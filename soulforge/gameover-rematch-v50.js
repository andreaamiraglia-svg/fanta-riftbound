(()=>{
let sending=false;
let enhanceQueued=false;
function setText(el,value){
 if(el&&el.textContent!==value)el.textContent=value;
}
function ensureStyle(){
 if(document.getElementById('sfGameover50Style'))return;
 const s=document.createElement('style');s.id='sfGameover50Style';s.textContent=`
 .sf-gameover-panel{position:fixed!important;inset:0!important;z-index:10000!important;max-width:none!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:#101112!important;color:#fff!important;text-align:center!important;display:flex!important;flex-direction:column!important;align-items:center!important;overflow:auto!important}
 .sf-gameover-header{width:100%;height:83px;min-height:83px;border-bottom:1px solid #48282a;display:flex;align-items:center;justify-content:center;background:#101112}
 .sf-gameover-brand{display:flex;align-items:center;gap:12px;text-transform:uppercase;line-height:1.02;letter-spacing:1px}
 .sf-gameover-brand img{width:40px;height:52px;object-fit:contain}
 .sf-gameover-brand span{display:flex;flex-direction:column}
 .sf-gameover-brand strong{color:#e5f16a;font:700 17px Arial,sans-serif}
 .sf-gameover-brand small{color:#fff;font:700 10px Arial,sans-serif;margin:2px 0;letter-spacing:0}
 .sf-gameover-brand b{color:#fff;font:700 17px Arial,sans-serif}
 .sf-gameover-result{margin:48px 20px 0;font:900 clamp(52px,8vw,92px)/1 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;transform:rotate(-2deg);text-shadow:0 4px 0 #0005}
 .sf-gameover-result.sf-draw{font-size:clamp(44px,7vw,78px)}
 .sf-gameover-actions{display:flex;flex-direction:column;align-items:center;gap:16px;margin:auto 20px 68px}
 .sf-gameover-panel .sf-home-primary{min-width:250px;min-height:100px;border:0;border-radius:25px;background:#c80f17;color:#fff;font:800 38px Arial,sans-serif;text-transform:uppercase;box-shadow:0 7px 0 #78080d;cursor:pointer;padding:20px 36px}
 .sf-gameover-panel .sf-home-primary:hover{background:#e01821;transform:translateY(-1px)}
 .sf-gameover-panel .sf-rematch-secondary{border:0;background:transparent;color:#b9bdc7;font:600 15px Arial,sans-serif;text-decoration:underline;cursor:pointer;padding:8px 16px}
 .sf-gameover-panel .sf-rematch-secondary:disabled{opacity:.55;cursor:wait}
 .sf-rematch-state{min-height:18px;color:#aeb8c8;font-size:13px}
 @media(max-height:560px){.sf-gameover-result{margin-top:26px}.sf-gameover-actions{margin-bottom:28px}.sf-gameover-panel .sf-home-primary{min-height:78px}}
 `;document.head.appendChild(s);
}
function voteInfo(){
 const v=session?.state?.rematchVotes||{};
 return {me:!!v[String(session?.player)],op:!!v[String(otherP?.()||0)]};
}
function enhance(){
 ensureStyle();
 const s=session?.state;if(!s||s.status!=='gameover')return;
 const heading=[...document.querySelectorAll('#app h1')].find(h=>/Hai vinto|Hai perso|Pareggio/i.test(h.textContent||''));
 const panel=document.querySelector('#sfBaseRematch')?.closest('.panel')||heading?.closest('.panel');if(!panel)return;
 if(!panel.classList.contains('sf-gameover-panel')){
  const result=s.draw?'PAREGGIO':Number(s.winner)===Number(session.player)?'VITTORIA':'SCONFITTA';
  panel.className='sf-gameover-panel';
  panel.innerHTML='<header class="sf-gameover-header"><div class="sf-gameover-brand"><img src="/favicon-192.png?v=cs2" alt=""><span><strong>Champion</strong><small>of the</small><b>Souls</b></span></div></header><h1 class="sf-gameover-result '+(s.draw?'sf-draw':'')+'">'+result+'</h1><div class="sf-gameover-actions"><button id="sfHomeBtn" class="sf-home-primary">Home</button><button id="sfRematchBtn" class="sf-rematch-secondary">Rematch</button><div class="sf-rematch-state" aria-live="polite"></div></div>';
 }
 const info=panel.querySelector('.sf-rematch-state');
 const v=voteInfo(),btn=panel.querySelector('#sfRematchBtn');
 if(btn){
  const disabled=v.me||sending;if(btn.disabled!==disabled)btn.disabled=disabled;
  setText(btn,v.me?'Rematch richiesto':sending?'Richiesta…':'Rematch');
 }
 setText(info,v.me&&!v.op?'In attesa che l’avversario accetti il rematch…':!v.me&&v.op?'L’avversario ha richiesto un rematch.':v.me&&v.op?'Avvio del rematch…':'');
}
async function rematch(){
 if(sending||session?.state?.status!=='gameover')return;
 sending=true;enhance();
 try{
  const j=await post({action:'rematch',roomCode:session.room,token:session.token,version:session.version});
  session.player=j.player;session.version=j.version;session.state=j.state;selected.clear();render();
 }catch(e){
  if(e?.message==='STATE_CONFLICT')await refresh();else try{showError(e?.message||'Errore rematch')}catch{}
 }finally{sending=false;enhance()}
}
function home(){
 try{stopPolling()}catch{}
 location.assign(location.origin+location.pathname);
}
document.addEventListener('click',e=>{
 const r=e.target.closest?.('#sfRematchBtn');if(r){e.preventDefault();rematch();return;}
 const h=e.target.closest?.('#sfHomeBtn');if(h){e.preventDefault();home();}
},true);
const app=document.getElementById('app');if(app)new MutationObserver(()=>{
 if(enhanceQueued)return;enhanceQueued=true;
 queueMicrotask(()=>{enhanceQueued=false;enhance()});
}).observe(app,{subtree:true,childList:true});
window.addEventListener('sf-blue-ready',enhance);setInterval(()=>{if(session?.state?.status==='gameover')enhance()},700);setTimeout(enhance,0);
})();
