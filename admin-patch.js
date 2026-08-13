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
