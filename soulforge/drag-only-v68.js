(()=>{
function disableDoubleClick(root=document){
  root.querySelectorAll?.('.hand-card,[data-hand-card]').forEach(el=>{
    try{el.ondblclick=null}catch{}
    el.removeAttribute('ondblclick');
    el.dataset.sfDragOnly='1';
  });
}

document.addEventListener('dblclick',e=>{
  const card=e.target instanceof Element?e.target.closest('.hand-card,[data-hand-card]'):null;
  if(!card)return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
},true);

disableDoubleClick();
const app=document.getElementById('app');
if(app){
  let queued=false;
  new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;disableDoubleClick(app)});
  }).observe(app,{childList:true,subtree:true});
}

const prevRender=window.render;
if(typeof prevRender==='function'&&!prevRender.__sfDragOnlyV68){
  const wrapped=function(){
    const out=prevRender.apply(this,arguments);
    requestAnimationFrame(()=>disableDoubleClick());
    return out;
  };
  wrapped.__sfDragOnlyV68=true;
  window.render=wrapped;
  try{render=wrapped}catch{}
}
})();
