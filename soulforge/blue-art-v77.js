(()=>{
const CURRENT='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const BEFORE_YETI_REUPLOAD='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/fefcef7c59cebcf33ece3a31b57942a1501f3ce5/champion-of-the-souls-carte-ottimizzate/cards/';

// Il 01/09 yeti.webp è stato sovrascritto con la nuova carta Yeti.
// Prima di quel commit quel file conteneva l'artwork usato per Grifone della Tempesta.
const FIX={
  grifone_della_tempesta: BEFORE_YETI_REUPLOAD+'yeti.webp?rev=griffon-pre-yeti-upload',
  yeti: CURRENT+'yeti.webp?rev=yeti-404c3869'
};

const NAMES={
  'Grifone della tempesta':'grifone_della_tempesta',
  'Grifone della Tempesta':'grifone_della_tempesta',
  'Yeti':'yeti'
};

function idOf(el){return String(el?.dataset?.deckId||el?.dataset?.sidebarPreview||el?.dataset?.previewId||el?.dataset?.handCard||el?.dataset?.selectCard||el?.dataset?.previewCard||el?.dataset?.cardId||el?.dataset?.card||'')}
function setImg(img,id){const src=FIX[id];if(img&&src&&img.getAttribute('src')!==src)img.setAttribute('src',src)}
function patch(root=document){
  root.querySelectorAll?.('[data-deck-id],[data-sidebar-preview],[data-preview-id],[data-hand-card],[data-select-card],[data-preview-card],[data-card-id],[data-card]').forEach(el=>setImg(el.querySelector('img'),idOf(el)));
  const preview=document.getElementById('deckPreview');
  if(preview){const title=preview.querySelector('h3')?.textContent?.trim();if(title)setImg(preview.querySelector('img'),NAMES[title])}
  document.querySelectorAll('.sf-grave-card[data-preview-card]').forEach(el=>setImg(el.querySelector('img'),el.dataset.previewCard));
}

const previous=window.sfArtUrl21;
const resolver=id=>FIX[String(id)]||(typeof previous==='function'?previous(id):'');
resolver.__sfBlueArt77=true;resolver.__previous=previous;
window.sfArtUrl21=resolver;

let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;patch()})};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
patch();setTimeout(patch,100);setTimeout(patch,500);setTimeout(patch,1500);
window.sfBlueArt77={FIX,patch};
})();
