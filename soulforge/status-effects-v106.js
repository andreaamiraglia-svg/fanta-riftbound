(()=>{
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>Number.isFinite(Number(v))?Number(v):0;
function fxLabel(f){
 const source=String(f?.source||'Effetto');const who=String(f?.sourcePlayer||'');
 if(f?.stat==='passive'){
  const text=String(f?.text||'');const ability=(text.split('—')[0]||'Passiva').trim();return{main:ability||'Passiva',sub:`Passiva${source?' • '+source:''}`};
 }
 return{main:String(f?.label||'Effetto'),sub:[source,who].filter(Boolean).join(' • ')};
}
function fxRows(effects,monster=false){
 const xs=Array.isArray(effects)?effects:[];if(!xs.length)return'';
 return `<div class="sf-effects-tray ${monster?'sf-monster-effects':''}">${xs.map(f=>{const k=f?.kind==='debuff'?'debuff':f?.kind==='buff'?'buff':'status',p=f?.stat==='passive'?' sf-passive':'',l=fxLabel(f),title=[l.main,l.sub,f?.text||''].filter(Boolean).join(' — ');return `<div class="sf-effect-row sf-${k}${p}" title="${esc(title)}"><b>${esc(l.main)}</b>${l.sub?`<small>${esc(l.sub)}</small>`:''}</div>`}).join('')}</div>`;
}
function championRuntime(el){
 try{const owner=Number(el.dataset.owner),id=String(el.dataset.champId||'');return session?.state?.players?.[String(owner)]?.champions?.find(c=>String(c.id)===id)||null}catch{return null}
}
function monsterRuntime(el){try{return session?.state?.board?.monsters?.find(m=>String(m.uid)===String(el.dataset.monsterUid))||null}catch{return null}}
function ensureCharge(el,c){
 let stats=el.querySelector('.stats');if(!stats)return;
 let stat=stats.querySelector('[data-sf-charge-stat]');
 if(!stat){stat=document.createElement('span');stat.className='stat sf-charge-stat';stat.dataset.sfChargeStat='1';stats.appendChild(stat)}
 stat.innerHTML=`CARICA <b>${Math.max(0,num(c?.charge))}</b>`;
 // card-hud may rebuild the stat markup after this; normalize it immediately when available.
 if(typeof window.sfCardHud41!=='undefined'){stat.classList.add('sf-hud-stat','sf-hud-charge');stat.dataset.sfHudReady='1';stat.dataset.sfHudKind='charge';stat.innerHTML=`<span class="sf-hud-label">CARICA</span><strong class="sf-hud-value">${Math.max(0,num(c?.charge))}</strong>`}
}
function decorateChampion(el){
 const c=championRuntime(el);if(!c)return;ensureCharge(el,c);
 el.querySelector(':scope > .sf-effects-tray')?.remove();
 const h=fxRows(c.effects,false);if(h)el.insertAdjacentHTML('beforeend',h);
}
function decorateMonster(el){
 const m=monsterRuntime(el);if(!m)return;
 el.querySelector(':scope > .sf-effects-tray')?.remove();
 const h=fxRows(m.effects,true);if(h)el.insertAdjacentHTML('beforeend',h);
}
function effectDetails(effects){
 const xs=Array.isArray(effects)?effects:[];if(!xs.length)return'';
 return `<div class="sf-preview-effects"><div class="sf-preview-effects-title">Buff / Debuff / Passive</div>${xs.map(f=>{const k=f?.kind==='debuff'?'debuff':f?.kind==='buff'?'buff':'status',l=fxLabel(f);return `<div class="sf-preview-effect sf-${k}"><strong>${esc(l.main)}</strong><span>${esc(l.sub||'Effetto attivo')}</span>${f?.text?`<div>${esc(f.text)}</div>`:''}</div>`}).join('')}</div>`;
}
function decorate(){
 document.querySelectorAll('.champ[data-owner][data-champ-id]').forEach(decorateChampion);
 document.querySelectorAll('.monster[data-monster-uid]').forEach(decorateMonster);
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}
const app=document.getElementById('app');if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});
setInterval(schedule,500);schedule();
window.sfStatusEffects106={decorate,effectDetails,fxRows};
})();
