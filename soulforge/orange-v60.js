(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={
 kroth:'kroth-il-fulminatore.webp',falco_dell_alba:'falco-dell-alba.webp',frecce_divine:'frecce-divine.webp',golem_d_ambra:'golem-d-ambra.webp',grifone_imperiale:'grifone-imperiale.webp',legionario_troll:'legionario-troll.webp',leone_solare:'leone-solare.webp',loda_il_sole:'loda-il-sole.webp',parry:'parry.webp',perfezione:'perfezione.webp',pugno_in_faccia:'pugno-in-faccia.webp',sciamano_del_sole:'sciamano-del-sole.webp',sciamano_del_sole_support:'sciamano-del-sole.webp',soldato_corrotto:'soldato-corrotto.webp',spacca_teste:'spacca-teste-orange.webp',su_gli_scudi:'su-gli-scudi.webp',alabardo:'alabardo.webp',drago_aureo:'drago-aureo.webp'
};
const COLORS=['red','green','black','blue','orange'];
const LABEL={red:'Rosse',green:'Verdi',black:'Nere',blue:'Blu',orange:'Arancioni'};
let queued=false;

function artUrl(id){return ART[String(id)]?BASE+ART[String(id)]:''}
function installArt(){
 const cur=window.sfArtUrl21;if(cur?.__sfOrange60)return;
 const prev=cur;
 const fn=id=>artUrl(id)||(typeof prev==='function'?prev(id):'');
 fn.__sfOrange60=true;fn.__previous=prev;window.sfArtUrl21=fn;
}
function me(){return typeof playerState==='function'?playerState(session.player):session?.state?.players?.[String(session.player)]}
function opponent(){return typeof playerState==='function'?playerState(otherP()):session?.state?.players?.[String(otherP())]}
function starter(c){return c&&!c.supportChampion&&!c.defeated}
function supports(){return (me()?.champions||[]).filter(c=>c.supportChampion&&!c.defeated)}
function deckColorsOf(p){
 const raw=Array.isArray(p?.deckColors)&&p.deckColors.length?p.deckColors:(p?.champions||[]).filter(c=>!c.supportChampion).map(c=>c?.color);
 return [...new Set(raw.map(String))].filter(c=>COLORS.includes(c));
}
function installSouls(){
 soulsHtml=function(p){
  const colors=deckColorsOf(p),s=p?.souls||{};
  return `<div class="souls">${colors.map(c=>`<div class="soul ${c}" title="Anime ${LABEL[c]}">${Number(s[c]||0)}</div>`).join('')}</div>`;
 };
 try{colorName=function(c){return c==='red'?'Rossa':c==='green'?'Verde':c==='black'?'Nera':c==='blue'?'Blu':'Arancione'}}catch{}
}
function installRecycle(){
 showRecycle=function(){
  const q=me(),cost=Number(q?.recycleCount||0)+1,s=q?.souls||{},colors=deckColorsOf(q);
  const rows=colors.map(c=>`<div class="field"><label>Anime ${LABEL[c]}</label><input id="sfPay60_${c}" type="number" min="0" max="${Number(s[c]||0)}" value="0"></div>`).join('');
  showModal(`Riciclo — costo ${cost}`,rows+`<div class="tiny">La somma deve essere esattamente ${cost}.</div><button class="btn primary" id="sfDoRecycle60">Ricicla</button>`);
  const b=document.getElementById('sfDoRecycle60');if(!b)return;
  b.onclick=()=>{const pay={type:'recycle',red:0,green:0,black:0,blue:0,orange:0};for(const c of colors)pay[c]=Number(document.getElementById(`sfPay60_${c}`)?.value||0);closeModal();move(pay)};
 };
}
function defendingChampion(){
 const c=session?.state?.combat;if(!c||c.target?.type!=='champion'||Number(c.target.player)!==Number(session.player))return null;
 return (me()?.champions||[]).find(x=>String(x.id)===String(c.target.champId)&&starter(x))||null;
}
function legalAttackTargets(){
 const s=session?.state;if(!s)return[];const guards=[];
 for(const m of s.board?.monsters||[])if(m.provocazione||s.monsterDefs?.[m.cardId]?.provocazione)guards.push({label:m.name||s.monsterDefs?.[m.cardId]?.name||'Mostro',desc:'Mostro • Provocazione',value:{type:'monster',uid:m.uid}});
 for(const c of opponent()?.champions||[])if(!c.defeated&&c.provocazione)guards.push({label:c.name,desc:(c.supportChampion?'Supporto':'Campione')+' • Provocazione',value:{type:'champion',player:otherP(),champId:c.id}});
 if(guards.length)return guards;
 return [...(opponent()?.champions||[]).filter(c=>!c.defeated).map(c=>({label:c.name,desc:c.supportChampion?'Supporto':'Campione',value:{type:'champion',player:otherP(),champId:c.id}})),...(s.board?.monsters||[]).map(m=>({label:m.name||s.monsterDefs?.[m.cardId]?.name||'Mostro',desc:'Mostro • POW '+m.pow,value:{type:'monster',uid:m.uid}}))];
}
async function selectOrange(card){
 const id=String(card.id),effect=String(card.effect||'');let targets={};
 try{
  if(effect==='frecce_divine'){
   const list=(session.state?.board?.monsters||[]).map(m=>({label:m.name||session.state?.monsterDefs?.[m.cardId]?.name||'Mostro',desc:'POW '+m.pow,value:m.uid}));
   if(!list.length)return showError('Non ci sono Mostri da bersagliare.');const v=await pick('Frecce Divine — scegli un Mostro',list);if(!v)return;targets.monsterUid=v;
  }else if(effect==='parry'||effect==='su_gli_scudi'){
   const d=defendingChampion();if(!d)return showError(card.name+' richiede un tuo Campione in difesa.');targets.ownChamp=d.id;
  }else if(effect==='pugno_in_faccia'){
   const ss=supports().filter(c=>!c.tapped);if(!ss.length)return showError('Non hai Supporti disponibili per attaccare.');
   const sid=await pick('Pugno in Faccia — scegli un tuo Supporto',ss.map(c=>({label:c.name,desc:'Supporto • POW '+c.pow,value:c.id})));if(!sid)return;
   const opts=legalAttackTargets();if(!opts.length)return showError('Non ci sono bersagli validi.');const target=await pick('Pugno in Faccia — scegli il difensore',opts);if(!target)return;targets={supportId:sid,target};
  }else if(effect==='spacca_teste'){
   const cs=(me()?.champions||[]).filter(starter);if(!cs.length)return showError('Non hai Campioni validi.');const v=await pick('Spacca Teste — scegli un tuo Campione',cs.map(c=>({label:c.name,desc:'Campione • POW '+c.pow,value:c.id})));if(!v)return;targets.ownChamp=v;
  }
  await move({type:'cast',cardId:id,targets});
 }catch(e){showError(e?.message||String(e))}
}
function installChooser(){
 const current=window.chooseForCard;if(typeof current!=='function'||current.__sfOrange60)return;
 const previous=current;
 const wrapped=function(id){const card=me()?.handCards?.find(c=>String(c.id)===String(id));if(card?.color==='orange')return selectOrange(card);return previous(id)};
 wrapped.__sfOrange60=true;wrapped.__previous=previous;window.chooseForCard=wrapped;
}
function installCanCast(){
 const current=window.canCast;if(typeof current!=='function'||current.__sfOrange60)return;
 const previous=current;
 const wrapped=function(card){const ok=previous(card);if(!ok||card?.color!=='orange')return ok;if(card.effect==='parry'||card.effect==='su_gli_scudi')return !!defendingChampion();if(card.effect==='pugno_in_faccia')return !session.state?.combat&&!session.state?.stack?.length&&supports().some(c=>!c.tapped)&&legalAttackTargets().length>0;if(card.effect==='frecce_divine')return (session.state?.board?.monsters||[]).length>0;return ok};
 wrapped.__sfOrange60=true;wrapped.__previous=previous;window.canCast=wrapped;
}
function idOf(el){return el?.dataset?.handCard||el?.dataset?.previewCard||el?.dataset?.selectCard||el?.dataset?.deckId||el?.dataset?.card||''}
function ensureImage(el,id){
 const u=artUrl(id);if(!u||!el)return;
 let img=el.matches?.('img')?el:el.querySelector?.('img');
 if(!img){img=document.createElement('img');img.loading='lazy';img.alt=String(id);if(el.classList?.contains('champ'))img.className='champ-art';else if(el.classList?.contains('monster'))img.className='monster-art';el.prepend(img)}
 if(img.src!==u)img.src=u;
}
function repairImages(root=document){
 root.querySelectorAll?.('[data-hand-card],[data-preview-card],[data-select-card],[data-deck-id],[data-card]').forEach(el=>{const id=idOf(el);if(ART[id])ensureImage(el,id)});
}
function supportState(owner,id){return session?.state?.players?.[String(owner)]?.champions?.find(c=>String(c.id)===String(id))}
function decorateSupports(){
 document.querySelectorAll('.champ[data-owner][data-champ-id]').forEach(el=>{const c=supportState(Number(el.dataset.owner),el.dataset.champId);el.classList.toggle('sf-support-card',!!c?.supportChampion);let badge=el.querySelector('.sf-support-badge');if(c?.supportChampion&&!badge){badge=document.createElement('span');badge.className='sf-support-badge';badge.textContent='SUPPORTO';el.appendChild(badge)}if(!c?.supportChampion)badge?.remove()});
}
function boot(){installArt();installSouls();installRecycle();installChooser();installCanCast();repairImages();decorateSupports()}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;try{boot()}catch(e){console.error('[orange-v60]',e)}})}

