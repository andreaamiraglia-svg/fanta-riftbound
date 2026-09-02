(()=>{
let mode=null;
const previousChoose=window.chooseForCard;

function hardClearAttackMode(){
  document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  document.body.classList.remove('attack-mode');
  const attackLine=document.getElementById('sfAttackLine');
  if(attackLine) attackLine.setAttribute('opacity','0');
}
function clearHighlights(){
  document.querySelectorAll('.sf-sfera-valid').forEach(el=>{
    el.classList.remove('sf-sfera-valid');
    el.style.outline='';
  });
}
function clear(){
  clearHighlights();
  document.getElementById('sfSferaV7Arrow')?.remove();
  document.getElementById('sfSferaV7Hint')?.remove();
  mode=null;
}
function ownChampEls(){
  return [...document.querySelectorAll(`.champ[data-owner="${session.player}"][data-champ-id]`)]
    .filter(el=>!el.classList.contains('defeated'));
}
function enemyEls(){
  const champs=[...document.querySelectorAll(`.champ[data-owner="${otherP()}"][data-champ-id]`)]
    .filter(el=>!el.classList.contains('defeated'));
  const mons=(typeof monsterTargets==='function'?monsterTargets():session.state.board.monsters)
    .map(m=>document.querySelector(`[data-monster-uid="${m.uid}"]`)).filter(Boolean);
  return [...champs,...mons];
}
function center(el){
  if(!el)return null;
  const r=el.getBoundingClientRect();
  return {x:r.left+r.width/2,y:r.top+r.height/2};
}
function layer(){
  let svg=document.getElementById('sfSferaV7Arrow');
  if(!svg){
    svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.id='sfSferaV7Arrow';
    Object.assign(svg.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh',pointerEvents:'none',zIndex:'9997'});
    document.body.appendChild(svg);
  }
  let hint=document.getElementById('sfSferaV7Hint');
  if(!hint){
    hint=document.createElement('div');hint.id='sfSferaV7Hint';
    Object.assign(hint.style,{position:'fixed',top:'50px',left:'50%',transform:'translateX(-50%)',zIndex:'9999',background:'#171b23',border:'1px solid #ffd166',borderRadius:'999px',padding:'10px 18px',fontWeight:'800'});
    document.body.appendChild(hint);
  }
  return {svg,hint};
}
function paint(){
  if(!mode)return;
  clearHighlights();
  const els=mode.step===0?enemyEls():ownChampEls();
  els.forEach(el=>{el.classList.add('sf-sfera-valid');el.style.outline='3px solid #ffd166'});
  mode.valid=els;
  const {hint}=layer();
  hint.textContent=mode.step===0?'Sfera Incandescente: scegli un nemico':'Sfera Incandescente: scegli un tuo Campione';
}
function draw(e){
  if(!mode)return;
  const from=center(mode.source);
  if(!from)return;
  const {svg}=layer();
  let fixed='';
  if(mode.enemyEl){
    const c=center(mode.enemyEl);
    if(c) fixed=`<line x1="${from.x}" y1="${from.y}" x2="${c.x}" y2="${c.y}" stroke="#8ee8ff" stroke-width="4" marker-end="url(#sfSferaFixed)"/>`;
  }
  svg.innerHTML=`<defs><marker id="sfSferaCursor" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ffd166"/></marker><marker id="sfSferaFixed" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#8ee8ff"/></marker></defs>${fixed}<line x1="${from.x}" y1="${from.y}" x2="${e.clientX}" y2="${e.clientY}" stroke="#ffd166" stroke-width="4" marker-end="url(#sfSferaCursor)"/>`;
}

window.chooseForCard=function(id){
  if(id!=='sfera_incandescente') return previousChoose?.(id);
  hardClearAttackMode();
  try{ if(typeof cancelLive==='function') cancelLive(); }catch{}
  const card=playerState(session.player)?.handCards?.find(c=>c.id===id);
  if(!card)return;
  const source=document.querySelector(`[data-hand-card="${id}"]`)||document.querySelector(`[data-card="${id}"]`)||document.getElementById('playDropZone');
  mode={source,step:0,targets:{},enemyEl:null};
  paint();
};

document.addEventListener('mousemove',draw,true);
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&mode){clear();hardClearAttackMode();}
},true);
document.addEventListener('click',e=>{
  if(!mode)return;
  const hit=e.target.closest?.('.sf-sfera-valid');
  if(!hit)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  hardClearAttackMode();
  if(mode.step===0){
    mode.targets.enemy=hit.dataset.monsterUid
      ? {type:'monster',uid:hit.dataset.monsterUid}
      : {type:'champion',player:Number(hit.dataset.owner),champId:hit.dataset.champId};
    mode.enemyEl=hit;
    mode.step=1;
    paint();
    return;
  }
  mode.targets.ownChamp=hit.dataset.champId;
  const targets={...mode.targets};
  clear();
  hardClearAttackMode();
  move({type:'cast',cardId:'sfera_incandescente',targets});
},true);

// Se un render ricrea il DOM mentre stai scegliendo, riaggancia i bersagli senza perdere la scelta.
const oldRender=render;
render=function(){
  oldRender();
  if(mode){
    hardClearAttackMode();
    mode.source=document.querySelector('[data-hand-card="sfera_incandescente"]')||document.getElementById('playDropZone')||mode.source;
    if(mode.enemyEl?.dataset?.monsterUid) mode.enemyEl=document.querySelector(`[data-monster-uid="${mode.enemyEl.dataset.monsterUid}"]`);
    else if(mode.enemyEl?.dataset?.champId) mode.enemyEl=document.querySelector(`.champ[data-owner="${mode.enemyEl.dataset.owner}"][data-champ-id="${mode.enemyEl.dataset.champId}"]`);
    setTimeout(paint,0);
  }
};
})();