(()=>{
const picked=new Set();
let selectionKey='';
let busy=false;

const getState=()=>session?.state||null;
const getMe=()=>typeof playerState==='function'?playerState(session.player):getState()?.players?.[String(session.player)];
const getCards=()=>getMe()?.deckCards||[];
const makeKey=()=>{const s=getState();return s?`${session.room||''}:${session.player||''}:${s.turn||0}:${s.status||''}`:''};
function sync(){const k=makeKey();if(k!==selectionKey){selectionKey=k;picked.clear()}const valid=new Set(getCards().map(c=>String(c.id)));for(const id of [...picked])if(!valid.has(id))picked.delete(id)}
function art(id){try{return window.sfArtUrl21?.(String(id))||''}catch{return''}}
function esc58(v){try{return esc(v)}catch{return String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]||m))}}
function speed(v){try{return speedLabel(v||'base')}catch{return String(v||'base')}}

function tile(c){
 const id=String(c?.id||''),name=esc58(c?.name||id),u=art(id),meta=[c?.type,speed(c?.speed)].filter(Boolean).join(' • '),on=picked.has(id);
 return `<div class="select-card sf58-card ${on?'selected':''}" role="button" tabindex="0" data-sf58-card="${esc58(id)}" data-preview-card="${esc58(id)}" aria-pressed="${on?'true':'false'}" onpointerdown="return window.sf58Pick(event,this)" onkeydown="return window.sf58Key(event,this)">${u?`<img src="${u}" alt="${name}" loading="lazy" draggable="false">`:`<div class="sf58-missing"><strong>${name}</strong><span>${esc58(meta)}</span><small>Immagine non disponibile</small></div>`}<div class="select-check">✓</div><div class="sf58-name">${name}</div></div>`;
}
function render58(){
 sync();const q=getMe();if(q?.selected)return '<div class="panel"><h2>Selezione confermata</h2><p>Attendo l’altro giocatore.</p></div>';
 const list=q?.deckCards||[],need=Math.min(6,list.length);
 return `<div class="panel sf58-panel"><div class="select-head"><div><h2 style="margin:0">Scegli ${need} carte</h2><div class="sub">Premi con il tasto sinistro sulle carte che vuoi tenere.</div></div><b id="sf58Count">${picked.size}/${need}</b></div><div class="select-gallery sf58-gallery">${list.map(tile).join('')}</div><div class="controls"><button type="button" id="sf58Confirm" class="btn primary" ${picked.size!==need||busy?'disabled':''} onpointerdown="return window.sf58Confirm(event,this)">Conferma</button></div></div>`;
}
function installRender(){renderSelect=render58;if(typeof render==='function'&&!render.__sf58){const prev=render;const wrap=function(...a){renderSelect=render58;const out=prev.apply(this,a);requestAnimationFrame(paint);return out};wrap.__sf58=true;wrap.__previous=prev;render=wrap}}
function paint(){
 if(getState()?.status!=='select')return;sync();const need=Math.min(6,getCards().length);
 document.querySelectorAll('.sf58-card[data-sf58-card]').forEach(el=>{const on=picked.has(String(el.dataset.sf58Card));el.classList.toggle('selected',on);el.setAttribute('aria-pressed',on?'true':'false')});
 const n=document.getElementById('sf58Count');if(n)n.textContent=`${picked.size}/${need}`;
 const b=document.getElementById('sf58Confirm');if(b)b.disabled=busy||picked.size!==need;
}
function toggle(el){sync();const id=String(el?.dataset?.sf58Card||'');const cards=getCards(),need=Math.min(6,cards.length);if(!cards.some(c=>String(c.id)===id))return false;if(picked.has(id))picked.delete(id);else if(picked.size<need)picked.add(id);paint();return false}
window.sf58Pick=function(e,el){if(getState()?.status!=='select')return true;if(e&&e.button!==0&&e.pointerType!=='touch')return true;e?.preventDefault?.();e?.stopPropagation?.();toggle(el);return false};
window.sf58Key=function(e,el){if(e?.key!=='Enter'&&e?.key!==' ')return true;e.preventDefault();e.stopPropagation();toggle(el);return false};
window.sf58Confirm=async function(e,el){if(getState()?.status!=='select'||busy)return false;e?.preventDefault?.();e?.stopPropagation?.();sync();const need=Math.min(6,getCards().length),ids=[...picked];if(ids.length!==need)return false;busy=true;paint();try{await move({type:'select_cards',cardIds:ids})}catch(err){try{showError(err?.message||String(err))}catch{console.error(err)}}finally{busy=false;paint()}return false};
function style(){if(document.getElementById('sf58Style'))return;const st=document.createElement('style');st.id='sf58Style';st.textContent=`
.sf58-gallery{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(135px,1fr))!important;gap:14px!important;align-items:start!important}.sf58-card{display:block!important;background:transparent!important;color:inherit!important;width:100%!important;min-width:0!important;border:2px solid transparent!important;padding:4px!important;cursor:pointer!important;position:relative!important;border-radius:14px!important;user-select:none!important;-webkit-user-select:none!important;pointer-events:auto!important;touch-action:manipulation!important;box-sizing:border-box!important}.sf58-card:hover{transform:translateY(-3px)!important}.sf58-card.selected{border-color:#fff!important;box-shadow:0 0 0 3px #ffffff30!important}.sf58-card.selected .select-check{opacity:1!important;transform:scale(1)!important}.sf58-card img{display:block!important;width:100%!important;height:auto!important;aspect-ratio:.744!important;object-fit:contain!important;border-radius:10px!important;background:#090c12!important;pointer-events:none!important}.sf58-card .select-check,.sf58-name,.sf58-missing{pointer-events:none!important}.sf58-name{margin-top:6px;font-size:11px;font-weight:800;line-height:1.2;color:#dce3ee;white-space:normal}.sf58-missing{aspect-ratio:.744;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:12px;border:1px dashed #687384;border-radius:10px;background:#0d1118;text-align:center}.sf58-missing span,.sf58-missing small{font-size:10px;color:#9ca5b5}@media(max-width:720px){.sf58-gallery{grid-template-columns:repeat(auto-fill,minmax(110px,1fr))!important;gap:10px!important}}
`;document.head.appendChild(st)}
function boot(){style();installRender();sync();if(getState()?.status==='select'){try{render()}catch(e){console.error('[sf58 render]',e)}requestAnimationFrame(paint)}}
boot();window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));setTimeout(boot,100);setTimeout(boot,500);setTimeout(boot,1500);setTimeout(boot,3000);
})();
