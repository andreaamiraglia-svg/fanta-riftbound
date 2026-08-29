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
}

function baseTransform(el){
  return el.dataset.sfBaseTransform||'';
}

function bindFancyHand(){
  const fan=document.querySelector('.hand-fan');
  if(!fan||fan.dataset.sfFancyBound==='1')return;
  fan.dataset.sfFancyBound='1';

  const cards=[...fan.querySelectorAll('.hand-card')];
  cards.forEach((el,i)=>{
    const base=el.style.transform||'';
    el.dataset.sfBaseTransform=base;
    el.dataset.sfHandIndex=String(i);
    /* Lock the fan transform with inline !important so the old fantasy-board
       :hover rule cannot replace translate(x,y) with translate(0,-24px). */
    setTransform(el,base);
  });

  let activeIndex=-1;

  const reset=()=>{
    if(activeIndex===-1)return;
    activeIndex=-1;
    fan.classList.remove('sf-hand-active');
    cards.forEach(el=>{
      el.classList.remove('sf-hand-focus','sf-hand-near');
      setTransform(el,baseTransform(el));
      el.style.removeProperty('z-index');
    });
  };

  const focusAt=(index)=>{
    if(index===activeIndex)return;
    activeIndex=index;
    fan.classList.add('sf-hand-active');

    cards.forEach((el,i)=>{
      const base=parseBaseTransform(el);
      if(!base)return;
      el.classList.remove('sf-hand-focus','sf-hand-near');

      if(i===index){
        el.classList.add('sf-hand-focus');
        /* Only the selected card moves. Neighbours stay exactly in their fan
           positions, which prevents pointer-enter/leave oscillation. */
        setTransform(el,`translate(${base.x}px,${base.y-34}px) rotate(0deg) scale(1.09)`);
        el.style.setProperty('z-index','120');
      }else{
        if(Math.abs(i-index)===1)el.classList.add('sf-hand-near');
        setTransform(el,baseTransform(el));
        el.style.setProperty('z-index',String(60-Math.abs(i-index)));
      }
    });
  };

  cards.forEach((el,i)=>{
    el.addEventListener('pointerenter',()=>focusAt(i));
  });

  fan.addEventListener('pointerleave',reset);
  fan.addEventListener('pointercancel',reset);
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