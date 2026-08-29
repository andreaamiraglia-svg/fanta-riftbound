(()=>{
let queued=false;
function bindHandHover(){
 document.querySelectorAll('.hand-card').forEach(el=>{
  if(el.dataset.sfV30Hover)return;
  el.dataset.sfV30Hover='1';
  const base=el.style.transform||'';
  el.dataset.sfV30Base=base;
  el.addEventListener('mouseenter',()=>{
   const b=el.dataset.sfV30Base||base;
   el.style.setProperty('transform',`${b} translateY(-22px) scale(1.06)`,'important');
  });
  el.addEventListener('mouseleave',()=>{
   el.style.removeProperty('transform');
   el.style.transform=el.dataset.sfV30Base||base;
  });
 });
}
function decorateReferenceBoard(){
 queued=false;
 const grid=document.querySelector('.game-grid');
 if(!grid)return;
 const monsterLane=grid.querySelector('.monsters');
 if(monsterLane){
  monsterLane.querySelectorAll('.sf-empty-monster-slot').forEach(x=>x.remove());
  const monsters=monsterLane.querySelectorAll(':scope > .monster').length;
  const targetSlots=6;
  for(let i=monsters;i<targetSlots;i++){
   const slot=document.createElement('div');
   slot.className='sf-empty-monster-slot';
   slot.setAttribute('aria-hidden','true');
   monsterLane.appendChild(slot);
  }
 }
 const chain=document.querySelector('.chain-lane');
 if(chain&&!chain.querySelector('.sf-chain-crest')){
  const crest=document.createElement('div');crest.className='sf-chain-crest';crest.textContent='✦';chain.prepend(crest);
 }
 const log=document.querySelector('.game-grid>.side .panel');
 if(log&&!log.querySelector('.sf-log-crest')){
  const crest=document.createElement('div');crest.className='sf-log-crest';crest.textContent='✦';log.prepend(crest);
 }
 bindHandHover();
}
function queue(){if(queued)return;queued=true;requestAnimationFrame(decorateReferenceBoard)}
const app=document.querySelector('#app');
if(app)new MutationObserver(queue).observe(app,{childList:true,subtree:true});
window.addEventListener('sf-blue-ready',queue);
window.addEventListener('resize',queue);
setInterval(queue,1500);
queue();
})();
