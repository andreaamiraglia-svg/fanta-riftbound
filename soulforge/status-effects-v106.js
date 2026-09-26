(()=>{
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>Number.isFinite(Number(v))?Number(v):0;
function fxLabel(f){
 const source=String(f?.source||'Effetto');const who=String(f?.sourcePlayer||'');
 if(f?.stat==='passive'){
  const text=String(f?.text||''),parts=text.split('—'),ability=parts.length>1?parts[0].trim():'Passiva';return{main:ability||'Passiva',sub:source||'Passiva'};
 }
 return{main:String(f?.label||'Effetto'),sub:[source,who].filter(Boolean).join(' • ')};
}
function rowsInner(effects){
 const xs=Array.isArray(effects)?effects:[];
 return xs.map(f=>{const k=f?.kind==='debuff'?'debuff':f?.kind==='buff'?'buff':'status',p=f?.stat==='passive'?' sf-passive':'',l=fxLabel(f),title=[l.main,l.sub,f?.text||''].filter(Boolean).join(' — ');return `<div class="sf-effect-row sf-${k}${p}" title="${esc(title)}"><b>${esc(l.main)}</b>${l.sub?`<small>${esc(l.sub)}</small>`:''}</div>`}).join('');
}
function fxRows(effects,monster=false){const inner=rowsInner(effects);return inner?`<div class="sf-effects-tray ${monster?'sf-monster-effects':''}">${inner}</div>`:''}
function championRuntime(el){try{const owner=Number(el.dataset.owner),id=String(el.dataset.champId||'');return session?.state?.players?.[String(owner)]?.champions?.find(c=>String(c.id)===id)||null}catch{return null}}
function monsterRuntime(el){try{return session?.state?.board?.monsters?.find(m=>String(m.uid)===String(el.dataset.monsterUid))||null}catch{return null}}
function allUnits(){try{return [...[1,2].flatMap(p=>session?.state?.players?.[String(p)]?.champions||[]),...(session?.state?.board?.monsters||[])]}catch{return[]}}
function ensureCharge(el,c){
 const stats=el.querySelector('.stats');if(!stats)return;const charge=Math.max(0,num(c?.charge));let stat=stats.querySelector('[data-sf-charge-stat]');
 if(!stat){stat=document.createElement('span');stat.className='stat sf-charge-stat';stat.dataset.sfChargeStat='1';stats.appendChild(stat)}
 if(stat.dataset.sfChargeValue===String(charge))return;stat.dataset.sfChargeValue=String(charge);
 if(typeof window.sfCardHud41!=='undefined'){stat.classList.add('sf-hud-stat','sf-hud-charge');stat.dataset.sfHudReady='1';stat.dataset.sfHudKind='charge';stat.innerHTML=`<span class="sf-hud-label">CARICA</span><strong class="sf-hud-value">${charge}</strong>`}
 else stat.innerHTML=`CARICA <b>${charge}</b>`;
}
function updateTray(el,effects,monster=false){
 const inner=rowsInner(effects),sig=JSON.stringify((effects||[]).map(f=>[f.id,f.kind,f.stat,f.amount,f.label,f.source,f.sourcePlayer,f.text]));let tray=el.querySelector(':scope > .sf-effects-tray');
 if(!inner){tray?.remove();return}
 if(!tray){tray=document.createElement('div');tray.className=`sf-effects-tray${monster?' sf-monster-effects':''}`;el.appendChild(tray)}
 if(tray.dataset.sig!==sig){tray.dataset.sig=sig;tray.innerHTML=inner}
}
function decorateChampion(el){const c=championRuntime(el);if(!c)return;ensureCharge(el,c);updateTray(el,c.effects,false)}
function decorateMonster(el){const m=monsterRuntime(el);if(!m)return;updateTray(el,m.effects,true)}
function effectDetails(effects){
 const xs=Array.isArray(effects)?effects:[];if(!xs.length)return'';
 return `<div class="sf-preview-effects"><div class="sf-preview-effects-title">Buff / Debuff / Passive</div>${xs.map(f=>{const k=f?.kind==='debuff'?'debuff':f?.kind==='buff'?'buff':'status',l=fxLabel(f);return `<div class="sf-preview-effect sf-${k}"><strong>${esc(l.main)}</strong><span>${esc(l.sub||'Effetto attivo')}</span>${f?.text?`<div>${esc(f.text)}</div>`:''}</div>`}).join('')}</div>`;
}
function findByHeading(text){const t=String(text||'').trim().toLowerCase();return allUnits().find(x=>String(x?.name||session?.state?.monsterDefs?.[x?.cardId]?.name||'').trim().toLowerCase()===t)||null}
function decorateRightPreview(){
 const b=document.getElementById('sfRightPreview');if(!b?.classList.contains('show'))return;const copy=b.querySelector('.ptext'),h=b.querySelector('h3');if(!copy||!h)return;const u=findByHeading(h.textContent);if(!u)return;
 let charge=copy.querySelector('[data-sf-preview-charge]');if('charge' in u){if(!charge){charge=document.createElement('div');charge.dataset.sfPreviewCharge='1';charge.className='sf-preview-stat sf-preview-stat--charge';const stats=copy.querySelector('.sf-preview-stats');(stats||copy).appendChild(charge)}charge.innerHTML=`<span>Carica</span><b>${Math.max(0,num(u.charge))}</b>`}
 const old=copy.querySelector('.sf-preview-effects');const html=effectDetails(u.effects);if(html){const holder=document.createElement('div');holder.innerHTML=html;const next=holder.firstElementChild;if(!old)copy.appendChild(next);else if(old.dataset.sig!==JSON.stringify(u.effects||[])){next.dataset.sig=JSON.stringify(u.effects||[]);old.replaceWith(next)}}else old?.remove();
}
function decorateChampionModal(){
 const modal=document.getElementById('sfChampion105');if(!modal?.classList.contains('show'))return;const h=modal.querySelector('.sf105-copy h2'),copy=modal.querySelector('.sf105-copy');if(!h||!copy)return;const u=findByHeading(h.textContent);if(!u)return;
 const stats=copy.querySelector('.sf105-stats');if(stats){let ch=stats.querySelector('[data-sf105-charge]');if(!ch){ch=document.createElement('span');ch.dataset.sf105Charge='1';stats.appendChild(ch)}ch.innerHTML=`Carica <b>${Math.max(0,num(u.charge))}</b>`}
 const old=copy.querySelector('.sf-preview-effects'),html=effectDetails(u.effects);if(html){const holder=document.createElement('div');holder.innerHTML=html;const next=holder.firstElementChild;next.dataset.sig=JSON.stringify(u.effects||[]);if(!old)copy.appendChild(next);else if(old.dataset.sig!==next.dataset.sig)old.replaceWith(next)}else old?.remove();
}
function decorate(){document.querySelectorAll('.champ[data-owner][data-champ-id]').forEach(decorateChampion);document.querySelectorAll('.monster[data-monster-uid]').forEach(decorateMonster);decorateRightPreview();decorateChampionModal()}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}
const app=document.getElementById('app');if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});
setInterval(schedule,450);schedule();window.sfStatusEffects106={decorate,effectDetails,fxRows};
})();
