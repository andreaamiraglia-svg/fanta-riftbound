(()=>{
const state=()=>session?.state;
const me=()=>playerState(session.player);
function provocationMonsters(){
 const s=state();
 return (s?.board?.monsters||[]).filter(m=>!!s.monsterDefs?.[m.cardId]?.provocazione);
}
function attackReady(c){
 const s=state();
 return !!(s&&c&&s.status==='main'&&Number(s.focus)===Number(session.player)&&!s.priority&&!s.combat&&!(s.stack||[]).length&&!s.pendingChoice&&!c.defeated&&!c.tapped&&c.cantAttackTurn!==s.turn);
}
function clearAttack(){
 window.__v17AttackSource=null;
 document.body.classList.remove('attack-mode');
 document.querySelector('#sfAttackLine')?.setAttribute('opacity','0');
}
function beginAttack(champId,el){
 const c=me()?.champions?.find(x=>String(x.id)===String(champId));
 if(!attackReady(c))return false;
 try{document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))}catch{}
 window.__v17AttackSource={champId:String(champId),el};
 document.body.classList.add('attack-mode');
 return true;
}
function validTargetEl(el){
 const guards=provocationMonsters();
 if(guards.length){
  const uid=el?.dataset?.monsterUid;
  return !!uid&&guards.some(m=>String(m.uid)===String(uid));
 }
 if(el?.dataset?.monsterUid)return true;
 return !!el?.dataset?.champId&&Number(el.dataset.owner)===Number(otherP());
}
function targetPayload(el){
 if(el?.dataset?.monsterUid)return{type:'monster',uid:String(el.dataset.monsterUid)};
 if(el?.dataset?.champId)return{type:'champion',player:Number(el.dataset.owner),champId:String(el.dataset.champId)};
 return null;
}
function refresh(){
 const guards=provocationMonsters();
 const guardIds=new Set(guards.map(m=>String(m.uid)));
 document.querySelectorAll('.monster[data-monster-uid]').forEach(el=>{
  const uid=String(el.dataset.monsterUid||'');
  const isGuard=guardIds.has(uid);
  el.classList.toggle('provocazione',isGuard);
  el.classList.toggle('attack-target',guards.length?isGuard:true);
  if(isGuard)el.setAttribute('data-sf-global-provocazione','1');else el.removeAttribute('data-sf-global-provocazione');
 });
 document.querySelectorAll('.champ[data-owner][data-champ-id]').forEach(el=>{
  const enemy=Number(el.dataset.owner)===Number(otherP());
  el.classList.toggle('attack-target',!guards.length&&enemy&&!el.classList.contains('defeated'));
 });
 let note=document.getElementById('sfGlobalProvNote');
 if(guards.length){
  if(!note){note=document.createElement('div');note.id='sfGlobalProvNote';note.style.cssText='position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:10050;background:#261b12;border:1px solid #d39145;color:#ffe0b3;border-radius:999px;padding:8px 14px;font-size:12px;font-weight:900;pointer-events:none';document.body.appendChild(note)}
  note.textContent=`Provocazione: devi attaccare uno dei ${guards.length} Mostri con Provocazione presenti sul campo.`;
 }else note?.remove();
}

// Capture prima di tutti i vecchi handler: sul Divoratore la carta avvia SEMPRE l'attacco;
// solo il pulsante dell'abilità avvia Ritorno delle Anime.
document.addEventListener('click',e=>{
 const ability=e.target.closest?.('.v17-champ-ability');
 if(ability)return;
 const ownChamp=e.target.closest?.(`.champ[data-owner="${session?.player}"][data-champ-id]`);
 if(ownChamp&&String(ownChamp.dataset.champId)==='divoratore_campione'){
  if(beginAttack('divoratore_campione',ownChamp)){
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  }
  return;
 }
 const src=window.__v17AttackSource;
 if(!src)return;
 const target=e.target.closest?.('[data-monster-uid],.champ[data-owner][data-champ-id]');
 if(!target)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 if(!validTargetEl(target)){
  try{showError(provocationMonsters().length?'Finché esiste un Mostro con Provocazione devi attaccare uno di quei Mostri.':'Bersaglio di combattimento non valido.')}catch{}
  return;
 }
 const payload=targetPayload(target);if(!payload)return;
 const champId=src.champId;
 clearAttack();
 move({type:'attack',champId,target:payload});
},true);

document.addEventListener('mousemove',e=>{
 const src=window.__v17AttackSource;if(!src?.el)return;
 const r=src.el.getBoundingClientRect(),l=document.querySelector('#sfAttackLine');
 if(l){l.setAttribute('x1',r.left+r.width/2);l.setAttribute('y1',r.top+r.height/2);l.setAttribute('x2',e.clientX);l.setAttribute('y2',e.clientY);l.setAttribute('opacity','1')}
},true);
window.addEventListener('sf-blue-ready',()=>setTimeout(refresh,0));
window.addEventListener('resize',refresh);
setInterval(refresh,250);
setTimeout(refresh,0);
})();
