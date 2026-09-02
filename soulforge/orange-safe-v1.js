(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={
 kroth:'kroth-il-fulminatore.webp',
 falco_dell_alba:'falco-dell-alba.webp',
 frecce_divine:'frecce-divine.webp',
 golem_d_ambra:'golem-d-ambra.webp',
 grifone_imperiale:'grifone-imperiale.webp',
 legionario_troll:'legionario-troll.webp',
 leone_solare:'leone-solare.webp',
 loda_il_sole:'loda-il-sole.webp',
 parry:'parry.webp',
 perfezione:'perfezione.webp',
 pugno_in_faccia:'pugno-in-faccia.webp',
 sciamano_del_sole:'sciamano-del-sole.webp',
 sciamano_del_sole_support:'sciamano-del-sole.webp',
 soldato_corrotto:'soldato-corrotto.webp',
 su_gli_scudi:'su-gli-scudi.webp',
 drago_aureo:'drago-aureo.webp'
};
const COLORS=['red','green','black','blue','orange'];
const LABEL={red:'Rosse',green:'Verdi',black:'Nere',blue:'Blu',orange:'Arancioni'};
let queued=false;

const artUrl=id=>ART[String(id)]?BASE+ART[String(id)]:'';
const me=()=>typeof playerState==='function'?playerState(session.player):session?.state?.players?.[String(session.player)];
const op=()=>typeof playerState==='function'?playerState(otherP()):session?.state?.players?.[String(otherP())];
const isStarter=c=>c&&!c.supportChampion&&!c.defeated;
const deckColorsOf=p=>{
 const raw=Array.isArray(p?.deckColors)&&p.deckColors.length?p.deckColors:(p?.champions||[]).filter(c=>!c.supportChampion).map(c=>c?.color);
 return [...new Set(raw.map(String))].filter(c=>COLORS.includes(c));
};

function installArtResolver(){
 const current=window.sfArtUrl21;
 if(current?.__sfOrangeSafeV1)return;
 const previous=current;
 const wrapped=id=>artUrl(id)||(typeof previous==='function'?previous(id):'');
 wrapped.__sfOrangeSafeV1=true;
 wrapped.__previous=previous;
 window.sfArtUrl21=wrapped;
}

function installSoulRenderer(){
 const current=window.soulsHtml;
 if(typeof current!=='function'||current.__sfOrangeSafeV1)return;
 const previous=current;
 const wrapped=function(p){
  const colors=deckColorsOf(p);
  if(!colors.includes('orange'))return previous(p);
  const soul=p?.souls||{};
  return `<div class="souls">${colors.map(c=>`<div class="soul ${c}" title="Anime ${LABEL[c]}">${Number(soul[c]||0)}</div>`).join('')}</div>`;
 };
 wrapped.__sfOrangeSafeV1=true;
 wrapped.__previous=previous;
 window.soulsHtml=wrapped;
 try{soulsHtml=wrapped}catch{}
}

function installColorName(){
 const current=window.colorName;
 if(typeof current!=='function'||current.__sfOrangeSafeV1)return;
 const previous=current;
 const wrapped=c=>String(c)==='orange'?'Arancione':previous(c);
 wrapped.__sfOrangeSafeV1=true;
 wrapped.__previous=previous;
 window.colorName=wrapped;
 try{colorName=wrapped}catch{}
}

function installRecycle(){
 const current=window.showRecycle;
 if(typeof current!=='function'||current.__sfOrangeSafeV1)return;
 const previous=current;
 const wrapped=function(){
  const q=me(),colors=deckColorsOf(q);
  if(!colors.includes('orange'))return previous();
  const cost=Number(q?.recycleCount||0)+1,s=q?.souls||{};
  const rows=colors.map(c=>`<div class="field"><label>Anime ${LABEL[c]}</label><input id="sfOrangePay_${c}" type="number" min="0" max="${Number(s[c]||0)}" value="0"></div>`).join('');
  showModal(`Riciclo — costo ${cost}`,rows+`<div class="tiny">La somma deve essere esattamente ${cost}.</div><button class="btn primary" id="sfOrangeRecycle">Ricicla</button>`);
  const b=document.getElementById('sfOrangeRecycle');
  if(!b)return;
  b.onclick=()=>{
   const pay={type:'recycle',red:0,green:0,black:0,blue:0,orange:0};
   for(const c of colors)pay[c]=Number(document.getElementById(`sfOrangePay_${c}`)?.value||0);
   closeModal();
   move(pay);
  };
 };
 wrapped.__sfOrangeSafeV1=true;
 wrapped.__previous=previous;
 window.showRecycle=wrapped;
 try{showRecycle=wrapped}catch{}
}

function defendingStarter(){
 const c=session?.state?.combat;
 if(!c||c.target?.type!=='champion'||Number(c.target.player)!==Number(session.player))return null;
 return (me()?.champions||[]).find(x=>String(x.id)===String(c.target.champId)&&isStarter(x))||null;
}
function ownStarters(){return (me()?.champions||[]).filter(isStarter)}
function ownSupports(){return (me()?.champions||[]).filter(c=>c.supportChampion&&!c.defeated)}
function monsterTargetsSafe(){return session?.state?.board?.monsters||[]}
function legalAttackTargets(){
 const s=session?.state;if(!s)return[];
 const enemy=typeof otherP==='function'?otherP():(session.player===1?2:1);
 const guards=[];
 for(const m of s.board?.monsters||[]){
  const prov=!!(m.provocazione||s.monsterDefs?.[m.cardId]?.provocazione);
  if(Number(m.owner)===Number(enemy)&&prov)guards.push({label:m.name||s.monsterDefs?.[m.cardId]?.name||'Mostro',desc:'Mostro • Provocazione',value:{type:'monster',uid:m.uid}});
 }
 for(const c of op()?.champions||[])if(!c.defeated&&c.provocazione)guards.push({label:c.name,desc:`${c.supportChampion?'Supporto':'Campione'} • Provocazione`,value:{type:'champion',player:enemy,champId:c.id}});
 if(guards.length)return guards;
 return [
  ...(op()?.champions||[]).filter(c=>!c.defeated).map(c=>({label:c.name,desc:c.supportChampion?'Supporto':'Campione',value:{type:'champion',player:enemy,champId:c.id}})),
  ...(s.board?.monsters||[]).map(m=>({label:m.name||s.monsterDefs?.[m.cardId]?.name||'Mostro',desc:`Mostro • POW ${m.pow}`,value:{type:'monster',uid:m.uid}}))
 ];
}

async function chooseOrange(card){
 let targets={};
 try{
  switch(card.id){
   case 'frecce_divine':{
    const list=monsterTargetsSafe().map(m=>({label:m.name||session.state?.monsterDefs?.[m.cardId]?.name||'Mostro',desc:`POW ${m.pow}`,value:m.uid}));
    if(!list.length)return showError('Non ci sono Mostri da bersagliare.');
    const id=await pick('Frecce Divine — scegli un Mostro',list);if(!id)return;targets.monsterUid=id;break;
   }
   case 'parry':
   case 'su_gli_scudi':{
    const d=defendingStarter();if(!d)return showError(`${card.name} richiede un tuo Campione in difesa.`);targets.ownChamp=d.id;break;
   }
   case 'pugno_in_faccia':{
    const ss=ownSupports().filter(c=>!c.tapped);
    if(!ss.length)return showError('Non hai Supporti disponibili per attaccare.');
    const supportId=await pick('Pugno in Faccia — scegli un tuo Supporto',ss.map(c=>({label:c.name,desc:`Supporto • POW ${c.pow}`,value:c.id})));if(!supportId)return;
    const opts=legalAttackTargets();if(!opts.length)return showError('Non ci sono bersagli validi.');
    const target=await pick('Pugno in Faccia — scegli il bersaglio',opts);if(!target)return;
    targets={supportId,target};break;
   }
   case 'spacca_teste':{
    const cs=ownStarters();if(!cs.length)return showError('Non hai Campioni validi.');
    const id=await pick('Spacca Teste — scegli un tuo Campione',cs.map(c=>({label:c.name,desc:`Campione • POW ${c.pow}`,value:c.id})));if(!id)return;targets.ownChamp=id;break;
   }
  }
  await move({type:'cast',cardId:card.id,targets});
 }catch(e){showError(e?.message||String(e))}
}

function installChooser(){
 const current=window.chooseForCard;
 if(typeof current!=='function'||current.__sfOrangeSafeV1)return;
 const previous=current;
 const wrapped=function(id){
  const card=me()?.handCards?.find(c=>String(c.id)===String(id));
  if(card?.color==='orange')return chooseOrange(card);
  return previous(id);
 };
 wrapped.__sfOrangeSafeV1=true;
 wrapped.__previous=previous;
 window.chooseForCard=wrapped;
 try{chooseForCard=wrapped}catch{}
}

function elementId(el){return el?.dataset?.handCard||el?.dataset?.previewCard||el?.dataset?.selectCard||el?.dataset?.card||''}
function ensureImage(el,id){
 const src=artUrl(id);if(!src||!el)return;
 let img=el.matches?.('img')?el:el.querySelector?.('img');
 if(!img){
  img=document.createElement('img');img.alt=String(id);img.loading='lazy';
  if(el.classList?.contains('champ'))img.className='champ-art';
  else if(el.classList?.contains('monster'))img.className='monster-art';
  el.prepend(img);
 }
 if(img.getAttribute('src')!==src)img.setAttribute('src',src);
}
function repairImages(root=document){
 root.querySelectorAll?.('[data-hand-card],[data-preview-card],[data-select-card],[data-card]').forEach(el=>{
  const id=elementId(el);if(ART[id])ensureImage(el,id);
 });
}

function boot(){
 installArtResolver();
 installSoulRenderer();
 installColorName();
 installRecycle();
 installChooser();
 repairImages();
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;try{boot()}catch(e){console.error('[orange-safe-v1]',e)}})}

if(!document.getElementById('sfOrangeSafeStyle')){
 const s=document.createElement('style');s.id='sfOrangeSafeStyle';
 s.textContent=`.soul.orange{background:#8a4a00;border-color:#ffad4a!important}.champ.orange,.monster.orange,.card.orange{border-color:#cf7800!important}.deck-library-color.orange{border-color:#cf7800!important;color:#ffc16b!important}`;
 document.head.appendChild(s);
}
boot();
window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));
for(const root of [document.getElementById('app'),document.getElementById('modal')].filter(Boolean))new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
setTimeout(boot,150);setTimeout(boot,700);setTimeout(boot,1800);
})();
