(()=>{
let scheduled=false;
let shownCoinId='';

function gameState(){
  try{return typeof session!=='undefined'?session?.state:null}catch{return null}
}
function getPlayer(p){
  try{return typeof playerState==='function'?playerState(p):gameState()?.players?.[String(p)]}catch{return null}
}
function opponentId(){
  try{return typeof otherP==='function'?otherP():(session.player===1?2:1)}catch{return 2}
}
function escText(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function decorateOpponentHand(){
  const s=gameState();
  if(!s)return;
  const op=getPlayer(opponentId());
  if(!op)return;
  const zone=document.querySelector('.sf-opponent-zone')||document.querySelector('.game-grid main > .playerzone:first-child');
  const info=zone?.querySelector('.playerinfo');
  if(!info)return;
  let badge=info.querySelector('.sf-opponent-hand-count');
  if(!badge){
    badge=document.createElement('div');
    badge.className='sf-opponent-hand-count';
    const name=info.querySelector(':scope > b');
    if(name)name.insertAdjacentElement('afterend',badge);else info.prepend(badge);
  }
  const count=Math.max(0,Number(op.handCount??op.hand?.length??0));
  badge.innerHTML='<span class="sf-hand-stack-icon" aria-hidden="true"><i></i><i></i><i></i></span><span class="sf-hand-count-label">MANO</span><strong>'+count+'</strong>';
  badge.title='Carte nella mano avversaria: '+count;
}

function closeCoin(){
  const el=document.getElementById('sfCoinTossOverlay');
  if(el)el.remove();
}
function coinStorageKey(id){
  let room='';
  try{room=String(session?.room||'')}catch{}
  return 'sf-coin-toss:'+room+':'+String(id||'');
}
function alreadyShown(id){
  try{return sessionStorage.getItem(coinStorageKey(id))==='1'}catch{return false}
}
function markShown(id){
  try{sessionStorage.setItem(coinStorageKey(id),'1')}catch{}
}
function showCoinIfNeeded(){
  const s=gameState();
  const toss=s?.coinToss;
  if(!toss?.id)return;
  const id=String(toss.id);
  if(shownCoinId===id||alreadyShown(id))return;
  shownCoinId=id;
  closeCoin();
  const p1=getPlayer(1),p2=getPlayer(2),winner=getPlayer(Number(toss.winner));
  const result=String(toss.result||'').toLowerCase()==='croce'?'CROCE':'TESTA';
  const overlay=document.createElement('div');
  overlay.id='sfCoinTossOverlay';
  overlay.className='sf-coin-overlay';
  overlay.innerHTML=`<div class="sf-coin-panel" role="dialog" aria-modal="true" aria-label="Lancio della moneta">
    <div class="sf-coin-kicker">INIZIO PARTITA</div>
    <h2>Lancio della moneta</h2>
    <div class="sf-coin-scene"><div class="sf-coin" aria-hidden="true"><div class="sf-coin-face sf-coin-heads">I</div><div class="sf-coin-face sf-coin-tails">II</div></div></div>
    <div class="sf-coin-assign"><span>TESTA = ${escText(p1?.name||'Giocatore 1')}</span><span>CROCE = ${escText(p2?.name||'Giocatore 2')}</span></div>
    <div class="sf-coin-result" aria-live="polite">La moneta gira...</div>
    <button type="button" class="sf-coin-continue" disabled>Continua</button>
  </div>`;
  document.body.appendChild(overlay);
  const coin=overlay.querySelector('.sf-coin');
  const resultEl=overlay.querySelector('.sf-coin-result');
  const btn=overlay.querySelector('.sf-coin-continue');
  requestAnimationFrame(()=>overlay.classList.add('is-visible'));
  setTimeout(()=>{
    coin?.classList.add(result==='CROCE'?'show-tails':'show-heads');
    if(resultEl)resultEl.innerHTML=`È uscita <b>${result}</b><span>${escText(winner?.name||'Il vincitore')} inizia per primo.</span>`;
    if(btn)btn.disabled=false;
    overlay.classList.add('is-revealed');
  },1450);
  btn?.addEventListener('click',()=>{markShown(id);closeCoin()});
  overlay.addEventListener('keydown',e=>{if(e.key==='Escape'&&!btn?.disabled){markShown(id);closeCoin()}});
}

function sync(){
  scheduled=false;
  decorateOpponentHand();
  showCoinIfNeeded();
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(sync)}
const app=document.getElementById('app');
if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});
window.addEventListener('sf-blue-ready',schedule);
setInterval(schedule,900);
schedule();
})();
