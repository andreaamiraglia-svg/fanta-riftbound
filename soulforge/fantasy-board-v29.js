(()=>{
let scheduled=false;
function countOf(p,key,fallbackKey){
 if(!p)return 0;
 const v=p[key];
 if(Array.isArray(v))return v.length;
 if(Number.isFinite(Number(v)))return Number(v);
 const f=p[fallbackKey];
 if(Array.isArray(f))return f.length;
 if(Number.isFinite(Number(f)))return Number(f);
 return 0;
}
function zone(kind,label,count,owner,clickable=false){
 const tag=clickable?'button':'div';
 return `<${tag} ${clickable?'type="button" ':''}class="sf-mini-zone" data-kind="${kind}" data-owner="${owner}" ${clickable?'data-sf-open-zone="1"':''}><small>${label}</small><strong>${count}</strong></${tag}>`;
}
function decoratePlayerInfo(zoneEl,p,owner,isOwn){
 const info=zoneEl?.querySelector('.playerinfo');if(!info||!p)return;
 info.classList.add('sf-fantasy-playerinfo');
 let z=info.querySelector('.sf-fantasy-zones');
 if(!z){z=document.createElement('div');z.className='sf-fantasy-zones';const souls=info.querySelector('.souls');if(souls)info.insertBefore(z,souls);else info.appendChild(z)}
 const deck=isOwn?countOf(p,'deckCards','deckCount'):countOf(p,'deckCount','deckCards');
 const monsterDeck=countOf(p,'monsterDeck','monsterDeckCount');
 const grave=isOwn?countOf(p,'graveCards','graveCount'):countOf(p,'graveCount','graveCards');
 const monsterGrave=countOf(p,'monsterGrave','monsterGraveCount');
 const sig=[deck,monsterDeck,grave,monsterGrave,owner].join('|');
 if(z.dataset.sig!==sig){
  z.dataset.sig=sig;
  z.innerHTML=zone('deck',isOwn?'Deck giocatore':'Deck avversario',deck,owner)+zone('monster-deck','Mazzo Mostri',monsterDeck,owner)+zone('grave','Cimitero Carte',grave,owner,true)+zone('monster-grave','Cimitero Mostri',monsterGrave,owner,true);
 }
 const souls=info.querySelector('.souls');
 if(souls&&!souls.previousElementSibling?.classList?.contains('sf-souls-label')){
  const lab=document.createElement('div');lab.className='sf-souls-label';lab.textContent=isOwn?'Anime giocatore':'Anime avversario';lab.style.cssText='margin-top:4px;text-align:center;text-transform:uppercase;letter-spacing:.08em;font-size:8px;color:#a9967c';info.insertBefore(lab,souls);
 }
}
function addBoardDetails(){
 const board=document.querySelector('.board');
 if(board){board.dataset.sfFantasy='1';const h=board.querySelector('h3');if(h&&!h.dataset.sfFantasy){h.dataset.sfFantasy='1';h.innerHTML=h.innerHTML.replace(/^Campo dei Mostri/i,'Campo dei Mostri')}}
 const chain=document.querySelector('.chain-lane');if(chain)chain.dataset.sfFantasy='1';
 const side=document.querySelector('.game-grid>.side');if(side)side.dataset.sfFantasy='1';
 document.querySelectorAll('.champ').forEach(x=>x.dataset.sfFantasy='1');
 document.querySelectorAll('.monster').forEach(x=>x.dataset.sfFantasy='1');
}
function decorate(){
 scheduled=false;
 const grid=document.querySelector('.game-grid');
 document.body.classList.toggle('sf-fantasy-game',!!grid);
 if(!grid)return;
 try{
  if(typeof session==='undefined'||!session?.state)return;
  const main=grid.querySelector('main');if(!main)return;
  const pzones=main.querySelectorAll(':scope > .playerzone');
  if(pzones.length>=2){
   pzones.forEach(x=>x.classList.remove('sf-opponent-zone','sf-player-zone'));
   pzones[0].classList.add('sf-opponent-zone');
   pzones[pzones.length-1].classList.add('sf-player-zone');
   const op=typeof otherP==='function'?otherP():(session.player===1?2:1);
   const opState=typeof playerState==='function'?playerState(op):session.state.players?.[String(op)];
   const meState=typeof playerState==='function'?playerState(session.player):session.state.players?.[String(session.player)];
   decoratePlayerInfo(pzones[0],opState,op,false);
   decoratePlayerInfo(pzones[pzones.length-1],meState,session.player,true);
  }
  addBoardDetails();
 }catch(e){console.warn('Fantasy board decoration skipped',e)}
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(decorate)}

document.addEventListener('click',e=>{
 const z=e.target.closest?.('.sf-mini-zone[data-sf-open-zone="1"]');if(!z)return;
 const kind=z.dataset.kind==='grave'?'cards':'monsters';
 const owner=String(z.dataset.owner||'');
 const btn=document.querySelector(`.sf-grave-btn[data-owner="${owner}"][data-kind="${kind}"]`);
 if(btn){e.preventDefault();btn.click()}
});

const app=document.querySelector('#app');
if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});
window.addEventListener('sf-blue-ready',schedule);
window.addEventListener('resize',schedule);
setInterval(schedule,1200);
schedule();
})();
