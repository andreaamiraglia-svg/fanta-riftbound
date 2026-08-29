(()=>{
/* Definitive cleanup for the legacy UI-v2 hover preview.
   The modern preview in right-click-preview.js is the only preview allowed. */
let cleanupQueued=false;
function legacyTarget(el){
  return el instanceof Element ? el.closest('[data-preview-card]') : null;
}
function cleanup(){
  cleanupQueued=false;
  document.querySelectorAll('#sfPreview').forEach(n=>n.remove());
  document.querySelectorAll('[data-preview-card]').forEach(el=>{
    /* ui-v2 assigns its obsolete preview through these DOM0 handlers. */
    if(el.onmouseenter) el.onmouseenter=null;
    if(el.onmouseleave) el.onmouseleave=null;
  });
}
function queueCleanup(){
  if(cleanupQueued)return;
  cleanupQueued=true;
  queueMicrotask(cleanup);
}

/* mouseenter is what the obsolete preview uses. Stop it before the target handler
   can run. The new preview listens to mouseover/mouseout at document level, so it
   is unaffected. */
document.addEventListener('mouseenter',e=>{
  if(!legacyTarget(e.target))return;
  const el=legacyTarget(e.target);
  if(el){el.onmouseenter=null;el.onmouseleave=null;}
  document.querySelectorAll('#sfPreview').forEach(n=>n.remove());
  e.stopImmediatePropagation();
},true);

document.addEventListener('mouseleave',e=>{
  if(!legacyTarget(e.target))return;
  const el=legacyTarget(e.target);
  if(el){el.onmouseenter=null;el.onmouseleave=null;}
},true);

/* Every game render replaces large parts of the DOM and ui-v2 rebinds its old
   handlers. Clean them immediately after every mutation/render. */
const root=document.body||document.documentElement;
if(root)new MutationObserver(queueCleanup).observe(root,{childList:true,subtree:true});

if(typeof window.render==='function'){
  const previousRender=window.render;
  window.render=function(...args){
    const result=previousRender.apply(this,args);
    cleanup();
    requestAnimationFrame(cleanup);
    return result;
  };
}

window.addEventListener('sf-blue-ready',()=>{cleanup();requestAnimationFrame(cleanup)});
cleanup();
requestAnimationFrame(cleanup);
setInterval(cleanup,750);
})();
