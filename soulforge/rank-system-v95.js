(()=>{
const ICONS={
 bronze:'https://clash-wiki.com/images/progress/leagues/bronze_league.png',
 silver:'https://clash-wiki.com/images/progress/leagues/silver_league.png',
 gold:'https://clash-wiki.com/images/progress/leagues/gold_league.png',
 crystal:'https://clash-wiki.com/images/progress/leagues/crystal_league.png',
 master:'https://clash-wiki.com/images/progress/leagues/master_league.png',
 titan:'https://clash-wiki.com/images/progress/leagues/titan_league.png'
};
const RANKS=[
 {id:'bronze',name:'Bronzo',min:0,next:100},
 {id:'silver',name:'Argento',min:100,next:250},
 {id:'gold',name:'Oro',min:250,next:500},
 {id:'crystal',name:'Cristallo',min:500,next:750},
 {id:'master',name:'Master',min:750,next:1000},
 {id:'titan',name:'Titano',min:1000,next:null}
];
const STYLE=`
.sf-ranked-home{position:relative;min-height:100vh}
.sf-ranked-home .sf-home-play{max-width:none;width:min(900px,45vw);margin:66px 0 0 clamp(34px,4.8vw,100px);padding:0 20px 48px}
.sf-rank-home-stage{position:absolute;top:118px;right:3.2vw;width:45vw;min-height:500px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;pointer-events:none}
.sf-rank-home-wrap,.sf-rank-result-wrap{width:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}
.sf-rank-current-icon{width:clamp(145px,11vw,215px);height:clamp(145px,11vw,215px);object-fit:contain;filter:drop-shadow(0 8px 10px #0008);flex:0 0 auto}
.sf-rank-progress-row{width:min(620px,92%);display:grid;grid-template-columns:minmax(300px,1fr) 96px;gap:22px;align-items:center;justify-content:center;margin-top:30px}
.sf-rank-progress{position:relative;width:100%;min-width:0;height:68px;border-radius:999px;background:#8f3e3e;overflow:hidden;border:2px solid #a34a4a;box-shadow:inset 0 3px 9px #0006,0 7px 20px #0004}
.sf-rank-progress-fill{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,#13e7d4,#21d9cb);border-radius:999px;box-shadow:inset 0 0 10px #fff4;transition:width .45s ease}
.sf-rank-progress-label{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;padding:0 18px;box-sizing:border-box;overflow:visible;white-space:nowrap;color:#fff;font:950 clamp(28px,2.4vw,42px)/1 system-ui,sans-serif;letter-spacing:-.035em;text-shadow:-3px -3px 0 #000,3px -3px 0 #000,-3px 3px 0 #000,3px 3px 0 #000,0 4px 6px #000a;pointer-events:none}
.sf-rank-next-icon{width:96px;height:96px;object-fit:contain;filter:drop-shadow(0 5px 7px #0008);flex:0 0 auto}
.sf-rank-title{margin-top:14px;color:#f4f4f4;font:900 24px/1 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em;text-shadow:0 3px 8px #0008}
.sf-rank-max .sf-rank-progress-row{grid-template-columns:minmax(300px,1fr)}
.sf-rank-max .sf-rank-next-icon{display:none}
.sf-rank-max .sf-rank-progress-fill{width:100%!important}
.sf-ranked-gameover .sf-gameover-result{margin:36px 20px 0!important;transform:none!important}
.sf-ranked-gameover .sf-rank-result-wrap{width:min(720px,90vw);margin:26px auto 0!important}
.sf-ranked-gameover .sf-rank-current-icon{width:145px;height:145px}
.sf-ranked-gameover .sf-rank-progress-row{width:min(620px,100%);grid-template-columns:minmax(300px,1fr) 92px;gap:20px;margin-top:20px}
.sf-ranked-gameover .sf-rank-progress{height:64px}
.sf-ranked-gameover .sf-rank-next-icon{width:92px;height:92px}
.sf-ranked-gameover .sf-rank-progress-label{font-size:36px}
.sf-ranked-gameover .sf-rank-title{font-size:25px}
.sf-ranked-gameover .sf-gameover-actions{margin:32px 20px 48px!important;gap:14px!important}
.sf-ranked-gameover .sf-home-primary{min-width:300px!important;min-height:100px!important;font-size:40px!important}
.sf-leaderboard-rank-icon{width:42px;height:42px;object-fit:contain;margin-right:9px;vertical-align:middle;filter:drop-shadow(0 2px 2px #0005)}
@media(max-width:1100px){
 .sf-ranked-home .sf-home-play{width:auto;margin:36px 18px 0;padding:0}
 .sf-rank-home-stage{position:relative;top:auto;right:auto;width:auto;min-height:0;margin:36px 18px 50px}
 .sf-rank-home-wrap{width:min(720px,100%)}
 .sf-rank-current-icon{width:145px;height:145px}
 .sf-rank-progress-row{width:min(600px,96%)}
}
@media(max-width:640px){
 .sf-rank-progress-row,.sf-ranked-gameover .sf-rank-progress-row{width:100%;grid-template-columns:minmax(190px,1fr) 68px;gap:10px}
 .sf-rank-progress{height:54px}
 .sf-rank-next-icon,.sf-ranked-gameover .sf-rank-next-icon{width:68px;height:68px}
 .sf-rank-progress-label,.sf-ranked-gameover .sf-rank-progress-label{font-size:25px;padding:0 10px}
 .sf-rank-current-icon,.sf-ranked-gameover .sf-rank-current-icon{width:115px;height:115px}
 .sf-rank-title,.sf-ranked-gameover .sf-rank-title{font-size:20px}
 .sf-rank-max .sf-rank-progress-row{grid-template-columns:minmax(190px,1fr)}
}
`;
let cache={name:'',points:0,at:0};
let running=false;
const norm=s=>String(s||'').trim().replace(/\s+/g,' ').toLowerCase();
const getSession=()=>{try{return typeof session!=='undefined'?session:window.session}catch{return window.session}};
function currentRank(points){
 points=Math.max(0,Number(points)||0);
 for(let i=RANKS.length-1;i>=0;i--)if(points>=RANKS[i].min)return {...RANKS[i],index:i};
 return {...RANKS[0],index:0};
}
function progress(points){
 points=Math.max(0,Number(points)||0);
 const rank=currentRank(points),nextRank=RANKS[rank.index+1]||null;
 if(!nextRank)return {rank,nextRank:null,pct:100,label:`${points} PUNTI`};
 const span=rank.next-rank.min,inside=Math.max(0,points-rank.min),pct=Math.max(0,Math.min(100,inside/span*100));
 return {rank,nextRank,pct,label:`${points}/${rank.next}`};
}
async function ownPoints(force=false){
 const user=window.sfAccount?.getUser?.();
 const name=window.sfAccount?.getDisplayName?.();
 if(!user||!name)return null;
 if(!force&&cache.name===norm(name)&&Date.now()-cache.at<5000)return cache.points;
 try{
  const data=await post({action:'leaderboard'}),entries=Array.isArray(data?.entries)?data.entries:[];
  const row=entries.find(x=>norm(x.name)===norm(name));
  cache={name:norm(name),points:Math.max(0,Number(row?.elo)||0),at:Date.now()};
  return cache.points;
 }catch{return cache.name===norm(name)?cache.points:0}
}
function rankMarkup(points,context='home'){
 const x=progress(points),max=!x.nextRank;
 return `<div class="sf-rank-${context}-wrap ${max?'sf-rank-max':''}"><img class="sf-rank-current-icon" src="${ICONS[x.rank.id]}" alt="${x.rank.name}" referrerpolicy="no-referrer"><div class="sf-rank-progress-row"><div class="sf-rank-progress"><div class="sf-rank-progress-fill" style="width:${x.pct}%"></div><div class="sf-rank-progress-label">${x.label}</div></div>${x.nextRank?`<img class="sf-rank-next-icon" src="${ICONS[x.nextRank.id]}" alt="${x.nextRank.name}" referrerpolicy="no-referrer">`:''}</div><div class="sf-rank-title">${x.rank.name}</div></div>`;
}
async function mountHome(){
 const home=document.querySelector('.sf-home'),play=document.querySelector('.sf-home-play');
 if(!home||!play)return;
 const user=window.sfAccount?.getUser?.();
 if(!user){home.classList.remove('sf-ranked-home');home.querySelector('.sf-rank-home-stage')?.remove();return}
 if(home.querySelector('.sf-leaderboard-main')||document.querySelector('.deck-builder-page'))return;
 home.classList.add('sf-ranked-home');
 let stage=home.querySelector('.sf-rank-home-stage');
 if(!stage){stage=document.createElement('aside');stage.className='sf-rank-home-stage';home.appendChild(stage)}
 const points=await ownPoints();if(points==null)return;
 const key=String(points);
 if(stage.dataset.points!==key){stage.dataset.points=key;stage.innerHTML=rankMarkup(points,'home')}
}
async function mountGameover(){
 const s=getSession();
 if(!s?.state||s.state.status!=='gameover')return;
 if(!window.sfAccount?.getUser?.())return;
 const panel=document.querySelector('.sf-gameover-panel');if(!panel)return;
 panel.classList.add('sf-ranked-gameover');
 const points=await ownPoints(true);if(points==null)return;
 let wrap=panel.querySelector('.sf-rank-result-wrap');
 const resultHeading=panel.querySelector('.sf-gameover-result');
 if(!wrap){wrap=document.createElement('div');wrap.className='sf-rank-result-wrap';if(resultHeading)resultHeading.insertAdjacentElement('afterend',wrap);else panel.querySelector('.sf-gameover-actions')?.insertAdjacentElement('beforebegin',wrap)}
 const key=`${s.version||''}:${points}`;
 if(wrap.dataset.rankKey!==key){wrap.dataset.rankKey=key;wrap.outerHTML=rankMarkup(points,'result')}
}
function decorateLeaderboard(){
 document.querySelectorAll('.sf-rank-row:not(.sf-rank-labels)').forEach(row=>{
  const cells=row.querySelectorAll('.sf-rank-cell');if(cells.length<3)return;
  const elo=Number((cells[2].textContent||'').replace(/\D/g,''))||0;
  const rank=currentRank(elo);if(cells[2].querySelector('.sf-leaderboard-rank-icon'))return;
  cells[2].insertAdjacentHTML('afterbegin',`<img class="sf-leaderboard-rank-icon" src="${ICONS[rank.id]}" alt="${rank.name}" referrerpolicy="no-referrer">`);
 });
}
async function maintain(){
 if(running)return;running=true;
 try{await mountHome();await mountGameover();decorateLeaderboard()}finally{running=false}
}
const oldStyle=document.getElementById('sfRank95Style');if(oldStyle)oldStyle.remove();
const st=document.createElement('style');st.id='sfRank95Style';st.textContent=STYLE;document.head.appendChild(st);
const obs=new MutationObserver(()=>queueMicrotask(maintain));obs.observe(document.body,{childList:true,subtree:true});
window.sfRankSystem={ranks:RANKS,currentRank,progress,refresh:()=>{cache.at=0;return maintain()}};
setInterval(maintain,900);setTimeout(maintain,0);setTimeout(maintain,800);
})();
