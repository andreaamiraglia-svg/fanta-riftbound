function players(){
  const isAdmin=D.user?.role==='admin';
  A.innerHTML=`<span class="eyebrow">Roster</span><h1>Giocatori.</h1>${isAdmin?'<div class="msg" style="border-color:#e0b85d55;background:#e0b85d0d;color:#e8d5a9">Modalità admin: puoi assegnare i punteggi direttamente da questa pagina.</div>':''}<div class="players">${[...D.players].sort((a,b)=>b.cost-a.cost||b.points-a.points).map(p=>`<div class="pc"><div><b>${e(p.name)}</b><small>${p.points} punti · ${p.selections} scelte · ${p.selectionPct}%</small></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px"><span class="cost">${p.cost}</span>${isAdmin?`<button class="btn alt" style="padding:6px 9px;font-size:11px" onclick="scorePlayer('${p.id}')">Assegna punti</button>`:''}</div></div>`).join('')}</div>`;
}

function scorePlayer(id){
  if(D.user?.role!=='admin') return;
  const p=D.players.find(x=>x.id===id);
  if(!p) return;
  M.innerHTML=`<div class="modalBg" onclick="if(event.target===this)M.innerHTML='' "><div class="modal"><span class="eyebrow">Assegna punteggio</span><h2>${e(p.name)}</h2><form class="stack" onsubmit="submitPlayerScore(event,'${p.id}')"><select class="select" name="ruleId" required>${D.scoringRules.map(r=>`<option value="${r.id}">${e(r.name)} ${r.type==='player_cost'?'(costo player)':((r.points>0?'+':'')+r.points)}</option>`).join('')}</select><input class="input" name="pointsOverride" type="number" placeholder="Punti personalizzati (opzionale)"><input class="input" name="notes" maxlength="120" placeholder="Nota (opzionale)"><button class="btn">Conferma punteggio</button><button type="button" class="btn alt" onclick="M.innerHTML=''">Annulla</button></form></div></div>`;
}

async function submitPlayerScore(ev,playerId){
  ev.preventDefault();
  const f=new FormData(ev.target);
  try{
    await api('/api/admin/events','POST',{playerId,ruleId:f.get('ruleId'),pointsOverride:f.get('pointsOverride'),notes:f.get('notes')});
    M.innerHTML='';
    await load();
    go('players');
  }catch(x){alert(x.message)}
}

function rules(){
  const R=Object.fromEntries(D.scoringRules.map(r=>[r.id,r]));
  const pts=id=>R[id]?.type==='player_cost'?'Costo player':`${R[id]?.points>0?'+':''}${R[id]?.points??0}`;
  const ranks=['top-128','top-64','top-32','top-16','top-8','top-4','top-2','top-1'];
  const extras=[
    ['best-of','★','Vinci un Best of'],['bonus-gentleman','🤝','Fair play e comportamento esemplare'],['bonus-valeg','✦','Bonus speciale ValeG'],['fraticida','◉','Sconfiggi un giocatore della tua lega'],['win-vs-top-player','◎','Sconfiggi il Top Player della classifica'],['perfect-day-1','▣','Record perfetto al Day 1'],['x-1','X/1','Record X/1 al Day 1'],['0-3-drop','◫','0/3 drop al Day 1']
  ];
  A.innerHTML=`
  <section class="scoreHero"><div><span class="eyebrow">SCORING</span><h1>Punteggi<span class="scoreDot">.</span></h1><p class="lede">Tutti i modi in cui i giocatori possono far guadagnare punti alla tua squadra.</p></div><div class="scoreGem">✦</div></section>
  <section class="scorePanel"><div class="scoreHeader"><b>🏆 RISULTATI — DAY 2</b><span>Conta solo il miglior risultato raggiunto</span></div><div class="scoreRanks">${ranks.map((id,i)=>`<article class="scoreRank r${i}"><div class="scoreIcon">${i===7?'♛':'◆'}</div><b>${e(R[id].name)}</b><small>solo miglior risultato</small><strong>${pts(id)} PUNTI</strong></article>`).join('')}</div><div class="scoreNote">ⓘ Se un player ottiene più piazzamenti, viene assegnato soltanto il punteggio del risultato migliore.</div></section>
  <section class="scorePanel"><div class="scoreHeader"><b>★ ALTRE AZIONI E BONUS</b></div><div class="scoreBonus">${extras.map(([id,ic,desc])=>`<article><div class="scoreIcon">${ic}</div><div><b>${e(R[id].name)}</b><small>${desc}</small></div><strong>${pts(id)}</strong></article>`).join('')}</div><div class="scoreNote">ⓘ Perfect Day 1 e X/1 Day 1 non sono cumulabili tra loro: vale solo il risultato migliore.</div></section>
  <section class="scoreImportant"><div class="scoreInfo">i</div><div><h2>Note importanti</h2><div class="scoreGrid"><p>✓ Per le posizioni del Day 2 conta solo il miglior risultato raggiunto.</p><p>✓ I punti vengono aggiornati manualmente dagli admin.</p><p>✓ X/1 Day 1 e Perfect Day 1 non sono cumulabili.</p><p>✓ In caso di dubbi, vale la decisione finale degli admin.</p></div></div></section>`;
}

