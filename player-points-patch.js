(()=>{
  const baseHome=home;

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
    section.innerHTML=`<div class="trendHead"><div><span class="eyebrow">Performance</span><h2>Più punti</h2></div><span class="trendHint">Scorri ↓</span></div><div class="trendScroll">${ranked.map((p,i)=>`<div class="mini trendRow"><span><b class="trendPos">${i+1}.</b> ${e(p.name)}</span><b class="playerPointsValue">${Number(p.points)||0} pt</b></div>`).join('')}</div>`;

    trend.insertAdjacentElement('afterend',section);
    grid.classList.add('homeRankGrid');
    const rules=section.nextElementSibling;
    if(rules) rules.classList.add('homeRulesPanel');
  };

  const st=document.createElement('style');
  st.textContent=`
    .homeRankGrid{grid-template-columns:1fr 1fr}
    .homeRulesPanel{grid-column:1/-1}
    .playerPointsValue{color:var(--gold)!important;white-space:nowrap}
    @media(max-width:850px){.homeRankGrid{grid-template-columns:1fr}.homeRulesPanel{grid-column:auto}}
  `;
  document.head.appendChild(st);
})();
