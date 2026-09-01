(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
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
// Gli export Blu storici nel branch sono ruotati. Questo è il file che il
// loader Blu stabile usa per lo Yeti.
const YETI=BASE+'leviatano.webp?rev=404c3869';
const ownUrl=id=>id==='yeti'?YETI:(ART[id]?BASE+ART[id]:'');
const ids=new Set([...Object.keys(ART),'yeti']);

function idOf(el){
  return String(el?.dataset?.handCard||el?.dataset?.selectCard||el?.dataset?.previewCard||el?.dataset?.cardId||el?.dataset?.card||el?.dataset?.champId||'');
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
  if(!img){
    img=document.createElement('img');
    img.alt=id;img.loading='lazy';
  }
  img.classList.add(cls);
  img.dataset.sfArtV73='1';
  const host=shell||el;
  if(img.parentElement!==host)host.insertBefore(img,host.firstChild||null);
  else if(host.firstElementChild!==img)host.insertBefore(img,host.firstChild||null);
  if(img.getAttribute('src')!==src)img.setAttribute('src',src);
  // Il bug v72 lasciava una copia fuori dalla shell e una dentro. Qui ne resta una sola.
  candidates(el).forEach(x=>{if(x!==img)x.remove()});
}

function ensureFlatArt(el,id,src){
  const imgs=[...el.querySelectorAll(':scope > img')];
  let img=imgs[0]||null;
  if(!img){
    img=document.createElement('img');img.alt=id;img.loading='lazy';el.insertBefore(img,el.firstChild||null);
  }
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

const SELECTOR='[data-hand-card],[data-select-card],[data-preview-card],[data-card-id],[data-card],.champ[data-champ-id],.monster[data-preview-card]';
function patch(root=document){
  if(root instanceof Element&&root.matches(SELECTOR))ensure(root);
  root.querySelectorAll?.(SELECTOR).forEach(ensure);
}

function installResolver(){
  const cur=window.sfArtUrl21;
  if(cur?.__sfArtV73)return;
  const prev=cur;
  const fn=id=>ownUrl(String(id))||(typeof prev==='function'?prev(id):'');
  fn.__sfArtV73=true;fn.__previous=prev;
  window.sfArtUrl21=fn;
}

let queued=false;
function schedule(root=document){
  if(queued)return;queued=true;
  requestAnimationFrame(()=>{queued=false;installResolver();patch(root)});
}
installResolver();patch();
const app=document.getElementById('app');
if(app)new MutationObserver(ms=>{
  for(const m of ms)for(const n of m.addedNodes)if(n instanceof Element)patch(n);
  schedule(app);
}).observe(app,{childList:true,subtree:true});
window.addEventListener('sf-blue-ready',()=>setTimeout(()=>{installResolver();patch()},0));
setTimeout(()=>patch(),100);setTimeout(()=>patch(),550);setTimeout(()=>patch(),1300);setTimeout(()=>patch(),3000);
window.sfNewSetArt73={patch,ART,YETI};
})();
