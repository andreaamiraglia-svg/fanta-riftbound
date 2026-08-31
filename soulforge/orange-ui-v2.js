(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={
 alabardo:'alabardo.webp',
 drago_aureo:'drago-aureo.webp',
 falco_dell_alba:'falco-dell-alba.webp',
 frecce_divine:'frecce-divine.webp',
 golem_d_ambra:'golem-d-ambra.webp',
 grifone_imperiale:'grifone-imperiale.webp',
 kroth:'kroth-il-fulminatore.webp',
 legionario_troll:'legionario-troll.webp',
 leone_solare:'leone-solare.webp',
 loda_il_sole:'loda-il-sole.webp',
 parry:'parry.webp',
 perfezione:'perfezione.webp',
 pugno_in_faccia:'pugno-in-faccia.webp',
 sciamano_del_sole:'sciamano-del-sole.webp',
 sciamano_del_sole_support:'sciamano-del-sole.webp',
 soldato_corrotto:'soldato-corrotto.webp',
 spacca_teste:'spacca-teste-orange.webp',
 su_gli_scudi:'su-gli-scudi.webp'
};
const ORANGE_IDS=new Set(Object.keys(ART));
const url=id=>ART[String(id)]?BASE+ART[String(id)]:'';
let queued=false;

function idOf(el){
 return String(el?.dataset?.handCard||el?.dataset?.previewCard||el?.dataset?.selectCard||el?.dataset?.deckId||el?.dataset?.card||'');
}
function directImg(el){
 if(!el)return null;
 if(el.matches?.('img'))return el;
 const selectors=[
  ':scope > .sf-card-shell > img[data-sf-orange-art="1"]',
  ':scope > .sf-card-shell > .champ-art',
  ':scope > .sf-card-shell > .monster-art',
  ':scope > img[data-sf-orange-art="1"]',
  ':scope > img'
 ];
 for(const selector of selectors){
  try{const found=el.querySelector(selector);if(found)return found}catch{}
 }
 return el.querySelector?.('img[data-sf-orange-art="1"],.champ-art,.monster-art,img')||null;
}
function removeDuplicateImages(el,keep,src){
 if(!el||!keep||!(el.classList?.contains('champ')||el.classList?.contains('monster')))return;
 el.querySelectorAll?.('img').forEach(img=>{
  if(img===keep)return;
  const sameSrc=img.getAttribute('src')===src;
  const orangeCopy=img.dataset?.sfOrangeArt==='1';
  if(sameSrc||orangeCopy)img.remove();
 });
}
function normalizeImage(el,id){
 const src=url(id);if(!src||!el)return;
 let img=directImg(el);
 if(!img){img=document.createElement('img');img.alt=String(id);img.loading='lazy';el.prepend(img)}
 img.dataset.sfOrangeArt='1';
 if(el.classList?.contains('champ')){
  img.classList.add('champ-art');
  img.classList.remove('monster-art');
 }else if(el.classList?.contains('monster')){
  img.classList.add('monster-art');
  img.classList.remove('champ-art');
 }
 if(img.getAttribute('src')!==src)img.setAttribute('src',src);
 removeDuplicateImages(el,img,src);
}
function repairImages(root=document){
 root.querySelectorAll?.('[data-hand-card],[data-preview-card],[data-select-card],[data-deck-id],[data-card]').forEach(el=>{
  const id=idOf(el);if(ORANGE_IDS.has(id))normalizeImage(el,id);
 });
}

function installResolver(){
 const current=window.sfArtUrl21;
 if(current?.__sfOrangeUiV3)return;
 const previous=current;
 const wrapped=id=>url(id)||(typeof previous==='function'?previous(id):'');
 wrapped.__sfOrangeUiV3=true;
 wrapped.__previous=previous;
 window.sfArtUrl21=wrapped;
}

function markSupportLanes(){
 document.querySelectorAll('.playerzone .champions').forEach(lane=>{
  lane.classList.toggle('sf-support-lane',lane.children.length>2);
  lane.querySelectorAll('.champ[data-owner][data-champ-id]').forEach(el=>{
   const owner=String(el.dataset.owner||''),id=String(el.dataset.champId||'');
   const c=session?.state?.players?.[owner]?.champions?.find(x=>String(x.id)===id);
   el.classList.toggle('sf-support-champ',!!c?.supportChampion);
  });
 });
}

function previewInfo(id){
 const s=session?.state;
 return s?.cardDefs?.[id]||s?.monsterDefs?.[id]||[1,2].flatMap(p=>s?.players?.[String(p)]?.champions||[]).find(c=>String(c.id)===String(id))||null;
}
function previewBox(){
 let p=document.getElementById('sfBluePreview');
 if(!p){p=document.createElement('div');p.id='sfBluePreview';p.className='sf-preview v17-preview';document.body.appendChild(p)}
 return p;
}
function escText(v){return String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))}
function speed(s){return s==='response'?'Risposta':s==='instant'?'Istantanea':'Base'}
function showOrangePreview(el,id,x=null,y=null){
 const info=previewInfo(id),src=url(id);if(!info||!src)return;
 const p=previewBox();let meta='';
 if(session?.state?.cardDefs?.[id])meta=`${info.type||''} • ${speed(info.speed||'base')}`;
 else if(session?.state?.monsterDefs?.[id])meta=`Mostro • POW ${info.pow}`;
 else meta=`Campione • POW ${info.pow||info.basePow||''}`;
 p.innerHTML=`<img src="${src}" data-sf-orange-art="1"><div class="ptext"><h3>${escText(info.name||id)}</h3><div class="tag">${escText(meta)}</div>${info.text?`<p>${escText(info.text)}</p>`:''}</div>`;
 const r=el?.getBoundingClientRect?.()||{right:x||20,left:x||20,top:y||20};
 const w=Math.min(720,innerWidth*.92);let left=x!=null?x+18:r.right+16;
 if(left+w>innerWidth-16)left=Math.max(16,(x!=null?x:r.left)-w-18);
 p.style.left=left+'px';
 p.style.top=Math.max(16,Math.min(innerHeight-430,(y!=null?y:r.top)-70))+'px';
 p.classList.add('show');
}
function bindPreview(root=document){
 root.querySelectorAll?.('[data-preview-card]').forEach(el=>{
  const id=String(el.dataset.previewCard||'');
  if(!ORANGE_IDS.has(id)||el.dataset.sfOrangePreviewBound)return;
  el.dataset.sfOrangePreviewBound='1';
  el.addEventListener('mouseenter',()=>{
   clearTimeout(el._sfOrangeHover);
   el._sfOrangeHover=setTimeout(()=>showOrangePreview(el,id),1000);
  });
  el.addEventListener('mouseleave',()=>{
   clearTimeout(el._sfOrangeHover);
   document.getElementById('sfBluePreview')?.classList.remove('show');
  });
 });
}

