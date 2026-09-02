(()=>{
/* ui-v2 still creates its legacy #sfPreview and binds a 1s hover timer to it.
   The new right-click-preview.js already owns both hover and context-menu preview.
   Remove the legacy node whenever it appears so there is exactly one preview system. */
function removeLegacyPreview(){
  const old=document.getElementById('sfPreview');
  if(old)old.remove();
}
removeLegacyPreview();
const root=document.body||document.documentElement;
if(root){
  new MutationObserver(()=>removeLegacyPreview()).observe(root,{childList:true,subtree:false});
}
window.addEventListener('sf-blue-ready',removeLegacyPreview);
setTimeout(removeLegacyPreview,0);
setTimeout(removeLegacyPreview,250);
setTimeout(removeLegacyPreview,1000);
})();
