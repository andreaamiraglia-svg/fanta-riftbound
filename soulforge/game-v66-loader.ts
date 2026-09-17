import * as base from './game-v65-loader.ts';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

function normalize(state:any){
 if(!state)return;
 if(state.focus!=null){const n=Number(state.focus);if(n===1||n===2)state.focus=n;}
 if(state.priority!=null){const n=Number(state.priority);if(n===1||n===2)state.priority=n;}
 if(state.combat){
  const i=Number(state.combat.initiator);if(i===1||i===2)state.combat.initiator=i;
  const a=Number(state.combat.attacker?.player);if(a===1||a===2)state.combat.attacker.player=a;
  state.combatPasses=Math.max(0,Number(state.combatPasses)||0);
 }
}

export function act(state:any,p0:any,move:any){
 const p=Number(p0);
 normalize(state);

 // In a combat response window the player with Priority must be allowed to act
 // independently from who owns the Focus.
 if((move?.type==='pass_priority'||move?.type==='cast')&&state?.priority!=null&&Number(state.priority)!==p){
  throw new Error('Non hai priorità.');
 }

 const out=(base.act as any)(state,p,move);
 normalize(state);
 return out||state;
}

export function publicView(state:any,p0:any){
 const p=Number(p0);
 normalize(state);
 const v:any=(base.publicView as any)(state,p);
 if(!v)return v;
 if(v.focus!=null)v.focus=Number(v.focus);
 if(v.priority!=null)v.priority=Number(v.priority);

 // The legacy frontend checks stack before combat and would otherwise disable
 // Response cards as soon as a card is already on the stack. During combat,
 // Priority still lets the current player add Response cards to that stack.
 if(v.combat && (v.stack||[]).length && Number(v.priority)===p){
  const me=v.players?.[String(p)];
  if(Array.isArray(me?.handCards)){
   me.handCards=me.handCards.map((card:any)=>card?.speed==='response'?{...card,speed:'instant',responseInCombat:true}:card);
  }
 }
 return v;
}
