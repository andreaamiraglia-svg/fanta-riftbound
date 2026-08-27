(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={
 kael:'kael.webp',lyrandel:'lyrandel.webp',
 lucertola_fuoco:'lucertola-di-fuoco.webp',segugio_infernale:'segugio-infernale.webp',fenice_cremisi:'fenice-cremisi.webp',golem_magmatico:'golem-magmatico.webp',drago_delle_ceneri:'drago-delle-ceneri.webp',salamandra_vulcanica:'salamandra-vulcanica.webp',
 ragno_dei_germogli:'ragno-dei-germogli.webp',serpente_della_giungla:'serpente-della-giungla.webp',lupo_delle_radici:'lupo-delle-radici.webp',cervo_antico:'cervo-antico.webp',guardiano_della_foresta:'guardiano-della-foresta.webp',orso_furioso:'orso-furioso.webp',
 taglio_fiammante:'taglio_fiammante.webp',sfera_incandescente:'sfera_incandescente.webp',corazza_esplosiva:'corazza_esplosiva.webp',occhio_di_drago:'occhio_di_drago.webp',mano_del_caos:'mano_del_caos.webp',nube_di_fuoco:'nube_di_fuoco.webp',tornado_bollente:'tornado_bollente.webp',fendente_di_fuoco:'fendente_di_fuoco.webp',berserk:'berserk.webp',taglio_ninjitsu:'taglio_ninjitsu.webp',stupido:'stupido.webp',riflesso:'riflesso.webp',tutto_per_la_festa:'tutto_per_la_festa.webp',alta_marea:'alta_marea.webp',doppia_katana:'doppia_katana.webp',albero_della_vita:'albero_della_vita.webp',sguardo_ninjitsu:'sguardo_ninjitsu.webp',mille_lame:'mille_lame.webp'
};
const url=id=>ART[id]?BASE+ART[id]:'';
const img=(id,cl='')=>url(id)?`<img class="${cl}" src="${url(id)}" alt="${id}" loading="lazy">`:'';
let hoverTimer=null,attackSource=null,autoPassVersion=null;

function ensureUi(){
 if(!document.querySelector('.ui-v2-badge'))document.body.insertAdjacentHTML('beforeend','<div class="ui-v2-badge">UI v3 • Mostri Set 1</div>');
 if(!document.querySelector('#sfPreview'))document.body.insertAdjacentHTML('beforeend','<div id="sfPreview" class="sf-preview"></div><div class="attack-hint">Scegli il bersaglio dell’attacco</div><svg class="attack-arrow"><defs><marker id="sfArrowHead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ffcb68"/></marker></defs><line id="sfAttackLine" x1="0" y1="0" x2="0" y2="0" stroke="#ffcb68" stroke-width="4" marker-end="url(#sfArrowHead)" opacity="0"/></svg>');
}
function objectInfo(id){
 const c=session.state?.cardDefs?.[id];if(c)return {kind:'card',...c};
 const m=session.state?.monsterDefs?.[id];if(m)return {kind:'monster',...m};
 for(const p of [1,2]){const ch=session.state?.players?.[String(p)]?.champions?.find(x=>x.id===id);if(ch)return {kind:'champion',...ch}}
 return null;
}
function previewOn(el,id){
 const c=objectInfo(id),p=document.querySelector('#sfPreview');if(!c||!p||!url(id))return;
 let meta='',text='';
 if(c.kind==='card'){meta=`${esc(c.type||'')} • ${speedLabel(c.speed||'base')}`;text=esc(c.text||'')}
 else if(c.kind==='monster'){meta=`Mostro • POW ${c.pow}`;text=esc(c.text||'')}
 else {meta=`Campione • POW ${c.pow}`;text=''}
 p.innerHTML=`<img src="${url(id)}"><div class="ptext"><h3>${esc(c.name||id)}</h3><div class="tag">${meta}</div>${text?`<p>${text}</p>`:''}</div>`;
 const r=el.getBoundingClientRect(),w=Math.min(720,innerWidth*.92);let left=r.right+16;if(left+w>innerWidth-16)left=Math.max(16,r.left-w-16);p.style.left=left+'px';p.style.top=Math.max(16,Math.min(innerHeight-430,r.top-70))+'px';p.classList.add('show');
}
function previewOff(){clearTimeout(hoverTimer);hoverTimer=null;document.querySelector('#sfPreview')?.classList.remove('show')}
function bindPreview(){document.querySelectorAll('[data-preview-card]').forEach(el=>{el.onmouseenter=()=>{clearTimeout(hoverTimer);hoverTimer=setTimeout(()=>previewOn(el,el.dataset.previewCard),1000)};el.onmouseleave=previewOff})}

renderSelect=function(){
 const me=playerState(session.player);if(me.selected)return '<div class="panel"><h2>Selezione confermata</h2><p>Hai scelto le tue 6 carte. Attendo l’altro giocatore.</p></div>';
 return `<div class="panel"><div class="select-head"><div><h2 style="margin:0">Scegli 6 carte</h2><div class="sub">Clicca l’immagine per selezionarla. Hover 1 secondo = zoom.</div></div><b>${selected.size}/6</b></div><div class="select-gallery">${(me.deckCards||[]).map(c=>`<div class="select-card ${selected.has(c.id)?'selected':''}" data-select-card="${c.id}" data-preview-card="${c.id}">${img(c.id)}<div class="select-check">✓</div></div>`).join('')}</div><div class="controls"><button id="confirmSelect" class="btn primary" ${selected.size!==6?'disabled':''}>Conferma 6 carte</button></div></div>`;
};

function guardActive(){return !!session.state?.board?.monsters?.some(m=>m.cardId==='guardiano_della_foresta')}
function monsterAllowed(m){return !guardActive()||m.cardId==='guardiano_della_foresta'}
monsterTargets=function(){return (session.state?.board?.monsters||[]).filter(monsterAllowed)};

champHtml=function(c,owner,isOwn){
 if(!c)return'';const w=c.wounds||0;
 return `<div class="champ ${c.color}${c.defeated?' defeated':''}${isOwn&&canAttack(c)?' click-attack':''}${!isOwn&&!c.defeated?' attack-target':''}" data-owner="${owner}" data-champ-id="${c.id}" data-preview-card="${c.id}"><div class="tap ${!c.tapped&&!c.defeated?'active':''}">${c.defeated?'SCONFITTO':c.tapped?'TAPPATO':'ATTIVO'}</div>${img(c.id,'champ-art')}<h3>${esc(c.name)}</h3><div class="stats"><span class="stat">POW <b>${c.pow}</b></span><span class="stat">HP <b>${c.hp-w}</b>/${c.hp}</span><span class="stat">Danni <b>${c.damage}</b>/${c.pow}</span><span class="stat">Ferite <b>${w}</b></span></div></div>`;
};
monsterHtml=function(m){
 const targetable=monsterAllowed(m)?' attack-target':'';
 return `<div class="monster ${m.color}${targetable}" data-monster-uid="${m.uid}" data-preview-card="${m.cardId}">${img(m.cardId,'monster-art')}<h4>${esc(m.name)}</h4><div class="meta">Proprietario: ${esc(playerState(m.owner)?.name||'?')}</div><div class="stats" style="margin-top:8px"><span class="stat">POW ${m.pow}</span><span class="stat">Danni ${m.damage}/${m.pow}</span></div></div>`;
};
function chainLane(){
 const s=session.state;let cards=s.stack.length?s.stack.map((x,i)=>`<div class="stack-card" data-preview-card="${x.cardId}" style="z-index:${20+i}"><img src="${url(x.cardId)}"><div class="stack-owner">${esc(playerState(x.actor)?.name||'')}</div></div>`).join(''):'<div class="sub">Nessuna carta in pending.</div>';
 return `<div class="panel chain-lane"><h3 style="margin-top:0">Pending / Catena</h3><div id="playDropZone" class="pending-zone"><div class="tiny" style="text-align:center;margin-bottom:8px">Trascina qui una carta dalla mano</div><div class="stack-stage">${cards}</div></div>${s.combat?combatHtml():''}${s.priority?`<div class="sub" style="margin-top:10px">In attesa di <b>${esc(playerState(s.priority)?.name||'')}</b></div>`:''}</div>`;
}
function hand(cards){
 const n=cards.length;if(!n)return '<div class="sub">Nessuna carta in mano.</div>';
 return `<div class="hand-wrap"><div class="hand-fan">${cards.map((c,i)=>{const off=i-(n-1)/2,rot=off*7,x=off*82,disabled=!canCast(c);return `<div class="hand-card ${disabled?'disabled':''}" draggable="${!disabled}" data-hand-card="${c.id}" data-preview-card="${c.id}" style="transform:translate(${x}px,${Math.abs(off)*5}px) rotate(${rot}deg);z-index:${10+i}">${img(c.id)}</div>`}).join('')}</div></div>`;
}
function canRevivePhoenix(){
 const s=session.state,me=playerState(session.player);return s?.status==='main'&&s.focus===session.player&&!s.priority&&!s.stack.length&&!s.combat&&!s.pendingChoice&&me?.monsterGrave?.includes('fenice_cremisi')&&(me.souls.red+me.souls.green>0);
}
mainControls=function(){
 const s=session.state,me=playerState(session.player);let h='';
 if(s.priority===session.player)h+='<button id="passPriority" class="btn gold">Passa priorità</button>';else if(!s.priority&&s.focus===session.player)h+='<button id="passMain" class="btn gold">Passa</button>';
 const cost=me.recycleCount+1;if(!s.priority&&!s.combat&&!s.stack.length&&s.focus===session.player&&me.graveCards.length)h+=`<button id="recycleBtn" class="btn ghost">Ricicla (${cost})</button>`;
 if(canRevivePhoenix())h+='<button id="revivePhoenix" class="btn red">Rianima Fenice (1)</button>';
 return h||'<span class="sub">Attendi l’avversario…</span>';
};
renderMain=function(){
 const s=session.state,me=playerState(session.player),op=playerState(otherP());
 const center=`<main><div class="panel playerzone"><div class="playerinfo"><b>${esc(op.name)}</b><div class="sub">Mano: ${op.handCount} • Deck: ${op.deckCount} • Cimitero: ${op.graveCount}</div>${soulsHtml(op)}</div><div class="champions">${op.champions.map(c=>champHtml(c,otherP(),false)).join('')}</div></div><div class="board"><h3>Campo dei Mostri <span class="sub">(${s.board.monsters.length})</span></h3><div class="monsters">${s.board.monsters.length?s.board.monsters.map(monsterHtml).join(''):'<div class="sub">Nessun Mostro sul campo.</div>'}</div></div><div class="panel playerzone"><div class="playerinfo"><b>${esc(me.name)}</b><div class="sub">Deck: ${me.deckCards.length} • Cimitero: ${me.graveCards.length} • Monster Deck: ${me.monsterDeck.length} • Cimitero Mostri: ${me.monsterGrave.length}</div>${soulsHtml(me)}</div><div class="champions">${me.champions.map(c=>champHtml(c,session.player,true)).join('')}</div></div><div class="hand-title"><h3 style="margin:0">La tua mano (${me.handCards.length})</h3><div class="controls">${mainControls()}</div></div>${hand(me.handCards)}</main>`;
 const lg=`<aside class="side"><div class="panel"><h3 style="margin-top:0">Log</h3><div class="log">${[...s.log].reverse().map(x=>`<div>${esc(x)}</div>`).join('')}</div></div></aside>`;
 return `<div class="game-grid">${chainLane()}${center}${lg}</div>`;
};

function choosePhoenixPayment(){
 const me=playerState(session.player);if(me.souls.red>0&&me.souls.green>0){showModal('Rianima Fenice Cremisi','<p>Scegli quale Anima pagare.</p><div class="controls"><button id="phoenixRed" class="btn red">1 Anima Rossa</button><button id="phoenixGreen" class="btn green">1 Anima Verde</button></div>');document.querySelector('#phoenixRed').onclick=()=>{closeModal();move({type:'revive_phoenix',color:'red'})};document.querySelector('#phoenixGreen').onclick=()=>{closeModal();move({type:'revive_phoenix',color:'green'})}}
 else if(me.souls.red>0)move({type:'revive_phoenix',color:'red'});else if(me.souls.green>0)move({type:'revive_phoenix',color:'green'});
}
const baseBind=bind;
bind=function(){
 baseBind();
 document.querySelectorAll('[data-select-card]').forEach(el=>el.onclick=()=>{const id=el.dataset.selectCard;if(selected.has(id))selected.delete(id);else if(selected.size<6)selected.add(id);render()});
 bindPreview();
 document.querySelectorAll('[data-hand-card]').forEach(el=>{el.ondragstart=e=>{if(el.classList.contains('disabled'))return e.preventDefault();el.classList.add('dragging');e.dataTransfer.setData('text/plain',el.dataset.handCard)};el.ondragend=()=>el.classList.remove('dragging');el.ondblclick=()=>{if(!el.classList.contains('disabled'))chooseForCard(el.dataset.handCard)}});
 const dz=document.querySelector('#playDropZone');if(dz){dz.ondragover=e=>{e.preventDefault();dz.classList.add('dragover')};dz.ondragleave=()=>dz.classList.remove('dragover');dz.ondrop=e=>{e.preventDefault();dz.classList.remove('dragover');const id=e.dataTransfer.getData('text/plain');if(id)chooseForCard(id)}}
 document.querySelector('#revivePhoenix')?.addEventListener('click',choosePhoenixPayment);
 document.querySelectorAll('.champ.click-attack').forEach(el=>el.onclick=e=>{e.stopPropagation();attackSource={champId:el.dataset.champId,el};document.body.classList.add('attack-mode')});
 document.querySelectorAll('.attack-target').forEach(el=>el.onclick=e=>{if(!attackSource)return;e.stopPropagation();const t=el.dataset.monsterUid?{type:'monster',uid:el.dataset.monsterUid}:{type:'champion',player:Number(el.dataset.owner),champId:el.dataset.champId};const champId=attackSource.champId;attackSource=null;document.body.classList.remove('attack-mode');document.querySelector('#sfAttackLine')?.setAttribute('opacity','0');move({type:'attack',champId,target:t})});
};
document.addEventListener('mousemove',e=>{if(!attackSource)return;const r=attackSource.el.getBoundingClientRect(),l=document.querySelector('#sfAttackLine');if(!l)return;l.setAttribute('x1',r.left+r.width/2);l.setAttribute('y1',r.top+r.height/2);l.setAttribute('x2',e.clientX);l.setAttribute('y2',e.clientY);l.setAttribute('opacity','1')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){attackSource=null;document.body.classList.remove('attack-mode');document.querySelector('#sfAttackLine')?.setAttribute('opacity','0')}});
async function autoPass(){if(busy||!session.state||session.state.status!=='main'||autoPassVersion===session.version)return;const s=session.state;if(s.combatSpellPriority===session.player)return;let yes=false;if(s.priority===session.player&&s.stack.length&&s.stack[s.stack.length-1].actor===session.player)yes=true;else if(s.priority===session.player&&s.combat&&!s.stack.length&&s.combat.initiator===session.player)yes=true;if(yes){autoPassVersion=session.version;await move({type:'pass_priority'})}}
const baseRender=render;render=function(){baseRender();ensureUi();bindPreview();setTimeout(autoPass,80)};
ensureUi();if(session.state)render();
})();
