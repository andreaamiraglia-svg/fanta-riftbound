(()=>{
let passLock=false;
let renderWrapped=false;

function state(){try{return session?.state||null}catch{return null}}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function clearLegacyAttack(){
 try{window.__v17AttackSource=null}catch{}
 try{window.__sfAttackSource=null}catch{}
 document.body.classList.remove('attack-mode');
 document.querySelector('#sfAttackLine')?.setAttribute('opacity','0');
 document.querySelectorAll('.sf-attack-source,.sf-attack-valid,.sf-attack-hover,.attack-source,.attack-valid,.attack-hover').forEach(el=>el.classList.remove('sf-attack-source','sf-attack-valid','sf-attack-hover','attack-source','attack-valid','attack-hover'));
}
function removeOldCombatUi(){
 document.getElementById('sfCombatPriorityHint42')?.remove();
}
function ensureHint(){
 removeOldCombatUi();
 let h=document.getElementById('sfCombatPriorityHint43');
 if(!h){
  h=document.createElement('div');
  h.id='sfCombatPriorityHint43';
  h.style.cssText='position:fixed;left:50%;bottom:54px;transform:translateX(-50%);z-index:10052;display:none;pointer-events:none;background:rgba(20,15,10,.96);border:1px solid #d7a748;color:#ffe7ad;border-radius:999px;padding:8px 14px;font:900 12px/1.2 Georgia,serif;box-shadow:0 8px 28px rgba(0,0,0,.48);white-space:nowrap;max-width:92vw;text-overflow:ellipsis;overflow:hidden';
  document.body.appendChild(h);
 }
 return h;
}
function canPassCombat(){
 const s=state();
 return !!(s&&s.status==='main'&&s.combat&&Number(s.priority)===Number(session?.player)&&!(s.stack||[]).length&&!s.pendingChoice);
}
function passButton(){return document.getElementById('passPriority')}

// Il vecchio client e Set 1 collegavano entrambi click a #passPriority.
// Sostituire il nodo elimina in modo sicuro TUTTI i listener legacy senza toccare
// gli altri controlli del gioco.
function replacePassButton(){
 const old=passButton();
 if(!old)return null;
 if(old.dataset.sfCombat43==='1')return old;
 const btn=old.cloneNode(true);
 btn.dataset.sfCombat43='1';
 btn.disabled=false;
 btn.style.pointerEvents='auto';
 btn.style.position='relative';
 btn.style.zIndex='10054';
 btn.title='Passa priorità e continua il combattimento';
 btn.addEventListener('click',onPass,false);
 old.replaceWith(btn);
 return btn;
}
async function waitForIdle(maxMs=1200){
 const end=Date.now()+maxMs;
 while(typeof busy!=='undefined'&&busy&&Date.now()<end)await sleep(25);
 return !(typeof busy!=='undefined'&&busy);
}
async function directFallback(){
 const j=await post({action:'move',roomCode:session.room,token:session.token,version:session.version,move:{type:'pass_priority'}});
 session.version=j.version;
 session.state=j.state;
 try{render()}catch(err){
  console.error('[combat-v43] render dopo pass_priority fallito',err);
  try{await refresh()}catch{}
 }
}
async function passPriority(){
 if(passLock||!canPassCombat())return;
 passLock=true;
 clearLegacyAttack();
 const beforeVersion=session.version;
 const btn=replacePassButton();
 if(btn){btn.disabled=true;btn.textContent='Passaggio…'}
 try{
  const idle=await waitForIdle();
  if(!idle){
   try{await refresh()}catch{}
  }
  if(!canPassCombat())return;

  // Prima usiamo il percorso ufficiale del gioco. È quello usato da tutte le altre mosse.
  await move({type:'pass_priority'});

  // Se un vecchio flag busy ha fatto ignorare move(), facciamo un solo fallback diretto.
  if(session.version===beforeVersion&&canPassCombat()){
   await directFallback();
  }
 }catch(err){
  console.error('[combat-v43] pass_priority',err);
  try{await refresh()}catch{}
  if(canPassCombat()){
   try{await directFallback()}catch(err2){try{showError(err2?.message||'Errore nel passaggio di priorità')}catch{}}
  }
 }finally{
  passLock=false;
  setTimeout(sync,0);
  setTimeout(sync,80);
 }
}
function onPass(e){
 if(!canPassCombat())return;
 e.preventDefault();
 e.stopPropagation();
 e.stopImmediatePropagation();
 passPriority();
}
function sync(){
 const s=state(),hint=ensureHint();
 if(!s||s.status!=='main'){
  hint.style.display='none';
  return;
 }
 if(s.combat){
  clearLegacyAttack();
  if(canPassCombat()){
   hint.textContent='Combattimento in attesa: passa priorità per continuare o gioca una Risposta/Istantanea.';
   hint.style.display='block';
   const btn=replacePassButton();
   if(btn&&!passLock){btn.disabled=false;if(btn.textContent==='Passaggio…')btn.textContent='Passa priorità'}
  }else hint.style.display='none';
 }else{
  hint.style.display='none';
 }
}
function wrapRender(){
 if(typeof render!=='function'||render.__sfCombat43)return;
 const previous=render;
 const wrapped=function(){
  const out=previous.apply(this,arguments);
  sync();
  return out;
 };
 wrapped.__sfCombat43=true;
 render=wrapped;
 renderWrapped=true;
}
function install(){
 removeOldCombatUi();
 wrapRender();
 sync();
}

// Nessun listener globale su pointerdown/click: il solo listener di passaggio vive
// sul bottone clonato. Questo evita la competizione con targeting, hover e vecchi bind.
const app=document.getElementById('app');
if(app)new MutationObserver(()=>queueMicrotask(sync)).observe(app,{childList:true,subtree:true});
window.addEventListener('sf-blue-ready',()=>setTimeout(()=>{renderWrapped=false;install()},0));
window.addEventListener('resize',sync);
setInterval(()=>{if(typeof render==='function'&&!render.__sfCombat43)wrapRender();sync()},300);
install();
})();