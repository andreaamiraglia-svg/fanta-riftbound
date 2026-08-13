let leaderPick=null;

function ensureLeaderPick(){
  if(leaderPick && pick.includes(leaderPick)) return leaderPick;
  const saved=D?.myTeam?.leaderId;
  leaderPick=saved && pick.includes(saved) ? saved : (pick[0]||null);
  return leaderPick;
}

function setLeader(id){
  if(D?.config?.teamsLocked && D?.user?.role!=='admin') return;
  if(!pick.includes(id)) return;
  leaderPick=id;
  team();
}

function team(){
  if(!D.user){
    A.innerHTML=`<span class="eyebrow">La tua rosa</span><h1>Accedi per creare la squadra.</h1><p class="lede">Registrati con nome utente e password e scegli i tuoi ${D.config.teamSize} player. Ogni squadra ha un leader: i suoi punti valgono ×2.</p><button class="btn" onclick="auth()">Accedi / Registrati</button>`;
    return;
  }
  ensureLeaderPick();
  const ps=pick.map(id=>D.players.find(p=>p.id===id)).filter(Boolean);
  const spent=ps.reduce((s,p)=>s+p.cost,0);
  const locked=D.config.teamsLocked&&D.user.role!=='admin';
  A.innerHTML=`<span class="eyebrow">Mercato</span><h1>Crea la tua squadra.</h1>
  <div class="leaderNotice"><span class="leaderCrown">♛</span><div><b>Scegli il leader della squadra</b><small>Il punteggio del leader vale <strong>×2</strong>. Puoi cambiarlo fino alla chiusura delle squadre.</small></div></div>
  ${locked?'<div class="msg">Le squadre sono bloccate.</div>':''}
  <div class="builder"><section><div class="players">${D.players.map(p=>{const sel=pick.includes(p.id),off=locked||(!sel&&(pick.length>=D.config.teamSize||spent+p.cost>D.config.budget)),lead=sel&&leaderPick===p.id;return`<article class="pc ${sel?'sel':''} ${lead?'leaderPc':''} ${off?'off':''}" onclick="toggle('${p.id}',${off&&!sel})"><div><b>${lead?'<span class="leaderMini">♛ LEADER ×2</span> ':''}${e(p.name)}</b><small>${p.points} pt · ${p.selectionPct}% scelto</small></div><span class="cost">${p.cost}</span></article>`}).join('')}</div></section>
  <aside class="panel summary"><h2>La tua rosa</h2><input id="tn" class="input" placeholder="Nome squadra" value="${e(teamName)}" ${locked?'disabled':''}><div class="mini"><span>Budget</span><b>${spent}/${D.config.budget} G</b></div><div class="budget"><i style="width:${Math.min(100,spent/D.config.budget*100)}%"></i></div>
  ${Array.from({length:D.config.teamSize},(_,i)=>ps[i]?`<div class="slot full ${leaderPick===ps[i].id?'leaderSlot':''}"><span><b>${i+1}. ${e(ps[i].name)}</b> · ${ps[i].cost}G ${leaderPick===ps[i].id?'<em>♛ LEADER ×2</em>':''}</span><div class="slotActions">${!locked&&leaderPick!==ps[i].id?`<button class="leaderBtn" onclick="event.stopPropagation();setLeader('${ps[i].id}')">Fai leader</button>`:''}<button class="btn danger" onclick="event.stopPropagation();toggle('${ps[i].id}',false)" ${locked?'disabled':''}>×</button></div></div>`:`<div class="slot"><span>${i+1}. Slot libero</span></div>`).join('')}
  <button class="btn" style="width:100%;margin-top:10px" onclick="saveTeam()" ${locked||ps.length!==D.config.teamSize||spent>D.config.budget||!leaderPick?'disabled':''}>${D.myTeam?'Aggiorna squadra':'Conferma squadra'}</button></aside></div>`;
  document.querySelector('#tn')?.addEventListener('input',x=>teamName=x.target.value);
}

function toggle(id,off){
  if(off)return;
  if(pick.includes(id)){
    pick=pick.filter(x=>x!==id);
    if(leaderPick===id) leaderPick=pick[0]||null;
  }else{
    pick=[...pick,id];
    if(!leaderPick) leaderPick=id;
  }
  team();
}

async function saveTeam(){
  teamName=document.querySelector('#tn').value.trim();
  if(!teamName)return alert('Inserisci il nome squadra');
  ensureLeaderPick();
  if(!leaderPick)return alert('Scegli il leader della squadra');
  try{
    await api('/api/team','POST',{name:teamName,playerIds:pick,leaderId:leaderPick});
    leaderPick=null;
    await load();
    leaderPick=D?.myTeam?.leaderId||null;
    go('leaderboard');
  }catch(x){alert(x.message)}
}

function leaderboard(){
  A.innerHTML=`<span class="eyebrow">Live standings</span><h1>Classifica.</h1><p class="lede leaderboardLead">Il giocatore con la corona è il leader della squadra: i suoi punti valgono ×2.</p><div class="table"><table><thead><tr><th>#</th><th>Squadra</th><th>Giocatori</th><th>Budget</th><th>Punti</th></tr></thead><tbody>${D.leaderboard.map(t=>`<tr><td class="pts">${t.rank}</td><td><b>${e(t.name)}</b><div class="muted">${e(t.owner)}</div></td><td>${t.players.map(p=>`<span class="pill ${p.isLeader?'leaderPill':''}">${p.isLeader?'♛ ':''}${e(p.name)}${p.isLeader?' ×2':''}</span>`).join('')}</td><td>${t.cost}/${D.config.budget} G</td><td class="pts">${t.points}</td></tr>`).join('')}</tbody></table></div>`;
}

(()=>{
  const st=document.createElement('style');
  st.textContent=`
  .leaderNotice{display:flex;align-items:center;gap:13px;border:1px solid #e0b85d66;background:linear-gradient(90deg,#e0b85d13,#10201b);padding:13px 15px;margin:0 0 18px}.leaderNotice small{display:block;color:var(--muted);margin-top:3px}.leaderNotice strong{color:var(--gold)}.leaderCrown{width:42px;height:42px;border:1px solid #e0b85d77;border-radius:50%;display:grid;place-items:center;color:var(--gold);font-size:23px;background:#e0b85d12}.leaderPc{box-shadow:inset 0 0 0 1px #e0b85d99,0 0 18px #e0b85d12}.leaderMini{display:inline-block;color:var(--gold);font-size:9px;letter-spacing:.08em;margin-right:4px}.leaderSlot{border-color:var(--gold);background:#e0b85d0b}.leaderSlot em{font-style:normal;color:var(--gold);font-size:10px;font-weight:900;white-space:nowrap;margin-left:6px}.slotActions{display:flex;gap:6px;align-items:center}.leaderBtn{border:1px solid #e0b85d66;background:#e0b85d12;color:var(--gold);border-radius:7px;padding:7px 8px;font-size:10px;font-weight:800;cursor:pointer}.leaderBtn:hover{background:#e0b85d22}.leaderPill{border-color:#e0b85daa!important;color:#f0c96f!important;background:#e0b85d12}.leaderboardLead{font-size:14px;margin-top:-10px;margin-bottom:20px}@media(max-width:520px){.slot.full{align-items:flex-start;gap:8px}.slotActions{flex-direction:column;align-items:flex-end}.leaderNotice{align-items:flex-start}}
  `;
  document.head.appendChild(st);
})();