function boot(){
 installResolver();
 repairImages(document);
 markSupportLanes();
 bindPreview(document);
}
function schedule(){
 if(queued)return;queued=true;
 requestAnimationFrame(()=>{queued=false;try{boot()}catch(e){console.error('[orange-ui-v3]',e)}});
}

if(!document.getElementById('sfOrangeUiV2Style')){
 const s=document.createElement('style');s.id='sfOrangeUiV2Style';
 s.textContent=`
 body.sf-fantasy-game .champions.sf-support-lane{
  grid-template-columns:none!important;
  grid-auto-flow:column!important;
  grid-auto-columns:minmax(235px,1fr)!important;
  align-items:stretch!important;
  overflow-x:auto!important;
  overflow-y:hidden!important;
  padding-bottom:3px!important;
  scrollbar-width:thin;
 }
 body.sf-fantasy-game .champions.sf-support-lane>.champ{min-width:235px!important;height:100%!important}
 body.sf-fantasy-game .champions.sf-support-lane>.sf-support-champ h3{
  white-space:normal!important;
  overflow:visible!important;
  text-overflow:clip!important;
  line-height:1.05!important;
  font-size:12px!important;
 }
 body.sf-fantasy-game .champ.sf-support-champ.sf-tapped .sf-champ-shell{
  transform:none!important;
  filter:brightness(.80) saturate(.88)!important;
 }
 body.sf-fantasy-game .champ.sf-support-champ.sf-tap-anim .sf-champ-shell,
 body.sf-fantasy-game .champ.sf-support-champ.sf-untap-anim .sf-champ-shell{
  animation:none!important;
  transform:none!important;
 }
 body.sf-fantasy-game .champ.orange,body.sf-fantasy-game .monster.orange{border-color:#c77a18!important}
 body.sf-fantasy-game .champ.orange .champ-art,
 body.sf-fantasy-game .monster.orange .monster-art{object-fit:contain!important;object-position:center!important}
 img[data-sf-orange-art="1"]{object-fit:contain!important;object-position:center!important}
 body.sf-fantasy-game .hand-card>img[data-sf-orange-art="1"],
 body.sf-fantasy-game .select-card>img[data-sf-orange-art="1"],
 body.sf-fantasy-game .stack-card>img[data-sf-orange-art="1"],
 body.sf-fantasy-game .sf-grave-card>img[data-sf-orange-art="1"],
 .deck-pick>img[data-sf-orange-art="1"]{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;aspect-ratio:3/4!important}
 `;
 document.head.appendChild(s);
}

document.addEventListener('contextmenu',e=>{
 const el=e.target.closest?.('[data-preview-card]');if(!el)return;
 const id=String(el.dataset.previewCard||'');if(!ORANGE_IDS.has(id))return;
 e.preventDefault();showOrangePreview(el,id,e.clientX,e.clientY);
},true);

boot();
window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));
for(const root of [document.getElementById('app'),document.getElementById('modal')].filter(Boolean))new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
setTimeout(boot,120);setTimeout(boot,600);setTimeout(boot,1600);
})();
