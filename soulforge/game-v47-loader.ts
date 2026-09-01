import * as base from './game-v46-loader.ts';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const other=(p:number)=>p===1?2:1;

function enforceStarterGameover(s:any){
 if(!s?.players)return s;
 if(s.status!=='gameover'){
  for(const p of [1,2]){
   const starters=(player(s,p)?.champions||[]).filter((c:any)=>!c?.supportChampion);
   if(starters.length&&starters.every((c:any)=>!!c?.defeated)){
    s.status='gameover';
    s.winner=other(p);
    const winnerName=player(s,other(p))?.name||`Giocatore ${other(p)}`;
    const last=Array.isArray(s.log)?String(s.log[s.log.length-1]||''):'';
    if(!last.includes('vince la partita')){
     s.log ||= [];
     s.log.push(`${winnerName} vince la partita!`);
     if(s.log.length>180)s.log=s.log.slice(-180);
    }
    break;
   }
  }
 }
 if(s.status==='gameover'){
  // Gameover è uno stato terminale. Non devono restare interazioni o risoluzioni
  // pendenti che il frontend/polling possano tentare di continuare a processare.
  s.priority=null;
  s.priorityPasses=0;
  s.mainPasses=0;
  s.stack=[];
  s.stackInitiator=null;
  s.combat=null;
  s.pendingChoice=null;
  s.triggerQueue=[];
  s.enterQueue=[];
  s.delayedKills=[];
  s.endTurnPending=false;
  if(s._orangeTriggers) s._orangeTriggers=[];
  if(s._damageEvent) delete s._damageEvent;
 }
 return s;
}

export function act(state:any,p:any,move:any){
 const out=base.act(state,p,move);
 return enforceStarterGameover(out||state);
}

export function publicView(state:any,p:any){
 enforceStarterGameover(state);
 return base.publicView(state,p);
}
