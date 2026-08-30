(()=>{
let casting=false;

function cardInHand(){
 try{return playerState(session.player)?.handCards?.find(c=>c?.id==='taglio_fiammante')||null}catch{return null}
}
function allowed(card){
 try{return !!card&&typeof canCast==='function'&&canCast(card)}catch{return false}
}
function castTaglio(){
 const card=cardInHand();
 if(casting)return;
 if(!allowed(card)){
  try{showError('Taglio Fiammante può essere giocato solo durante un combattimento quando hai priorità.')}catch{}
  return;
 }
 casting=true;
 try{
  const r=move({type:'cast',cardId:'taglio_fiammante',targets:{}});
  if(r&&typeof r.finally==='function')r.finally(()=>{casting=false});
  else setTimeout(()=>{casting=false},250);
 }catch(e){
  casting=false;
  try{showError(e?.message||'Errore giocando Taglio Fiammante.')}catch{}
 }
}

function installChooser(){
 const current=window.chooseForCard;
 if(typeof current!=='function'||current.__sf51Taglio)return;
 const previous=current;
 const wrapped=function(id){
  if(String(id)==='taglio_fiammante'){castTaglio();return;}
  return previous.apply(this,arguments);
 };
 wrapped.__sf51Taglio=true;
 window.chooseForCard=wrapped;
}

// Intercetta esplicitamente il drop sulla Catena: evita che vecchi wrapper asincroni
// di chooseForCard impediscano il cast di Taglio Fiammante.
document.addEventListener('drop',e=>{
 const zone=e.target?.closest?.('#playDropZone');
 if(!zone)return;
 const id=e.dataTransfer?.getData('text/plain');
 if(String(id)!=='taglio_fiammante')return;
 e.preventDefault();
 e.stopPropagation();
 e.stopImmediatePropagation();
 zone.classList.remove('dragover');
 castTaglio();
},true);

document.addEventListener('dblclick',e=>{
 const el=e.target?.closest?.('[data-hand-card="taglio_fiammante"]');
 if(!el||el.classList.contains('disabled'))return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 castTaglio();
},true);

installChooser();
window.addEventListener('sf-blue-ready',()=>setTimeout(installChooser,0));
setTimeout(installChooser,200);
setTimeout(installChooser,1000);
setTimeout(installChooser,2600);
})();
