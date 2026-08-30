(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={
 colpo_in_testa:'colpo-in-testa.webp',
 fabbro_ninjitsu:'fabbro-ninjitsu.webp',
 fino_alla_morte:'fino-alla-morte.webp',
 richiamo_del_branco:'richiamo-del-branco.webp',
 grandine_brillante:'grandine-brillante.webp'
};
const NEW_IDS=new Set(Object.keys(ART));
const artUrl=id=>ART[String(id)]?BASE+ART[String(id)]:'';
let hoverTimer=null;

function cardIdOf(el){
 if(!el)return'';
 return String(el.dataset?.handCard||el.dataset?.previewCard||el.dataset?.selectCard||el.dataset?.cardId||el.dataset?.card||'');
}

function ensureImg(el,id){
 const url=artUrl(id);if(!url||!el)return;
 let img=el.matches?.('img')?el:el.querySelector?.('img');
 if(!img){
  img=document.createElement('img');
  img.alt=id;
  img.loading='lazy';
  img.dataset.sf47Art='1';
  el.prepend(img);
 }
 if(img.getAttribute('src')!==url)img.setAttribute('src',url);
}

function repairArt(root=document){
 const selector='[data-hand-card],[data-preview-card],[data-select-card],[data-card-id],[data-card]';
 root.querySelectorAll?.(selector).forEach(el=>{
  const id=cardIdOf(el);
  if(NEW_IDS.has(id))ensureImg(el,id);
 });
 document.querySelectorAll('.stack-card[data-preview-card]').forEach(el=>{
  const id=String(el.dataset.previewCard||'');
  if(NEW_IDS.has(id))ensureImg(el,id);
 });
}

function previewData(id){
 return session?.state?.cardDefs?.[id]||null;
}
function showHoverPreview(el,id){
 const def=previewData(id),url=artUrl(id),box=document.getElementById('sfPreview');
 if(!def||!url||!box)return;
 const speed=typeof speedLabel==='function'?speedLabel(def.speed||'base'):(def.speed||'');
 box.innerHTML=`<img src="${url}" alt="${id}"><div class="ptext"><h3>${typeof esc==='function'?esc(def.name||id):(def.name||id)}</h3><div class="tag">${typeof esc==='function'?esc(def.type||'Magia'):(def.type||'Magia')} • ${typeof esc==='function'?esc(speed):speed}</div><p>${typeof esc==='function'?esc(def.text||''):(def.text||'')}</p></div>`;
 const r=el.getBoundingClientRect(),w=Math.min(720,innerWidth*.92);
 let left=r.right+16;if(left+w>innerWidth-16)left=Math.max(16,r.left-w-16);
 box.style.left=left+'px';
 box.style.top=Math.max(16,Math.min(innerHeight-430,r.top-70))+'px';
 box.classList.add('show');
}
function hideHoverPreview(){
 clearTimeout(hoverTimer);hoverTimer=null;
 document.getElementById('sfPreview')?.classList.remove('show');
}
function bindHover(root=document){
 root.querySelectorAll?.('[data-preview-card]').forEach(el=>{
  const id=String(el.dataset.previewCard||'');
  if(!NEW_IDS.has(id)||el.dataset.sf47Preview==='1')return;
  el.dataset.sf47Preview='1';
  el.addEventListener('mouseenter',()=>{
   clearTimeout(hoverTimer);
   hoverTimer=setTimeout(()=>showHoverPreview(el,id),900);
  });
  el.addEventListener('mouseleave',hideHoverPreview);
 });
}

function installGlobalArtFallback(){
 const cur=window.sfArtUrl21;
 if(cur?.__sf47)return;
 const prev=cur;
 const fn=id=>artUrl(id)||(typeof prev==='function'?prev(id):'');
 fn.__sf47=true;fn.__previous=prev;
 window.sfArtUrl21=fn;
}

function sync(root=document){repairArt(root);bindHover(root);installGlobalArtFallback()}
function boot(){sync(document)}

boot();
window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));
const app=document.getElementById('app');
const modal=document.getElementById('modal');
let queued=false;
const observer=new MutationObserver(muts=>{
 if(queued)return;
 if(!muts.some(m=>m.addedNodes?.length))return;
 queued=true;
 requestAnimationFrame(()=>{queued=false;sync(document)});
});
if(app)observer.observe(app,{childList:true,subtree:true});
if(modal)observer.observe(modal,{childList:true,subtree:true});
setTimeout(boot,250);
setTimeout(boot,1200);
})();
