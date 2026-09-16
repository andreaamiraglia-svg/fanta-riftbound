// Ability sources and legal Monster targets are deliberately different sets.
// A converted Support keeps its abilities but is never a Monster target.
export function abilitySources61(s:any){
 return [...(s?.board?.monsters||[]),...[1,2].flatMap(p=>(s?.players?.[String(p)]?.champions||[]).filter((c:any)=>c.monsterOrigin&&!c.defeated))];
}
export function monsterDied61(s:any,dead:any){
 s.processedDeaths61 ||= [];
 if(s.processedDeaths61.includes(dead.uid))return;
 s.processedDeaths61.push(dead.uid);
 for(const source of abilitySources61(s).filter((x:any)=>x.cardId==='abominio_ricucito'&&x.uid!==dead.uid))
  for(const m of s.board.monsters)if(m.uid!==source.uid)m.tempPow=Number(m.tempPow||0)+1;
}
