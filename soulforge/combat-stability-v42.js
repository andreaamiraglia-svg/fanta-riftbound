(()=>{
let lastSig='';

function state(){try{return session?.state||null}catch{return null}}
function clearLegacyAttack(){
 try{window.__v17AttackSource=null}catch{}
 document.body.classList.remove('attack-mode');
 document.querySelector('#sfAttackLine')?.setAttribute('opacity','0');
 document.querySelectorAll('.sf-attack-source,.sf-attack-valid,.sf-attack-hover').forEach(el=>el.classList.remove('sf-attack-source','sf-attack-valid','sf-attack-hover'));
}
function ensureHint(){
 let h=document.getElementById('sfCombatPriorityHint42');
 if(!h){
  h=document.createElement('div');
  h.id='sfCombatPriorityHint42';
  h.style.cssText='position:fixed;left:50%;bottom:54px;transform:translateX(-50%);z-index:10052;display:none;pointer-events:none;background:rgba(20,15,10,.96);border:1px solid #d7a748;color:#ffe7ad;border-radius:999px;padding:8px 14px;font:900 12px/1.2 Georgia,serif;box-shadow:0 8px 28px rgba(0,0,0,.48);white-space:nowrap;max-width:92vw;text-overflow:ellipsis;overflow:hidden';
  document.body.appendChild(h);
 }
 return h;
}
function sync(){
 const s=state(),hint=ensureHint();
 if(!s||s.status!=='main'){
  hint.style.display='none';
  return;
 }
 if(s.combat){
  // Appena il combattimento e' stato dichiarato nessun vecchio sistema di targeting
  // deve restare attivo: in passato poteva intercettare il click su Passa priorita'.
  clearLegacyAttack();
  const mine=Number(s.priority)===Number(session?.player);
  const noStack=!(s.stack||[]).length;
  if(mine&&noStack&&!s.pendingChoice){
   hint.textContent='Combattimento in attesa: passa priorità per continuare o gioca una Risposta/Istantanea.';
   hint.style.display='block';
   const btn=document.getElementById('passPriority');
   if(btn){
    btn.disabled=false;
    btn.style.pointerEvents='auto';
    btn.style.position='relative';
    btn.style.zIndex='10054';
    btn.title='Passa priorità e continua il combattimento';
   }
  }else hint.style.display='none';
 }else{
  hint.style.display='none';
 }
 const sig=[s.turn,s.priority,s.combat?.attacker?.player||'',s.combat?.attacker?.champId||'',s.combat?.target?.uid||s.combat?.target?.champId||'',s.combatPasses||0,(s.stack||[]).length,s.pendingChoice?.type||''].join('|');
 lastSig=sig;
}

// Rende il comando deterministico: un solo handler invia pass_priority.
document.addEventListener('click',e=>{
 const btn=e.target.closest?.('#passPriority');
 if(!btn)return;
 const s=state();
 if(!s||Number(s.priority)!==Number(session?.player))return;
 e.preventDefault();
 e.stopPropagation();
 e.stopImmediatePropagation();
 clearLegacyAttack();
 Promise.resolve(move({type:'pass_priority'})).finally(()=>setTimeout(sync,40));
},true);

// Un Campione gia tappato/non disponibile non deve riaprire un targeting fantasma.
document.addEventListener('click',e=>{
 const champ=e.target.closest?.(`.champ[data-owner="${session?.player}"][data-champ-id]`);
 if(!champ)return;
 const s=state();
 if(s?.combat||s?.priority||s?.pendingChoice){
  clearLegacyAttack();
 }
},true);

const app=document.getElementById('app');
if(app)new MutationObserver(()=>queueMicrotask(sync)).observe(app,{childList:true,subtree:true});
window.addEventListener('sf-blue-ready',()=>setTimeout(sync,0));
window.addEventListener('resize',sync);
setInterval(sync,250);
setTimeout(sync,0);
})();