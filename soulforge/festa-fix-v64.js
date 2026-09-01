(()=>{
function me(){return typeof playerState==='function'?playerState(session.player):session?.state?.players?.[String(session.player)]}
function install(){
 const current=window.chooseForCard;
 if(typeof current!=='function'||current.__sfFestaFixV64)return;
 const previous=current;
 const wrapped=function(id){
  const card=me()?.handCards?.find(c=>String(c.id)===String(id));
  if(card&&(String(card.id)==='tutto_per_la_festa'||String(card.effect)==='festa')){
   return Promise.resolve(move({type:'cast',cardId:String(card.id),targets:{}})).catch(e=>{try{showError(e?.message||String(e))}catch{}});
  }
  return previous(id);
 };
 wrapped.__sfFestaFixV64=true;
 wrapped.__previous=previous;
 window.chooseForCard=wrapped;
 try{chooseForCard=wrapped}catch{}
}
install();
window.addEventListener('sf-blue-ready',()=>setTimeout(install,0));
setTimeout(install,120);setTimeout(install,700);setTimeout(install,1800);
})();
