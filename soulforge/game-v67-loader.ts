import * as base from './game-v66-loader.ts';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

function actor(v:any){
 const n=Number(v);
 return n===1||n===2?n:null;
}

function normalize(state:any){
 if(!state)return;
 if(state.focus!=null)state.focus=actor(state.focus);
 if(state.priority!=null)state.priority=actor(state.priority);
 if(state.combat){
  state.combat.initiator=actor(state.combat.initiator);
  if(state.combat.attacker)state.combat.attacker.player=actor(state.combat.attacker.player);
  state.combatPasses=Math.max(0,Number(state.combatPasses)||0);
 }
}

export function act(state:any,p0:any,move:any){
 const p=Number(p0);
 normalize(state);
 const out=(base.act as any)(state,p,move);
 normalize(state);
 return out||state;
}

export function publicView(state:any,p0:any){
 const p=Number(p0);
 normalize(state);

 // Capture the persisted authoritative actors BEFORE legacy publicView runs.
 // Some older layers rebuild/transform the public snapshot and can expose a
 // stale Priority even though the actual state already moved to the opponent.
 const authoritativeFocus=actor(state?.focus);
 const authoritativePriority=actor(state?.priority);
 const authoritativeCombatPasses=Math.max(0,Number(state?.combatPasses)||0);

 const v:any=(base.publicView as any)(state,p);
 if(!v)return v;

 // The client must always render and enable actions from the same authoritative
 // values used by act(). This removes the state where the log says Priority was
 // passed but the UI still shows the previous player as having Priority.
 v.focus=authoritativeFocus;
 v.priority=authoritativePriority;
 if(v.combat)v.combatPasses=authoritativeCombatPasses;

 return v;
}
