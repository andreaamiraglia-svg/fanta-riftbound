(()=>{
/* v65 — definitive generic cast path for cards that do not choose a target.
   Targeted cards continue through the existing targeting modules unchanged. */
const TARGET_EFFECTS=new Set([
  // Rosso / Verde
  'corazza','mano','occhio','berserk','katana','albero','mille','marea',
  'stupido','taglio_ninjitsu','sguardo','fendente','sfera','riflesso',
  // Nero
  'evocatore_anime_vacue','anima_esplosiva','sacrificio','collasso','spacca_ossa',
  'eclipse_fang','fino_alla_morte','ammazza_morte',
  // Blu
  'flusso_gelido','freddo_puro','in_guardia','ali_protettore','staffa_mare',
  'specchio_acqua','custode_deboli','distruzione_totale',
  // Nuove carte
  'colpo_in_testa','fabbro_ninjitsu',
  // Arancione
  'frecce_divine','parry','su_gli_scudi','pugno_in_faccia','spacca_teste'
]);
const TARGET_IDS=new Set([
  'colpo_in_testa','fabbro_ninjitsu','frecce_divine','parry','su_gli_scudi',
  'pugno_in_faccia','spacca_teste'
]);
function me(){
  try{return typeof playerState==='function'?playerState(session.player):session?.state?.players?.[String(session.player)]}catch{return null}
}
function cardById(id){return me()?.handCards?.find(c=>String(c?.id)===String(id))||null}
function needsTarget(card){
  if(!card)return false;
  return TARGET_IDS.has(String(card.id))||TARGET_EFFECTS.has(String(card.effect||''));
}
function install(){
  const current=window.chooseForCard;
  if(typeof current!=='function'||current.__sfNoTargetCastV65)return;
  const previous=current;
  const wrapped=function(id){
    const card=cardById(id);
    if(!card)return previous(id);
    if(needsTarget(card))return previous(id);
    /* No-target cards must always reach the generic cast path. Do not send them
       through the historical chooser chain, where a wrapper may swallow them. */
    try{
      if(typeof canCast==='function'&&!canCast(card))return;
    }catch{}
    return Promise.resolve(move({type:'cast',cardId:String(card.id),targets:{}}))
      .catch(e=>{try{showError(e?.message||String(e))}catch{}});
  };
  wrapped.__sfNoTargetCastV65=true;
  wrapped.__previous=previous;
  window.chooseForCard=wrapped;
  try{chooseForCard=wrapped}catch{}
}
install();
window.addEventListener('sf-blue-ready',()=>setTimeout(install,0));
setTimeout(install,120);
setTimeout(install,700);
setTimeout(install,1800);
})();
