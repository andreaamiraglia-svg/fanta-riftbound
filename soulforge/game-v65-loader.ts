import * as base from './game-v64-loader.ts';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

function normalizeStateActors(state:any){
 if(!state)return;
 if(state.focus!==null&&state.focus!==undefined){
  const n=Number(state.focus);if(n===1||n===2)state.focus=n;
 }
 if(state.priority!==null&&state.priority!==undefined){
  const n=Number(state.priority);if(n===1||n===2)state.priority=n;
 }
 if(state.combat){
  const i=Number(state.combat.initiator);if(i===1||i===2)state.combat.initiator=i;
  const a=Number(state.combat.attacker?.player);if(a===1||a===2)state.combat.attacker.player=a;
  state.combatPasses=Math.max(0,Number(state.combatPasses)||0);
 }
}

function assertPriorityAction(state:any,p:number,move:any){
 if(!state?.priority)return;
 if(!['cast','pass_priority'].includes(String(move?.type||'')))return;
 if(Number(state.priority)!==p)throw new Error('Non hai priorità.');
}

function withCombatResponseWindow(state:any,p:number,move:any,run:()=>any){
 if(move?.type!=='cast'||!state?.combat||!(state?.stack||[]).length||Number(state?.priority)!==p)return run();
 const def=CARD_DEFS?.[String(move.cardId||'')];
 if(!def||def.speed!=='response')return run();
 const old=def.speed;
 def.speed='instant';
 try{return run()}finally{def.speed=old}
}

export function act(state:any,p0:any,move:any){
 const p=Number(p0);
 normalizeStateActors(state);
 assertPriorityAction(state,p,move);
 const out=withCombatResponseWindow(state,p,move,()=> (base.act as any)(state,p,move));
 normalizeStateActors(state);
 return out||state;
}

export function publicView(state:any,p0:any){
 normalizeStateActors(state);
 const v:any=(base.publicView as any)(state,Number(p0));
 if(v){
  if(v.focus!==null&&v.focus!==undefined)v.focus=Number(v.focus);
  if(v.priority!==null&&v.priority!==undefined)v.priority=Number(v.priority);
 }
 return v;
}
