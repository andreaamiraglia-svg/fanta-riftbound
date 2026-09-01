(()=>{
let dragId=null;
let deferredRender=false;
let lastPlay={id:'',at:0};

function myState(){
  try{return typeof playerState==='function'?playerState(session.player):session?.state?.players?.[String(session.player)]}catch{return null}
}
function handCard(id){
  return myState()?.handCards?.find(c=>String(c?.id)===String(id))||null;
}
function isLegal(card){
  if(!card)return false;
  try{return typeof canCast==='function'?!!canCast(card):true}catch{return false}
}
function showIllegal(){
  try{showError('Non puoi giocare questa carta in questo momento.')}catch{}
}

function restoreHandVisual(){
  const fan=document.querySelector('.hand-fan');
  fan?.classList.remove('sf-hand-dragging','sf-hand-active');
  document.body.classList.remove('sf-v69-dragging');
  document.querySelectorAll('.hand-card').forEach(el=>{
    el.classList.remove('dragging','sf-hand-drag-source','sf-hand-focus','sf-hand-near');
    const base=el.dataset.sfBaseTransform;
    if(base!=null&&base!=='')el.style.setProperty('transform',base,'important');
    el.style.removeProperty('z-index');
    el.style.removeProperty('opacity');
    el.style.removeProperty('filter');
  });
}

function normalize(root=document){
  root.querySelectorAll?.('.hand-card[data-hand-card]').forEach(el=>{
    const id=String(el.dataset.handCard||'');
    const card=handCard(id);
    const legal=isLegal(card);

    /* The card element is always the native drag source. Old DOM0 handlers are
       removed so there is only one input path for drag/drop and double click. */
    el.draggable=true;
    el.setAttribute('draggable','true');
    el.ondblclick=null;
    el.ondragstart=null;
    el.ondragend=null;
    el.removeAttribute('ondblclick');
    el.removeAttribute('ondragstart');
    el.removeAttribute('ondragend');
    el.classList.toggle('disabled',!legal);
    el.setAttribute('aria-disabled',legal?'false':'true');
    el.dataset.sfInputV69='1';

    el.querySelectorAll('img').forEach(img=>{
      img.draggable=false;
      img.setAttribute('draggable','false');
    });
  });
}

function flushDeferredRender(){
  if(!deferredRender)return;
  deferredRender=false;
  try{window.render?.()}catch{}
}
function finishDrag(){
  dragId=null;
  restoreHandVisual();
  requestAnimationFrame(()=>{
    restoreHandVisual();
    normalize();
    flushDeferredRender();
  });
}

function activate(id){
  id=String(id||'');
  const card=handCard(id);
  if(!card)return;
  if(!isLegal(card)){showIllegal();normalize();return;}

  const now=Date.now();
  if(lastPlay.id===id&&now-lastPlay.at<280)return;
  lastPlay={id,at:now};

  const chooser=window.chooseForCard;
  if(typeof chooser!=='function'){
    try{showError('Interazione carta non disponibile. Ricarica la pagina.')}catch{}
    return;
  }
  try{
    const out=chooser(id);
    Promise.resolve(out).catch(e=>{try{showError(e?.message||String(e))}catch{}});
  }catch(e){try{showError(e?.message||String(e))}catch{}}
}

/* Single delegated double-click path. */
document.addEventListener('dblclick',e=>{
  const el=e.target instanceof Element?e.target.closest('.hand-card[data-hand-card]'):null;
  if(!el)return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  activate(el.dataset.handCard);
},true);

/* Native drag is kept because it works consistently with mouse input, but the
   source survives polling: render() is deferred for the duration of the drag. */
document.addEventListener('dragstart',e=>{
  const el=e.target instanceof Element?e.target.closest('.hand-card[data-hand-card]'):null;
  if(!el)return;
  const id=String(el.dataset.handCard||'');
  const card=handCard(id);
  if(!isLegal(card)){
    e.preventDefault();
    showIllegal();
    normalize();
    return;
  }
  dragId=id;
  document.body.classList.add('sf-v69-dragging');
  el.classList.add('dragging','sf-hand-drag-source');
  try{
    e.dataTransfer.effectAllowed='move';
    e.dataTransfer.setData('text/plain',id);
    e.dataTransfer.setData('application/x-soulforge-card',id);
  }catch{}
},true);

document.addEventListener('dragover',e=>{
  const zone=e.target instanceof Element?e.target.closest('#playDropZone'):null;
  if(!zone||!dragId)return;
  e.preventDefault();
  try{e.dataTransfer.dropEffect='move'}catch{}
  zone.classList.add('dragover');
},true);

document.addEventListener('dragleave',e=>{
  const zone=e.target instanceof Element?e.target.closest('#playDropZone'):null;
  if(zone&&!zone.contains(e.relatedTarget))zone.classList.remove('dragover');
},true);

document.addEventListener('drop',e=>{
  const zone=e.target instanceof Element?e.target.closest('#playDropZone'):null;
  if(!zone)return;
  const id=dragId||(()=>{try{return e.dataTransfer.getData('application/x-soulforge-card')||e.dataTransfer.getData('text/plain')}catch{return''}})();
  if(!id)return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  zone.classList.remove('dragover');
  dragId=null;
  restoreHandVisual();
  activate(id);
  requestAnimationFrame(()=>{normalize();flushDeferredRender()});
},true);

document.addEventListener('dragend',()=>{if(dragId)finishDrag()},true);
document.addEventListener('keyup',e=>{if(e.key==='Escape'&&dragId)finishDrag()},true);
window.addEventListener('blur',()=>{if(dragId)finishDrag()});

/* Polling used to replace the whole hand every ~900 ms even while the browser
   was dragging a card. That destroys the drag source and causes the visible
   flash/stuck-card bug. Defer only those renders until dragend/drop. */
const previousRender=window.render;
if(typeof previousRender==='function'&&!previousRender.__sfHandInputV69){
  const wrapped=function(){
    if(dragId){deferredRender=true;return;}
    const out=previousRender.apply(this,arguments);
    requestAnimationFrame(()=>normalize());
    return out;
  };
  wrapped.__sfHandInputV69=true;
  window.render=wrapped;
  try{render=wrapped}catch{}
}

if(!document.getElementById('sfHandInputV69Style')){
  const s=document.createElement('style');
  s.id='sfHandInputV69Style';
  s.textContent=`
    body.sf-v69-dragging .hand-card{transition:none!important}
    body.sf-v69-dragging .hand-card:not(.sf-hand-drag-source){filter:none!important}
    #playDropZone.dragover{outline:3px solid rgba(255,209,102,.9)!important;outline-offset:-3px!important}
  `;
  document.head.appendChild(s);
}

normalize();
const app=document.getElementById('app');
if(app){
  let queued=false;
  new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;normalize(app)});
  }).observe(app,{childList:true,subtree:true});
}
window.addEventListener('sf-blue-ready',()=>requestAnimationFrame(()=>normalize()));
setTimeout(()=>normalize(),250);
setTimeout(()=>normalize(),1200);
})();
