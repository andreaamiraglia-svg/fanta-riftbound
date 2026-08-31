(()=>{
const picked=new Set();
let selectionKey='';
let busyConfirm=false;

function state(){return session?.state||null}
function me(){return typeof playerState==='function'?playerState(session.player):state()?.players?.[String(session.player)]}
function cards(){return me()?.deckCards||[]}
function key(){const s=state();return s?`${session.room||''}:${session.player||''}:${s.turn||0}:${s.status||''}`:''}
function sync(){
 const k=key();
 if(k!==selectionKey){selectionKey=k;picked.clear()}
 const valid=new Set(cards().map(c=>String(c.id)));
 for(const id of [...picked])if(!valid.has(id))picked.delete(id);
}
function art(id){try{return window.sfArtUrl21?.(String(id))||''}catch{return''}}
function tile(c){
 const id=String(c?.id||''),name=esc(c?.name||id),u=art(id),on=picked.has(id),meta=[c?.type,speedLabel(c?.speed||'base')].filter(Boolean).join(' • ');
 return `<button type="button" class="select-card sf57-select ${on?'selected':''}" data-sf57-card="${id}" data-preview-card="${id}" aria-pressed="${on?'true':'false'}">${u?`<img src="${u}" alt="${name}" loading="lazy">`:`<div class="sf57-missing"><strong>${name}</strong><span>${esc(meta)}</span><small>Immagine non disponibile</small></div>`}<div class="select-check">✓</div><div class="sf57-name">${name}</div></button>`;
}
function renderSelect57(){
 sync();
 const q=me();
 if(q?.selected)return '<div class="panel"><h2>Selezione confermata</h2><p>Attendo l’altro giocatore.</p></div>';
 const list=q?.deckCards||[],need=Math.min(6,list.length);
 return `<div class="panel sf57-panel"><div class="select-head"><div><h2 style="margin:0">Scegli ${need} carte</h2><div class="sub">Clicca una carta per selezionarla. Tasto destro o hover = zoom.</div></div><b>${picked.size}/${need}</b></div><div class="select-gallery sf57-gallery">${list.map(tile).join('')}</div><div class="controls"><button type="button" id="sf57Confirm" class="btn primary" ${picked.size!==need||busyConfirm?'disabled':''}>Conferma</button></div></div>`;
}
function installRender(){
 renderSelect=renderSelect57;
 if(typeof render==='function'&&!render.__sf57Selection){
  const prev=render;
  const wrapped=function(...args){renderSelect=renderSelect57;return prev.apply(this,args)};
  wrapped.__sf57Selection=true;wrapped.__previous=prev;render=wrapped;
 }
}
function style(){
 if(document.getElementById('sfSelection57Style'))return;
 const st=document.createElement('style');st.id='sfSelection57Style';st.textContent=`
 .sf57-gallery{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(135px,1fr))!important;gap:14px!important;align-items:start!important}
 .sf57-select{appearance:none!important;-webkit-appearance:none!important;background:transparent!important;color:inherit!important;font:inherit!important;text-align:left!important;width:100%!important;min-width:0!important;border:2px solid transparent!important;padding:4px!important;overflow:visible!important;cursor:pointer!important;position:relative!important;border-radius:14px!important;transition:transform .14s,border-color .14s,box-shadow .14s!important;pointer-events:auto!important}
 .sf57-select:hover{transform:translateY(-3px)!important}.sf57-select.selected{border-color:#fff!important;box-shadow:0 0 0 3px #ffffff26!important}.sf57-select img{display:block!important;width:100%!important;height:auto!important;aspect-ratio:.744!important;object-fit:contain!important;border-radius:10px!important;background:#090c12!important;pointer-events:none!important}.sf57-select .select-check{pointer-events:none!important}.sf57-name{margin-top:6px;font-size:11px;font-weight:800;line-height:1.2;color:#dce3ee;white-space:normal;pointer-events:none}.sf57-missing{aspect-ratio:.744;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:12px;border:1px dashed #687384;border-radius:10px;background:#0d1118;text-align:center;pointer-events:none}.sf57-missing strong{font-size:13px}.sf57-missing span,.sf57-missing small{font-size:10px;color:#9ca5b5}
 @media(max-width:720px){.sf57-gallery{grid-template-columns:repeat(auto-fill,minmax(110px,1fr))!important;gap:10px!important}}
 `;document.head.appendChild(st);
}
function repaint(){installRender();if(state()?.status==='select')try{render()}catch(e){console.error('[selection-v57 render]',e)}}
function toggle(id){
 sync();
 const list=cards(),need=Math.min(6,list.length),sid=String(id);
 if(!list.some(c=>String(c.id)===sid))return;
 if(picked.has(sid))picked.delete(sid);else if(picked.size<need)picked.add(sid);
 repaint();
}
async function confirm(){
 if(busyConfirm)return;
 sync();
 const need=Math.min(6,cards().length),ids=[...picked];
 if(ids.length!==need)return;
 busyConfirm=true;repaint();
 try{await move({type:'select_cards',cardIds:ids})}
 finally{busyConfirm=false}
}

// Capture su window: viene eseguito prima dei vecchi listener su document.
window.addEventListener('click',e=>{
 if(state()?.status!=='select')return;
 const card=e.target?.closest?.('.sf57-select[data-sf57-card]');
 if(card){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();toggle(card.dataset.sf57Card);return}
 const conf=e.target?.closest?.('#sf57Confirm');
 if(conf){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(!conf.disabled)confirm()}
},true);

function boot(){style();installRender();sync();if(state()?.status==='select')repaint()}
boot();window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));
setTimeout(boot,120);setTimeout(boot,600);setTimeout(boot,1800);setTimeout(boot,3200);
})();
