(()=>{
let active=null;
let mouse={x:null,y:null};
let graveOpened=false;

function injectStyle(){
 if(document.getElementById('sfStdTargetStyle'))return;
 const s=document.createElement('style');
 s.id='sfStdTargetStyle';
 s.textContent=`
 .sf-std-valid{outline:3px solid #ffd166!important;outline-offset:3px!important;cursor:crosshair!important;filter:brightness(1.1)!important;box-shadow:0 0 0 4px rgba(255,209,102,.12),0 0 28px rgba(255,209,102,.24)!important;animation:sfStdPulse .85s ease-in-out infinite alternate}
 .sf-std-invalid{opacity:.48!important}
 #sfStdTargetHint{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:10040;background:#171b23;border:1px solid #ffd166;color:#fff4cf;border-radius:999px;padding:10px 18px;font-size:12px;font-weight:900;box-shadow:0 8px 30px rgba(0,0,0,.38);max-width:min(92vw,760px);text-align:center}
 #sfStdTargetArrow{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:10038;overflow:visible}
 @keyframes sfStdPulse{from{filter:brightness(1.03)}to{filter:brightness(1.18)}}
 @media(prefers-reduced-motion:reduce){.sf-std-valid{animation:none!important}}
 `;
 document.head.appendChild(s);
}
function pending(){
 const pc=session?.state?.pendingChoice;
 if(!pc||pc.hidden||Number(pc.player)!==Number(session?.player))return null;
 if(pc.type==='trigger_target'||pc.type==='cerbero')return pc;
 return null;
}
function signature(pc){
 if(!pc)return'';
 const tr=pc.trigger||{};
 const ids=pc.type==='cerbero'?(pc.cardIds||[]):(pc.options||[]).map(o=>o.id);
 return [pc.type,tr.effectId||'',tr.sourceCardId||'',tr.choiceType||'',...ids].join('|');
}
function choiceType(pc){return pc?.type==='cerbero'?'graveMonsterPow2':pc?.trigger?.choiceType||''}
function options(pc){
 if(pc?.type==='cerbero')return (pc.cardIds||[]).map(id=>({id,label:session?.state?.monsterDefs?.[id]?.name||id}));
 return pc?.options||[];
}
function clearMarks(){
 document.querySelectorAll('.sf-std-valid').forEach(el=>el.classList.remove('sf-std-valid'));
 document.querySelectorAll('.sf-std-invalid').forEach(el=>el.classList.remove('sf-std-invalid'));
 document.querySelectorAll('[data-sf-std-choice]').forEach(el=>delete el.dataset.sfStdChoice);
}
function clearUI(removeModal=false){
 clearMarks();
 document.getElementById('sfStdTargetHint')?.remove();
 document.getElementById('sfStdTargetArrow')?.remove();
 if(removeModal&&graveOpened){try{closeModal()}catch{}}
 graveOpened=false;
}
function ensureUI(){
 injectStyle();
 let hint=document.getElementById('sfStdTargetHint');
 if(!hint){hint=document.createElement('div');hint.id='sfStdTargetHint';document.body.appendChild(hint)}
 let svg=document.getElementById('sfStdTargetArrow');
 if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='sfStdTargetArrow';document.body.appendChild(svg)}
 return{hint,svg};
}
function visible(el){if(!el)return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0}
function center(el){if(!el)return null;const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
function sourceEl(pc){
 if(pc?.type==='cerbero'&&pc.monsterUid){const m=document.querySelector(`[data-monster-uid="${CSS.escape(String(pc.monsterUid))}"]`);if(visible(m))return m}
 const id=pc?.trigger?.sourceCardId;
 if(id){
  const els=[...document.querySelectorAll(`[data-preview-card="${CSS.escape(String(id))}"]`)].filter(visible);
  const preferred=els.find(el=>el.matches('.monster,.champ,.stack-card'))||els[0];
  if(preferred)return preferred;
 }
 return document.getElementById('sfStdTargetHint');
}
function playerZone(owner){
 return [...document.querySelectorAll('.playerzone')].find(z=>z.querySelector(`.champ[data-owner="${owner}"]`))||null;
}
function graveCardsEls(ids){
 const allowed=new Set(ids.map(String));
 return [...document.querySelectorAll('.sf-grave-card[data-preview-card]')].filter(el=>allowed.has(String(el.dataset.previewCard))&&visible(el));
}
function buildCandidates(pc){
 const type=choiceType(pc),opts=options(pc),ids=opts.map(o=>String(o.id)),out=[];
 const add=(el,id)=>{if(el&&visible(el)&&!out.some(x=>x.el===el)){el.dataset.sfStdChoice=String(id);out.push({el,id:String(id)})}};
 if(type==='enemyChampion'){
  for(const id of ids)add(document.querySelector(`.champ[data-owner="${otherP()}"][data-champ-id="${CSS.escape(id)}"]`),id);
 }
 else if(type==='monsterUids'){
  for(const id of ids)add(document.querySelector(`[data-monster-uid="${CSS.escape(id)}"]`),id);
 }
 else if(type==='enemySoul'){
  const zone=playerZone(otherP());
  for(const id of ids)add(zone?.querySelector(`.soul.${CSS.escape(id)}`),id);
 }
 else if(type==='graveMonsterPow2'){
  for(const el of graveCardsEls(ids))add(el,el.dataset.previewCard);
 }
 else {
  // Generic future-proof mapping: try board characters, monsters, souls and visible grave cards by option id.
  for(const id of ids){
   const champ=document.querySelector(`.champ[data-champ-id="${CSS.escape(id)}"]`);
   const mon=document.querySelector(`[data-monster-uid="${CSS.escape(id)}"]`);
   const grave=[...document.querySelectorAll(`.sf-grave-card[data-preview-card="${CSS.escape(id)}"]`)].find(visible);
   const soul=[...document.querySelectorAll(`.soul.${CSS.escape(id)}`)].find(visible);
   add(champ||mon||grave||soul,id);
  }
 }
 return out;
}
function labelFor(pc){
 const type=choiceType(pc),name=pc?.trigger?.effectName||(pc?.type==='cerbero'?'Effetto — Cerbero':'Scegli un bersaglio');
 const action=type==='enemyChampion'?'scegli un Campione nemico':type==='monsterUids'?'scegli un Mostro':type==='enemySoul'?'scegli graficamente un’Anima nemica':type==='graveMonsterPow2'?'scegli un Mostro valido dal tuo Cimitero':'scegli il bersaglio evidenziato';
 return `${name}: ${action}  •  ESC per annullare`;
}
function draw(){
 if(!active)return;
 const {svg}=ensureUI(),from=center(sourceEl(active.pc));
 if(!from||mouse.x==null||mouse.y==null){svg.innerHTML='';return}
 svg.innerHTML=`<defs><marker id="sfStdHead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ffd166"/></marker></defs><line x1="${from.x}" y1="${from.y}" x2="${mouse.x}" y2="${mouse.y}" stroke="#ffd166" stroke-width="4" stroke-linecap="round" marker-end="url(#sfStdHead)"/>`;
}
function suppressLegacyModal(){
 const box=document.querySelector('[data-v17-pending="trigger_target"],[data-v17-pending="cerbero"]');
 if(box){try{closeModal()}catch{document.getElementById('modal').innerHTML=''}}
}
function openGraveForTarget(pc){
 if(choiceType(pc)!=='graveMonsterPow2')return false;
 const ids=options(pc).map(o=>String(o.id));
 if(graveCardsEls(ids).length)return false;
 const btn=document.querySelector(`.sf-grave-btn[data-owner="${session.player}"][data-kind="monsters"]`);
 if(!btn||graveOpened)return false;
 graveOpened=true;
 setTimeout(()=>{btn.click();setTimeout(sync,40)},0);
 return true;
}
function markNonTargets(pc,cands){
 const type=choiceType(pc),valid=new Set(cands.map(x=>x.el));
 let pool=[];
 if(type==='enemyChampion')pool=[...document.querySelectorAll(`.champ[data-owner="${otherP()}"][data-champ-id]`)];
 else if(type==='monsterUids')pool=[...document.querySelectorAll('[data-monster-uid]')];
 else if(type==='enemySoul')pool=[...(playerZone(otherP())?.querySelectorAll('.soul')||[])];
 else if(type==='graveMonsterPow2')pool=[...document.querySelectorAll('.sf-grave-card[data-preview-card]')];
 pool.filter(visible).forEach(el=>{if(!valid.has(el))el.classList.add('sf-std-invalid')});
}
function sync(){
 injectStyle();
 const pc=pending();
 if(!pc){if(active){clearUI(true);active=null}return}
 suppressLegacyModal();
 const sig=signature(pc);
 if(!active||active.sig!==sig){clearUI(false);active={pc,sig,candidates:[]};graveOpened=false}else active.pc=pc;
 const {hint}=ensureUI();hint.textContent=labelFor(pc);
 if(openGraveForTarget(pc))return;
 clearMarks();
 const cands=buildCandidates(pc);active.candidates=cands;
 cands.forEach(({el})=>el.classList.add('sf-std-valid'));
 markNonTargets(pc,cands);
 if(!cands.length)hint.textContent=labelFor(pc)+' — nessun bersaglio grafico disponibile';
 draw();
}
function resolve(id){
 if(!active)return;
 const pc=active.pc;
 clearUI(true);active=null;
 if(pc.type==='cerbero')move({type:'resolve_choice',cardId:id});
 else move({type:'resolve_choice',choice:id});
}

// Blocca soltanto il vecchio popup testuale dei trigger; tutti gli altri modal restano invariati.
if(typeof window.showModal==='function'&&!window.showModal.__sfStd26){
 const previous=window.showModal;
 const wrapped=function(title,body){
  const text=String(body||'');
  if(pending()&&(text.includes('data-v17-pending="trigger_target"')||text.includes('data-v17-pending="cerbero"'))){setTimeout(sync,0);return}
  return previous(title,body);
 };
 wrapped.__sfStd26=true;window.showModal=wrapped;
}

document.addEventListener('mousemove',e=>{mouse={x:e.clientX,y:e.clientY};if(active)draw()},true);
document.addEventListener('click',e=>{
 if(!active)return;
 const el=e.target.closest?.('[data-sf-std-choice].sf-std-valid');
 if(!el)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();resolve(String(el.dataset.sfStdChoice));
},true);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&active){e.preventDefault();clearUI(true);active=null}
},true);

const observer=new MutationObserver(()=>queueMicrotask(sync));
observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-preview-card']});
if(typeof render==='function'&&!render.__sfStd26){
 const previous=render;
 const wrapped=function(){const out=previous();setTimeout(sync,0);setTimeout(sync,30);return out};
 wrapped.__sfStd26=true;render=wrapped;
}
window.addEventListener('resize',()=>{if(active)draw()});
window.addEventListener('sf-blue-ready',()=>setTimeout(sync,0));
setInterval(()=>{if(pending())sync()},350);
setTimeout(sync,0);
})();
