import * as base from './game-v63-loader.ts';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

function normalizeCombatPriority(state:any){
 if(!state)return;
 if(state.priority!==null&&state.priority!==undefined){
  const n=Number(state.priority);
  if(n===1||n===2)state.priority=n;
 }
 if(state.combat){
  const initiator=Number(state.combat.initiator);
  if(initiator===1||initiator===2)state.combat.initiator=initiator;
  const attacker=Number(state.combat.attacker?.player);
  if(attacker===1||attacker===2)state.combat.attacker.player=attacker;
  state.combatPasses=Math.max(0,Number(state.combatPasses)||0);
 }
}

function repairFreshAttackPriority(state:any,move:any){
 if(move?.type!=='attack'||!state?.combat||state.pendingChoice||(state.stack||[]).length)return;
 const initiator=Number(state.combat.initiator||state.combat.attacker?.player);
 if(initiator!==1&&initiator!==2)return;
 state.combat.initiator=initiator;
 if(state.combat.attacker)state.combat.attacker.player=initiator;
 state.combatPasses=0;
 state.priority=3-initiator;
 state.priorityPasses=0;
}

export function act(state:any,p0:any,move:any){
 normalizeCombatPriority(state);
 const out=(base.act as any)(state,Number(p0),move);
 repairFreshAttackPriority(state,move);
 normalizeCombatPriority(state);
 return out||state;
}

export function publicView(state:any,p0:any){
 normalizeCombatPriority(state);
 return (base.publicView as any)(state,Number(p0));
}