(()=>{
  const style=document.createElement('style');
  style.textContent=`
  .scoreHero{display:grid;grid-template-columns:1fr 260px;gap:28px;align-items:center;margin-bottom:24px}.scoreHero h1{margin-bottom:12px}.scoreDot{color:var(--gold)}.scoreGem{height:160px;border:1px solid #d9af5140;background:radial-gradient(circle,#e0b85d50 0 5%,#e0b85d16 13%,transparent 50%),linear-gradient(135deg,#142820,#07110f);display:grid;place-items:center;font-size:72px;color:var(--gold)}.scorePanel{border:1px solid var(--line);background:linear-gradient(145deg,#10201be8,#081511e8);padding:20px;margin-bottom:18px}.scoreHeader{display:flex;align-items:center;gap:12px;color:var(--gold);margin-bottom:18px}.scoreHeader span{font-size:12px;padding:6px 10px;border:1px solid #d9af5133;border-radius:999px;background:#d9af510d}.scoreRanks{display:grid;grid-template-columns:repeat(8,1fr);gap:10px}.scoreRank{min-height:170px;border:1px solid #31574b;background:linear-gradient(#10231d,#091611);display:flex;flex-direction:column;align-items:center;text-align:center;padding:14px 8px;transition:.2s}.scoreRank:hover{transform:translateY(-3px);border-color:var(--gold)}.scoreIcon{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:#e0b85d12;border:1px solid #e0b85d33;color:var(--gold);font-weight:900;margin-bottom:10px}.scoreRank small{color:var(--muted);font-size:11px;margin:7px 0 12px}.scoreRank strong{margin-top:auto;color:var(--gold);font-size:14px}.r0 strong{color:#73e0a2}.r1 strong{color:#67d3e8}.r2 strong{color:#b982f0}.r3 strong{color:#ef7895}.r4 strong,.r5 strong,.r7 strong{color:#ffb32c}.r6 strong{color:#6bbef4}.scoreNote{margin-top:14px;border:1px solid #d9af5129;background:#d9af5108;padding:11px 13px;color:#c8d5cf;font-size:13px}.scoreBonus{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.scoreBonus article{min-height:116px;border:1px solid var(--line);background:#0b1915;display:grid;grid-template-columns:48px 1fr auto;gap:12px;align-items:center;padding:14px}.scoreBonus small{display:block;color:var(--muted);font-size:12px;margin-top:5px}.scoreBonus strong{color:var(--gold);white-space:nowrap}.scoreImportant{display:grid;grid-template-columns:58px 1fr;gap:18px;border:1px solid #b58937;background:linear-gradient(110deg,#0d1d18,#091510);padding:20px 24px}.scoreImportant h2{font-size:18px;color:var(--gold);margin:0 0 8px;text-transform:uppercase}.scoreInfo{width:48px;height:48px;border:2px solid var(--gold);border-radius:50%;display:grid;place-items:center;color:var(--gold);font:bold 24px Georgia}.scoreGrid{display:grid;grid-template-columns:1fr 1fr;gap:4px 28px}.scoreGrid p{margin:5px 0;color:#d9e2de;font-size:13px}@media(max-width:1050px){.scoreRanks{grid-template-columns:repeat(4,1fr)}.scoreBonus{grid-template-columns:repeat(2,1fr)}}@media(max-width:700px){.scoreHero{grid-template-columns:1fr}.scoreGem{display:none}.scoreRanks{grid-template-columns:repeat(2,1fr)}.scoreBonus,.scoreGrid{grid-template-columns:1fr}.scoreHeader{flex-wrap:wrap}.scoreBonus article{grid-template-columns:46px 1fr}.scoreBonus strong{grid-column:2}.scoreImportant{grid-template-columns:1fr}.scoreInfo{display:none}}`;
  document.head.appendChild(style);

  let tries=0;
  const refresh=setInterval(()=>{
    tries++;
    try{
      if(typeof D!=='undefined' && D && current()==='rules'){
        rules();
        clearInterval(refresh);
      }
    }catch(_){}
    if(tries>40) clearInterval(refresh);
  },100);
})();
