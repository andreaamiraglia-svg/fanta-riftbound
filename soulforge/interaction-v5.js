(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={kael:'kael.webp',lyrandel:'lyrandel.webp',lucertola_fuoco:'lucertola-di-fuoco.webp',segugio_infernale:'segugio-infernale.webp',fenice_cremisi:'fenice-cremisi.webp',golem_magmatico:'golem-magmatico.webp',drago_delle_ceneri:'drago-delle-ceneri.webp',salamandra_vulcanica:'salamandra-vulcanica.webp',ragno_dei_germogli:'ragno-dei-germogli.webp',serpente_della_giungla:'serpente-della-giungla.webp',lupo_delle_radici:'lupo-delle-radici.webp',cervo_antico:'cervo-antico.webp',guardiano_della_foresta:'guardiano-della-foresta.webp',orso_furioso:'orso-furioso.webp',taglio_fiammante:'taglio_fiammante.webp',sfera_incandescente:'sfera_incandescente.webp',corazza_esplosiva:'corazza_esplosiva.webp',occhio_di_drago:'occhio_di_drago.webp',mano_del_caos:'mano_del_caos.webp',nube_di_fuoco:'nube_di_fuoco.webp',tornado_bollente:'tornado_bollente.webp',fendente_di_fuoco:'fendente_di_fuoco.webp',berserk:'berserk.webp',taglio_ninjitsu:'taglio_ninjitsu.webp',stupido:'stupido.webp',riflesso:'riflesso.webp',tutto_per_la_festa:'tutto_per_la_festa.webp',alta_marea:'alta_marea.webp',doppia_katana:'doppia_katana.webp',albero_della_vita:'albero_della_vita.webp',sguardo_ninjitsu:'sguardo_ninjitsu.webp',mille_lame:'mille_lame.webp'};
const artUrl=id=>ART[id]?BASE+ART[id]:'';
let live=null, festaDraft=null, lyrandelPendingKey=null;

function ensureLiveLayer(){
 let svg=document.getElementById('sfLiveTargetArrow');
 if(!svg){
  svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='sfLiveTargetArrow';svg.classList.add('sf-live-arrow');document.body.appendChild(svg);
 }
 let hint=document.getElementById('sfLiveTargetHint');
 if(!hint){hint=document.createElement('div');hint.id='sfLiveTargetHint';hint.className='sf-live-hint';document.body.appendChild(hint)}
 return {svg,hint};
}
function center(el){if(!el)return null;const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
function liveLine(a,b,cls='cursor'){if(!a||!b)return'';const color=cls==='fixed'?'#8ee8ff':'#ffd166';return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${color}" stroke-width="4" stroke-linecap="round" marker-end="url(#sfLiveHead${cls})"/>`}
function drawLive(mouse){
 const {svg}=ensureLiveLayer();if(!live){svg.innerHTML='';return}
 const from=center(live.source);let body='';
 for(const el of live.chosenEls||[])body+=liveLine(from,center(el),'fixed');
 if(mouse)body+=liveLine(from,mouse,'cursor');
 svg.innerHTML=`<defs><marker id="sfLiveHeadcursor" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ffd166"/></marker><marker id="sfLiveHeadfixed" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#8ee8ff"/></marker></defs>${body}`;
}
function clearValid(){document.querySelectorAll('.sf-live-valid').forEach(el=>el.classList.remove('sf-live-valid'))}
function cancelLive(){clearValid();live=null;document.body.classList.remove('sf-live-targeting');const ui=ensureLiveLayer();ui.hint.classList.remove('show');ui.svg.innerHTML=''}
function allOwnChamps(){return [...document.querySelectorAll(`.champ[data-owner="${session.player}"]`)].filter(el=>!el.classList.contains('defeated'))}
function allEnemyTargets(){const champs=[...document.querySelectorAll(`.champ[data-owner="${otherP()}"]`)].filter(el=>!el.classList.contains('defeated'));const mons=(typeof monsterTargets==='function'?monsterTargets():session.state.board.monsters).map(m=>document.querySelector(`[data-monster-uid="${m.uid}"]`)).filter(Boolean);return [...champs,...mons]}
function allMonsterTargets(){return (typeof monsterTargets==='function'?monsterTargets():session.state.board.monsters).map(m=>document.querySelector(`[data-monster-uid="${m.uid}"]`)).filter(Boolean)}
function combatOwnChamps(){const c=session.state.combat;if(!c)return[];return allOwnChamps().filter(el=>{const id=el.dataset.champId;return (c.attacker?.player===session.player&&c.attacker?.champId===id)||(c.target?.type==='champion'&&c.target?.player===session.player&&c.target?.champId===id)})}
function stepEls(step){if(step.kind==='ownChamp')return allOwnChamps();if(step.kind==='enemy')return allEnemyTargets();if(step.kind==='monster')return allMonsterTargets();if(step.kind==='combatOwnChamp')return combatOwnChamps();return[]}
function stepValue(step,el){if(step.kind==='ownChamp'||step.kind==='combatOwnChamp')return el.dataset.champId;if(step.kind==='monster')return el.dataset.monsterUid;if(step.kind==='enemy'){if(el.dataset.monsterUid)return{type:'monster',uid:el.dataset.monsterUid};return{type:'champion',player:Number(el.dataset.owner),champId:el.dataset.champId}}return null}
function paintStep(){
 clearValid();if(!live)return;
 const step=live.steps[live.index],els=stepEls(step);els.forEach(el=>el.classList.add('sf-live-valid'));
 const {hint}=ensureLiveLayer();hint.textContent=step.label+'  •  ESC per annullare';hint.classList.add('show');document.body.classList.add('sf-live-targeting');live.validEls=els;
}
function beginCardTarget(card){
 cancelLive();closeModal?.();
 const map={
  corazza:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],mano:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],occhio:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],berserk:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],katana:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],albero:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],mille:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],marea:[{kind:'combatOwnChamp',key:'ownChamp',label:'Scegli il tuo Campione nel combattimento'}],
  stupido:[{kind:'monster',key:'monsterUid',label:'Scegli un Mostro'}],taglio_ninjitsu:[{kind:'monster',key:'monsterUid',label:'Scegli un Mostro'}],sguardo:[{kind:'monster',key:'monsterUid',label:'Scegli un Mostro'}],
  fendente:[{kind:'enemy',key:'enemy',label:'Scegli il bersaglio'}],
  sfera:[{kind:'enemy',key:'enemy',label:'Scegli il nemico da colpire'},{kind:'ownChamp',key:'ownChamp',label:'Scegli il tuo Campione da danneggiare'}],
  riflesso:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'},{kind:'monster',key:'monsterUid',label:'Scegli il Mostro'}]
 };
 const steps=map[card.effect]||[];
 if(!steps.length){move({type:'cast',cardId:card.id,targets:{}});return}
 const source=document.querySelector(`[data-hand-card="${card.id}"]`)||document.querySelector(`[data-card="${card.id}"]`)||document.getElementById('playDropZone');
 live={type:'card',card,steps,index:0,targets:{},source,chosenEls:[]};paintStep();
}
window.chooseForCard=function(id){const card=playerState(session.player)?.handCards?.find(c=>c.id===id);if(card)beginCardTarget(card)};

