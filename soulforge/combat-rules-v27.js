(()=>{
function allProvocationMonsters(){
 const s=session?.state;
 if(!s)return[];
 return (s.board?.monsters||[]).filter(m=>!!s.monsterDefs?.[m.cardId]?.provocazione);
}
function attackAllowedTarget(el){
 const guards=allProvocationMonsters();
 if(guards.length){
  const uid=el?.dataset?.monsterUid;
  return !!uid&&guards.some(m=>String(m.uid)===String(uid));
 }
 if(el?.dataset?.monsterUid)return true;
 if(el?.dataset?.champId)return Number(el.dataset.owner)===Number(otherP());
 return false;
}
function canStartChampionAttack(c){
 try{return typeof canAttack==='function'&&canAttack(c)}catch{return false}
}
function refreshCombatTargets(){
 const guards=allProvocationMonsters();
 document.querySelectorAll('.monster[data-monster-uid]').forEach(el=>{
  const uid=String(el.dataset.monsterUid||'');
  const valid=!guards.length||guards.some(m=>String(m.uid)===uid);
  el.classList.toggle('attack-target',valid);
  const m=(session?.state?.board?.monsters||[]).find(x=>String(x.uid)===uid);
  const prov=!!(m&&session?.state?.monsterDefs?.[m.cardId]?.provocazione);
  el.classList.toggle('provocazione',prov);
 });
 document.querySelectorAll('.champ[data-owner][data-champ-id]').forEach(el=>{
  const enemy=Number(el.dataset.owner)===Number(otherP());
  el.classList.toggle('attack-target',!guards.length&&enemy&&!el.classList.contains('defeated'));
 });
}
function beginAttackFromDivoratore(el){
 const c=playerState(session.player)?.champions?.find(x=>x.id==='divoratore_campione');
 if(!c||!canStartChampionAttack(c))return false;
 try{document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))}catch{}
 window.__v17AttackSource={champId:'divoratore_campione',el};
 document.body.classList.add('attack-mode');
 return true;
}

document.addEventListener('click',e=>{
 const ability=e.target.closest?.('.v17-champ-ability');
 if(ability)return;
 const div=e.target.closest?.(`.champ[data-owner="${session?.player}"][data-champ-id="divoratore_campione"]`);
 if(div){
  if(beginAttackFromDivoratore(div)){
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  }
  return;
 }
 const src=window.__v17AttackSource;
 if(!src)return;
 const target=e.target.closest?.('[data-monster-uid],.champ[data-owner][data-champ-id]');
 if(!target)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 if(!attackAllowedTarget(target)){
  try{showError(allProvocationMonsters().length?'Devi prima attaccare un Mostro con Provocazione.':'Bersaglio di combattimento non valido.')}catch{}
  return;
 }
 const t=target.dataset.monsterUid?{type:'monster',uid:target.dataset.monsterUid}:{type:'champion',player:Number(target.dataset.owner),champId:target.dataset.champId};
 window.__v17AttackSource=null;
 document.body.classList.remove('attack-mode');
 document.querySelector('#sfAttackLine')?.setAttribute('opacity','0');
 move({type:'attack',champId:src.champId,target:t});
},true);

const oldRender=window.render;
if(typeof oldRender==='function'){
 window.render=function(){const out=oldRender.apply(this,arguments);setTimeout(refreshCombatTargets,0);return out};
}
window.addEventListener('sf-blue-ready',()=>setTimeout(refreshCombatTargets,0));
setInterval(refreshCombatTargets,500);
setTimeout(refreshCombatTargets,0);
})();
