(()=>{
let specchioTargeting=false;
let observer=null;
const PRINTED_COST=id=>Number(session?.state?.cardDefs?.[id]?.cost??99);

function ensureStyle(){
 if(document.getElementById('sfRules49Style'))return;
 const s=document.createElement('style');s.id='sfRules49Style';s.textContent=`
 #modal>.modal{z-index:50000!important;isolation:isolate!important}
 #modal>.modal>.modalbox{position:relative!important;z-index:50001!important}
 #sfTargetV8Arrow,#sfStdTargetArrow{z-index:51000!important}
 #sfTargetV8Hint,#sfStdTargetHint,#sfStdFallback{z-index:52000!important}
 body.sf49-specchio .stack-stage{display:flex!important;flex-direction:column!important;align-items:center!important;gap:8px!important;overflow:visible!important;padding-bottom:12px!important}
 body.sf49-specchio .stack-card{position:relative!important;transform:none!important;margin-top:0!important;pointer-events:auto!important}
 body.sf49-specchio .stack-card.sf49-specchio-valid{z-index:52010!important;outline:3px solid #ffd166!important;outline-offset:3px!important;cursor:crosshair!important;filter:brightness(1.12)!important;box-shadow:0 0 0 4px rgba(255,209,102,.15),0 0 28px rgba(255,209,102,.35)!important}
 body.sf49-specchio .stack-card:not(.sf49-specchio-valid){opacity:.42!important}
 #sf49SpecchioHint{position:fixed;left:50%;top:16px;transform:translateX(-50%);z-index:52020;background:#171b23;border:1px solid #ffd166;color:#fff4cf;border-radius:999px;padding:10px 18px;font-size:12px;font-weight:900;box-shadow:0 8px 30px rgba(0,0,0,.48);pointer-events:none}
 `;document.head.appendChild(s);
}

function printedEligibleStack(){
 const s=session?.state;
 // Specchio può annullare qualsiasi CARTA nella Catena con costo stampato 0 o 1.
 // Gli effetti/trigger non sono carte e restano esclusi.
 return (s?.stack||[]).filter(x=>x?.kind==='card'&&PRINTED_COST(x.cardId)<=1);
}

function fixedCanCast(card){
 const s=session?.state;if(!s||s.status!=='main'||s.pendingChoice)return false;
 const me=playerState(session.player),cost=Number(card.effectiveCost??card.cost??0);
 if(Number(me?.souls?.[card.color]??0)<cost)return false;
 if(card.effect==='taglio'&&!s.combat)return false;
 if(card.effect==='marea'&&!s.combat)return false;

 // Specchio d'Acqua è una risposta speciale alla Catena: non richiede un
 // combattimento. Se hai priorità e c'è almeno una carta dal costo stampato
 // 0 o 1, deve risultare giocabile indipendentemente dal tipo della carta bersaglio.
 if(card.id==='specchio_acqua'){
  if(!(s.stack||[]).length)return false;
  if(Number(s.priority)!==Number(session.player))return false;
  return printedEligibleStack().length>0;
 }

 if((s.stack||[]).length){
  if(Number(s.priority)!==Number(session.player))return false;
  if(s.combat){if(card.speed!=='instant'&&card.speed!=='response')return false;}
  else if(card.speed!=='instant')return false;
 }else if(s.combat){
  if(Number(s.priority)!==Number(session.player))return false;
  if(card.speed!=='instant'&&card.speed!=='response')return false;
 }else if(Number(s.focus)!==Number(session.player))return false;
 if(card.id==='freddo_puro')return (s.board?.monsters||[]).some(m=>Number(m.pow)<=2);
 return true;
}
fixedCanCast.__sf49=true;

function installCanCast(){
 if(window.canCast?.__sf49)return;
 window.canCast=fixedCanCast;
 if(session?.state)try{render()}catch{}
}

function clearSpecchio(){
 specchioTargeting=false;
 document.body.classList.remove('sf49-specchio');
 document.getElementById('sf49SpecchioHint')?.remove();
 document.querySelectorAll('.sf49-specchio-valid').forEach(el=>el.classList.remove('sf49-specchio-valid'));
 document.querySelectorAll('[data-sf49-stack-uid]').forEach(el=>el.removeAttribute('data-sf49-stack-uid'));
}
function syncSpecchio(){
 if(!specchioTargeting)return;
 const valid=printedEligibleStack();
 if(!valid.length){clearSpecchio();try{showError('Non ci sono carte da 0 o 1 Anima da annullare.')}catch{}return;}
 const stack=session?.state?.stack||[],els=[...document.querySelectorAll('.stack-card')];
 document.querySelectorAll('.sf49-specchio-valid').forEach(el=>el.classList.remove('sf49-specchio-valid'));
 els.forEach((el,i)=>{
  const item=stack[i];
  if(valid.some(x=>String(x.uid)===String(item?.uid))){el.classList.add('sf49-specchio-valid');el.dataset.sf49StackUid=String(item.uid)}
  else el.removeAttribute('data-sf49-stack-uid');
 });
 document.body.classList.add('sf49-specchio');
 let h=document.getElementById('sf49SpecchioHint');if(!h){h=document.createElement('div');h.id='sf49SpecchioHint';document.body.appendChild(h)}
 h.textContent='Specchio d’Acqua: scegli una carta in Catena con costo stampato 0 o 1 • ESC per annullare';
}
function beginSpecchio(){
 specchioTargeting=true;
 try{document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))}catch{}
 specchioTargeting=true;
 requestAnimationFrame(syncSpecchio);
}

function installChooser(){
 const current=window.chooseForCard;
 if(typeof current!=='function'||current.__sf49Specchio)return;
 const previous=current;
 const wrapped=function(id){
  const card=playerState(session.player)?.handCards?.find(c=>String(c.id)===String(id));
  if(card?.id==='specchio_acqua'){
   if(!fixedCanCast(card)){try{showError('Specchio d’Acqua non ha una carta valida da annullare oppure non hai priorità.')}catch{}return;}
   beginSpecchio();return;
  }
  return previous(id);
 };
 wrapped.__sf49Specchio=true;
 window.chooseForCard=wrapped;
}

function boot(){ensureStyle();installCanCast();installChooser();if(specchioTargeting)syncSpecchio()}

document.addEventListener('click',e=>{
 if(!specchioTargeting)return;
 const el=e.target.closest?.('.stack-card.sf49-specchio-valid[data-sf49-stack-uid]');
 if(!el)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 const uid=el.dataset.sf49StackUid;clearSpecchio();
 move({type:'cast',cardId:'specchio_acqua',targets:{stackUid:uid}});
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&specchioTargeting){e.preventDefault();clearSpecchio()}},true);

ensureStyle();boot();
window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));
const app=document.getElementById('app');
if(app){observer=new MutationObserver(m=>{if(!m.some(x=>x.addedNodes?.length))return;requestAnimationFrame(()=>{installCanCast();installChooser();if(specchioTargeting)syncSpecchio()})});observer.observe(app,{subtree:true,childList:true})}
setTimeout(boot,200);setTimeout(boot,1000);setTimeout(boot,2600);
})();