function startLyrandelChoice(choice){
 const key=`${session.version}:${(choice.monsterUids||[]).join(',')}`;if(lyrandelPendingKey===key&&live?.type==='lyrandel')return;lyrandelPendingKey=key;cancelLive();closeModal?.();
 const source=document.querySelector(`[data-owner="${session.player}"][data-champ-id="lyrandel"]`);
 const valid=(choice.monsterUids||[]).map(uid=>document.querySelector(`[data-monster-uid="${uid}"]`)).filter(Boolean);
 live={type:'lyrandel',steps:[{kind:'special',label:'Lyrandel: scegli uno dei Mostri danneggiati'}],index:0,source,chosenEls:[],validEls:valid};
 clearValid();valid.forEach(el=>el.classList.add('sf-live-valid'));const {hint}=ensureLiveLayer();hint.textContent='Lyrandel: scegli uno dei Mostri danneggiati';hint.classList.add('show');document.body.classList.add('sf-live-targeting');
}

document.addEventListener('mousemove',e=>{if(live)drawLive({x:e.clientX,y:e.clientY})},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&live)cancelLive()},true);
document.addEventListener('click',e=>{
 if(!live)return;const hit=e.target.closest?.('.sf-live-valid');if(!hit)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 if(live.type==='lyrandel'){const uid=hit.dataset.monsterUid;cancelLive();lyrandelPendingKey=null;move({type:'resolve_choice',monsterUid:uid});return}
 const step=live.steps[live.index];const val=stepValue(step,hit);live.targets[step.key]=val;live.chosenEls.push(hit);live.index+=1;
 if(live.index>=live.steps.length){const cardId=live.card.id,targets=live.targets;cancelLive();move({type:'cast',cardId,targets});return}
 paintStep();drawLive();
},true);

