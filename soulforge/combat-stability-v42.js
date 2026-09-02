(()=>{
let sending=false;

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
function canPassCombat(){
 const s=state();
 return !!(s&&s.status==='main'&&s.combat&&Number(s.priority)===Number(session?.player)&&!s.pendingChoice);
}
async function sendDirectMove(movePayload,retry=true){
 try{
  const j=await post({action:'move',roomCode:session.room,token:session.token,version:session.version,move:movePayload});
  session.version=j.version;
  session.state=j.state;
  render();
  return true;
 }catch(e){
  if(e?.message==='STATE_CONFLICT'&&retry){
   try{
    const j=await post({action:'get',roomCode:session.room,token:session.token});
    session.player=j.player;
    session.version=j.version;
    session.state=j.state;
    render();
    if(canPassCombat())return sendDirectMove(movePayload,false);
    return false;
   }catch(err){try{showError(err.message)}catch{};return false}
  }
  try{showError(e.message)}catch{}
  return false;
 }
}
async function passCombatPriority(){
 if(sending||!canPassCombat())return;
 sending=true;
 clearLegacyAttack();
 const btn=document.getElementById('passPriority');
 if(btn){btn.disabled=true;btn.textContent='Passaggio…'}
 try{
  await sendDirectMove({type:'pass_priority'});
 }finally{
  sending=false;
  setTimeout(sync,30);
 }
}
function sync(){
 const s=state(),hint=ensureHint();
 if(!s||s.status!=='main'){
  hint.style.display='none';
  return;
 }
 if(s.combat){
  clearLegacyAttack();
  const mine=Number(s.priority)===Number(session?.player);
  const noStack=!(s.stack||[]).length;
  if(mine&&noStack&&!s.pendingChoice){
   hint.textContent='Combattimento in attesa: passa priorità per continuare o gioca una Risposta/Istantanea.';
   hint.style.display='block';
   const btn=document.getElementById('passPriority');
   if(btn){
    btn.disabled=!!sending;
    btn.style.pointerEvents='auto';
    btn.style.position='relative';
    btn.style.zIndex='10054';
    btn.title='Passa priorità e continua il combattimento';
   }
  }else hint.style.display='none';
 }else hint.style.display='none';
}

// Pointerdown viene usato apposta: scatta prima dei vecchi handler click che in alcuni
// casi lasciavano il combattimento bloccato. La richiesta viene inviata direttamente
// al server, senza dipendere dal flag globale `busy` del vecchio client.
document.addEventListener('pointerdown',e=>{
 const btn=e.target.closest?.('#passPriority');
 if(!btn||!canPassCombat())return;
 e.preventDefault();
 e.stopPropagation();
 e.stopImmediatePropagation();
 passCombatPriority();
},true);

// Blocca comunque tutti i vecchi click sul pulsante. Serve anche per attivazione da tastiera.
document.addEventListener('click',e=>{
 const btn=e.target.closest?.('#passPriority');
 if(!btn||!canPassCombat())return;
 e.preventDefault();
 e.stopPropagation();
 e.stopImmediatePropagation();
 passCombatPriority();
},true);

// Un Campione già tappato/non disponibile non deve riaprire un targeting fantasma.
document.addEventListener('click',e=>{
 const champ=e.target.closest?.(`.champ[data-owner="${session?.player}"][data-champ-id]`);
 if(!champ)return;
 const s=state();
 if(s?.combat||s?.priority||s?.pendingChoice)clearLegacyAttack();
},true);

const app=document.getElementById('app');
if(app)new MutationObserver(()=>queueMicrotask(sync)).observe(app,{childList:true,subtree:true});
window.addEventListener('sf-blue-ready',()=>setTimeout(sync,0));
window.addEventListener('resize',sync);
setInterval(sync,200);
setTimeout(sync,0);
})();