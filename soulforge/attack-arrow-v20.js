(()=>{
let active=null;
let locked=null;
let pointer={x:innerWidth/2,y:innerHeight/2};
let invalidUntil=0;

function ensureUi(){
 let svg=document.querySelector('#sfAttackOverlay');
 if(!svg){
  svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.id='sfAttackOverlay';
  svg.setAttribute('aria-hidden','true');
  svg.innerHTML=`<defs>
   <marker id="sfArrowGold" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M1,1 L11,6 L1,11 Z" fill="#ffd04f"/></marker>
   <marker id="sfArrowRed" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M1,1 L11,6 L1,11 Z" fill="#ff3b3b"/></marker>
  </defs><path class="sf-attack-glow"></path><path class="sf-attack-path"></path>`;
  document.body.appendChild(svg);
 }
 let hint=document.querySelector('#sfAttackHint');
 if(!hint){hint=document.createElement('div');hint.id='sfAttackHint';document.body.appendChild(hint)}
 return {svg,hint,path:svg.querySelector('.sf-attack-path'),glow:svg.querySelector('.sf-attack-glow')};
}
function gameState(){try{return session?.state||null}catch{return null}}
function findChamp(player,id){return [...document.querySelectorAll('.champ[data-owner][data-champ-id]')].find(el=>Number(el.dataset.owner)===Number(player)&&el.dataset.champId===String(id))||null}
function findTarget(t){
 if(!t)return null;
 if(t.type==='monster')return [...document.querySelectorAll('[data-monster-uid]')].find(el=>el.dataset.monsterUid===String(t.uid))||null;
 if(t.type==='champion')return findChamp(t.player,t.champId);
 return null;
}
function validTargets(){return [...document.querySelectorAll('.attack-target')].filter(el=>!el.classList.contains('defeated'))}
function cleanClasses(){document.querySelectorAll('.sf-attack-source,.sf-attack-valid,.sf-attack-hover,.sf-combat-source,.sf-combat-target').forEach(el=>el.classList.remove('sf-attack-source','sf-attack-valid','sf-attack-hover','sf-combat-source','sf-combat-target'))}
function cancelSelection(){
 active=null;locked=null;
 try{window.__v17AttackSource=null}catch{}
 document.body.classList.remove('attack-mode');
 cleanClasses();
 const ui=ensureUi();ui.svg.style.display='none';ui.hint.classList.remove('show','combat');
}
function startSelection(el){
 const p=Number(el.dataset.owner),id=el.dataset.champId;
 if(active&&active.player===p&&active.champId===id){cancelSelection();return}
 active={player:p,champId:id};locked=null;
 document.body.classList.add('attack-mode');
 cleanClasses();el.classList.add('sf-attack-source');
 validTargets().forEach(t=>t.classList.add('sf-attack-valid'));
 const ui=ensureUi();ui.svg.style.display='block';ui.svg.classList.add('selecting');
 ui.hint.textContent='Seleziona un difensore • ESC per annullare';ui.hint.classList.add('show');ui.hint.classList.remove('combat');
}
function center(rect){return{x:rect.left+rect.width/2,y:rect.top+rect.height/2}}
function edgePoint(rect,toward){
 const c=center(rect),dx=toward.x-c.x,dy=toward.y-c.y;
 if(!dx&&!dy)return c;
 const hw=Math.max(1,rect.width/2),hh=Math.max(1,rect.height/2);
 const scale=Math.min(hw/(Math.abs(dx)||.0001),hh/(Math.abs(dy)||.0001));
 const k=Math.max(0,scale*.88);
 return{x:c.x+dx*k,y:c.y+dy*k};
}
function draw(srcEl,targetEl,targetPoint,mode){
 const ui=ensureUi();if(!srcEl||!srcEl.isConnected){ui.svg.style.display='none';return}
 const sr=srcEl.getBoundingClientRect();
 let toward,target;
 if(targetEl&&targetEl.isConnected){const tr=targetEl.getBoundingClientRect();toward=center(tr);target=edgePoint(tr,center(sr));}
 else{toward=targetPoint||pointer;target=toward}
 const source=edgePoint(sr,toward);
 const dx=target.x-source.x,dy=target.y-source.y,dist=Math.max(1,Math.hypot(dx,dy));
 const nx=-dy/dist,ny=dx/dist,bend=Math.min(58,dist*.085);
 const cx=(source.x+target.x)/2+nx*bend,cy=(source.y+target.y)/2+ny*bend;
 const d=`M ${source.x.toFixed(1)} ${source.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${target.x.toFixed(1)} ${target.y.toFixed(1)}`;
 ui.path.setAttribute('d',d);ui.glow.setAttribute('d',d);
 ui.path.setAttribute('marker-end',mode==='select'?'url(#sfArrowGold)':'url(#sfArrowRed)');
 ui.svg.classList.toggle('selecting',mode==='select');ui.svg.style.display='block';
}
function activeSourceEl(){return active?findChamp(active.player,active.champId):null}
function hoveredTarget(){const el=document.elementFromPoint(pointer.x,pointer.y);return el?.closest?.('.attack-target')||null}
function targetLabel(el){return el?.querySelector?.('h3,h4')?.textContent?.trim()||'difensore'}
function sourceLabel(el){return el?.querySelector?.('h3')?.textContent?.trim()||'Campione'}

function renderAttackUi(){
 const ui=ensureUi(),s=gameState(),combat=s?.combat||null;
 cleanClasses();
 if(combat){
  active=null;document.body.classList.remove('attack-mode');
  const src=findChamp(combat.attacker?.player,combat.attacker?.champId),tgt=findTarget(combat.target);
  if(src&&tgt){src.classList.add('sf-combat-source');tgt.classList.add('sf-combat-target');draw(src,tgt,null,'combat');ui.hint.textContent=`${sourceLabel(src)} → ${targetLabel(tgt)}`;ui.hint.classList.add('show','combat');}
  else{ui.svg.style.display='none';ui.hint.classList.remove('show','combat')}
  return;
 }
 if(locked&&Date.now()<locked.until){
  const src=findChamp(locked.player,locked.champId),tgt=findTarget(locked.target);
  if(src&&tgt){src.classList.add('sf-combat-source');tgt.classList.add('sf-combat-target');draw(src,tgt,null,'combat');ui.hint.textContent=`${sourceLabel(src)} → ${targetLabel(tgt)}`;ui.hint.classList.add('show','combat');return}
 }
 locked=null;
 if(active){
  const src=activeSourceEl();if(!src){cancelSelection();return}
  document.body.classList.add('attack-mode');src.classList.add('sf-attack-source');validTargets().forEach(t=>t.classList.add('sf-attack-valid'));
  const hover=hoveredTarget();if(hover){hover.classList.add('sf-attack-hover');draw(src,hover,null,'select')}else draw(src,null,pointer,'select');
  ui.hint.textContent=Date.now()<invalidUntil?'Bersaglio non valido • scegli un difensore consentito':'Seleziona un difensore • ESC per annullare';ui.hint.classList.add('show');ui.hint.classList.remove('combat');
  return;
 }
 ui.svg.style.display='none';ui.hint.classList.remove('show','combat');
}

document.addEventListener('mousemove',e=>{pointer.x=e.clientX;pointer.y=e.clientY},{passive:true});
document.addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY},{passive:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active)cancelSelection()},true);
document.addEventListener('click',e=>{
 const source=e.target.closest?.('.champ.click-attack');
 if(source){startSelection(source);return}
 if(!active)return;
 const valid=e.target.closest?.('.attack-target');
 if(valid){
  const target=valid.dataset.monsterUid?{type:'monster',uid:valid.dataset.monsterUid}:{type:'champion',player:Number(valid.dataset.owner),champId:valid.dataset.champId};
  locked={player:active.player,champId:active.champId,target,until:Date.now()+2200};
  active=null;document.body.classList.remove('attack-mode');return;
 }
 const piece=e.target.closest?.('.champ,.monster');
 if(piece){invalidUntil=Date.now()+1200;return}
 cancelSelection();
},false);

window.addEventListener('blur',()=>{if(active)cancelSelection()});
setInterval(renderAttackUi,40);
ensureUi();
})();
