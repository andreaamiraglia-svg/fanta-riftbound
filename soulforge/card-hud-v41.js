(()=>{
let scheduled=false;

function normalizeStat(stat){
  if(!stat||stat.dataset.sfHudReady==='1')return;
  const raw=String(stat.textContent||'').replace(/\s+/g,' ').trim();
  let label='',value='',kind='';
  if(/^POW\b/i.test(raw)){label='POTERE';value=raw.replace(/^POW\s*/i,'');kind='pow'}
  else if(/^HP\b/i.test(raw)){label='HP';value=raw.replace(/^HP\s*/i,'');kind='hp'}
  else if(/^Danni\b/i.test(raw)){label='DANNI';value=raw.replace(/^Danni\s*/i,'');kind='damage'}
  else if(/^Armatura\b/i.test(raw)){label='ARM';value=raw.replace(/^Armatura\s*/i,'');kind='armor'}
  else return;
  stat.dataset.sfHudReady='1';
  stat.dataset.sfHudKind=kind;
  stat.classList.add('sf-hud-stat','sf-hud-'+kind);
  stat.innerHTML=`<span class="sf-hud-label">${label}</span><strong class="sf-hud-value">${value||'0'}</strong>`;
  if(kind==='armor'&&Number(String(value).replace(/[^0-9.-]/g,''))<=0)stat.classList.add('sf-hud-zero');
}

function makeShell(card,art,stats,type){
  if(!card||!art||!stats)return;
  let shell=card.querySelector(':scope > .sf-card-shell');
  if(!shell){
    shell=document.createElement('div');
    shell.className=`sf-card-shell sf-${type}-shell`;
    art.parentNode.insertBefore(shell,art);
    shell.appendChild(art);
    shell.appendChild(stats);
  }else{
    if(art.parentNode!==shell)shell.prepend(art);
    if(stats.parentNode!==shell)shell.appendChild(stats);
  }
  card.classList.add('sf-card-hud-card');
  stats.querySelectorAll('.stat').forEach(normalizeStat);
}

function decorateChampion(card){
  const art=card.querySelector('.champ-art');
  const stats=card.querySelector('.stats');
  if(!art||!stats)return;
  makeShell(card,art,stats,'champ');
}
function decorateMonster(card){
  const art=card.querySelector('.monster-art');
  const stats=card.querySelector('.stats');
  if(!art||!stats)return;
  makeShell(card,art,stats,'monster');
}
function decorate(){
  scheduled=false;
  if(!document.body.classList.contains('sf-fantasy-game'))return;
  document.querySelectorAll('.champ').forEach(decorateChampion);
  document.querySelectorAll('.monster').forEach(decorateMonster);
}
function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(decorate);
}

const app=document.getElementById('app');
if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});
window.addEventListener('sf-blue-ready',schedule);
window.addEventListener('resize',schedule);
setInterval(schedule,1000);
schedule();
})();
