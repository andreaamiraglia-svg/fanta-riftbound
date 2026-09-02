(()=>{
const CURRENT='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';

// Manteniamo le correzioni Blu storiche solo dove servono.
// Grifone della Tempesta ora usa il proprio artwork canonico.
const BLUE_ART={
  valtheris: CURRENT+'vecchio-delle-nevi.webp?rev=404c3869',
  squalo_delle_maree: CURRENT+'squalo-delle-maree.webp?rev=art-shark-v2',
  lupo_glaciale: CURRENT+'lupo-glaciale.webp?rev=blue-replace-v3',
  grifone_della_tempesta: CURRENT+'grifone-della-tempesta.webp?rev=blue-replace-v3',
  yeti: CURRENT+'leviatano.webp?rev=404c3869',
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
  if((img.getAttribute('src')||'')!==url)img.setAttribute('src',url);
}

function fixArtwork(){
  document.querySelectorAll('.deck-pick[data-deck-id]').forEach(el=>setImg(el.querySelector('img'),el.dataset.deckId));
  document.querySelectorAll('.deck-side-row[data-sidebar-preview]').forEach(el=>setImg(el.querySelector('img'),el.dataset.sidebarPreview));
  document.querySelectorAll('.deck-library-champs img[alt]').forEach(img=>setImg(img,NAME_TO_ID[(img.getAttribute('alt')||'').trim()]));
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
  const grid=section?.querySelector('.deck-grid');if(!grid)return;
  const items=[...grid.querySelectorAll(':scope > .deck-pick[data-deck-kind="champions"]')];if(items.length<2)return;
  const sorted=[...items].sort((a,b)=>(COLOR_RANK[championColor(a)]??99)-(COLOR_RANK[championColor(b)]??99));
  if(items.some((el,i)=>el!==sorted[i]))sorted.forEach(el=>grid.appendChild(el));
}

let queued=false;
function patch(){
  if(queued)return;queued=true;
  requestAnimationFrame(()=>{queued=false;sortChampions();fixArtwork()});
}
new MutationObserver(patch).observe(document.documentElement,{subtree:true,childList:true});
patch();setTimeout(patch,250);setTimeout(patch,1000);
window.sfDeckBuilderVisualFix71={patch,BLUE_ART};
})();