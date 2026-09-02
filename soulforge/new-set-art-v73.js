(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const OLD_BLUE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/fefcef7c59cebcf33ece3a31b57942a1501f3ce5/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={
  scarlet:'scarlet-fiamma-dei-mari.webp',
  torvald:'torvald-spezzatronchi.webp',
  grinn:'grinn-il-folle.webp',
  hilda:'hilda-ira-d-inverno.webp',
  aurelius:'aurelius-re-dell-opulenza.webp',
  colpo_in_testa:'colpo-in-testa.webp',
  fabbro_ninjitsu:'fabbro-ninjitsu.webp',
  richiamo_del_branco:'richiamo-del-branco.webp',
  grandine_brillante:'grandine-brillante.webp',
  fino_alla_morte:'fino-alla-morte.webp',
  bang:'bang.webp',
  barile_esplosivo:'barile-esplosivo.webp',
  spacca_corazze:'spacca-corazze.webp',
  tiro_rotante:'tiro-rotante.webp',
  circo_infestato:'circo-infestato.webp',
  scatola_incantata:'scatola-incantata.webp',
  cacciatrice_della_tempesta:'cacciatrice-della-tempesta.webp',
  tempesta_di_ghiaccio:'tempesta-di-ghiaccio.webp',
  servo_del_sovrano:'servo-del-sovrano.webp',
  dono_ai_poveri:'dono-ai-poveri.webp'
};
// Il commit 404c3869 ha sovrascritto solo yeti.webp tra gli artwork Blu:
// il file nuovo è lo Yeti corretto; la revisione immediatamente precedente è
// l'artwork che veniva usato dal Grifone della Tempesta.
const BLUE_FIX={
  grifone_della_tempesta:OLD_BLUE+'yeti.webp?rev=grifone-pre-404c3869',
  yeti:BASE+'yeti.webp?rev=yeti-404c3869'
};
const ownUrl=id=>BLUE_FIX[id]||(ART[id]?BASE+ART[id]:'');
const ids=new Set([...Object.keys(ART),...Object.keys(BLUE_FIX)]);

function idOf(el){
  return String(el?.dataset?.handCard||el?.dataset?.selectCard||el?.dataset?.previewCard||el?.dataset?.cardId||el?.dataset?.card||el?.dataset?.champId||el?.dataset?.deckId||el?.dataset?.sidebarPreview||el?.dataset?.previewId||'');
}
function isBoardCard(el){return el?.classList?.contains('champ')||el?.classList?.contains('monster')}
function artClass(el){return el.classList.contains('champ')?'champ-art':el.classList.contains('monster')?'monster-art':''}
function candidates(el){
  const out=[];
  el.querySelectorAll?.(':scope > img').forEach(x=>out.push(x));
  const shell=el.querySelector?.(':scope > .sf-card-shell');
  if(shell)shell.querySelectorAll(':scope > img').forEach(x=>out.push(x));
  return [...new Set(out)];
}
function ensureBoardArt(el,id,src){
  const shell=el.querySelector(':scope > .sf-card-shell');
  const cls=artClass(el);
  const imgs=candidates(el);
  let img=(shell&&imgs.find(x=>x.parentElement===shell&&x.classList.contains(cls)))||imgs.find(x=>x.classList.contains(cls))||imgs[0]||null;
  if(!img){img=document.createElement('img');img.alt=id;img.loading='lazy'}
  img.classList.add(cls);img.dataset.sfArtV73='1';
  const host=shell||el;
  if(img.parentElement!==host)host.insertBefore(img,host.firstChild||null);
  else if(host.firstElementChild!==img)host.insertBefore(img,host.firstChild||null);
  if(img.getAttribute('src')!==src)img.setAttribute('src',src);
  candidates(el).forEach(x=>{if(x!==img)x.remove()});
}
function ensureFlatArt(el,id,src){
  const imgs=[...el.querySelectorAll(':scope > img')];
  let img=imgs[0]||null;
  if(!img){img=document.createElement('img');img.alt=id;img.loading='lazy';el.insertBefore(img,el.firstChild||null)}
  img.dataset.sfArtV73='1';
  if(img.getAttribute('src')!==src)img.setAttribute('src',src);
  imgs.slice(1).forEach(x=>x.remove());
}
function ensure(el){
  if(!(el instanceof Element))return;
  const id=idOf(el);if(!ids.has(id))return;
  const src=ownUrl(id);if(!src)return;
  if(isBoardCard(el))ensureBoardArt(el,id,src);else ensureFlatArt(el,id,src);
}
const SELECTOR='[data-hand-card],[data-select-card],[data-preview-card],[data-card-id],[data-card],[data-deck-id],[data-sidebar-preview],[data-preview-id],.champ[data-champ-id],.monster[data-preview-card]';
function patch(root=document){
  if(root instanceof Element&&root.matches(SELECTOR))ensure(root);
  root.querySelectorAll?.(SELECTOR).forEach(ensure);
  const preview=document.getElementById('deckPreview');
  if(preview){const title=preview.querySelector('h3')?.textContent?.trim();const id=title==='Grifone della tempesta'||title==='Grifone della Tempesta'?'grifone_della_tempesta':title==='Yeti'?'yeti':'';if(id)setTimeout(()=>setImgPreview(preview,id),0)}
}
function setImgPreview(preview,id){const img=preview?.querySelector('img'),src=ownUrl(id);if(img&&src&&img.getAttribute('src')!==src)img.setAttribute('src',src)}
function installResolver(){
  const cur=window.sfArtUrl21;
  if(cur?.__sfArtV73Current)return;
  const prev=cur;
  const fn=id=>ownUrl(String(id))||(typeof prev==='function'?prev(id):'');
  fn.__sfArtV73=true;fn.__sfArtV73Current=true;fn.__previous=prev;
  window.sfArtUrl21=fn;
}
let queued=false;
function schedule(root=document){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;installResolver();patch(root)})}
installResolver();patch();
const app=document.getElementById('app');
if(app)new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n instanceof Element)patch(n);schedule(app)}).observe(app,{childList:true,subtree:true});
window.addEventListener('sf-blue-ready',()=>setTimeout(()=>{installResolver();patch()},0));
setTimeout(()=>patch(),100);setTimeout(()=>patch(),550);setTimeout(()=>patch(),1300);setTimeout(()=>patch(),3000);
window.sfNewSetArt73={patch,ART,BLUE_FIX};
})();
