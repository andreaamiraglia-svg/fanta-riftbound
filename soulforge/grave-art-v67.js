(()=>{
const MARK='sfGraveArtV67';

function defs(){
 return [session?.state?.cardDefs||{},session?.state?.monsterDefs||{}];
}
function idFromName(name){
 const wanted=String(name||'').trim().toLowerCase();
 if(!wanted)return'';
 for(const group of defs()){
  for(const [id,d] of Object.entries(group||{})){
   if(String(d?.name||'').trim().toLowerCase()===wanted)return String(id);
  }
 }
 return'';
}
function cardId(el){
 let id=String(el?.dataset?.previewCard||'').trim();
 if(id&&id!=='undefined'&&id!=='null')return id;
 const name=el?.querySelector?.('.sf-grave-name')?.textContent||'';
 return idFromName(name);
}
function art(id){
 if(!id)return'';
 try{
  const u=window.sfArtUrl21?.(id);
  if(u)return String(u);
 }catch{}
 return'';
}
function patchTile(el){
 if(!el)return;
 const id=cardId(el),src=art(id);
 if(!id||!src)return;
 if(el.dataset.previewCard!==id)el.dataset.previewCard=id;
 let img=el.querySelector(':scope > img');
 if(!img){
  img=document.createElement('img');
  img.alt=id;
  img.loading='lazy';
  img.dataset.sfGraveArt='67';
  el.prepend(img);
 }
 if(img.getAttribute('src')!==src)img.setAttribute('src',src);
 img.draggable=false;
 img.setAttribute('draggable','false');
}
function patch(root=document){
 root.querySelectorAll?.('.sf-grave-card').forEach(patchTile);
}
function boot(){patch(document)}

const modal=document.getElementById('modal');
if(modal){
 let queued=false;
 new MutationObserver(()=>{
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;patch(modal)});
 }).observe(modal,{childList:true,subtree:true});
}

document.addEventListener('click',e=>{
 if(e.target.closest?.('.sf-grave-btn')){
  requestAnimationFrame(()=>patch(document.getElementById('modal')||document));
  setTimeout(()=>patch(document.getElementById('modal')||document),30);
 }
},true);

window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));
setTimeout(boot,100);setTimeout(boot,700);setTimeout(boot,1800);
window[MARK]=true;
})();