if(!document.getElementById('sfOrange60Style')){const st=document.createElement('style');st.id='sfOrange60Style';st.textContent=`
:root{--orange:#ff8a00}.soul.orange{background:radial-gradient(circle at 35% 30%,#ffd28a 0,#c66900 40%,#663100 100%)!important;border-color:#ffb45a!important;color:#fff!important;box-shadow:0 0 12px #ff8a0077!important}.champ.orange,.monster.orange,.card.orange,.deck-pick.orange{border-color:#ff8a00!important}.sf-support-card{box-shadow:inset 0 0 0 2px rgba(255,177,74,.32)!important}.sf-support-badge{position:absolute;left:10px;top:10px;z-index:9;padding:4px 7px;border-radius:999px;background:#eee;color:#161616;font-size:10px;font-weight:950;letter-spacing:.06em}.champ.orange>.champ-art,.monster.orange>.monster-art,.hand-card>img,.stack-card>img{display:block;width:100%;height:100%;object-fit:cover}
`;document.head.appendChild(st)}
boot();window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));const roots=[document.getElementById('app'),document.getElementById('modal')].filter(Boolean);roots.forEach(r=>new MutationObserver(schedule).observe(r,{subtree:true,childList:true}));setTimeout(boot,100);setTimeout(boot,500);setTimeout(boot,1400);setTimeout(boot,3000);
})();
