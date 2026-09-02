(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={
 kael:'kael.webp',lyrandel:'lyrandel.webp',
 lucertola_fuoco:'lucertola-di-fuoco.webp',segugio_infernale:'segugio-infernale.webp',fenice_cremisi:'fenice-cremisi.webp',golem_magmatico:'golem-magmatico.webp',drago_delle_ceneri:'drago-delle-ceneri.webp',salamandra_vulcanica:'salamandra-vulcanica.webp',
 ragno_dei_germogli:'ragno-dei-germogli.webp',serpente_della_giungla:'serpente-della-giungla.webp',lupo_delle_radici:'lupo-delle-radici.webp',cervo_antico:'cervo-antico.webp',guardiano_della_foresta:'guardiano-della-foresta.webp',orso_furioso:'orso-furioso.webp',
 taglio_fiammante:'taglio_fiammante.webp',sfera_incandescente:'sfera_incandescente.webp',corazza_esplosiva:'corazza_esplosiva.webp',occhio_di_drago:'occhio_di_drago.webp',mano_del_caos:'mano_del_caos.webp',nube_di_fuoco:'nube_di_fuoco.webp',tornado_bollente:'tornado_bollente.webp',fendente_di_fuoco:'fendente_di_fuoco.webp',berserk:'berserk.webp',
 taglio_ninjitsu:'taglio_ninjitsu.webp',stupido:'stupido.webp',riflesso:'riflesso.webp',tutto_per_la_festa:'tutto_per_la_festa.webp',alta_marea:'alta_marea.webp',doppia_katana:'doppia_katana.webp',albero_della_vita:'albero_della_vita.webp',sguardo_ninjitsu:'sguardo_ninjitsu.webp',mille_lame:'mille_lame.webp'
};
const artUrl=id=>ART[id]?BASE+ART[id]:'';
const pic=id=>artUrl(id)?`<img src="${artUrl(id)}" alt="${id}" loading="lazy">`:'';

function counts(pl){
 return {
  cards:Number(pl?.graveCount ?? pl?.graveCards?.length ?? 0),
  monsters:Number(pl?.monsterGraveCount ?? pl?.monsterGraveCards?.length ?? pl?.monsterGrave?.length ?? 0)
 };
}
function graveButtons(owner){
 const pl=playerState(owner),c=counts(pl),own=owner===session.player;
 return `<div class="sf-grave-buttons">
  <button class="btn ghost sf-grave-btn" data-owner="${owner}" data-kind="cards">${own?'Mio':'Avv.'} Cimitero Carte <b>${c.cards}</b></button>
  <button class="btn ghost sf-grave-btn" data-owner="${owner}" data-kind="monsters">${own?'Mio':'Avv.'} Cimitero Mostri <b>${c.monsters}</b></button>
 </div>`;
}
function enhanceGraves(){
 if(!session.state||session.state.status!=='main')return;
 const zones=[...document.querySelectorAll('.playerzone')];
 if(zones.length>=2){
  const opponentInfo=zones[0].querySelector('.playerinfo');
  const myInfo=zones[zones.length-1].querySelector('.playerinfo');
  if(opponentInfo&&!opponentInfo.querySelector('.sf-grave-buttons'))opponentInfo.insertAdjacentHTML('beforeend',graveButtons(otherP()));
  if(myInfo&&!myInfo.querySelector('.sf-grave-buttons'))myInfo.insertAdjacentHTML('beforeend',graveButtons(session.player));
 }
 document.querySelector('#recycleBtn')?.remove();
 document.querySelector('#revivePhoenix')?.remove();
}
function canUseOwnGrave(){
 const s=session.state;
 return s?.status==='main'&&s.focus===session.player&&!s.priority&&!s.stack?.length&&!s.combat&&!s.pendingChoice;
}
function tile(c,action=''){
 if(!c)return'';
 return `<div class="sf-grave-card" data-preview-card="${c.id}">${pic(c.id)}<div class="sf-grave-name">${esc(c.name||c.id)}</div>${c.text?`<div class="tiny">${esc(c.text)}</div>`:''}${action}</div>`;
}
function openGrave(owner,kind){
 const pl=playerState(owner);if(!pl)return;
 const own=owner===session.player;
 if(kind==='cards'){
  const cards=pl.graveCards||[];
  const cost=own?(pl.recycleCount||0)+1:0;
  const available=(pl.deckColors||[]).reduce((n,c)=>n+Number(pl.souls?.[c]||0),0);
  const enough=own&&available>=cost;
  const action=own&&cards.length?`<div class="sf-grave-action"><button class="btn primary sf-recycle-grave" ${(!canUseOwnGrave()||!enough)?'disabled':''}>Rimetti tutte le carte nel Mazzo — ${cost} Anime</button><span class="tiny">Scegli tu quali Anime usare.</span></div>`:'';
  showModal(`${own?'Il tuo':'Cimitero di '+pl.name} — Carte`,`${action}<div class="sf-grave-grid">${cards.length?cards.map(c=>tile(c)).join(''):'<div class="sub">Cimitero vuoto.</div>'}</div>`);
 }else{
  const monsters=pl.monsterGraveCards||((pl.monsterGrave||[]).map(id=>session.state.monsterDefs?.[id]).filter(Boolean));
  showModal(`${own?'Il tuo':'Cimitero di '+pl.name} — Mostri`,`<div class="sf-grave-grid">${monsters.length?monsters.map(m=>{
   const hasSoul=(pl.deckColors||[]).some(c=>(pl.souls?.[c]||0)>0);
   const action=own&&m.id==='fenice_cremisi'?`<button class="btn red sf-phoenix-grave" ${(!canUseOwnGrave()||!hasSoul)?'disabled':''}>Gioca dal Cimitero — 1 Anima</button>`:'';
   return tile(m,action);
  }).join(''):'<div class="sub">Cimitero Mostri vuoto.</div>'}</div>`);
 }
}
function recyclePayment(){
 const me=playerState(session.player),cost=(me.recycleCount||0)+1,colors=(me.deckColors||[]).filter(c=>(me.souls?.[c]||0)>=0);
 const labels={red:'Rosse',green:'Verdi',black:'Nere',blue:'Blu'};
 showModal('Riciclo del Cimitero',`<p>Rimetti tutte le carte del Cimitero nel Mazzo. Costo: <b>${cost}</b> Anime.</p><div class="sf-payment">${colors.map(c=>`<label>Anime ${labels[c]||c}<input data-sf-pay-color="${c}" type="number" min="0" max="${me.souls?.[c]||0}" value="0"></label>`).join('')}</div><div class="tiny">La somma deve essere esattamente ${cost}.</div><div class="controls"><button id="sfDoRecycle" class="btn primary">Paga e rimetti nel Mazzo</button></div>`);
 document.querySelector('#sfDoRecycle').onclick=()=>{
  const pay={red:0,green:0,black:0,blue:0};document.querySelectorAll('[data-sf-pay-color]').forEach(el=>pay[el.dataset.sfPayColor]=Number(el.value||0));
  const total=Object.values(pay).reduce((a,b)=>a+b,0);if(total!==cost){alert(`Devi pagare esattamente ${cost} Anime.`);return}
  if(colors.some(c=>pay[c]>(me.souls?.[c]||0))){alert('Non hai abbastanza Anime.');return}
  closeModal();move({type:'recycle',...pay});
 };
}
function phoenixPayment(){
 const me=playerState(session.player),colors=(me.deckColors||[]).filter(c=>(me.souls?.[c]||0)>0),labels={red:'Rossa',green:'Verde',black:'Nera',blue:'Blu'};
 showModal('Fenice Cremisi — scegli l’Anima',`<p>Scegli quale Anima spendere per giocare Fenice Cremisi dal Cimitero Mostri.</p><div class="sf-soul-choice">${colors.map(c=>`<button class="btn ${c}" data-sf-phoenix="${c}">1 Anima ${labels[c]||c}</button>`).join('')}</div>`);
 document.querySelectorAll('[data-sf-phoenix]').forEach(b=>b.onclick=()=>{closeModal();move({type:'revive_phoenix',color:b.dataset.sfPhoenix})});
}

document.addEventListener('click',e=>{
 const grave=e.target.closest?.('.sf-grave-btn');
 if(grave){e.preventDefault();openGrave(Number(grave.dataset.owner),grave.dataset.kind);return}
 if(e.target.closest?.('.sf-recycle-grave')){e.preventDefault();recyclePayment();return}
 if(e.target.closest?.('.sf-phoenix-grave')){e.preventDefault();phoenixPayment();return}
},true);

function ensureArrowLayer(){
 let svg=document.querySelector('#sfTargetArrows');
 if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='sfTargetArrows';svg.classList.add('sf-target-arrows');document.body.appendChild(svg)}
 return svg;
}
function mid(el){if(!el)return null;const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}}
function stackEl(uid){const s=session.state?.stack||[],i=s.findIndex(x=>x.uid===uid);return i>=0?[...document.querySelectorAll('.stack-card')][i]:null}
function targetEl(t){
 if(!t)return null;
 if(t.type==='champion')return document.querySelector(`[data-owner="${t.player}"][data-champ-id="${t.champId}"]`);
 if(t.type==='monster')return document.querySelector(`[data-monster-uid="${t.uid}"]`);
 if(t.type==='stack')return stackEl(t.uid);
 return null;
}
function uniqueTargets(item){
 const out=[],t=item?.targets||{},effect=session.state?.cardDefs?.[item.cardId]?.effect;
 if(t.enemy)out.push(t.enemy);
 if(t.character)out.push(t.character);
 if(t.champion)out.push({type:'champion',player:Number(t.champion.player),champId:t.champion.champId});
 if(t.monsterUid)out.push({type:'monster',uid:t.monsterUid});
 if(t.ownChamp)out.push({type:'champion',player:item.actor,champId:t.ownChamp});
 if(t.stackUid)out.push({type:'stack',uid:t.stackUid});
 if(effect==='taglio'&&session.state?.combat?.attacker){
  const a=session.state.combat.attacker;out.push({type:'champion',player:a.player,champId:a.champId});
 }
 const seen=new Set();
 return out.filter(x=>{const k=x.type==='monster'?`m:${x.uid}`:x.type==='stack'?`s:${x.uid}`:`c:${x.player}:${x.champId}`;if(seen.has(k))return false;seen.add(k);return true});
}
function line(a,b,color,marker){
 if(!a||!b)return'';
 const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;
 const x1=a.x+dx/d*14,y1=a.y+dy/d*14,x2=b.x-dx/d*24,y2=b.y-dy/d*24;
 return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="4" stroke-linecap="round" marker-end="url(#${marker})" filter="url(#sfGlow)"/>`;
}
function drawArrows(){
 const svg=ensureArrowLayer(),s=session.state;
 let body='';
 if(s?.combat){
  const a=s.combat.attacker;
  const from=document.querySelector(`[data-owner="${a.player}"][data-champ-id="${a.champId}"]`);
  body+=line(mid(from),mid(targetEl(s.combat.target)),'#ff765f','sfCombatArrow');
 }
 const stackEls=[...document.querySelectorAll('.stack-card')];
 (s?.stack||[]).forEach((item,i)=>{
  const from=stackEls[i];
  for(const t of uniqueTargets(item))body+=line(mid(from),mid(targetEl(t)),'#66d4ff','sfSpellArrow');
 });
 svg.innerHTML=`<defs>
  <marker id="sfCombatArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ff765f"/></marker>
  <marker id="sfSpellArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#66d4ff"/></marker>
  <filter id="sfGlow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 </defs>${body}`;
}
function enhance(){enhanceGraves();drawArrows()}

const previousRender=render;
render=function(){
 previousRender();
 setTimeout(enhance,10);
};
window.addEventListener('resize',()=>requestAnimationFrame(drawArrows));
window.addEventListener('scroll',()=>requestAnimationFrame(drawArrows),true);
setInterval(()=>{if(session.state?.status==='main')drawArrows()},350);
setTimeout(enhance,30);
})();