function festaKey(top){return `${session.room}:${session.player}:${(top||[]).join('|')}`}
function festaRender(){
 const d=festaDraft;if(!d)return;const defs=session.state.monsterDefs;
 const slots=[0,1,2].map(i=>{const id=d.order[i];if(!id)return `<div class="sf-festa-slot"><div class="sf-festa-num">${i+1}</div><div class="sf-festa-empty">Vuoto</div></div>`;const m=defs[id];return `<div class="sf-festa-slot" data-slot="${i}"><div class="sf-festa-num">${i+1}</div><div class="sf-festa-card" data-preview-card="${id}">${artUrl(id)?`<img src="${artUrl(id)}">`:''}<b>${esc(m?.name||id)}</b><div class="tiny">POW ${m?.pow??'—'}</div><div class="sf-festa-actions"><button class="btn ghost sf-festa-left" data-i="${i}" ${i===0?'disabled':''}>←</button><button class="btn red sf-festa-discard" data-id="${id}">Scarta</button><button class="btn ghost sf-festa-right" data-i="${i}" ${i===d.order.length-1?'disabled':''}>→</button></div></div></div>`}).join('');
 const discarded=d.discard.map(id=>{const m=defs[id];return `<div class="sf-festa-discarded" data-preview-card="${id}">${artUrl(id)?`<img src="${artUrl(id)}">`:''}<div><b>${esc(m?.name||id)}</b><button class="btn ghost sf-festa-restore" data-id="${id}">Ripristina</button></div></div>`}).join('');
 modal.innerHTML=`<div class="modal"><div class="modalbox sf-festa-modal"><h3>Tutto per la Festa</h3><p>Le posizioni <b>1 → 2 → 3</b> indicano l’ordine dalla cima del Monster Deck. Usa le frecce per cambiare ordine oppure scarta una carta.</p><div class="sf-festa-slots">${slots}</div><h4>Scartate</h4><div class="sf-festa-discard-list">${discarded||'<div class="sub">Nessuna carta scartata.</div>'}</div><div class="controls"><button id="sfFestaConfirm" class="btn primary">Conferma ordine e scarti</button><button id="modalCancel" class="btn ghost">Annulla</button></div></div></div>`;
 document.querySelectorAll('.sf-festa-left').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);if(i>0){[d.order[i-1],d.order[i]]=[d.order[i],d.order[i-1]];festaRender()}});
 document.querySelectorAll('.sf-festa-right').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);if(i<d.order.length-1){[d.order[i+1],d.order[i]]=[d.order[i],d.order[i+1]];festaRender()}});
 document.querySelectorAll('.sf-festa-discard').forEach(b=>b.onclick=()=>{const id=b.dataset.id;d.order=d.order.filter(x=>x!==id);if(!d.discard.includes(id))d.discard.push(id);festaRender()});
 document.querySelectorAll('.sf-festa-restore').forEach(b=>b.onclick=()=>{const id=b.dataset.id;d.discard=d.discard.filter(x=>x!==id);d.order.push(id);festaRender()});
 document.getElementById('sfFestaConfirm').onclick=()=>{const payload={type:'resolve_choice',discard:[...d.discard],order:[...d.order]};festaDraft=null;closeModal();move(payload)};
 document.getElementById('modalCancel').onclick=()=>{};
}
window.showFestaChoice=function(top){
 const pc=session.state?.pendingChoice;if(!pc||pc.player!==session.player)return;
 if(pc.type==='lyrandel'){startLyrandelChoice(pc);return}
 if(pc.type!=='festa')return;
 const k=festaKey(top);if(!festaDraft||festaDraft.key!==k)festaDraft={key:k,order:[...(top||[])],discard:[]};festaRender();
};

function postEnhance(){
 const sub=document.querySelector('.select-head .sub');if(sub)sub.textContent='Clicca l’immagine per selezionarla. Tasto destro = zoom.';
 const pc=session.state?.pendingChoice;if(pc?.type==='lyrandel'&&pc.player===session.player&&!pc.hidden)startLyrandelChoice(pc);
 if(!pc&&live?.type==='lyrandel'){cancelLive();lyrandelPendingKey=null}
}
const previousRender=render;
render=function(){previousRender();setTimeout(postEnhance,20)};
setTimeout(postEnhance,40);
})();