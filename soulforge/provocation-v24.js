(()=>{
const tapStates=new Map();
let divMode=null;
let divSourceKey=null;
let graveObserverScheduled=false;

function enemyGuards(){
 const s=session?.state;if(!s)return[];
 const enemy=otherP();
 const monsters=(s.board?.monsters||[]).filter(m=>Number(m.owner)===Number(enemy)&&s.monsterDefs?.[m.cardId]?.provocazione).map(m=>({type:'monster',uid:String(m.uid)}));
 const champions=(playerState(enemy)?.champions||[]).filter(c=>!c.defeated&&c.provocazione).map(c=>({type:'champion',player:Number(enemy),champId:String(c.id)}));
 return [...monsters,...champions];
}
function isAllowedMonster(m){
 const guards=enemyGuards();
 if(!guards.length)return true;
 return guards.some(g=>g.type==='monster'&&String(g.uid)===String(m.uid));
}
function addStatClasses(html){
 return String(html)
  .replace(/<span class="stat">POW/g,'<span class="stat sf-stat-pow">POW')
  .replace(/<span class="stat">HP/g,'<span class="stat sf-stat-hp">HP')
  .replace(/<span class="stat">Danni/g,'<span class="stat sf-stat-damage">Danni')
  .replace(/<span class="stat">Ferite\s*<b>[^<]*<\/b><\/span>/g,'');
}
function patchMonsterHtml(){
 if(typeof monsterHtml!=='function'||monsterHtml.__sfV25)return;
 const previous=monsterHtml;
 const wrapped=function(m){
  let html=previous(m);
  const own=Number(m?.owner)===Number(session?.player);
  const hasProv=!!session?.state?.monsterDefs?.[m?.cardId]?.provocazione;
  const allowed=isAllowedMonster(m);
  html=html.replace(/class="monster ([^"]*)"/,(_,cls)=>{
   let list=String(cls).split(/\s+/).filter(Boolean).filter(x=>x!=='attack-target');
   if(allowed)list.push('attack-target');
   if(own&&hasProv)list=list.filter(x=>x!=='provocazione');
   return `class="monster ${[...new Set(list)].join(' ')}"`;
  });
  if(own&&hasProv)html=html.replace(' • Provocazione','');
  return addStatClasses(html);
 };
 wrapped.__sfV25=true;
 monsterHtml=wrapped;
}
function patchChampHtml(){
 if(typeof champHtml!=='function'||champHtml.__sfV25)return;
 const previous=champHtml;
 const wrapped=function(c,owner,isOwn){
  let html=previous(c,owner,isOwn);
  if(!isOwn){
   const guards=enemyGuards();
   const allowed=!guards.length||guards.some(g=>g.type==='champion'&&Number(g.player)===Number(owner)&&String(g.champId)===String(c.id));
   html=html.replace(/class="champ ([^"]*)"/,(_,cls)=>{
    let list=String(cls).split(/\s+/).filter(Boolean).filter(x=>x!=='attack-target');
    if(allowed&&!c.defeated)list.push('attack-target');
    return `class="champ ${[...new Set(list)].join(' ')}"`;
   });
  }
  return addStatClasses(html);
 };
 wrapped.__sfV25=true;
 champHtml=wrapped;
}
function injectStyle(){
 if(document.getElementById('sfV25Style'))return;
 const style=document.createElement('style');style.id='sfV25Style';style.textContent=`
 .sf-stat-pow{border-color:rgba(255,159,67,.65)!important;background:rgba(255,159,67,.13)!important;color:#ffad55!important}.sf-stat-pow b{color:#ffad55!important}
 .sf-stat-hp{border-color:rgba(82,210,115,.62)!important;background:rgba(82,210,115,.12)!important;color:#62db82!important}.sf-stat-hp b{color:#62db82!important}
 .sf-stat-damage{border-color:rgba(255,92,92,.62)!important;background:rgba(255,92,92,.12)!important;color:#ff7474!important}.sf-stat-damage b{color:#ff7474!important}
 .champ .champ-art{transform-origin:50% 50%;will-change:transform;transition:transform .34s cubic-bezier(.2,.8,.2,1)}
 .champ.sf-tapped .champ-art{transform:rotate(90deg) scale(.72)}
 .champ.sf-tap-anim .champ-art{animation:sfTapCard .34s cubic-bezier(.2,.8,.2,1) both}
 .champ.sf-untap-anim .champ-art{animation:sfUntapCard .34s cubic-bezier(.2,.8,.2,1) both}
 @keyframes sfTapCard{from{transform:rotate(0deg) scale(1)}to{transform:rotate(90deg) scale(.72)}}
 @keyframes sfUntapCard{from{transform:rotate(90deg) scale(.72)}to{transform:rotate(0deg) scale(1)}}
 .champ.sf-divoratore-ready{cursor:pointer!important;box-shadow:0 0 0 2px rgba(177,94,255,.55) inset,0 0 26px rgba(122,45,184,.18)}
 .sf-v25-grave-target{outline:3px solid #c98cff!important;outline-offset:3px!important;cursor:crosshair!important;animation:sfGravePulse 1s ease-in-out infinite alternate}
 @keyframes sfGravePulse{from{box-shadow:0 0 0 0 rgba(201,140,255,.12)}to{box-shadow:0 0 0 7px rgba(201,140,255,.12)}}
 #sfDivHint{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:10020;background:#17131d;border:1px solid #c98cff;color:#f0dcff;border-radius:999px;padding:9px 15px;font-size:12px;font-weight:900;box-shadow:0 8px 30px rgba(0,0,0,.35)}
 #sfDivArrow{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:10018;overflow:visible}
 .sf-v25-grave-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin-top:12px}
 .sf-v25-grave-choice{appearance:none;border:2px solid #3a4351;background:#10141b;border-radius:14px;padding:7px;color:#fff;text-align:left;cursor:pointer;transition:transform .15s,border-color .15s,filter .15s;min-width:0}
 .sf-v25-grave-choice:hover,.sf-v25-grave-choice:focus-visible{transform:translateY(-3px);border-color:#c98cff;filter:brightness(1.08);outline:none}
 .sf-v25-grave-choice img{display:block;width:100%;aspect-ratio:2/3;object-fit:contain;border-radius:10px;background:#0b0e13}
 .sf-v25-grave-choice strong{display:block;margin-top:7px;font-size:12px;line-height:1.25}
 @media(max-width:800px){.sf-v25-grave-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.champ.sf-tapped .champ-art{transform:rotate(90deg) scale(.68)}}
 @media(prefers-reduced-motion:reduce){.champ .champ-art,.sf-v25-grave-target{transition:none!important;animation:none!important}}
 `;document.head.appendChild(style);
}
function artUrl(id){
 try{return typeof window.sfArtUrl21==='function'?window.sfArtUrl21(id):''}catch{return''}
}
function scheduleGraveImages(){
 if(graveObserverScheduled)return;graveObserverScheduled=true;
 requestAnimationFrame(()=>{graveObserverScheduled=false;enhanceGraveImages()});
}
function enhanceGraveImages(){
 document.querySelectorAll('.sf-grave-card[data-preview-card]').forEach(el=>{
  const id=el.dataset.previewCard,u=artUrl(id);if(!u)return;
  let img=el.querySelector('img');
  if(!img){img=document.createElement('img');img.alt=id;img.loading='lazy';el.prepend(img)}
  if(img.src!==u)img.src=u;
 });
}
function championState(owner,id){return playerState(Number(owner))?.champions?.find(c=>String(c.id)===String(id))||null}
function canUseDivoratore(){
 const s=session?.state,me=playerState(session?.player),c=me?.champions?.find(x=>x.id==='divoratore_campione');
 return !!(s&&me&&c&&s.status==='main'&&Number(s.focus)===Number(session.player)&&!s.priority&&!s.stack?.length&&!s.combat&&!s.pendingChoice&&!c.defeated&&!c.tapped&&me.killedMonsterThisTurn&&(me.graveCards||[]).length);
}
function processChampions(){
 document.querySelectorAll('.champ[data-owner][data-champ-id]').forEach(el=>{
  const c=championState(el.dataset.owner,el.dataset.champId);if(!c)return;
  const key=`${el.dataset.owner}:${el.dataset.champId}`,tapped=!!c.tapped&&!c.defeated,prev=tapStates.get(key);
  el.classList.toggle('sf-tapped',tapped);
  el.classList.remove('sf-tap-anim','sf-untap-anim');
  if(prev!==undefined&&prev!==tapped)el.classList.add(tapped?'sf-tap-anim':'sf-untap-anim');
  tapStates.set(key,tapped);
  if(Number(el.dataset.owner)===Number(session.player)&&el.dataset.champId==='divoratore_campione')el.classList.toggle('sf-divoratore-ready',canUseDivoratore());
  el.querySelectorAll('.stats .stat').forEach(stat=>{
   const text=stat.textContent.trim();
   if(text.startsWith('Ferite')){stat.remove();return}
   if(text.startsWith('POW'))stat.classList.add('sf-stat-pow');
   else if(text.startsWith('HP'))stat.classList.add('sf-stat-hp');
   else if(text.startsWith('Danni'))stat.classList.add('sf-stat-damage');
  });
 });
 document.querySelectorAll('.monster .stats .stat').forEach(stat=>{
  const text=stat.textContent.trim();
  if(text.startsWith('POW'))stat.classList.add('sf-stat-pow');
  else if(text.startsWith('Danni'))stat.classList.add('sf-stat-damage');
 });
}
function ensureDivLayers(){
 let svg=document.getElementById('sfDivArrow');
 if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='sfDivArrow';document.body.appendChild(svg)}
 let hint=document.getElementById('sfDivHint');
 if(!hint){hint=document.createElement('div');hint.id='sfDivHint';document.body.appendChild(hint)}
 return{svg,hint};
}
function center(el){if(!el)return null;const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
function ownDivEl(){return document.querySelector(`.champ[data-owner="${session.player}"][data-champ-id="divoratore_campione"]`)}
function ownCardsGraveBtn(){return document.querySelector(`.sf-grave-btn[data-owner="${session.player}"][data-kind="cards"]`)}
function drawDivArrow(){
 if(divMode!=='grave')return;
 const{svg,hint}=ensureDivLayers(),from=center(ownDivEl()),to=center(ownCardsGraveBtn());
 hint.textContent='Ritorno delle Anime: seleziona il tuo Cimitero Carte  •  ESC per annullare';
 if(!from||!to){svg.innerHTML='';return}
 const dx=to.x-from.x,dy=to.y-from.y,d=Math.hypot(dx,dy)||1,x1=from.x+dx/d*20,y1=from.y+dy/d*20,x2=to.x-dx/d*18,y2=to.y-dy/d*18;
 svg.innerHTML=`<defs><marker id="sfDivHead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#c98cff"/></marker></defs><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c98cff" stroke-width="4" stroke-linecap="round" marker-end="url(#sfDivHead)"/>`;
}
function clearDivVisuals(){
 document.body.classList.remove('sf-divoratore-targeting');
 document.querySelectorAll('.sf-v25-grave-target').forEach(x=>x.classList.remove('sf-v25-grave-target'));
 document.getElementById('sfDivArrow')?.remove();document.getElementById('sfDivHint')?.remove();
}
function cancelDivoratore(){divMode=null;divSourceKey=null;clearDivVisuals()}
function markDivTarget(){
 if(divMode!=='grave')return;
 const btn=ownCardsGraveBtn();if(btn)btn.classList.add('sf-v25-grave-target');
 drawDivArrow();
}
function startDivoratore(){
 if(!canUseDivoratore())return false;
 try{document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))}catch{}
 window.__v17AttackSource=null;
 divMode='grave';divSourceKey=`${session.player}:divoratore_campione`;
 document.body.classList.add('sf-divoratore-targeting');
 setTimeout(markDivTarget,0);setTimeout(markDivTarget,40);
 return true;
}
function graveChoiceHtml(c){
 const u=artUrl(c.id),pic=u?`<img src="${u}" alt="${esc(c.name||c.id)}" loading="lazy">`:'';
 return `<button type="button" class="sf-v25-grave-choice" data-sf-div-card="${c.id}" data-preview-card="${c.id}">${pic}<strong>${esc(c.name||c.id)}</strong></button>`;
}
function openDivoratoreGrave(){
 const cards=playerState(session.player)?.graveCards||[];
 if(!cards.length){cancelDivoratore();try{showError('Il tuo Cimitero Carte è vuoto.')}catch{}return}
 divMode='card';clearDivVisuals();
 showModal('Ritorno delle Anime — scegli una carta',`<div class="sub">Scegli graficamente una carta dal tuo Cimitero da riprendere in mano.</div><div class="sf-v25-grave-grid">${cards.map(graveChoiceHtml).join('')}</div><div class="controls" style="margin-top:14px"><button type="button" class="btn ghost" id="sfDivCancel">Annulla</button></div>`);
 document.getElementById('sfDivCancel')?.addEventListener('click',()=>{cancelDivoratore();closeModal()});
}
function postRender(){
 injectStyle();processChampions();enhanceGraveImages();
 if(divMode==='grave'){
  if(!canUseDivoratore()){cancelDivoratore();return}
  setTimeout(markDivTarget,0);
 }
}
function patchRender(){
 if(typeof render!=='function'||render.__sfV25)return;
 const previous=render;
 const wrapped=function(){patchMonsterHtml();patchChampHtml();const out=previous();setTimeout(postRender,0);return out};
 wrapped.__sfV25=true;render=wrapped;
}
function install(redraw=false){
 injectStyle();patchMonsterHtml();patchChampHtml();patchRender();
 if(redraw&&session?.state)render();else setTimeout(postRender,0);
}

document.addEventListener('click',e=>{
 const ability=e.target.closest?.('.v17-champ-ability');
 const div=e.target.closest?.(`.champ[data-owner="${session?.player}"][data-champ-id="divoratore_campione"]`);
 if((ability||div)&&canUseDivoratore()){
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();startDivoratore();return;
 }
 if(divMode==='grave'){
  const grave=e.target.closest?.(`.sf-grave-btn[data-owner="${session?.player}"][data-kind="cards"]`);
  if(grave){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openDivoratoreGrave();return}
 }
 if(divMode==='card'){
  const card=e.target.closest?.('[data-sf-div-card]');
  if(card){
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const id=card.dataset.sfDivCard;cancelDivoratore();closeModal();move({type:'activate_champion',champId:'divoratore_campione',graveCardId:id});return;
  }
 }
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&divMode){cancelDivoratore()}},true);
window.addEventListener('resize',()=>requestAnimationFrame(drawDivArrow));
window.addEventListener('scroll',()=>requestAnimationFrame(drawDivArrow),true);
const graveObserver=new MutationObserver(scheduleGraveImages);graveObserver.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('sf-blue-ready',()=>setTimeout(()=>install(true),0));
install(true);
})();
