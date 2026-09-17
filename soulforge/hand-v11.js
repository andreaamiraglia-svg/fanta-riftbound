(()=>{
let lastSelectResetKey=null;
let handListeners=null;
let lastPointer=null;
let focusedCardId=null;

function selectionResetKey(){
  try{
    const s=session?.state;
    if(!s||s.status!=='select')return null;
    const me=playerState(session.player);
    if(me?.selected)return null;
    return `${session.room||''}:${s.turn||0}:select`;
  }catch{return null}
}

function resetSelectionForNewRound(){
  const key=selectionResetKey();
  if(!key||key===lastSelectResetKey)return;
  lastSelectResetKey=key;
  try{selected.clear()}catch{}
}

function parseBaseTransform(el){
  const raw=el.dataset.sfBaseTransform||el.style.transform||'';
  const m=raw.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*rotate\(([-\d.]+)deg\)/);
  if(!m)return null;
  return {x:Number(m[1]),y:Number(m[2]),r:Number(m[3])};
}

function setTransform(el,value){
  el.style.setProperty('transform',value,'important');
  el.style.setProperty('translate','none','important');
}

function baseTransform(el){
  return el.dataset.sfBaseTransform||'';
}

function bindFancyHand(){
  const fan=document.querySelector('.hand-fan');
  if(!fan){handListeners?.abort();return;}
  if(fan.dataset.sfFancyBound==='1')return;
  fan.dataset.sfFancyBound='1';
  handListeners?.abort();
  handListeners=new AbortController();
  const signal=handListeners.signal;

  const cards=[...fan.querySelectorAll('.hand-card')];
  const bases=[];
  const cardWidth=cards[0]?.offsetWidth||122;
  const zoom=Math.max(1.25,Math.min(2,240/cardWidth,(innerHeight*.48)/(cardWidth*1024/762)));
  cards.forEach((el,i)=>{
    const base=el.style.transform||'';
    el.dataset.sfBaseTransform=base;
    el.dataset.sfHandIndex=String(i);
    el.dataset.sfBaseZ=el.style.zIndex||String(10+i);
    el.style.setProperty('z-index',el.dataset.sfBaseZ,'important');
    const parsed=parseBaseTransform(el);
    bases.push(parsed||{x:i*82,y:0,r:0});
    setTransform(el,base);
  });

  let activeIndex=-1;
  let dragging=false;
  let pressed=false;

  /* Always restore every card. Do not early-return when activeIndex is -1:
     a cancelled native drag can leave classes/z-index behind even after the
     hover state itself has already been cleared. */
  const reset=()=>{
    if(activeIndex===-1&&!dragging&&!fan.classList.contains('sf-hand-active')&&!fan.classList.contains('sf-hand-dragging')&&!cards.some(el=>el.classList.contains('sf-hand-drag-source')||el.classList.contains('dragging')))return;
    activeIndex=-1;
    focusedCardId=null;
    fan.classList.remove('sf-hand-active');
    cards.forEach(el=>{
      el.classList.remove('sf-hand-focus','sf-hand-near','sf-hand-drag-source','dragging');
      setTransform(el,baseTransform(el));
      el.style.setProperty('z-index',el.dataset.sfBaseZ,'important');
      el.style.removeProperty('opacity');
      el.style.removeProperty('filter');
    });
  };

  const finishDrag=()=>{
    dragging=false;
    fan.classList.remove('sf-hand-dragging');
    reset();
    /* Legacy bind() also handles dragend. Run once more after its DOM0 handler
       has finished so no class or inline style can survive the cancelled drag. */
    requestAnimationFrame(reset);
    setTimeout(reset,0);
  };

  const focusAt=(index)=>{
    if(dragging||index<0||index>=cards.length||index===activeIndex)return;
    activeIndex=index;
    focusedCardId=cards[index].dataset.handCard||'index:'+index;
    fan.classList.add('sf-hand-active');

    cards.forEach((el,i)=>{
      const base=bases[i];
      el.classList.remove('sf-hand-focus','sf-hand-near');

      if(i===index){
        el.classList.add('sf-hand-focus');
        setTransform(el,`translate(${base.x}px,${base.y-12}px) rotate(0deg) scale(${zoom})`);
        el.style.setProperty('z-index','120','important');
      }else{
        if(Math.abs(i-index)===1)el.classList.add('sf-hand-near');
        setTransform(el,baseTransform(el));
        el.style.setProperty('z-index',String(60-Math.abs(i-index)),'important');
      }
    });
  };

  const trackPointer=e=>{
    lastPointer={clientX:e.clientX,clientY:e.clientY};
    if(dragging||pressed||!cards.length)return;
    const rect=fan.getBoundingClientRect();
    const width=cards[0]?.offsetWidth||150;
    const left=rect.left+rect.width/2+Math.min(...bases.map(b=>b.x))-width/2;
    const right=rect.left+rect.width/2+Math.max(...bases.map(b=>b.x))+width*1.5;
    const top=rect.bottom-width*1.45-60;
    // Horizontal selection always follows the resting fan, never the enlarged
    // card's hit box: a zoomed card can span several neighbouring card centres.
    const localX=e.clientX-(rect.left+rect.width/2+width/2);
    let best=0,bestDist=Infinity;
    for(let i=0;i<bases.length;i++){
      const d=Math.abs(localX-bases[i].x);
      if(d<bestDist){bestDist=d;best=i;}
    }
    // Keep the card until the pointer leaves both its expanded rectangle and
    // the original activation strip. The strip covers the area vacated by lift.
    if(activeIndex>=0){
      const base=bases[activeIndex],center=rect.left+rect.width/2+base.x+width/2;
      const raisedBottom=rect.bottom+base.y-12,height=width*1024/762*zoom;
      const stickyBottom=rect.bottom+base.y+8;
      if(e.clientX>=center-width*zoom/2-4&&e.clientX<=center+width*zoom/2+4&&e.clientY>=raisedBottom-height-4&&e.clientY<=stickyBottom){
        // Keep vertical access to the readable card, but allow horizontal
        // movement to its immediate neighbours even inside the zoomed image.
        if(best!==activeIndex&&e.clientX>=left&&e.clientX<=right)focusAt(best);
        return;
      }
      reset();
    }
    if(e.clientX<left||e.clientX>right||e.clientY<top||e.clientY>rect.bottom+Math.max(...bases.map(b=>b.y))+8){reset();return}
    if(activeIndex>=0&&Math.abs(localX-bases[activeIndex].x)<=Math.abs(localX-bases[best].x)+10)return;
    focusAt(best);
  };
  document.addEventListener('pointermove',trackPointer,{signal,passive:true});
  fan.addEventListener('pointerdown',()=>{pressed=true},{signal});
  document.addEventListener('pointerup',()=>{pressed=false},{signal});
  document.addEventListener('pointercancel',()=>{pressed=false;reset()},{signal});
  if(focusedCardId){
    const index=cards.findIndex((el,i)=>(el.dataset.handCard||'index:'+i)===focusedCardId);
    if(index>=0)focusAt(index);else focusedCardId=null;
  }
  if(lastPointer)trackPointer(lastPointer);

  fan.addEventListener('pointercancel',()=>{if(!dragging)reset()});

  /* Native HTML drag temporarily changes hit-testing and can suppress the normal
     pointerleave sequence. Freeze the whole fan before the browser starts its
     drag ghost and explicitly restore it afterwards. */
  fan.addEventListener('dragstart',e=>{
    const card=e.target instanceof Element?e.target.closest('.hand-card'):null;
    if(!card)return;
    dragging=true;
    reset();
    dragging=true;
    fan.classList.add('sf-hand-dragging');
    card.classList.add('sf-hand-drag-source');
  },true);

  fan.addEventListener('dragend',finishDrag,true);
  fan.addEventListener('drop',finishDrag,true);

  /* ESC is the usual way browsers cancel a native drag. dragend should fire,
     but this extra cleanup also covers browser-specific cancelled-drag paths. */
  document.addEventListener('keyup',e=>{
    if(e.key==='Escape'){if(dragging)finishDrag();else reset()}
  },{signal});
  window.addEventListener('blur',()=>{if(dragging)finishDrag();else reset()},{signal});
}

const prevRender=render;
render=function(){
  resetSelectionForNewRound();
  const out=prevRender.apply(this,arguments);
  bindFancyHand();
  return out;
};

resetSelectionForNewRound();
requestAnimationFrame(bindFancyHand);
})();
