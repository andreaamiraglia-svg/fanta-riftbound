(()=>{
const STYLE_ID='sfTargetImages83Style';
const CARD_RATIO='762 / 1024';

function esc(value){
  return String(value??'').replace(/[&<>"']/g,ch=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[ch]);
}

function state(){
  try{return session?.state||null}catch{return null}
}

function players(){
  const rows=state()?.players||{};
  return Object.values(rows).filter(Boolean);
}

function championById(id){
  id=String(id??'');
  for(const p of players()){
    const found=(p?.champions||[]).find(c=>String(c?.id)===id);
    if(found)return found;
  }
  return null;
}

function monsterByUid(uid){
  uid=String(uid??'');
  return (state()?.board?.monsters||[]).find(m=>String(m?.uid)===uid)||null;
}

function cardIdFor(item){
  const value=item?.value??item?.id;
  if(value&&typeof value==='object'){
    if(value.type==='champion')return String(championById(value.champId)?.cardId||value.champId||'');
    if(value.type==='monster')return String(monsterByUid(value.uid)?.cardId||'');
    if(value.cardId)return String(value.cardId);
    if(value.champId)return String(championById(value.champId)?.cardId||value.champId);
    if(value.monsterUid||value.uid)return String(monsterByUid(value.monsterUid||value.uid)?.cardId||'');
  }

  const raw=String(value??'');
  if(!raw)return'';
  const monster=monsterByUid(raw);
  if(monster)return String(monster.cardId||'');
  const champion=championById(raw);
  if(champion)return String(champion.cardId||champion.id||'');

  const s=state();
  if(s?.cardDefs?.[raw]||s?.monsterDefs?.[raw])return raw;
  for(const p of players()){
    const known=[...(p?.handCards||[]),...(p?.graveCards||[]),...(p?.deckCards||[])].find(c=>String(c?.id)===raw);
    if(known)return String(known.cardId||known.id||raw);
  }
  return raw;
}

function domArt(item,id){
  const value=item?.value??item?.id;
  const raw=value&&typeof value==='object'
    ? String(value.champId||value.uid||value.monsterUid||'')
    : String(value??'');
  const selectors=[
    raw&&`.champ[data-champ-id="${CSS.escape(raw)}"] img`,
    raw&&`[data-monster-uid="${CSS.escape(raw)}"] img`,
    id&&`[data-hand-card="${CSS.escape(id)}"] img`,
    id&&`[data-preview-card="${CSS.escape(id)}"] img`,
    id&&`[data-card="${CSS.escape(id)}"] img`,
    id&&`[data-card-id="${CSS.escape(id)}"] img`
  ].filter(Boolean);
  for(const selector of selectors){
    const img=document.querySelector(selector);
    const src=img?.currentSrc||img?.src;
    if(src)return src;
  }
  return'';
}

function artFor(item){
  if(item?.img||item?.image||item?.art)return String(item.img||item.image||item.art);
  const id=cardIdFor(item);
  try{
    const url=typeof window.sfArtUrl21==='function'?window.sfArtUrl21(id):'';
    if(url)return String(url);
  }catch{}
  try{
    const url=typeof sfArtUrl21==='function'?sfArtUrl21(id):'';
    if(url)return String(url);
  }catch{}
  return domArt(item,id);
}

function targetMarkup(items){
  return '<div class="target-grid sf-target-image-grid">'+items.map((item,index)=>{
    const label=String(item?.label||cardIdFor(item)||'Carta');
    const desc=String(item?.desc||'');
    const src=artFor(item);
    return '<button type="button" class="target sf-target-card" data-i="'+index+'">'
      +(src?'<img class="sf-target-card-art" src="'+esc(src)+'" alt="'+esc(label)+'" loading="eager" decoding="async">':'<span class="sf-target-card-placeholder" aria-hidden="true">?</span>')
      +'<span class="sf-target-card-copy"><b>'+esc(label)+'</b>'
      +(desc?'<span class="tiny">'+esc(desc)+'</span>':'')
      +'</span></button>';
  }).join('')+'</div>';
}

function installTargetButtons(){
  let current=null;
  try{if(typeof targetButtons==='function')current=targetButtons}catch{}
  if(!current&&typeof window.targetButtons==='function')current=window.targetButtons;
  if(current?.__sfTargetImages83)return;
  const enhanced=items=>targetMarkup(Array.isArray(items)?items:[]);
  enhanced.__sfTargetImages83=true;
  enhanced.__previous=current;
  try{targetButtons=enhanced}catch{}
  try{window.targetButtons=enhanced}catch{}
}

function pendingOptions(){
  const pc=state()?.pendingChoice;
  if(!pc)return[];
  if(pc.type==='cerbero')return (pc.cardIds||[]).map(id=>({id,value:id,label:state()?.monsterDefs?.[id]?.name||id}));
  if(pc.type==='v52_minotauro_discard')return (pc.cardIds||[]).map(id=>({id,value:id,label:state()?.cardDefs?.[id]?.name||id}));
  return (pc.options||[]).map(o=>({...o,value:o.value??o.id}));
}

function decorateFallback(){
  const box=document.getElementById('sfStdFallback');
  if(!box)return;
  const opts=pendingOptions();
  box.classList.add('sf-target-image-fallback');
  box.querySelectorAll('button[data-sf-fallback-choice]').forEach(button=>{
    if(button.querySelector('.sf-target-card-art,.sf-target-card-placeholder'))return;
    const id=String(button.dataset.sfFallbackChoice||'');
    const item=opts.find(o=>String(o.id??o.value)===id)||{id,value:id,label:button.textContent?.trim()||id};
    const label=String(item.label||button.textContent?.trim()||id);
    const src=artFor(item);
    const copy=document.createElement('span');
    copy.className='sf-target-card-copy';
    copy.textContent=label;
    button.textContent='';
    if(src){
      const img=document.createElement('img');
      img.className='sf-target-card-art';
      img.src=src;
      img.alt=label;
      img.decoding='async';
      button.appendChild(img);
    }else{
      const placeholder=document.createElement('span');
      placeholder.className='sf-target-card-placeholder';
      placeholder.textContent='?';
      placeholder.setAttribute('aria-hidden','true');
      button.appendChild(placeholder);
    }
    button.appendChild(copy);
  });
}

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
  .sf-target-image-grid{grid-template-columns:repeat(auto-fit,minmax(136px,180px));justify-content:center;align-items:stretch;gap:12px}
  .target.sf-target-card{display:flex;min-width:0;flex-direction:column;gap:8px;padding:7px;text-align:left;overflow:hidden;border-color:#556173;background:linear-gradient(155deg,#252b37,#12161d);transition:transform .14s ease,border-color .14s ease,box-shadow .14s ease}
  .target.sf-target-card:hover,.target.sf-target-card:focus-visible{transform:translateY(-3px);border-color:#ffd166;box-shadow:0 10px 26px rgba(0,0,0,.42),0 0 0 2px rgba(255,209,102,.18);outline:none}
  .sf-target-card-art,.sf-target-card-placeholder{display:block;width:100%;aspect-ratio:${CARD_RATIO};border-radius:7px;background:#090b0f;border:1px solid rgba(255,255,255,.12);object-fit:cover;object-position:center}
  .sf-target-card-placeholder{display:grid;place-items:center;color:#8c96a8;font-size:34px;font-weight:900}
  .sf-target-card-copy{display:flex;min-width:0;flex-direction:column;gap:3px;line-height:1.2}
  .sf-target-card-copy b{font-size:13px;overflow-wrap:anywhere}
  .sf-target-card-copy .tiny{display:block;font-size:11px;line-height:1.25}
  #sfStdFallback.sf-target-image-fallback{display:grid;grid-template-columns:repeat(auto-fit,minmax(108px,142px));align-items:stretch;max-height:calc(100vh - 130px);overflow:auto}
  #sfStdFallback.sf-target-image-fallback button{display:flex;min-width:0;flex-direction:column;gap:6px;padding:6px;text-align:left}
  #sfStdFallback.sf-target-image-fallback .sf-target-card-copy{font-size:12px;line-height:1.2}
  @media(max-width:620px){
    .sf-target-image-grid{grid-template-columns:repeat(2,minmax(118px,1fr));gap:9px}
    .target.sf-target-card{padding:6px}
    #sfStdFallback.sf-target-image-fallback{grid-template-columns:repeat(2,minmax(96px,1fr));width:min(94vw,360px)}
  }
  `;
  document.head.appendChild(style);
}

let queued=false;
function boot(){
  injectStyle();
  installTargetButtons();
  decorateFallback();
}
function schedule(){
  if(queued)return;
  queued=true;
  queueMicrotask(()=>{queued=false;try{boot()}catch(err){console.error('[target-images-v83]',err)}});
}

boot();
setTimeout(boot,250);
setTimeout(boot,1000);
window.addEventListener('sf-blue-ready',schedule);
const modal=document.getElementById('modal');
const app=document.getElementById('app');
const observer=new MutationObserver(schedule);
if(modal)observer.observe(modal,{childList:true,subtree:true});
if(app)observer.observe(app,{childList:true,subtree:true});
})();
