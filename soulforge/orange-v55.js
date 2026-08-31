(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={
 kroth:'kroth-il-fulminatore.webp',falco_dell_alba:'falco-dell-alba.webp',frecce_divine:'frecce-divine.webp',golem_d_ambra:'golem-d-ambra.webp',grifone_imperiale:'grifone-imperiale.webp',legionario_troll:'legionario-troll.webp',leone_solare:'leone-solare.webp',loda_il_sole:'loda-il-sole.webp',parry:'parry.webp',perfezione:'perfezione.webp',pugno_in_faccia:'pugno-in-faccia.webp',sciamano_del_sole:'sciamano-del-sole.webp',sciamano_del_sole_support:'sciamano-del-sole.webp',soldato_corrotto:'soldato-corrotto.webp',spacca_teste:'spacca-teste-orange.webp',su_gli_scudi:'su-gli-scudi.webp',alabardo:'alabardo.webp',drago_aureo:'drago-aureo.webp'
};
const ORANGE_IDS=new Set(Object.keys(ART));
const COLORS=['red','green','black','blue','orange'];
const COLOR_LABEL={red:'Rosse',green:'Verdi',black:'Nere',blue:'Blu',orange:'Arancioni'};
let chooserInstalled=false,canInstalled=false,queued=false;

function artUrl(id){return ART[id]?BASE+ART[id]:''}
function installArt(){
 const cur=window.sfArtUrl21;if(cur?.__sfOrange55)return;
 const prev=cur;
 const fn=id=>artUrl(String(id))||(typeof prev==='function'?prev(id):'');
 fn.__sfOrange55=true;fn.__previous=prev;window.sfArtUrl21=fn;
}
function me(){return typeof playerState==='function'?playerState(session.player):null}
function opponent(){return typeof playerState==='function'?playerState(otherP()):null}
function starter(c){return c&&!c.supportChampion&&!c.defeated}
function supports(){return (me()?.champions||[]).filter(c=>c.supportChampion&&!c.defeated)}
function defendingChampion(){
 const c=session?.state?.combat;if(!c||c.target?.type!=='champion'||Number(c.target.player)!==Number(session.player))return null;
 return (me()?.champions||[]).find(x=>String(x.id)===String(c.target.champId)&&starter(x))||null;
}
function legalAttackTargets(){
 const s=session?.state;if(!s)return[];
 const guards=[];
 for(const m of s.board?.monsters||[])if(m.provocazione||s.monsterDefs?.[m.cardId]?.provocazione)guards.push({label:m.name||s.monsterDefs?.[m.cardId]?.name||'Mostro',desc:'Mostro • Provocazione',value:{type:'monster',uid:m.uid}});
 for(const c of opponent()?.champions||[])if(!c.defeated&&c.provocazione)guards.push({label:c.name,desc:(c.supportChampion?'Supporto':'Campione')+' • Provocazione',value:{type:'champion',player:otherP(),champId:c.id}});
 if(guards.length)return guards;
 return [
  ...(opponent()?.champions||[]).filter(c=>!c.defeated).map(c=>({label:c.name,desc:c.supportChampion?'Supporto':'Campione',value:{type:'champion',player:otherP(),champId:c.id}})),
  ...(s.board?.monsters||[]).map(m=>({label:m.name||s.monsterDefs?.[m.cardId]?.name||'Mostro',desc:'Mostro • POW '+m.pow,value:{type:'monster',uid:m.uid}}))
 ];
}
async function selectOrange(card){
 const id=String(card.id),effect=String(card.effect||'');let targets={};
 try{
  if(effect==='frecce_divine'){
   const list=(session.state?.board?.monsters||[]).map(m=>({label:m.name||session.state?.monsterDefs?.[m.cardId]?.name||'Mostro',desc:'POW '+m.pow,value:m.uid}));
   if(!list.length)return showError('Non ci sono Mostri da bersagliare.');
   const v=await pick('Frecce Divine — scegli un Mostro',list);if(!v)return;targets.monsterUid=v;
  }else if(effect==='parry'||effect==='su_gli_scudi'){
   const d=defendingChampion();if(!d)return showError(card.name+' richiede un tuo Campione in difesa.');targets.ownChamp=d.id;
  }else if(effect==='pugno_in_faccia'){
   const ss=supports().filter(c=>!c.tapped);if(!ss.length)return showError('Non hai Supporti disponibili per attaccare.');
   const sid=await pick('Pugno in Faccia — scegli un tuo Supporto',ss.map(c=>({label:c.name,desc:'Supporto • POW '+c.pow,value:c.id})));if(!sid)return;
   const opts=legalAttackTargets();if(!opts.length)return showError('Non ci sono bersagli validi.');
   const target=await pick('Pugno in Faccia — scegli il difensore',opts);if(!target)return;targets={supportId:sid,target};
  }else if(effect==='spacca_teste'){
   const cs=(me()?.champions||[]).filter(starter);if(!cs.length)return showError('Non hai Campioni validi.');
   const v=await pick('Spacca Teste — scegli un tuo Campione',cs.map(c=>({label:c.name,desc:'Campione • POW '+c.pow,value:c.id})));if(!v)return;targets.ownChamp=v;
  }
  await move({type:'cast',cardId:id,targets});
 }catch(e){try{showError(e?.message||String(e))}catch{}}
}
function installChooser(){
 const current=window.chooseForCard;
 if(typeof current!=='function')return;
 if(current.__sfOrange55){chooserInstalled=true;return;}
 const previous=current;
 const wrapped=function(id){
  const card=me()?.handCards?.find(c=>String(c.id)===String(id));
  if(card&&card.color==='orange')return selectOrange(card);
  return previous(id);
 };
 wrapped.__sfOrange55=true;wrapped.__previous=previous;window.chooseForCard=wrapped;chooserInstalled=true;
}
function installCanCast(){
 const current=window.canCast;if(typeof current!=='function')return;
 if(current.__sfOrange55){canInstalled=true;return;}
 const previous=current;
 const wrapped=function(card){
  const ok=previous(card);if(!ok||card?.color!=='orange')return ok;
  if(card.effect==='parry'||card.effect==='su_gli_scudi')return !!defendingChampion();
  if(card.effect==='pugno_in_faccia')return !session.state?.combat&&!session.state?.stack?.length&&supports().some(c=>!c.tapped)&&legalAttackTargets().length>0;
  if(card.effect==='frecce_divine')return (session.state?.board?.monsters||[]).length>0;
  return ok;
 };
 wrapped.__sfOrange55=true;wrapped.__previous=previous;window.canCast=wrapped;canInstalled=true;
}
function installSouls(){
 try{
  soulsHtml=function(pl){
   const soul=pl?.souls||{};
   return '<div class="souls sf-all-souls">'+COLORS.map(c=>'<div class="soul '+c+'" title="Anime '+COLOR_LABEL[c]+'">'+Number(soul[c]||0)+'</div>').join('')+'</div>';
  };
 }catch{}
 try{colorName=function(c){return c==='red'?'Rossa':c==='green'?'Verde':c==='black'?'Nera':c==='blue'?'Blu':'Arancione'}}catch{}
}
function installRecycle(){
 try{
  showRecycle=function(){
   const q=me(),cost=Number(q?.recycleCount||0)+1,s=q?.souls||{};
   const rows=COLORS.map(c=>'<div class="field"><label>Anime '+COLOR_LABEL[c]+'</label><input id="sfPay_'+c+'" type="number" min="0" max="'+Number(s[c]||0)+'" value="0"></div>').join('');
   showModal('Riciclo — costo '+cost,rows+'<div class="tiny">La somma deve essere esattamente '+cost+'.</div><button class="btn primary" id="sfDoRecycle55">Ricicla</button>');
   document.getElementById('sfDoRecycle55').onclick=()=>{const pay={type:'recycle'};for(const c of COLORS)pay[c]=Number(document.getElementById('sfPay_'+c)?.value||0);closeModal();move(pay)};
  };
 }catch{}
}
function supportState(owner,id){return session?.state?.players?.[String(owner)]?.champions?.find(c=>String(c.id)===String(id))}
function decorateSupports(){
 document.querySelectorAll('.champ[data-owner][data-champ-id]').forEach(el=>{
  const c=supportState(Number(el.dataset.owner),el.dataset.champId);el.classList.toggle('sf-support-card',!!c?.supportChampion);
  let badge=el.querySelector('.sf-support-badge');
  if(c?.supportChampion&&!badge){badge=document.createElement('span');badge.className='sf-support-badge';badge.textContent='SUPPORTO';el.appendChild(badge)}
  if(!c?.supportChampion)badge?.remove();
 });
}
function repairImages(){
 for(const id of ORANGE_IDS){const url=artUrl(id);document.querySelectorAll(`[data-hand-card="${CSS.escape(id)}"],[data-preview-card="${CSS.escape(id)}"],[data-select-card="${CSS.escape(id)}"],[data-deck-id="${CSS.escape(id)}"]`).forEach(el=>{let img=el.matches('img')?el:el.querySelector('img');if(img&&img.src!==url)img.src=url})}
}
function injectMissingOrangeSouls(){
 document.querySelectorAll('.playerinfo .souls,.sf-player-zone .souls,.sf-opponent-zone .souls').forEach(box=>{if(box.querySelector('.soul.orange'))return;let owner=null;const zone=box.closest('[data-owner]');if(zone)owner=Number(zone.dataset.owner);if(!owner){const infos=[...document.querySelectorAll('.playerinfo .souls')];const idx=infos.indexOf(box);owner=idx===0?otherP():session.player;}const n=Number(session?.state?.players?.[String(owner)]?.souls?.orange||0);const d=document.createElement('div');d.className='soul orange';d.title='Anime Arancioni';d.textContent=String(n);box.appendChild(d)});
}
function boot(){installArt();installSouls();installRecycle();installChooser();installCanCast();decorateSupports();repairImages();injectMissingOrangeSouls()}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;try{boot()}catch(e){console.error('[orange-v55]',e)}})}

const style=document.createElement('style');style.id='sfOrange55Style';style.textContent=`
:root{--orange:#ff8a00}.soul.orange{background:#8b4300;border-color:#ffb45a!important;color:#fff}.champ.orange,.monster.orange,.card.orange,.deck-pick.orange{border-color:#ff8a00!important}.card.orange .playCard,.deck-pick.orange .deck-check{background:#d96f00!important;color:white!important}.sf-support-card{box-shadow:inset 0 0 0 2px rgba(255,177,74,.28)!important}.sf-support-badge{position:absolute;left:10px;top:10px;z-index:9;padding:4px 7px;border-radius:999px;background:#f0f0f0;color:#181818;font-size:10px;font-weight:950;letter-spacing:.06em}.sf-all-souls{flex-wrap:wrap}
`;
document.head.appendChild(style);
boot();window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));
const roots=[document.getElementById('app'),document.getElementById('modal')].filter(Boolean);roots.forEach(r=>new MutationObserver(schedule).observe(r,{subtree:true,childList:true}));
setTimeout(boot,120);setTimeout(boot,650);setTimeout(boot,1800);setTimeout(boot,3500);
})();
