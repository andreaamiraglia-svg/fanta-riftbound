(()=>{
let lastSelectResetKey=null;

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
  if(!fan||fan.dataset.sfFancyBound==='1')return;
  fan.dataset.sfFancyBound='1';

  const cards=[...fan.querySelectorAll('.hand-card')];
  const bases=[];
  cards.forEach((el,i)=>{
    const base=el.style.transform||'';
    el.dataset.sfBaseTransform=base;
    el.dataset.sfHandIndex=String(i);
    const parsed=parseBaseTransform(el);
    bases.push(parsed||{x:i*82,y:0,r:0});
    setTransform(el,base);
  });

  let activeIndex=-1;
  let dragging=false;

  /* Always restore every card. Do not early-return when activeIndex is -1:
     a cancelled native drag can leave classes/z-index behind even after the
     hover state itself has already been cleared. */
  const reset=()=>{
    activeIndex=-1;
    fan.classList.remove('sf-hand-active');
    cards.forEach(el=>{
      el.classList.remove('sf-hand-focus','sf-hand-near','sf-hand-drag-source','dragging');
      setTransform(el,baseTransform(el));
      el.style.removeProperty('z-index');
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
    fan.classList.add('sf-hand-active');

    cards.forEach((el,i)=>{
      const base=bases[i];
      el.classList.remove('sf-hand-focus','sf-hand-near');

      if(i===index){
        el.classList.add('sf-hand-focus');
        setTransform(el,`translate(${base.x}px,${base.y-34}px) rotate(0deg) scale(1.09)`);
        el.style.setProperty('z-index','120');
      }else{
        if(Math.abs(i-index)===1)el.classList.add('sf-hand-near');
        setTransform(el,baseTransform(el));
        el.style.setProperty('z-index',String(60-Math.abs(i-index)));
      }
    });
  };

  fan.addEventListener('pointermove',e=>{
    if(dragging||!cards.length)return;
    const rect=fan.getBoundingClientRect();
    const localX=e.clientX-(rect.left+rect.width/2);
    let best=0,bestDist=Infinity;
    for(let i=0;i<bases.length;i++){
      const d=Math.abs(localX-bases[i].x);
      if(d<bestDist){bestDist=d;best=i;}
    }
    focusAt(best);
  });

  fan.addEventListener('pointerleave',()=>{if(!dragging)reset()});
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
    if(e.key==='Escape'&&dragging)finishDrag();
  });
  window.addEventListener('blur',()=>{if(dragging)finishDrag()});
}

const prevRender=render;
render=function(){
  resetSelectionForNewRound();
  const out=prevRender.apply(this,arguments);
  requestAnimationFrame(bindFancyHand);
  return out;
};

resetSelectionForNewRound();
requestAnimationFrame(bindFancyHand);
})();