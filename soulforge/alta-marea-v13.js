(()=>{
  if(typeof canCast!=='function') return;
  const previousCanCast=canCast;

  canCast=function(card){
    const s=session?.state;
    if(card?.effect==='marea'&&s?.status==='main'&&!s.pendingChoice&&s.combat&&!s.stack?.length){
      const me=playerState(session.player);
      const cost=card.effectiveCost??card.cost??0;
      const c=s.combat;
      const involved=(c.attacker?.player===session.player)||(c.target?.type==='champion'&&c.target?.player===session.player);
      return !!involved&&s.priority===session.player&&(me?.souls?.[card.color]??0)>=cost;
    }
    return previousCanCast(card);
  };

  if(session?.state) setTimeout(()=>{try{render()}catch{}},0);
})();
