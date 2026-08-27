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

function setCardTransform(el,t,scale=1){
  el.style.transform=`translate(${t.x}px,${t.y}px) rotate(${t.r}deg) scale(${scale})`;
}

function bindFancyHand(){
  const fan=document.querySelector('.hand-fan');
  if(!fan||fan.dataset.sfFancyBound==='1')return;
  fan.dataset.sfFancyBound='1';
  const cards=[...fan.querySelectorAll('.hand-card')];
  cards.forEach((el,i)=>{
    el.dataset.sfBaseTransform=el.style.transform;
    el.dataset.sfHandIndex=String(i);
  });

  const reset=()=>{
    fan.classList.remove('sf-hand-active');
    cards.forEach(el=>{
      el.classList.remove('sf-hand-focus','sf-hand-near');
      el.style.transform=el.dataset.sfBaseTransform||'';
      el.style.zIndex='';
    });
  };

  const focusAt=(index)=>{
    fan.classList.add('sf-hand-active');
    cards.forEach((el,i)=>{
      const base=parseBaseTransform(el);
      if(!base)return;
      const d=i-index;
      el.classList.remove('sf-hand-focus','sf-hand-near');
      if(d===0){
        el.classList.add('sf-hand-focus');
        setCardTransform(el,{x:base.x,y:base.y-54,r:0},1.16);
        el.style.zIndex='120';
      }else{
        const dist=Math.abs(d);
        const shift=(dist===1?34:dist===2?20:10)*(d<0?-1:1);
        const lift=dist===1?-10:0;
        const rotAdjust=dist===1?(d<0?-2:2):0;
        if(dist<=1)el.classList.add('sf-hand-near');
        setCardTransform(el,{x:base.x+shift,y:base.y+lift,r:base.r+rotAdjust},1);
        el.style.zIndex=String(70-dist);
      }
    });
  };

  cards.forEach((el,i)=>el.addEventListener('pointerenter',()=>focusAt(i)));
  fan.addEventListener('pointerleave',reset);
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
