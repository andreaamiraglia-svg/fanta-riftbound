(()=>{
function ensureStyle(){
 if(document.getElementById('sfSpecchioStackFixStyle'))return;
 const s=document.createElement('style');
 s.id='sfSpecchioStackFixStyle';
 s.textContent=`
 body.sf-specchio-stack-target .stack-stage{display:flex!important;flex-direction:column!important;align-items:center!important;gap:8px!important;overflow:visible!important;padding-bottom:12px!important}
 body.sf-specchio-stack-target .stack-card{margin-top:0!important;transform:none!important;position:relative!important;z-index:auto!important;pointer-events:auto!important}
 body.sf-specchio-stack-target .stack-card.sf-v8-valid{z-index:2!important;box-shadow:0 0 0 3px #ffd166,0 10px 30px rgba(0,0,0,.35)!important}
 body.sf-specchio-stack-target .stack-card:not(.sf-v8-valid){opacity:.48!important}
 `;
 document.head.appendChild(s);
}
function sync(){
 ensureStyle();
 const valid=[...document.querySelectorAll('.stack-card.sf-v8-valid[data-sf-stack-uid]')];
 const hint=document.getElementById('sfTargetV8Hint');
 const targeting=valid.length>0 && !!hint && /Magia in Catena/i.test(hint.textContent||'');
 document.body.classList.toggle('sf-specchio-stack-target',targeting);
}
const mo=new MutationObserver(()=>queueMicrotask(sync));
mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-sf-stack-uid']});
document.addEventListener('click',()=>setTimeout(sync,0),true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')setTimeout(sync,0)},true);
window.addEventListener('resize',sync);
setInterval(sync,250);
ensureStyle();sync();
})();
