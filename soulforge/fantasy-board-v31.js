(()=>{
let queued=false;
function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d}
function stat(type,label,value){return `<div class="sf-card-stat sf-card-stat--${type}"><span class="sf-card-stat-label">${label}</span><span class="sf-card-stat-value">${value}</span></div>`}
function championState(owner,id){
 try{return playerState(Number(owner))?.champions?.find(c=>String(c.id)===String(id))||null}catch{return null}
}
function monsterState(uid){
 try{return session?.state?.board?.monsters?.find(m=>String(m.uid)===String(uid))||null}catch{return null}
}
function championStats(c){
 const hp=n(c.hp),w=n(c.wounds),curHp=Math.max(0,hp-w),pow=n(c.pow),damage=n(c.damage),armor=n(c.armor);
 let html=stat('pow','Potere',pow)+stat('hp','HP',`${curHp}/${hp}`)+stat('damage','Danni',`${damage}/${Math.max(1,pow)}`);
 if(armor>0)html+=stat('armor','Armatura',armor);
 return html;
}
function monsterStats(m){
 const pow=n(m.pow),damage=n(m.damage),armor=n(m.armor);
 let html=stat('pow','Potere',pow)+stat('damage','Danni',damage);
 if(armor>0)html+=stat('armor','Armatura',armor);
 return html;
}
function applyTo(el,html,sig){
 let stack=el.querySelector(':scope > .sf-card-stat-stack');
 if(!stack){stack=document.createElement('div');stack.className='sf-card-stat-stack';el.appendChild(stack)}
 if(stack.dataset.sig!==sig){stack.dataset.sig=sig;stack.innerHTML=html}
}
function decorateStats(){
 queued=false;
 if(!document.body.classList.contains('sf-fantasy-game'))return;
 document.querySelectorAll('.champ[data-owner][data-champ-id]').forEach(el=>{
  const c=championState(el.dataset.owner,el.dataset.champId);if(!c)return;
  const sig=['c',c.pow,c.hp,c.wounds,c.damage,c.armor,c.tapped,c.defeated].join('|');
  applyTo(el,championStats(c),sig);
 });
 document.querySelectorAll('.monster[data-monster-uid]').forEach(el=>{
  const m=monsterState(el.dataset.monsterUid);if(!m)return;
  const sig=['m',m.pow,m.damage,m.armor,m.tempPow].join('|');
  applyTo(el,monsterStats(m),sig);
 });
}
function queue(){if(queued)return;queued=true;requestAnimationFrame(decorateStats)}
const app=document.querySelector('#app');
if(app)new MutationObserver(queue).observe(app,{childList:true,subtree:true});
window.addEventListener('sf-blue-ready',queue);
window.addEventListener('resize',queue);
setInterval(queue,900);
queue();
})();