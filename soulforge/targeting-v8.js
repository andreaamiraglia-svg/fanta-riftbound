(()=>{
let tgt=null;
const TARGET_STEPS={
  corazza:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],
  mano:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],
  occhio:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],
  berserk:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],
  katana:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],
  albero:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],
  mille:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],
  marea:[{kind:'combatOwnChamp',key:'ownChamp',label:'Scegli il tuo Campione nel combattimento'}],
  stupido:[{kind:'monster',key:'monsterUid',label:'Scegli un Mostro'}],
  taglio_ninjitsu:[{kind:'monster',key:'monsterUid',label:'Scegli un Mostro'}],
  sguardo:[{kind:'monster',key:'monsterUid',label:'Scegli un Mostro'}],
  fendente:[{kind:'enemy',key:'enemy',label:'Scegli il bersaglio'}],
  sfera:[{kind:'enemy',key:'enemy',label:'Sfera Incandescente: scegli un nemico'},{kind:'ownChamp',key:'ownChamp',label:'Sfera Incandescente: scegli un tuo Campione'}],
  riflesso:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'},{kind:'monster',key:'monsterUid',label:'Scegli il Mostro'}],

  // Nero
  evocatore_anime_vacue:[{kind:'graveMonsterWeak',key:'graveMonsterId',label:'Scegli un Mostro con 2 POW o meno dal tuo Cimitero'}],
  anima_esplosiva:[{kind:'monster',key:'monsterUid',label:'Scegli un Mostro'}],
  sacrificio:[{kind:'ownMonster',key:'monsterUid',label:'Scegli un Mostro sotto il tuo controllo'}],
  collasso:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],
  spacca_ossa:[{kind:'monster',key:'monsterUid',label:'Scegli un Mostro'}],
  eclipse_fang:[{kind:'enemy',key:'enemy',label:'Scegli un nemico'}],
  fino_alla_morte:[{kind:'ownChamp',key:'ownChamp',label:'Scegli un tuo Campione'}],
  ammazza_morte:[{kind:'anyChampObj',key:'champion',label:'Scegli un Campione'}],

  // Blu
  flusso_gelido:[{kind:'monster',key:'monsterUid',label:'Scegli un Mostro'}],
  freddo_puro:[{kind:'weakMonster',key:'monsterUid',label:'Scegli un Mostro con 2 POW o meno'}],
  in_guardia:[{kind:'character',key:'character',label:'Scegli un Personaggio'}],
  ali_protettore:[{kind:'monster',key:'monsterUid',label:'Scegli un Mostro'}],
  staffa_mare:[{kind:'enemy',key:'enemy',label:'Scegli un nemico'}],
  specchio_acqua:[{kind:'stackSpell',key:'stackUid',label:'Scegli una Magia in Catena che costa 1 Anima o meno'}],
  custode_deboli:[{kind:'enemy',key:'enemy',label:'Scegli un nemico'}],
  distruzione_totale:[{kind:'anyChampObj',key:'champion',label:'Scegli un Campione'}]
};

