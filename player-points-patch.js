(()=>{
  const baseHome=home;
  let breakdownCache=null;
  let breakdownEventCount=null;

  async function loadPointBreakdown(){
    if(breakdownCache && breakdownEventCount===D?.stats?.events) return breakdownCache;
    const r=await fetch(U+'/rest/v1/rpc/public_player_point_breakdown',{
      method:'POST',
      headers:{'content-type':'application/json','apikey':K},
      body:'{}'
    });
    const x=await r.json();
    if(!r.ok || +x.status>=400) throw Error(x.data?.error||x.message||'Errore');
    breakdownCache=new Map((x.data?.players||[]).map(p=>[p.playerId,p.breakdown||[]]));
    breakdownEventCount=D?.stats?.events;
    return breakdownCache;
  }

  function shortRuleName(name){
    return String(name||'').replace(/\s*\([^)]*\)\s*$/,'').trim();
  }

  function renderBreakdown(items){
    if(!items?.length) return '<span class="noPointReason">Nessun punto ancora</span>';
    return items.map(x=>{
      const pts=Number(x.points)||0;
      const count=Number(x.count)||0;
      return `<span class="pointReason"><b>${e(shortRuleName(x.ruleName))}</b>${count>1?` ×${count}`:''}<em>${pts>0?'+':''}${pts} pt</em></span>`;
    }).join('');
  }

  home=function(){
    baseHome();

    const grid=document.querySelector('.grid2');
    const trend=grid?.querySelector('.trendPanel');
    if(!grid||!trend||document.querySelector('#playerPointsRanking')) return;

    const ranked=[...D.players].sort((a,b)=>
      (Number(b.points)||0)-(Number(a.points)||0) ||
      a.name.localeCompare(b.name,'it')
    );

    const section=document.createElement('section');
    section.className='panel trendPanel pointsRankingPanel';
    section.id='playerPointsRanking';
    section.innerHTML=`<div class="trendHead"><div><span class="eyebrow">Performance</span><h2>Più punti</h2></div><span class="trendHint">Scorri ↓</span></div><div class="trendScroll">${ranked.map((p,i)=>`<div class="mini trendRow pointsPlayerRow"><span class="playerRankInfo"><span><b class="trendPos">${i+1}.</b> ${e(p.name)}</span><small class="pointsBreakdown" data-player-id="${e(p.id)}">Caricamento dettaglio...</small></span><b class="playerPointsValue">${Number(p.points)||0} pt</b></div>`).join('')}</div>`;

    trend.insertAdjacentElement('afterend',section);
    grid.classList.add('homeRankGrid');
    const rules=section.nextElementSibling;
    if(rules) rules.classList.add('homeRulesPanel');

    loadPointBreakdown().then(map=>{
      if(!document.querySelector('#playerPointsRanking')) return;
      document.querySelectorAll('#playerPointsRanking .pointsBreakdown').forEach(el=>{
        el.innerHTML=renderBreakdown(map.get(el.dataset.playerId)||[]);
      });
    }).catch(()=>{
      document.querySelectorAll('#playerPointsRanking .pointsBreakdown').forEach(el=>{
        el.textContent='Dettaglio non disponibile';
      });
    });
  };

  const st=document.createElement('style');
  st.textContent=`
    .homeRankGrid{grid-template-columns:1fr 1fr}
    .homeRulesPanel{grid-column:1/-1}
    .playerPointsValue{color:var(--gold)!important;white-space:nowrap;padding-top:2px}
    .pointsPlayerRow{align-items:flex-start}
    .playerRankInfo{display:block;min-width:0;flex:1}
    .pointsBreakdown{display:flex!important;flex-wrap:wrap;gap:5px 6px;margin:6px 0 0!important;text-align:left!important;color:var(--muted)}
    .pointReason{display:inline-flex;align-items:center;gap:4px;border:1px solid #294b4077;background:#07110f88;border-radius:999px;padding:3px 7px;font-size:9px;line-height:1.25}
    .pointReason b{color:var(--text);font-weight:700}
    .pointReason em{font-style:normal;color:var(--gold);font-weight:900}
    .noPointReason{font-size:9px;color:var(--muted)}
    @media(max-width:850px){.homeRankGrid{grid-template-columns:1fr}.homeRulesPanel{grid-column:auto}}
  `;
  document.head.appendChild(st);
})();
