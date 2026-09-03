import * as base from './game-v55-loader.ts?rev=simultaneous-defeat-draw-v1';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

function startersDefeated(state:any,p:number){
 const starters=(state?.players?.[String(p)]?.champions||[]).filter((c:any)=>!c?.supportChampion);
 return starters.length>0&&starters.every((c:any)=>!!c?.defeated);
}
function settleSimultaneousDefeat(state:any){
 if(!state?.players)return;
 if(!startersDefeated(state,1)||!startersDefeated(state,2))return;
 const changed=state.status!=='gameover'||state.winner!=null||!state.draw;
 state.status='gameover';
 state.winner=null;
 state.draw=true;
 state.priority=null;
 state.priorityPasses=0;
 state.mainPasses=0;
 state.stack=[];
 state.stackInitiator=null;
 state.combat=null;
 state.pendingChoice=null;
 state.triggerQueue=[];
 state.enterQueue=[];
 state.delayedKills=[];
 state.endTurnPending=false;
 if(changed){
  state.log ||= [];
  const last=String(state.log[state.log.length-1]||'');
  if(!last.includes('pareggio'))state.log.push('Entrambi i giocatori non hanno più Campioni: la partita termina in pareggio.');
 }
}
export function act(state:any,p:any,move:any){
 const out=(base.act as any)(state,p,move);
 settleSimultaneousDefeat(state);
 return out||state;
}
export function publicView(state:any,p:any){
 settleSimultaneousDefeat(state);
 return (base.publicView as any)(state,p);
}