function injectStyle(){
 if(document.getElementById('sfTargetV8Style'))return;
 const s=document.createElement('style');s.id='sfTargetV8Style';s.textContent=`
 .sf-v8-valid{outline:3px solid #ffd166!important;outline-offset:2px!important;cursor:crosshair!important;filter:brightness(1.08)}
 #sfTargetV8Hint{position:fixed;top:50px;left:50%;transform:translateX(-50%);z-index:10001;background:#171b23;border:1px solid #ffd166;border-radius:999px;padding:10px 18px;font-weight:900;box-shadow:0 8px 30px rgba(0,0,0,.35)}
 #sfTargetV8Arrow{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:10000}
 `;document.head.appendChild(s);
}
function hardCancelAttack(){
 try{document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))}catch{}
 document.body.classList.remove('attack-mode');
 const l=document.querySelector('#sfAttackLine');if(l)l.setAttribute('opacity','0');
}
function clearMarks(){document.querySelectorAll('.sf-v8-valid').forEach(x=>x.classList.remove('sf-v8-valid'))}
function clearUI(){clearMarks();document.getElementById('sfTargetV8Hint')?.remove();document.getElementById('sfTargetV8Arrow')?.remove()}
function cancel(closeOpened=true){
 const opened=!!tgt?.openedModal;
 clearUI();tgt=null;
 if(opened&&closeOpened){try{closeModal()}catch{}}
}
function ensureLayer(){
 injectStyle();
 let svg=document.getElementById('sfTargetV8Arrow');if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='sfTargetV8Arrow';document.body.appendChild(svg)}
 let h=document.getElementById('sfTargetV8Hint');if(!h){h=document.createElement('div');h.id='sfTargetV8Hint';document.body.appendChild(h)}
 return{svg,h};
}
function sourceEl(){if(!tgt)return null;return document.querySelector(`[data-hand-card="${tgt.cardId}"]`)||document.querySelector(`[data-card="${tgt.cardId}"]`)||document.getElementById('playDropZone')}
function center(el){if(!el)return null;const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
function ownChampEls(){return [...document.querySelectorAll(`.champ[data-owner="${session.player}"][data-champ-id]`)].filter(x=>!x.classList.contains('defeated'))}
function allChampEls(){return [...document.querySelectorAll('.champ[data-owner][data-champ-id]')].filter(x=>!x.classList.contains('defeated'))}
function monsterEls(){
 const arr=typeof monsterTargets==='function'?monsterTargets():(session.state?.board?.monsters||[]);
 return arr.map(m=>document.querySelector(`[data-monster-uid="${m.uid}"]`)).filter(Boolean)
}
function ownMonsterEls(){
 return (session.state?.board?.monsters||[]).filter(m=>Number(m.owner)===Number(session.player)).map(m=>document.querySelector(`[data-monster-uid="${m.uid}"]`)).filter(Boolean)
}
function weakMonsterEls(){
 return (session.state?.board?.monsters||[]).filter(m=>Number(m.pow)<=2).map(m=>document.querySelector(`[data-monster-uid="${m.uid}"]`)).filter(Boolean)
}
function enemyEls(){
 const champs=[...document.querySelectorAll(`.champ[data-owner="${otherP()}"][data-champ-id]`)].filter(x=>!x.classList.contains('defeated'));
 return [...champs,...monsterEls()]
}
function characterEls(){return [...allChampEls(),...monsterEls()]}
function combatOwnChampEls(){
 const c=session.state?.combat;if(!c)return[];
 return ownChampEls().filter(el=>{const id=el.dataset.champId;return(c.attacker?.player===session.player&&c.attacker?.champId===id)||(c.target?.type==='champion'&&c.target?.player===session.player&&c.target?.champId===id)})
}
function stackSpellEls(){
 const els=[...document.querySelectorAll('.stack-card')],stack=session.state?.stack||[],out=[];
 els.forEach((el,i)=>{const x=stack[i],d=x?.kind==='card'?session.state?.cardDefs?.[x.cardId]:null;const cost=Number(x?.paidCost??d?.cost??99);if(x?.kind==='card'&&d?.type==='Magia'&&cost<=1&&x.uid){el.dataset.sfStackUid=x.uid;out.push(el)}});
 return out
}
function graveWeakEls(){
 const ids=new Set((playerState(session.player)?.monsterGraveCards||[]).filter(m=>Number(m.pow)<=2).map(m=>m.id));
 return [...document.querySelectorAll('.sf-grave-card[data-preview-card]')].filter(el=>ids.has(el.dataset.previewCard))
}
function validEls(step){
 if(!step)return[];
 if(step.kind==='ownChamp')return ownChampEls();
 if(step.kind==='anyChampObj')return allChampEls();
 if(step.kind==='monster')return monsterEls();
 if(step.kind==='ownMonster')return ownMonsterEls();
 if(step.kind==='weakMonster')return weakMonsterEls();
 if(step.kind==='enemy')return enemyEls();
 if(step.kind==='character')return characterEls();
 if(step.kind==='combatOwnChamp')return combatOwnChampEls();
 if(step.kind==='stackSpell')return stackSpellEls();
 if(step.kind==='graveMonsterWeak')return graveWeakEls();
 return[]
}
function descriptor(step,el){
 if(step.kind==='ownChamp'||step.kind==='combatOwnChamp')return el.dataset.champId;
 if(step.kind==='anyChampObj')return {type:'champion',player:Number(el.dataset.owner),champId:el.dataset.champId};
 if(step.kind==='monster'||step.kind==='ownMonster'||step.kind==='weakMonster')return el.dataset.monsterUid;
 if(step.kind==='enemy'||step.kind==='character')return el.dataset.monsterUid?{type:'monster',uid:el.dataset.monsterUid}:{type:'champion',player:Number(el.dataset.owner),champId:el.dataset.champId};
 if(step.kind==='stackSpell')return el.dataset.sfStackUid;
 if(step.kind==='graveMonsterWeak')return el.dataset.previewCard;
 return null
}
function descriptorEl(step,val){
 if(step.kind==='ownChamp'||step.kind==='combatOwnChamp')return document.querySelector(`.champ[data-owner="${session.player}"][data-champ-id="${val}"]`);
 if(step.kind==='anyChampObj')return document.querySelector(`.champ[data-owner="${val?.player}"][data-champ-id="${val?.champId}"]`);
 if(step.kind==='monster'||step.kind==='ownMonster'||step.kind==='weakMonster')return document.querySelector(`[data-monster-uid="${val}"]`);
 if(step.kind==='enemy'||step.kind==='character'){if(val?.type==='monster')return document.querySelector(`[data-monster-uid="${val.uid}"]`);return document.querySelector(`.champ[data-owner="${val?.player}"][data-champ-id="${val?.champId}"]`)}
 if(step.kind==='stackSpell')return document.querySelector(`[data-sf-stack-uid="${val}"]`);
 if(step.kind==='graveMonsterWeak')return document.querySelector(`.sf-grave-card[data-preview-card="${val}"]`);
 return null
}
function maybeOpenStep(step){
 if(!tgt||step?.kind!=='graveMonsterWeak')return;
 if(graveWeakEls().length)return;
 const btn=document.querySelector(`.sf-grave-btn[data-owner="${session.player}"][data-kind="monsters"]`);
 if(btn){tgt.openedModal=true;btn.click();setTimeout(()=>{if(tgt){refreshUI();draw()}},40)}
}
function refreshUI(){
 if(!tgt)return;clearMarks();const step=tgt.steps[tgt.index];const els=validEls(step);els.forEach(x=>x.classList.add('sf-v8-valid'));tgt.valid=els;
 const{h}=ensureLayer();h.textContent=step.label+(els.length?'':' — nessun bersaglio valido')+'  •  ESC per annullare';
 if(!els.length)maybeOpenStep(step);
}
function draw(mx,my){
 if(!tgt)return;const{svg}=ensureLayer();const a=center(sourceEl());if(!a){svg.innerHTML='';return}
 let fixed='';for(const ch of tgt.chosen){const el=descriptorEl(ch.step,ch.value),b=center(el);if(b)fixed+=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#8ee8ff" stroke-width="4" stroke-linecap="round" marker-end="url(#sfv8fixed)"/>`}
 const cursor=(mx!=null&&my!=null)?`<line x1="${a.x}" y1="${a.y}" x2="${mx}" y2="${my}" stroke="#ffd166" stroke-width="4" stroke-linecap="round" marker-end="url(#sfv8cursor)"/>`:'';
 svg.innerHTML=`<defs><marker id="sfv8cursor" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ffd166"/></marker><marker id="sfv8fixed" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#8ee8ff"/></marker></defs>${fixed}${cursor}`;
}
function clickedTarget(e){
 const champ=e.target.closest?.('.champ[data-owner][data-champ-id]');if(champ)return champ;
 const mon=e.target.closest?.('[data-monster-uid]');if(mon)return mon;
 const stack=e.target.closest?.('.stack-card[data-sf-stack-uid]');if(stack)return stack;
 const grave=e.target.closest?.('.sf-grave-card[data-preview-card]');if(grave)return grave;
 return null
}
function isCurrentlyValid(el){return !!tgt?.valid?.some(x=>x===el)}

function installChooser(){
 const current=window.chooseForCard;
 if(current?.__sfTargetV8)return;
 const previousChoose=current;
 const wrapped=function(id){
  const card=playerState(session.player)?.handCards?.find(c=>c.id===id);
  if(!card)return;
  const steps=TARGET_STEPS[card.effect];
  if(!steps?.length){cancel();hardCancelAttack();return previousChoose?.(id)}
  hardCancelAttack();cancel();
  tgt={cardId:id,effect:card.effect,steps,index:0,targets:{},chosen:[],valid:[],openedModal:false};
  refreshUI();draw();
 };
 wrapped.__sfTargetV8=true;
 window.chooseForCard=wrapped;
}
installChooser();
window.addEventListener('sf-blue-ready',()=>setTimeout(installChooser,0));
setTimeout(installChooser,150);
setTimeout(installChooser,800);
setTimeout(installChooser,2500);

document.addEventListener('mousemove',e=>{if(tgt)draw(e.clientX,e.clientY)},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&tgt){e.preventDefault();cancel()}},true);
document.addEventListener('click',e=>{
 if(!tgt)return;
 const el=clickedTarget(e);if(!el||!isCurrentlyValid(el))return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 const step=tgt.steps[tgt.index],value=descriptor(step,el);if(value==null)return;
 tgt.targets[step.key]=value;tgt.chosen.push({step,value});tgt.index++;
 if(tgt.index>=tgt.steps.length){const cardId=tgt.cardId,targets={...tgt.targets},opened=!!tgt.openedModal;cancel(false);hardCancelAttack();if(opened){try{closeModal()}catch{}}move({type:'cast',cardId,targets});return}
 refreshUI();draw();
},true);

const prevRender=render;
render=function(){prevRender();if(tgt){setTimeout(()=>{const stillInHand=playerState(session.player)?.handCards?.some(c=>c.id===tgt?.cardId);if(!stillInHand){cancel();return}refreshUI();draw()},25)}};
setTimeout(()=>{injectStyle();if(tgt)refreshUI()},20);
})();