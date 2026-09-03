(()=>{
const OLD_BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const NEW_BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/cards-v18/';
const MAIN_CARD_BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/champion-of-the-souls-carte-ottimizzate/cards/';
const OLD_ART={
 kael:'kael.webp',lyrandel:'lyrandel.webp',
 lucertola_fuoco:'lucertola-di-fuoco.webp',segugio_infernale:'segugio-infernale.webp',fenice_cremisi:'fenice-cremisi.webp',golem_magmatico:'golem-magmatico.webp',drago_delle_ceneri:'drago-delle-ceneri.webp',salamandra_vulcanica:'salamandra-vulcanica.webp',
 ragno_dei_germogli:'ragno-dei-germogli.webp',serpente_della_giungla:'serpente-della-giungla.webp',lupo_delle_radici:'lupo-delle-radici.webp',cervo_antico:'cervo-antico.webp',guardiano_della_foresta:'guardiano-della-foresta.webp',orso_furioso:'orso-furioso.webp',
 taglio_fiammante:'taglio_fiammante.webp',sfera_incandescente:'sfera_incandescente.webp',corazza_esplosiva:'corazza_esplosiva.webp',occhio_di_drago:'occhio_di_drago.webp',mano_del_caos:'mano_del_caos.webp',nube_di_fuoco:'nube_di_fuoco.webp',tornado_bollente:'tornado_bollente.webp',fendente_di_fuoco:'fendente_di_fuoco.webp',berserk:'berserk.webp',taglio_ninjitsu:'taglio_ninjitsu.webp',stupido:'stupido.webp',riflesso:'riflesso.webp',tutto_per_la_festa:'tutto_per_la_festa.webp',alta_marea:'alta_marea.webp',doppia_katana:'doppia_katana.webp',albero_della_vita:'albero_della_vita.webp',sguardo_ninjitsu:'sguardo_ninjitsu.webp',mille_lame:'mille_lame.webp'
};
const NEW_ART={
 divoratore_campione:'il-divoratore-di-anime.webp',
 segugio_dei_morti:'segugio-dei-morti.webp',custode_sepolcrale:'custode-sepolcrale.webp',cavaliere_senza_volto:'cavaliere-senza-volto.webp',cerbero:'cerbero.webp',re_dei_non_morti:'re-dei-non-morti.webp',divoratore_di_anime_mostro:'divoratore-di-anime-mostro.webp',
 evocatore_anime_vacue:'evocatore-di-anime-vacue.webp',anima_esplosiva:'anima-esplosiva.webp',sacrificio:'sacrificio.webp',collasso:'collasso.webp',spacca_ossa:'spacca-ossa.webp',eclipse_fang:'eclipse-fang.webp',fino_alla_morte:'fino-alla-morte.webp',mietitore:'mietitore.webp',ammazza_morte:'ammazza-morte.webp'
};
const artUrl=id=>id==='valtheris'?MAIN_CARD_BASE+'valtheris-spirito-eterno.webp?v=20260903':(NEW_ART[id]?NEW_BASE+NEW_ART[id]:(OLD_ART[id]?OLD_BASE+OLD_ART[id]:''));
const artImg=(id,cl='')=>artUrl(id)?`<img class="${cl}" src="${artUrl(id)}" alt="${esc(id)}" loading="lazy">`:'';
const objectInfo=id=>session.state?.cardDefs?.[id]||session.state?.monsterDefs?.[id]||[1,2].flatMap(p=>session.state?.players?.[String(p)]?.champions||[]).find(c=>c.id===id)||null;
const colorLabel=c=>c==='red'?'Rossa':c==='green'?'Verde':'Nera';

function enemyProvocations(){
 const op=otherP(),s=session.state;if(!s)return[];
 const ms=(s.board?.monsters||[]).filter(m=>m.owner===op&&s.monsterDefs?.[m.cardId]?.provocazione).map(m=>({type:'monster',uid:m.uid}));
 const cs=(playerState(op)?.champions||[]).filter(c=>!c.defeated&&c.provocazione).map(c=>({type:'champion',player:op,champId:c.id}));
 return [...ms,...cs];
}
function attackTargetAllowed(el){
 const guards=enemyProvocations();if(!guards.length)return true;
 if(el.dataset.monsterUid)return guards.some(g=>g.type==='monster'&&g.uid===el.dataset.monsterUid);
 return guards.some(g=>g.type==='champion'&&g.player===Number(el.dataset.owner)&&g.champId===el.dataset.champId);
}

canAttack=function(c){const s=session.state;return s?.status==='main'&&s.focus===session.player&&!s.priority&&!s.combat&&!s.stack.length&&!s.pendingChoice&&!c.tapped&&!c.defeated&&c.cantAttackTurn!==s.turn};
canCast=function(card){const s=session.state;if(!s||s.status!=='main'||s.pendingChoice)return false;const me=playerState(session.player),cost=card.effectiveCost??card.cost;if((me.souls?.[card.color]||0)<cost)return false;if(card.effect==='taglio'&&!s.combat)return false;if(card.effect==='marea'&&!s.combat)return false;if(s.stack.length)return s.priority===session.player&&card.speed==='instant';if(s.combat)return s.priority===session.player&&(card.speed==='response'||card.effect==='marea');return s.focus===session.player};
monsterTargets=function(){return session.state?.board?.monsters||[]};
soulsHtml=function(p){return `<div class="souls"><div class="soul red" title="Anime Rosse">${p.souls?.red??0}</div><div class="soul green" title="Anime Verdi">${p.souls?.green??0}</div><div class="soul black" title="Anime Nere">${p.souls?.black??0}</div></div>`};

function canUseBlackChampion(c,isOwn){const me=playerState(session.player),s=session.state;return isOwn&&c.id==='divoratore_campione'&&!c.defeated&&!c.tapped&&s.status==='main'&&s.focus===session.player&&!s.priority&&!s.stack.length&&!s.combat&&!s.pendingChoice&&me.killedMonsterThisTurn&&(me.graveCards||[]).length>0}
function canUseValtheris(c,isOwn){const s=session.state;return isOwn&&c.id==='valtheris'&&!c.defeated&&!c.tapped&&s.status==='main'&&s.focus===session.player&&!s.priority&&!s.stack.length&&!s.combat&&!s.pendingChoice}
champHtml=function(c,owner,isOwn){
 if(!c)return'';const w=c.wounds||0,guards=enemyProvocations();const canAtk=isOwn&&canAttack(c);const enemyTarget=!isOwn&&!c.defeated&&(guards.length===0||guards.some(g=>g.type==='champion'&&g.player===owner&&g.champId===c.id));
 return `<div class="champ ${c.color}${c.defeated?' defeated':''}${canAtk?' click-attack':''}${enemyTarget?' attack-target':''}" data-owner="${owner}" data-champ-id="${c.id}" data-preview-card="${c.id}"><div class="tap ${!c.tapped&&!c.defeated?'active':''}">${c.defeated?'SCONFITTO':c.tapped?'TAPPATO':'ATTIVO'}</div>${artImg(c.id,'champ-art')}<h3>${esc(c.name)}</h3><div class="stats"><span class="stat">POW <b>${c.pow}</b></span><span class="stat">HP <b>${c.hp-w}</b>/${c.hp}</span><span class="stat">Danni <b>${c.damage}</b>/${c.pow}</span><span class="stat">Ferite <b>${w}</b></span></div>${canUseBlackChampion(c,isOwn)?'<div class="card-actions"><button class="btn black v17-champ-ability" data-champ="divoratore_campione">Ritorno delle Anime</button></div>':''}${canUseValtheris(c,isOwn)?'<div class="card-actions"><button class="btn blue v17-valtheris-ability" data-champ="valtheris">Protettore dell’Anima</button></div>':''}</div>`;
};
monsterHtml=function(m){
 const guards=enemyProvocations(),allowed=guards.length===0||guards.some(g=>g.type==='monster'&&g.uid===m.uid);const prov=session.state?.monsterDefs?.[m.cardId]?.provocazione;
 return `<div class="monster ${m.color}${allowed?' attack-target':''}${prov?' provocazione':''}" data-monster-uid="${m.uid}" data-owner="${m.owner}" data-preview-card="${m.cardId}">${artImg(m.cardId,'monster-art')}<h4>${esc(m.name)}</h4><div class="meta">Proprietario: ${esc(playerState(m.owner)?.name||'?')}${prov?' • Provocazione':''}</div><div class="stats" style="margin-top:8px"><span class="stat">POW ${m.pow}</span><span class="stat">Danni ${m.damage}/${m.pow}</span></div></div>`;
};

function v17Chain(){
 const s=session.state;let cards='';
 if(!s.stack?.length)cards='<div class="sub">Nessuna carta in pending.</div>';
 else cards=s.stack.map((x,i)=>{const effect=x.kind==='effect',id=effect?x.sourceCardId:x.cardId,name=effect?(x.effectName||'Effetto'):(s.cardDefs?.[x.cardId]?.name||x.cardId);return `<div class="stack-card${effect?' stack-effect':''}" data-preview-card="${id}" style="z-index:${20+i}">${artImg(id)}${effect?'<div class="effect-ribbon">EFFETTO</div>':''}<div class="stack-owner">${esc(name)} • ${esc(playerState(x.actor)?.name||'')}</div></div>`}).join('');
 return `<div class="panel chain-lane"><h3 style="margin-top:0">Pending / Catena</h3><div id="playDropZone" class="pending-zone"><div class="tiny" style="text-align:center;margin-bottom:8px">Trascina qui una carta dalla mano</div><div class="stack-stage">${cards}</div></div>${s.combat?combatHtml():''}${s.priority?`<div class="sub" style="margin-top:10px">Priorità: <b>${esc(playerState(s.priority)?.name||'')}</b></div>`:''}</div>`;
}
function v17Hand(cards){const n=cards.length;if(!n)return '<div class="sub">Nessuna carta in mano.</div>';return `<div class="hand-wrap"><div class="hand-fan">${cards.map((c,i)=>{const off=i-(n-1)/2,rot=off*7,x=off*82,disabled=!canCast(c);return `<div class="hand-card ${disabled?'disabled':''}" draggable="${!disabled}" data-hand-card="${c.id}" data-preview-card="${c.id}" style="transform:translate(${x}px,${Math.abs(off)*5}px) rotate(${rot}deg);z-index:${10+i}">${artImg(c.id)}</div>`}).join('')}</div></div>`}

renderSelect=function(){const me=playerState(session.player);if(me.selected)return '<div class="panel"><h2>Selezione confermata</h2><p>Attendo l’altro giocatore.</p></div>';const cards=me.deckCards||[],need=Math.min(6,cards.length);return `<div class="panel"><div class="select-head"><div><h2 style="margin:0">Scegli ${need} carte</h2><div class="sub">Clicca l’immagine per selezionarla. Tasto destro o hover = zoom.</div></div><b>${selected.size}/${need}</b></div><div class="select-gallery">${cards.map(c=>`<div class="select-card ${selected.has(c.id)?'selected':''}" data-select-card="${c.id}" data-preview-card="${c.id}">${artImg(c.id)}<div class="select-check">✓</div></div>`).join('')}</div><div class="controls"><button id="confirmSelect" class="btn primary" ${selected.size!==need?'disabled':''}>Conferma</button></div></div>`};

mainControls=function(){const s=session.state,me=playerState(session.player);let h='';if(s.priority===session.player)h+='<button id="passPriority" class="btn gold">Passa priorità</button>';else if(!s.priority&&s.focus===session.player)h+='<button id="passMain" class="btn gold">Passa</button>';const cost=me.recycleCount+1;if(!s.priority&&!s.combat&&!s.stack.length&&s.focus===session.player&&(me.graveCards||[]).length)h+=`<button id="recycleBtn" class="btn ghost">Ricicla (${cost})</button>`;if(!s.priority&&!s.combat&&!s.stack.length&&s.focus===session.player&&(me.monsterGrave||[]).includes('fenice_cremisi')&&((me.souls.red||0)+(me.souls.green||0)+(me.souls.black||0)>0))h+='<button id="revivePhoenix" class="btn red">Rianima Fenice (1)</button>';return h||'<span class="sub">Attendi l’avversario…</span>'};
renderMain=function(){const s=session.state,me=playerState(session.player),op=playerState(otherP());const center=`<main><div class="panel playerzone"><div class="playerinfo"><b>${esc(op.name)}</b><div class="sub">Mano: ${op.handCount} • Deck: ${op.deckCount} • Cimitero: ${op.graveCount}</div>${soulsHtml(op)}</div><div class="champions">${op.champions.map(c=>champHtml(c,otherP(),false)).join('')}</div></div><div class="board"><h3>Campo dei Mostri <span class="sub">(${s.board.monsters.length})</span></h3><div class="monsters">${s.board.monsters.length?s.board.monsters.map(monsterHtml).join(''):'<div class="sub">Nessun Mostro sul campo.</div>'}</div></div><div class="panel playerzone"><div class="playerinfo"><b>${esc(me.name)}</b><div class="sub">Deck: ${me.deckCards.length} • Cimitero: ${me.graveCards.length} • Monster Deck: ${me.monsterDeck.length} • Cimitero Mostri: ${me.monsterGrave.length}</div>${soulsHtml(me)}</div><div class="champions">${me.champions.map(c=>champHtml(c,session.player,true)).join('')}</div></div><div class="hand-title"><h3 style="margin:0">La tua mano (${me.handCards.length})</h3><div class="controls">${mainControls()}</div></div>${v17Hand(me.handCards)}</main>`;const log=`<aside class="side"><div class="panel"><h3 style="margin-top:0">Log</h3><div class="log">${[...s.log].reverse().map(x=>`<div>${esc(x)}</div>`).join('')}</div></div></aside>`;return `<div class="game-grid">${v17Chain()}${center}${log}</div>`};

const oldLanding=renderLanding;
renderLanding=function(){oldLanding();const sub=document.querySelector('.landing .sub');if(sub)sub.textContent='Starter Rosso / Verde / Nero • 2 giocatori • stanze private con codice';const n=document.querySelector('.landing .notice');if(n)n.innerHTML='<b>Starter attuale:</b> Kael + Lyrandel + Il Divoratore di Anime, 27 carte e 18 Mostri.'};

showRecycle=function(){const me=playerState(session.player),cost=me.recycleCount+1;showModal('Riciclo — costo '+cost,`<div class="field"><label>Anime Rosse</label><input id="payRed" type="number" min="0" max="${me.souls.red}" value="0"></div><div class="field"><label>Anime Verdi</label><input id="payGreen" type="number" min="0" max="${me.souls.green}" value="0"></div><div class="field"><label>Anime Nere</label><input id="payBlack" type="number" min="0" max="${me.souls.black}" value="${Math.min(cost,me.souls.black)}"></div><button class="btn primary" id="doRecycle">Ricicla</button>`);document.querySelector('#doRecycle').onclick=()=>{const r=Number(document.querySelector('#payRed').value),g=Number(document.querySelector('#payGreen').value),b=Number(document.querySelector('#payBlack').value);closeModal();move({type:'recycle',red:r,green:g,black:b})}};
function revivePhoenixV17(){const me=playerState(session.player),opts=['red','green','black'].filter(c=>(me.souls[c]||0)>0);if(opts.length===1)return move({type:'revive_phoenix',color:opts[0]});showModal('Rianima Fenice Cremisi','<p>Scegli quale Anima pagare.</p><div class="controls">'+opts.map(c=>`<button class="btn ${c==='black'?'black':c}" data-phoenix-color="${c}">1 Anima ${colorLabel(c)}</button>`).join('')+'</div>');document.querySelectorAll('[data-phoenix-color]').forEach(b=>b.onclick=()=>{const c=b.dataset.phoenixColor;closeModal();move({type:'revive_phoenix',color:c})})}

async function useBlackChampion(){const cards=playerState(session.player).graveCards||[];const v=await pick('Ritorno delle Anime — scegli una carta dal Cimitero',cards.map(c=>({label:c.name,desc:`${c.type} • ${colorLabel(c.color)}`,value:c.id})));if(v)move({type:'activate_champion',champId:'divoratore_campione',graveCardId:v})}
function useValtheris(){move({type:'activate_champion',champId:'valtheris'})}

const prevChoose=window.chooseForCard;
window.chooseForCard=async function(id){const card=playerState(session.player)?.handCards?.find(c=>c.id===id);if(!card)return;let targets={};try{
 if(card.effect==='evocatore_anime_vacue'){const g=(playerState(session.player).monsterGraveCards||[]).filter(m=>m.pow<=2);const x=await pick('Scegli un Mostro dal tuo Cimitero',g.map(m=>({label:m.name,desc:'POW '+m.pow,value:m.id})));if(!x)return;targets.graveMonsterId=x}
 else if(card.effect==='anima_esplosiva'||card.effect==='spacca_ossa'){const x=await pick('Scegli un Mostro',(session.state.board.monsters||[]).map(m=>({label:m.name,desc:'POW '+m.pow,value:m.uid})));if(!x)return;targets.monsterUid=x}
 else if(card.effect==='sacrificio'){const ms=(session.state.board.monsters||[]).filter(m=>m.owner===session.player);const x=await pick('Scegli un tuo Mostro',ms.map(m=>({label:m.name,desc:'POW '+m.pow,value:m.uid})));if(!x)return;targets.monsterUid=x}
 else if(card.effect==='collasso'||card.effect==='fino_alla_morte'){const x=await pick('Scegli un tuo Campione',ownChampTargets().map(c=>({label:c.name,value:c.id})));if(!x)return;targets.ownChamp=x}
 else if(card.effect==='eclipse_fang'){const es=[...enemyChampTargets().map(c=>({label:c.name,value:{type:'champion',player:otherP(),champId:c.id}})),...(session.state.board.monsters||[]).map(m=>({label:m.name,desc:'Mostro • POW '+m.pow,value:{type:'monster',uid:m.uid}}))];const x=await pick('Scegli un nemico',es);if(!x)return;targets.enemy=x}
 else if(card.effect==='ammazza_morte'){const all=[...playerState(1).champions.filter(c=>!c.defeated).map(c=>({label:c.name+' — '+playerState(1).name,value:{player:1,champId:c.id}})),...playerState(2).champions.filter(c=>!c.defeated).map(c=>({label:c.name+' — '+playerState(2).name,value:{player:2,champId:c.id}}))];const x=await pick('Scegli un Campione',all);if(!x)return;targets.champion=x}
 else if(card.effect==='mietitore'){}
 else return prevChoose?.(id);
 move({type:'cast',cardId:id,targets});
 }catch(e){showError(e.message)}
};

function showPendingV17(){const pc=session.state?.pendingChoice;if(!pc||pc.hidden||pc.player!==session.player||pc.type==='festa')return;if(document.querySelector('[data-v17-pending="'+pc.type+'"]'))return;
 if(pc.type==='trigger_target'){const title=pc.trigger?.effectName||'Scegli il bersaglio dell’effetto';showModal(title,`<div data-v17-pending="trigger_target" class="target-grid">${(pc.options||[]).map((o,i)=>`<button class="target" data-v17-choice="${i}"><b>${esc(o.label)}</b></button>`).join('')}</div>`);document.querySelectorAll('[data-v17-choice]').forEach(b=>b.onclick=()=>{const o=pc.options[Number(b.dataset.v17Choice)];closeModal();move({type:'resolve_choice',choice:o.id})});const cancel=document.querySelector('#modalCancel');if(cancel)cancel.style.display='none'}
 if(pc.type==='cerbero'){const defs=session.state.monsterDefs||{};showModal('Cerbero — evoca un Mostro con 2 POW',`<div data-v17-pending="cerbero" class="target-grid">${(pc.cardIds||[]).map(id=>`<button class="target" data-v17-mon="${id}"><b>${esc(defs[id]?.name||id)}</b><div class="tiny">POW ${defs[id]?.pow??''}</div></button>`).join('')}</div>`);document.querySelectorAll('[data-v17-mon]').forEach(b=>b.onclick=()=>{const id=b.dataset.v17Mon;closeModal();move({type:'resolve_choice',cardId:id})});const cancel=document.querySelector('#modalCancel');if(cancel)cancel.style.display='none'}
}

function bindV17Preview(){document.querySelectorAll('[data-preview-card]').forEach(el=>{const id=el.dataset.previewCard;if(!artUrl(id))return;el.addEventListener('mouseenter',()=>{clearTimeout(el._v17Hover);el._v17Hover=setTimeout(()=>showV17Preview(el,id),1000)});el.addEventListener('mouseleave',()=>{clearTimeout(el._v17Hover);document.querySelector('#sfV17Preview')?.classList.remove('show')})})}
function previewBox(){let p=document.querySelector('#sfV17Preview');if(!p){p=document.createElement('div');p.id='sfV17Preview';p.className='sf-preview v17-preview';document.body.appendChild(p)}return p}
function showV17Preview(el,id,x=null,y=null){const info=objectInfo(id),u=artUrl(id);if(!info||!u)return;const p=previewBox();let meta='',text=info.text||'';if(session.state.cardDefs?.[id])meta=`${info.type||''} • ${speedLabel(info.speed||'base')}`;else if(session.state.monsterDefs?.[id])meta=`Mostro • POW ${info.pow}`;else meta=`Campione • POW ${info.pow}`;p.innerHTML=`<img src="${u}"><div class="ptext"><h3>${esc(info.name||id)}</h3><div class="tag">${esc(meta)}</div>${text?`<p>${esc(text)}</p>`:''}</div>`;const r=el?.getBoundingClientRect?.()||{right:x||20,left:x||20,top:y||20};const w=Math.min(720,innerWidth*.92);let left=x!=null?x+18:r.right+16;if(left+w>innerWidth-16)left=Math.max(16,(x!=null?x:r.left)-w-18);p.style.left=left+'px';p.style.top=Math.max(16,Math.min(innerHeight-430,(y!=null?y:r.top)-70))+'px';p.classList.add('show')}
document.addEventListener('contextmenu',e=>{const el=e.target.closest?.('[data-preview-card]');if(!el)return;const id=el.dataset.previewCard;if(!artUrl(id))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showV17Preview(el,id,e.clientX,e.clientY)},true);
document.addEventListener('click',()=>document.querySelector('#sfV17Preview')?.classList.remove('show'),true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelector('#sfV17Preview')?.classList.remove('show')},true);

const prevBind=bind;
bind=function(){prevBind();
 document.querySelectorAll('[data-select-card]').forEach(el=>el.onclick=()=>{const cards=playerState(session.player).deckCards||[],need=Math.min(6,cards.length),id=el.dataset.selectCard;if(selected.has(id))selected.delete(id);else if(selected.size<need)selected.add(id);render()});
 const conf=document.querySelector('#confirmSelect');if(conf)conf.onclick=()=>move({type:'select_cards',cardIds:[...selected]});
 document.querySelectorAll('[data-hand-card]').forEach(el=>{el.ondblclick=()=>{if(!el.classList.contains('disabled'))window.chooseForCard(el.dataset.handCard)};el.ondragstart=e=>{if(el.classList.contains('disabled'))return e.preventDefault();e.dataTransfer.setData('text/plain',el.dataset.handCard);el.classList.add('dragging')};el.ondragend=()=>el.classList.remove('dragging')});
 const dz=document.querySelector('#playDropZone');if(dz){dz.ondrop=e=>{e.preventDefault();dz.classList.remove('dragover');const id=e.dataTransfer.getData('text/plain');if(id)window.chooseForCard(id)}}
 document.querySelector('#recycleBtn')?.addEventListener('click',e=>{e.stopImmediatePropagation();showRecycle()},true);
 document.querySelector('#revivePhoenix')?.addEventListener('click',e=>{e.stopImmediatePropagation();revivePhoenixV17()},true);
 document.querySelector('.v17-champ-ability')?.addEventListener('click',e=>{e.stopPropagation();useBlackChampion()});
 document.querySelector('.v17-valtheris-ability')?.addEventListener('click',e=>{e.stopPropagation();useValtheris()});
 document.querySelectorAll('.champ.click-attack').forEach(el=>el.onclick=e=>{e.stopPropagation();window.__v17AttackSource={champId:el.dataset.champId,el};document.body.classList.add('attack-mode')});
 document.querySelectorAll('.attack-target').forEach(el=>el.onclick=e=>{const src=window.__v17AttackSource;if(!src)return;e.stopPropagation();if(!attackTargetAllowed(el)){showError('Devi scegliere un difensore con Provocazione.');return}const t=el.dataset.monsterUid?{type:'monster',uid:el.dataset.monsterUid}:{type:'champion',player:Number(el.dataset.owner),champId:el.dataset.champId};window.__v17AttackSource=null;document.body.classList.remove('attack-mode');document.querySelector('#sfAttackLine')?.setAttribute('opacity','0');move({type:'attack',champId:src.champId,target:t})});
 bindV17Preview();setTimeout(showPendingV17,0);
};
document.addEventListener('mousemove',e=>{const src=window.__v17AttackSource;if(!src)return;const r=src.el.getBoundingClientRect(),l=document.querySelector('#sfAttackLine');if(l){l.setAttribute('x1',r.left+r.width/2);l.setAttribute('y1',r.top+r.height/2);l.setAttribute('x2',e.clientX);l.setAttribute('y2',e.clientY);l.setAttribute('opacity','1')}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){window.__v17AttackSource=null;document.body.classList.remove('attack-mode');document.querySelector('#sfAttackLine')?.setAttribute('opacity','0')}},true);

const prevRender=render;
render=function(){prevRender();const badge=document.querySelector('.ui-v2-badge');if(badge)badge.textContent='UI v17 • Set 1 Nero';bindV17Preview();setTimeout(showPendingV17,0)};

if(session.state)render();else renderLanding();
})();
