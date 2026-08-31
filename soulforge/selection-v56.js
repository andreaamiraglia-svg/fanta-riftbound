(()=>{
let lastTurn=null;
let lastStatus=null;
let busyConfirm=false;

function currentCards(){return (typeof playerState==='function'?playerState(session.player):session?.state?.players?.[String(session.player)])?.deckCards||[]}
function syncTurnSelection(){
 const s=session?.state;
 if(!s)return;
 if(s.status==='select'&&(lastStatus!=='select'||Number(lastTurn)!==Number(s.turn))){
  try{selected.clear()}catch{}
 }
 lastTurn=Number(s.turn||0);lastStatus=s.status;
 const valid=new Set(currentCards().map(c=>String(c.id)));
 try{for(const id of [...selected])if(!valid.has(String(id)))selected.delete(id)}catch{}
}
function art(id){try{return window.sfArtUrl21?.(String(id))||''}catch{return''}}
function cardTile(c){
 const id=String(c?.id||''),u=art(id),on=selected.has(id),name=esc(c?.name||id),meta=[c?.type,speedLabel(c?.speed||'base')].filter(Boolean).join(' • ');
 return `<button type="button" class="select-card sf56-select ${on?'selected':''}" data-select-card="${id}" data-preview-card="${id}" aria-pressed="${on?'true':'false'}">${u?`<img src="${u}" alt="${name}" loading="lazy">`:`<div class="sf56-missing-art"><strong>${name}</strong><span>${esc(meta)}</span><small>Immagine non disponibile</small></div>`}<div class="select-check">✓</div><div class="sf56-card-name">${name}</div></button>`;
}

function installRender(){
 renderSelect=function(){
  syncTurnSelection();
  const me=playerState(session.player);
  if(me?.selected)return '<div class="panel"><h2>Selezione confermata</h2><p>Attendo l’altro giocatore.</p></div>';
  const cards=me?.deckCards||[],need=Math.min(6,cards.length);
  return `<div class="panel sf56-select-panel"><div class="select-head"><div><h2 style="margin:0">Scegli ${need} carte</h2><div class="sub">Clicca una carta per selezionarla. Tasto destro o hover = zoom.</div></div><b>${selected.size}/${need}</b></div><div class="select-gallery sf56-gallery">${cards.map(cardTile).join('')}</div><div class="controls"><button id="confirmSelect" class="btn primary" ${selected.size!==need||busyConfirm?'disabled':''}>Conferma</button></div></div>`;
 };
}
function injectStyle(){
 if(document.getElementById('sfSelection56Style'))return;
 const s=document.createElement('style');s.id='sfSelection56Style';s.textContent=`
 .sf56-gallery{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(135px,1fr))!important;gap:14px!important;align-items:start!important}
 .sf56-select{appearance:none;-webkit-appearance:none;background:transparent;color:inherit;font:inherit;text-align:left;width:100%;min-width:0;border:2px solid transparent;padding:4px;overflow:visible;cursor:pointer;position:relative;border-radius:14px;transition:transform .14s,border-color .14s,box-shadow .14s;pointer-events:auto!important}
 .sf56-select:hover{transform:translateY(-3px)}.sf56-select.selected{border-color:#fff!important;box-shadow:0 0 0 3px #ffffff22!important}.sf56-select img{display:block;width:100%;height:auto;aspect-ratio:.744;object-fit:contain;border-radius:10px;background:#090c12;pointer-events:none}.sf56-select .select-check{pointer-events:none}.sf56-card-name{margin-top:6px;font-size:11px;font-weight:800;line-height:1.2;color:#dce3ee;white-space:normal;pointer-events:none}.sf56-missing-art{aspect-ratio:.744;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:12px;border:1px dashed #687384;border-radius:10px;background:#0d1118;text-align:center;pointer-events:none}.sf56-missing-art strong{font-size:13px}.sf56-missing-art span,.sf56-missing-art small{font-size:10px;color:#9ca5b5}
 @media(max-width:720px){.sf56-gallery{grid-template-columns:repeat(auto-fill,minmax(110px,1fr))!important;gap:10px!important}}
 `;document.head.appendChild(s);
}
function toggleCard(id){
 syncTurnSelection();
 const cards=currentCards(),need=Math.min(6,cards.length),sid=String(id);
 if(!cards.some(c=>String(c.id)===sid))return;
 if(selected.has(sid))selected.delete(sid);else if(selected.size<need)selected.add(sid);
 render();
}
async function confirmSelection(){
 if(busyConfirm)return;
 syncTurnSelection();
 const cards=currentCards(),need=Math.min(6,cards.length),ids=[...selected].map(String);
 if(ids.length!==need)return;
 busyConfirm=true;
 try{await move({type:'select_cards',cardIds:ids})}finally{busyConfirm=false}
}

document.addEventListener('click',e=>{
 const card=e.target.closest?.('.sf56-select[data-select-card]');
 if(card){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();toggleCard(card.dataset.selectCard);return}
 const conf=e.target.closest?.('#confirmSelect');
 if(conf&&session?.state?.status==='select'){
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();confirmSelection();
 }
},true);

function boot(){injectStyle();installRender();syncTurnSelection();if(session?.state?.status==='select')try{render()}catch{}}
boot();
window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));
setTimeout(boot,100);setTimeout(boot,500);setTimeout(boot,1500);
})();
