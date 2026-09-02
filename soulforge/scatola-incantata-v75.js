(()=>{
const ID='scatola_incantata';

function myState(){
  try{return typeof playerState==='function'?playerState(session.player):session?.state?.players?.[String(session.player)]}catch{return null}
}
function handCard(){return myState()?.handCards?.find(c=>String(c?.id)===ID)||null}
function legal(){
  const c=handCard();if(!c)return false;
  try{return typeof canCast==='function'?!!canCast(c):true}catch{return false}
}
function play(){
  if(!legal()){
    try{showError('Non puoi giocare Scatola Incantata in questo momento.')}catch{}
    return;
  }
  try{return move({type:'cast',cardId:ID,targets:{}})}catch(e){try{showError(e?.message||String(e))}catch{}}
}

// Copre anche eventuali chiamate programmatiche a chooseForCard.
const prevChoose=window.chooseForCard;
if(typeof prevChoose==='function'&&!prevChoose.__sfScatola75){
  const wrapped=function(id){
    if(String(id)===ID)return play();
    return prevChoose.apply(this,arguments);
  };
  wrapped.__sfScatola75=true;
  wrapped.__previous=prevChoose;
  window.chooseForCard=wrapped;
  try{chooseForCard=wrapped}catch{}
}

// Questi listener vengono caricati PRIMA di new-set-v70: bloccano il vecchio
// modal "Scegli 2 Mostri" solo per Scatola Incantata.
document.addEventListener('dblclick',e=>{
  const el=e.target instanceof Element?e.target.closest('.hand-card[data-hand-card]'):null;
  if(!el||String(el.dataset.handCard)!==ID)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  play();
},true);

document.addEventListener('drop',e=>{
  const zone=e.target instanceof Element?e.target.closest('#playDropZone'):null;
  if(!zone)return;
  let id='';
  try{id=e.dataTransfer?.getData('application/x-soulforge-card')||e.dataTransfer?.getData('text/plain')||''}catch{}
  if(String(id)!==ID)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  zone.classList.remove('dragover');
  play();
},true);

window.__sfPlayScatola75=play;
})();
