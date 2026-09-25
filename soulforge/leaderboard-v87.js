(()=>{
const STYLE=`
.sf-leaderboard-main{width:min(1120px,calc(100% - 32px));margin:0 auto;padding:48px 0 80px}
.sf-leaderboard-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:24px}
.sf-leaderboard-head h1{margin:0;color:#fff;font-size:clamp(32px,5vw,54px);letter-spacing:-.04em}
.sf-leaderboard-head p{margin:7px 0 0;color:#9da3ad}
.sf-rank-table{display:grid;gap:12px}
.sf-rank-row{display:grid;grid-template-columns:70px minmax(220px,1fr) 145px 90px 90px 112px;gap:12px;align-items:stretch}
.sf-rank-cell{min-height:66px;display:flex;align-items:center;justify-content:center;padding:12px 16px;background:linear-gradient(100deg,#ececec,#cfcfcf);color:#080808;font-size:19px;font-weight:800;border:1px solid #ffffff18}
.sf-rank-name{justify-content:flex-start;font-size:21px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sf-rank-row.first .sf-rank-cell{background:linear-gradient(100deg,#f4ff72,#bdff00)}
.sf-rank-row.second .sf-rank-cell{background:linear-gradient(100deg,#f3f3f3,#c9c9c9)}
.sf-rank-row.third .sf-rank-cell{background:linear-gradient(100deg,#ac7600,#d7e975)}
.sf-rank-pos{font-size:24px}.sf-rank-elo{font-size:22px;gap:8px}.sf-rank-empty{padding:52px 22px;text-align:center;border:1px solid #30343c;color:#aeb4bd;background:#12151a}
.sf-rank-loading{opacity:.65}.sf-rank-error{padding:18px;border:1px solid #91323b;background:#3b171b;color:#ffd8dc}
@media(max-width:760px){.sf-leaderboard-main{padding-top:28px}.sf-leaderboard-head{align-items:flex-start;flex-direction:column}.sf-rank-row{grid-template-columns:52px minmax(150px,1fr) 92px 64px}.sf-rank-row .sf-rank-losses,.sf-rank-row .sf-rank-rate{display:none}.sf-rank-cell{min-height:58px;padding:9px;font-size:15px}.sf-rank-name{font-size:17px}.sf-rank-pos,.sf-rank-elo{font-size:18px}}
`;
const escRank=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function header(){return `<header class="sf-home-header"><a class="sf-home-brand" href="/" aria-label="Champion of the Souls"><img src="/favicon-192.png?v=cs2" alt=""><span><strong>CHAMPION</strong><small>of the</small><b>SOULS</b></span></a><nav aria-label="Navigazione principale"><button data-home-tab="play">Play</button><button data-home-tab="decks">Decks</button><button data-home-tab="leaderboard" class="selected">Leaderboard</button></nav></header>`}
function bindRankNav(){
 const play=document.querySelector('[data-home-tab="play"]'),decks=document.querySelector('[data-home-tab="decks"]'),rank=document.querySelector('[data-home-tab="leaderboard"]');
 if(play)play.onclick=()=>renderLanding();
 if(decks)decks.onclick=()=>window.sfDeckBuilder?.library?.();
 if(rank)rank.onclick=renderLeaderboard;
}
function mountNav(){
 const nav=document.querySelector('.sf-home-header nav');if(!nav)return;
 let rank=nav.querySelector('[data-home-tab="leaderboard"]');
 if(!rank){rank=document.createElement('button');rank.dataset.homeTab='leaderboard';rank.textContent='Leaderboard';nav.appendChild(rank)}
 rank.onclick=renderLeaderboard;
}
function row(x){
 const cls=x.rank===1?'first':x.rank===2?'second':x.rank===3?'third':'';
 return `<div class="sf-rank-row ${cls}"><div class="sf-rank-cell sf-rank-pos">${x.rank}°</div><div class="sf-rank-cell sf-rank-name" title="${escRank(x.name)}">${escRank(x.name)}</div><div class="sf-rank-cell sf-rank-elo">${x.elo}</div><div class="sf-rank-cell">${x.wins}</div><div class="sf-rank-cell sf-rank-losses">${x.losses}</div><div class="sf-rank-cell sf-rank-rate">${x.winRate}%</div></div>`;
}
async function renderLeaderboard(){
 app.innerHTML=`<div class="sf-home">${header()}<main class="sf-leaderboard-main"><div class="sf-leaderboard-head"><div><h1>Leaderboard</h1><p>Classifica punti degli account registrati con almeno una partita completata.</p></div><div class="sf-home-hint">Punti iniziali 0 · Bronzo 0 · Argento 100 · Oro 250 · Cristallo 500 · Master 750 · Titano 1000</div></div><div id="sfRankStatus" class="sf-rank-empty sf-rank-loading">Caricamento classifica…</div></main></div>`;
 bindRankNav();
 try{
  const data=await post({action:'leaderboard'}),entries=Array.isArray(data.entries)?data.entries:[];
  const box=document.querySelector('#sfRankStatus');if(!box)return;
  if(!entries.length){box.className='sf-rank-empty';box.textContent='La classifica apparirà quando un account registrato completa la sua prima partita.';return}
  box.outerHTML=`<div class="sf-rank-table"><div class="sf-rank-row sf-rank-labels"><div class="sf-rank-cell">#</div><div class="sf-rank-cell sf-rank-name">Nome giocatore</div><div class="sf-rank-cell">Punti</div><div class="sf-rank-cell">W</div><div class="sf-rank-cell sf-rank-losses">L</div><div class="sf-rank-cell sf-rank-rate">Win%</div></div>${entries.map(row).join('')}</div>`;
 }catch(e){const box=document.querySelector('#sfRankStatus');if(box){box.className='sf-rank-error';box.textContent=e?.message||'Impossibile caricare la classifica.'}}
}
const style=document.createElement('style');style.id='sfLeaderboard87Style';style.textContent=STYLE;document.head.appendChild(style);
window.sfRenderLeaderboard=renderLeaderboard;
const root=document.getElementById('app');if(root)new MutationObserver(()=>mountNav()).observe(root,{childList:true,subtree:true});
mountNav();setTimeout(mountNav,0);setTimeout(mountNav,500);
})();

if(!document.querySelector('script[data-sf-account-loader]')){
 const accountLoader=document.createElement('script');
 accountLoader.src='/account-v94.js?v=5';
 accountLoader.dataset.sfAccountLoader='1';
 document.head.append(accountLoader);
}
