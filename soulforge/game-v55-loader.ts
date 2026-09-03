import * as base from './game-v54-loader.ts?rev=bang-champion-monster-v2';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

const other=(p:number)=>p===1?2:1;

function restoreFalcoPriority(state:any){
 if(state?.pendingChoice||state?.priority||state?.combat||state?.status==='gameover')return;
 const stack=state?.stack;
 if(!Array.isArray(stack)||!stack.length)return;
 const top=stack[stack.length-1];
 if(String(top?.effectId||'')!=='falco_alba_enter')return;
 const actor=Number(top?.actor);
 if(actor!==1&&actor!==2)return;
 state.priority=other(actor);
 state.priorityPasses=0;
 state.mainPasses=0;
}

export function act(state:any,p:any,move:any){
 restoreFalcoPriority(state);
 const out=(base.act as any)(state,p,move);
 restoreFalcoPriority(state);
 return out||state;
}

export function publicView(state:any,p:any){
 restoreFalcoPriority(state);
 return (base.publicView as any)(state,p);
}
