(()=>{
const CURRENT='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const OLD_GRIFONE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/2c71a2b8f32346a144172842b5fb72da1c8629b4/champion-of-the-souls-carte-ottimizzate/cards/yeti.webp';

// I vecchi export Blu nel branch sono fisicamente ruotati tra i filename.
// Questa tabella descrive il contenuto reale che deve essere mostrato per ogni ID.
const BLUE_ART={
  valtheris: CURRENT+'vecchio-delle-nevi.webp?rev=404c3869',
  squalo_delle_maree: CURRENT+'lupo-glaciale.webp?rev=404c3869',
  lupo_glaciale: CURRENT+'grifone-della-tempesta.webp?rev=404c3869',
  grifone_della_tempesta: OLD_GRIFONE,
  yeti: CURRENT+'yeti.webp?rev=404c3869',
  leviatano: CURRENT+'valtheris-spirito-eterno.webp?rev=404c3869',
  vecchio_delle_nevi: CURRENT+'squalo-delle-maree.webp?rev=404c3869'
};

const NAME_TO_ID={
  'Valtheris Spirito Eterno':'valtheris',
  'Squalo delle Maree':'squalo_delle_maree',
  'Lupo glaciale':'lupo_glaciale',
  'Lupo Glaciale':'lupo_glaciale',
  'Grifone della tempesta':'grifone_della_tempesta',
  'Grifone della Tempesta':'grifone_della_tempesta',
  'Yeti':'yeti',
  'Leviatano':'leviatano',
  'Vecchio delle Nevi':'vecchio_delle_nevi'
};

const COLOR_RANK={red:0,green:1,black:2,blue:3,orange:4};

function setImg(img,id){
  const url=BLUE_ART[id];
  if(!img||!url)return;
  const current=img.getAttribute('src')||'';
  if(current!==url)img.setAttribute('src',url);
}

function fixArtwork(){
  document.querySelectorAll('.deck-pick[data-deck-id]').forEach(el=>{
    setImg(el.querySelector('img'),el.dataset.deckId);
  });
  document.querySelectorAll('.deck-side-row[data-sidebar-preview]').forEach(el=>{
    setImg(el.querySelector('img'),el.dataset.sidebarPreview);
  });
  document.querySelectorAll('.deck-library-champs img[alt]').forEach(img=>{
    setImg(img,NAME_TO_ID[(img.getAttribute('alt')||'').trim()]);
  });
  const preview=document.querySelector('#deckPreview');
  const title=preview?.querySelector('h3')?.textContent?.trim();
  if(title)setImg(preview.querySelector('img'),NAME_TO_ID[title]);
}

function championColor(el){
  for(const c of Object.keys(COLOR_RANK))if(el.classList.contains(c))return c;
  return '';
}

function sortChampions(){
  const section=[...document.querySelectorAll('.deck-section')].find(s=>s.querySelector('h2')?.textContent?.trim()==='Campioni');
  const grid=section?.querySelector('.deck-grid');
  if(!grid)return;
  const items=[...grid.querySelectorAll(':scope > .deck-pick[data-deck-kind="champions"]')];
  if(items.length<2)return;
  const sorted=[...items].sort((a,b)=>(COLOR_RANK[championColor(a)]??99)-(COLOR_RANK[championColor(b)]??99));
  const changed=items.some((el,i)=>el!==sorted[i]);
  if(changed)sorted.forEach(el=>grid.appendChild(el));
}

let queued=false;
function patch(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{
    queued=false;
    sortChampions();
    fixArtwork();
  });
}

new MutationObserver(patch).observe(document.documentElement,{subtree:true,childList:true});
patch();
setTimeout(patch,250);
setTimeout(patch,1000);
window.sfDeckBuilderVisualFix71={patch,BLUE_ART};

// Il renderer storico non crea proprio <img> per gli ID nuovi.
// Carica il layer che crea i nodi immagine mancanti in selezione, mano,
// Pending/Catena e Campioni, senza toccare la logica di gioco.
if(!document.querySelector('script[data-sf-new-set-art72]')){
  const s=document.createElement('script');
  s.src='/new-set-art-v72.js?v=1';
  s.async=false;
  s.dataset.sfNewSetArt72='1';
  document.head.appendChild(s);
}
})();
