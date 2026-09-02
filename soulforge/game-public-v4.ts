import {
  newState,
  newPlayer,
  act,
  publicView as basePublicView,
  CARD_DEFS,
  MONSTER_DEFS,
} from "./game.ts";

export { newState, newPlayer, act };

export function publicView(state:any,p:number){
  const view=basePublicView(state,p);
  for(const q of [1,2]){
    const raw=state.players?.[String(q)];
    const shown=view.players?.[String(q)];
    if(!raw||!shown)continue;

    // I cimiteri sono informazioni pubbliche.
    shown.graveCards=(raw.grave||[]).map((id:string)=>CARD_DEFS[id]).filter(Boolean);
    shown.monsterGraveCards=(raw.monsterGrave||[]).map((id:string)=>MONSTER_DEFS[id]).filter(Boolean);
    shown.graveCount=(raw.grave||[]).length;
    shown.monsterGraveCount=(raw.monsterGrave||[]).length;
  }
  return view;
}
