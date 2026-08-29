(()=>{
let active=null;
let mouse={x:null,y:null};
let graveOpened=false;
let resolving=false;
let syncQueued=false;

function injectStyle(){
  if(document.getElementById('sfStdTargetStyle27'))return;
  const s=document.createElement('style');
  s.id='sfStdTargetStyle27';
  s.textContent=`
  .sf-std-valid{position:relative!important;z-index:10060!important;pointer-events:auto!important;outline:3px solid #ffd166!important;outline-offset:3px!important;cursor:crosshair!important;filter:brightness(1.12)!important;box-shadow:0 0 0 4px rgba(255,209,102,.16),0 0 34px rgba(255,209,102,.34)!important;animation:sfStdPulse27 .85s ease-in-out infinite alternate}
  .sf-std-invalid{opacity:.42!important}
  #sfStdTargetHint{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:10070;background:#171b23;border:1px solid #ffd166;color:#fff4cf;border-radius:999px;padding:10px 18px;font-size:12px;font-weight:900;box-shadow:0 8px 30px rgba(0,0,0,.48);max-width:min(92vw,760px);text-align:center;pointer-events:none}
  #sfStdTargetArrow{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:10058;overflow:visible}
  #sfStdFallback{position:fixed;left:50%;top:68px;transform:translateX(-50%);z-index:10072;display:flex;flex-wrap:wrap;justify-content:center;gap:8px;max-width:min(92vw,760px);padding:10px 12px;border:1px solid rgba(255,209,102,.55);border-radius:14px;background:rgba(16,19,26,.96);box-shadow:0 12px 34px rgba(0,0,0,.55)}
  #sfStdFallback button{border:1px solid #9b7834;background:#2a2112;color:#fff0c5;border-radius:10px;padding:9px 12px;font-weight:900;cursor:pointer}
  #sfStdFallback button:hover{filter:brightness(1.18)}
  @keyframes sfStdPulse27{from{filter:brightness(1.04)}to{filter:brightness(1.2)}}
  @media(prefers-reduced-motion:reduce){.sf-std-valid{animation:none!important}}
  `;
  document.head.appendChild(s);
}

function pending(){
  const pc=session?.state?.pendingChoice;
  if(!pc||pc.hidden||Number(pc.player)!==Number(session?.player))return null;
  return (pc.type==='trigger_target'||pc.type==='cerbero')?pc:null;
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
function visible(el){
  if(!el||!el.isConnected)return false;
  const r=el.getBoundingClientRect(),st=getComputedStyle(el);
  return r.width>0&&r.height>0&&st.display!=='none'&&st.visibility!=='hidden';
}
function center(el){
  if(!visible(el))return null;
  const r=el.getBoundingClientRect();
  return{x:r.left+r.width/2,y:r.top+r.height/2};
}
function css(v){return CSS.escape(String(v))}

function clearMarks(){
  document.querySelectorAll('.sf-std-valid').forEach(el=>el.classList.remove('sf-std-valid'));
  document.querySelectorAll('.sf-std-invalid').forEach(el=>el.classList.remove('sf-std-invalid'));
  document.querySelectorAll('[data-sf-std-choice]').forEach(el=>delete el.dataset.sfStdChoice);
}
function clearUI(closeGrave=false){
  clearMarks();
  document.getElementById('sfStdTargetHint')?.remove();
  document.getElementById('sfStdTargetArrow')?.remove();
  document.getElementById('sfStdFallback')?.remove();
  if(closeGrave&&graveOpened){try{closeModal()}catch{}}
  graveOpened=false;
}
function ensureUI(){
  injectStyle();
  let hint=document.getElementById('sfStdTargetHint');
  if(!hint){
    hint=document.createElement('div');
    hint.id='sfStdTargetHint';
    document.body.appendChild(hint);
  }
  let svg=document.getElementById('sfStdTargetArrow');
  if(!svg){
    svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.id='sfStdTargetArrow';
    svg.innerHTML='<defs><marker id="sfStdHead27" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ffd166"/></marker></defs><line id="sfStdTargetLine27" stroke="#ffd166" stroke-width="4" stroke-linecap="round" marker-end="url(#sfStdHead27)" visibility="hidden"/>';
    document.body.appendChild(svg);
  }
  return{hint,svg,line:svg.querySelector('#sfStdTargetLine27')};
}
function sourceEl(pc){
  if(pc?.type==='cerbero'&&pc.monsterUid){
    const m=document.querySelector(`[data-monster-uid="${css(pc.monsterUid)}"]`);
    if(visible(m))return m;
  }
  const id=pc?.trigger?.sourceCardId;
  if(id){
    const els=[...document.querySelectorAll(`[data-preview-card="${css(id)}"]`)].filter(visible);
    const preferred=els.find(el=>el.matches('.monster,.champ,.stack-card'))||els[0];
    if(preferred)return preferred;
  }
  return document.getElementById('sfStdTargetHint');
}
function playerZone(owner){
  const fantasy=document.querySelector(Number(owner)===Number(session?.player)?'.sf-player-zone':'.sf-opponent-zone');
  if(fantasy)return fantasy;
  return [...document.querySelectorAll('.playerzone')].find(z=>z.querySelector(`.champ[data-owner="${owner}"]`))||null;
}
function soulEl(owner,color){
  const zone=playerZone(owner);
  const inZone=zone?[...zone.querySelectorAll(`.soul.${css(color)}`)].find(visible):null;
  if(inZone)return inZone;
  return [...document.querySelectorAll(`.playerzone .soul.${css(color)}`)].find(visible)||null;
}
function graveCardsEls(ids){
  const allowed=new Set(ids.map(String));
  return [...document.querySelectorAll('.sf-grave-card[data-preview-card]')].filter(el=>allowed.has(String(el.dataset.previewCard))&&visible(el));
}
function buildCandidates(pc){
  const type=choiceType(pc),opts=options(pc),ids=opts.map(o=>String(o.id)),out=[];
  const add=(el,id)=>{
    if(el&&visible(el)&&!out.some(x=>x.el===el)){
      el.dataset.sfStdChoice=String(id);
      out.push({el,id:String(id)});
    }
  };
  if(type==='enemyChampion'){
    for(const id of ids)add(document.querySelector(`.champ[data-owner="${otherP()}"][data-champ-id="${css(id)}"]`),id);
  }else if(type==='monsterUids'){
    for(const id of ids)add(document.querySelector(`[data-monster-uid="${css(id)}"]`),id);
  }else if(type==='enemySoul'){
    for(const id of ids)add(soulEl(otherP(),id),id);
  }else if(type==='graveMonsterPow2'){
    for(const el of graveCardsEls(ids))add(el,el.dataset.previewCard);
  }else{
    for(const id of ids){
      const champ=document.querySelector(`.champ[data-champ-id="${css(id)}"]`);
      const mon=document.querySelector(`[data-monster-uid="${css(id)}"]`);
      const grave=[...document.querySelectorAll(`.sf-grave-card[data-preview-card="${css(id)}"]`)].find(visible);
      const soul=[...document.querySelectorAll(`.soul.${css(id)}`)].find(visible);
      add(champ||mon||grave||soul,id);
    }
  }
  return out;
}
function labelFor(pc){
  const type=choiceType(pc),name=pc?.trigger?.effectName||(pc?.type==='cerbero'?'Effetto — Cerbero':'Scegli un bersaglio');
  const action=type==='enemyChampion'?'scegli un Campione nemico':type==='monsterUids'?'scegli un Mostro evidenziato':type==='enemySoul'?'scegli una delle Anime avversarie evidenziate':type==='graveMonsterPow2'?'scegli un Mostro valido dal tuo Cimitero':'scegli il bersaglio evidenziato';
  return `${name}: ${action} • scelta obbligatoria`;
}
function draw(){
  if(!active)return;
  const {line}=ensureUI(),from=center(sourceEl(active.pc));
  if(!line)return;
  if(!from||mouse.x==null||mouse.y==null){line.setAttribute('visibility','hidden');return;}
  line.setAttribute('x1',String(from.x));
  line.setAttribute('y1',String(from.y));
  line.setAttribute('x2',String(mouse.x));
  line.setAttribute('y2',String(mouse.y));
  line.setAttribute('visibility','visible');
}
function suppressLegacyModal(){
  const box=document.querySelector('#modal [data-v17-pending="trigger_target"],#modal [data-v17-pending="cerbero"]');
  if(!box)return;
  try{closeModal()}catch{const m=document.getElementById('modal');if(m)m.innerHTML='';}
}
function openGraveForTarget(pc){
  if(choiceType(pc)!=='graveMonsterPow2')return false;
  const ids=options(pc).map(o=>String(o.id));
  if(graveCardsEls(ids).length)return false;
  const btn=document.querySelector(`.sf-grave-btn[data-owner="${session.player}"][data-kind="monsters"]`);
  if(!btn||graveOpened)return false;
  graveOpened=true;
  setTimeout(()=>{btn.click();scheduleSync()},0);
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
function fallback(pc,cands){
  const opts=options(pc);
  const current=document.getElementById('sfStdFallback');
  if(!opts.length||cands.length){current?.remove();return;}
  const sig=signature(pc);
  if(current?.dataset.sig===sig)return;
  current?.remove();
  const box=document.createElement('div');
  box.id='sfStdFallback';
  box.dataset.sig=sig;
  for(const o of opts){
    const b=document.createElement('button');
    b.type='button';
    b.dataset.sfFallbackChoice=String(o.id);
    b.textContent=String(o.label||o.id);
    box.appendChild(b);
  }
  document.body.appendChild(box);
}
function sync(){
  injectStyle();
  const pc=pending();
  if(!pc){
    if(active){clearUI(true);active=null;}
    resolving=false;
    return;
  }
  suppressLegacyModal();
  const sig=signature(pc);
  if(!active||active.sig!==sig){
    clearUI(false);
    active={pc,sig,candidates:[]};
    graveOpened=false;
    resolving=false;
  }else active.pc=pc;

  const {hint}=ensureUI();
  hint.textContent=labelFor(pc);
  if(openGraveForTarget(pc))return;

  clearMarks();
  const cands=buildCandidates(pc);
  active.candidates=cands;
  cands.forEach(({el})=>el.classList.add('sf-std-valid'));
  markNonTargets(pc,cands);
  fallback(pc,cands);
  if(!cands.length)hint.textContent=labelFor(pc)+' — usa i pulsanti di scelta qui sotto';
  draw();
}
function scheduleSync(){
  if(syncQueued)return;
  syncQueued=true;
  queueMicrotask(()=>{
    syncQueued=false;
    try{sync()}catch(err){console.error('[targeting-v27] sync',err);}
  });
}
function resolve(id){
  if(!active||resolving)return;
  resolving=true;
  const pc=active.pc;
  clearUI(true);
  active=null;
  const payload=pc.type==='cerbero'?{type:'resolve_choice',cardId:id}:{type:'resolve_choice',choice:id};
  Promise.resolve(move(payload)).catch(err=>{
    console.error('[targeting-v27] resolve',err);
    try{showError(err?.message||'Errore nella scelta del bersaglio')}catch{}
  }).finally(()=>{
    resolving=false;
    scheduleSync();
  });
}

document.addEventListener('mousemove',e=>{
  mouse={x:e.clientX,y:e.clientY};
  if(active)draw();
},true);
document.addEventListener('click',e=>{
  if(!active)return;
  const el=e.target.closest?.('[data-sf-std-choice].sf-std-valid');
  const fb=e.target.closest?.('[data-sf-fallback-choice]');
  const id=el?.dataset.sfStdChoice??fb?.dataset.sfFallbackChoice;
  if(id==null)return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  resolve(String(id));
},true);
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&active){
    e.preventDefault();
    e.stopPropagation();
    scheduleSync();
  }
},true);

const appRoot=document.getElementById('app');
const modalRoot=document.getElementById('modal');
const observer=new MutationObserver(scheduleSync);
if(appRoot)observer.observe(appRoot,{subtree:true,childList:true,attributes:true,attributeFilter:['data-preview-card']});
if(modalRoot)observer.observe(modalRoot,{subtree:true,childList:true,attributes:true,attributeFilter:['data-preview-card']});

window.addEventListener('resize',()=>{if(active){scheduleSync();draw();}});
window.addEventListener('sf-blue-ready',scheduleSync);
setTimeout(scheduleSync,0);
})();