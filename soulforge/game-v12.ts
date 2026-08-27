import { newState, newPlayer, act as baseAct, publicView } from "https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game.ts";

export { newState, newPlayer, publicView };

export function act(s:any,p:number,a:any){
  const limitFirstTurn = s?.status === 'select' && s?.turn === 1 && a?.type === 'select_cards';
  if(!limitFirstTurn) return baseAct(s,p,a);

  const saved:any = {};
  for(const q of [1,2]){
    const pl = s?.players?.[String(q)];
    if(!pl) continue;
    saved[q] = [...(pl.monsterDeck || [])];
    pl.monsterDeck = saved[q].length ? [saved[q][0]] : [];
  }

  try{
    const wasStatus = s.status;
    const out = baseAct(s,p,a);
    const startedTurn = wasStatus === 'select' && out?.status === 'main' && out?.turn === 1;

    for(const q of [1,2]){
      const pl = out?.players?.[String(q)];
      if(!pl || !saved[q]) continue;
      pl.monsterDeck = startedTurn ? saved[q].slice(1) : saved[q];
    }
    return out;
  }catch(e){
    for(const q of [1,2]){
      const pl = s?.players?.[String(q)];
      if(pl && saved[q]) pl.monsterDeck = saved[q];
    }
    throw e;
  }
}
