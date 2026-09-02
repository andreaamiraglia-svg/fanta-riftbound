(()=>{
let sending=false;
function ensureStyle(){
 if(document.getElementById('sfGameover50Style'))return;
 const s=document.createElement('style');s.id='sfGameover50Style';s.textContent=`
 .sf-gameover-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
 .sf-rematch-state{margin-top:12px;color:#aeb8c8;font-size:13px}
 .sf-gameover-panel{max-width:640px;margin:8vh auto;text-align:center;padding:28px!important}
 .sf-gameover-panel .sf-gameover-actions{justify-content:center}
 `;document.head.appendChild(s);
}
function voteInfo(){
 const v=session?.state?.rematchVotes||{};
 return {me:!!v[String(session?.player)],op:!!v[String(otherP?.()||0)]};
}
function enhance(){
 ensureStyle();
 const s=session?.state;if(!s||s.status!=='gameover')return;
 const heading=[...document.querySelectorAll('#app h1')].find(h=>/Hai vinto|Hai perso/i.test(h.textContent||''));
 const panel=heading?.closest('.panel');if(!panel)return;
 panel.classList.add('sf-gameover-panel');
 let actions=panel.querySelector('.sf-gameover-actions');
 if(!actions){
  actions=document.createElement('div');actions.className='sf-gameover-actions';
  actions.innerHTML='<button id="sfRematchBtn" class="btn primary">Rematch</button><button id="sfHomeBtn" class="btn ghost">Torna alla home</button>';
  panel.appendChild(actions);
 }
 let info=panel.querySelector('.sf-rematch-state');if(!info){info=document.createElement('div');info.className='sf-rematch-state';panel.appendChild(info)}
 const v=voteInfo(),btn=panel.querySelector('#sfRematchBtn');
 if(btn){btn.disabled=v.me||sending;btn.textContent=v.me?'Rematch richiesto':sending?'Richiesta…':'Rematch';}
 info.textContent=v.me&&!v.op?'In attesa che l’avversario accetti il rematch…':!v.me&&v.op?'L’avversario ha richiesto un rematch.':v.me&&v.op?'Avvio del rematch…':'';
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
const app=document.getElementById('app');if(app)new MutationObserver(()=>queueMicrotask(enhance)).observe(app,{subtree:true,childList:true});
window.addEventListener('sf-blue-ready',enhance);setInterval(()=>{if(session?.state?.status==='gameover')enhance()},700);setTimeout(enhance,0);
})();
