(()=>{
let casting=false;
let renderQueued=false;

function nubeCard(){
 try{return playerState(session.player)?.handCards?.find(c=>String(c?.id)==='nube_di_fuoco')||null}catch{return null}
}
function nubeCost(card){
 const s=session?.state;
 if(card?.effectiveCost!=null)return Math.max(0,Number(card.effectiveCost)||0);
 const ragni=(s?.board?.monsters||[]).filter(m=>m?.cardId==='ragno_dei_germogli').length;
 return Math.max(0,Number(card?.cost||0)+ragni);
}
function nubePlayable(card=nubeCard()){
 try{
  const s=session?.state,me=playerState(session.player);
  if(!card||!s||s.status!=='main'||s.pendingChoice)return false;
  // Nube di Fuoco è una Magia Base: si gioca solo con il Focus e a Catena/combattimento vuoti.
  if(Number(s.focus)!==Number(session.player))return false;
  if(s.priority!=null||(s.stack||[]).length||s.combat)return false;
  return Number(me?.souls?.red||0)>=nubeCost(card);
 }catch{return false}
}
function castNube(){
 const card=nubeCard();
 if(casting)return;
 if(!nubePlayable(card)){
  try{showError('Nube di Fuoco richiede il Focus, nessuna Catena o combattimento in corso e Anime Rosse sufficienti.')}catch{}
  return;
 }
 casting=true;
 try{
  const r=move({type:'cast',cardId:'nube_di_fuoco',targets:{}});
  if(r&&typeof r.finally==='function')r.finally(()=>{casting=false});
  else setTimeout(()=>{casting=false},300);
 }catch(e){
  casting=false;
  try{showError(e?.message||'Errore giocando Nube di Fuoco.')}catch{}
 }
}

function installCanCast(){
 const current=window.canCast;
 if(typeof current!=='function'||current.__sf52Nube)return false;
 const previous=current;
 const wrapped=function(card){
  if(String(card?.id)==='nube_di_fuoco')return nubePlayable(card);
  return previous.apply(this,arguments);
 };
 wrapped.__sf52Nube=true;
 // Mantiene i marker dei fix caricati prima, così i loro installer non ci sovrascrivono.
 if(previous.__sf49)wrapped.__sf49=true;
 window.canCast=wrapped;
 return true;
}
function installChooser(){
 const current=window.chooseForCard;
 if(typeof current!=='function'||current.__sf52Nube)return false;
 const previous=current;
 const wrapped=function(id){
  if(String(id)==='nube_di_fuoco'){castNube();return;}
  return previous.apply(this,arguments);
 };
 wrapped.__sf52Nube=true;
 if(previous.__sf49Specchio)wrapped.__sf49Specchio=true;
 if(previous.__sf51Taglio)wrapped.__sf51Taglio=true;
 window.chooseForCard=wrapped;
 return true;
}
function repairHand(){
 const el=document.querySelector('[data-hand-card="nube_di_fuoco"]');
 if(!el)return;
 const ok=nubePlayable();
 el.classList.toggle('disabled',!ok);
 el.setAttribute('draggable',ok?'true':'false');
}
function queueRender(){
 if(renderQueued||!session?.state)return;
 renderQueued=true;
 requestAnimationFrame(()=>{
  renderQueued=false;
  try{render();}catch{}
  setTimeout(repairHand,0);
 });
}
function boot(){
 const changed=installCanCast();
 installChooser();
 if(changed)queueRender();else repairHand();
}

document.addEventListener('drop',e=>{
 const zone=e.target?.closest?.('#playDropZone');
 if(!zone)return;
 const id=e.dataTransfer?.getData('text/plain');
 if(String(id)!=='nube_di_fuoco')return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 zone.classList.remove('dragover');
 castNube();
},true);

document.addEventListener('dblclick',e=>{
 const el=e.target?.closest?.('[data-hand-card="nube_di_fuoco"]');
 if(!el)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 castNube();
},true);

const app=document.getElementById('app');
if(app)new MutationObserver(m=>{
 if(!m.some(x=>x.addedNodes?.length))return;
 requestAnimationFrame(repairHand);
}).observe(app,{subtree:true,childList:true});

boot();
window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));
setTimeout(boot,200);setTimeout(boot,1000);setTimeout(boot,2800);
})();
