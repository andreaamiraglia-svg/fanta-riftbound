(()=>{
let passing=false;

function gameState(){
  try{return session?.state||null}catch{return null}
}
function canPassCombat(){
  const s=gameState();
  return !!(s&&s.status==='main'&&s.combat&&Number(s.priority)===Number(session?.player)&&!(s.stack||[]).length&&!s.pendingChoice);
}
function clearAttackUi(){
  try{window.__v17AttackSource=null}catch{}
  try{window.__sfAttackSource=null}catch{}
  document.body.classList.remove('attack-mode');
  document.querySelector('#sfAttackLine')?.setAttribute('opacity','0');
  document.querySelectorAll('.sf-attack-source,.sf-attack-valid,.sf-attack-hover,.attack-source,.attack-valid,.attack-hover').forEach(el=>{
    el.classList.remove('sf-attack-source','sf-attack-valid','sf-attack-hover','attack-source','attack-valid','attack-hover');
  });
}

// Un solo handler capture per il passaggio di priorità in combattimento.
// Non wrappa render, non usa MutationObserver e non crea timer periodici.
document.addEventListener('click',e=>{
  const btn=e.target.closest?.('#passPriority');
  if(!btn||!canPassCombat())return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  if(passing)return;
  passing=true;
  clearAttackUi();
  btn.disabled=true;
  btn.textContent='Passaggio…';

  Promise.resolve(move({type:'pass_priority'}))
    .catch(err=>{try{showError(err?.message||'Errore nel passaggio di priorità')}catch{}})
    .finally(()=>{passing=false});
},true);

// Rimuove eventuali residui visivi lasciati dalle versioni precedenti.
document.getElementById('sfCombatPriorityHint42')?.remove();
document.getElementById('sfCombatPriorityHint43')?.remove();
})();
