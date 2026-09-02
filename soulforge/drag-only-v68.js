(()=>{
function normalizeDoubleClick(root=document){
  root.querySelectorAll?.('.hand-card,[data-hand-card]').forEach(el=>{
    /* Remove legacy DOM0 handler so the card cannot be cast twice. The single
       capture listener below is the only double-click path. */
    try{el.ondblclick=null}catch{}
    el.removeAttribute('ondblclick');
    el.dataset.sfDoubleClickPending='1';
  });
}

function handCardFromElement(el){
  const id=String(el?.dataset?.handCard||'');
  if(!id)return null;
  const me=typeof playerState==='function'?playerState(session.player):session?.state?.players?.[String(session.player)];
  return me?.handCards?.find(c=>String(c.id)===id)||null;
}

document.addEventListener('dblclick',e=>{
  const el=e.target instanceof Element?e.target.closest('.hand-card,[data-hand-card]'):null;
  if(!el)return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const card=handCardFromElement(el);
  if(!card||el.classList.contains('disabled'))return;
  try{
    if(typeof canCast==='function'&&!canCast(card))return;
  }catch{}

  const id=String(el.dataset.handCard||card.id);
  if(!id||typeof window.chooseForCard!=='function')return;
  Promise.resolve(window.chooseForCard(id)).catch(err=>{
    try{showError(err?.message||String(err))}catch{}
  });
},true);

normalizeDoubleClick();
const app=document.getElementById('app');
if(app){
  let queued=false;
  new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;normalizeDoubleClick(app)});
  }).observe(app,{childList:true,subtree:true});
}

const prevRender=window.render;
if(typeof prevRender==='function'&&!prevRender.__sfDoubleClickPendingV68){
  const wrapped=function(){
    const out=prevRender.apply(this,arguments);
    requestAnimationFrame(()=>normalizeDoubleClick());
    return out;
  };
  wrapped.__sfDoubleClickPendingV68=true;
  window.render=wrapped;
  try{render=wrapped}catch{}
}
})();
