import * as base from './game-v48-loader.ts?rev=souls-uncapped-v3';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;

// Torvald, Spezzatronchi — canonical stats/rule.
// 4 POW / 2 HP. The first time he dies he revives at 1 HP, untapped,
// then dies at the end of that turn. The resurrection can happen only once.
CHAMPION_DEFS.torvald={
  ...(CHAMPION_DEFS.torvald||{}),
  id:'torvald',
  name:'Torvald, Spezzatronchi',
  color:'green',
  basePow:4,
  hp:2
};

function playersOf(s:any){return s?.players||{}}
function normalizeTorvaldPlayer(q:any,turn?:number){
  if(!q)return;
  for(const c of q.champions||[]){
    if(String(c?.id)!=='torvald')continue;
    c.basePow=4;
    c.hp=2;
    c.wounds=Math.max(0,Math.min(Number(c.wounds||0),2));
    // Migrate games where the old v48 resurrection already happened.
    if(c._torvaldRevivedTurn!==undefined&&c._torvaldRevivedTurn!==null)c._torvaldRevivedUsed=true;
    // v48 only blocks a second resurrection in the same turn. Once the
    // ability has been used, prime that guard on every action so it can
    // never revive again on a later turn.
    if(c._torvaldRevivedUsed&&turn!==undefined)c._torvaldRevivedTurn=Number(turn);
  }
}
function normalizeTorvaldState(s:any){
  if(!s)return s;
  const turn=Number(s.turn||0);
  for(const q of Object.values(playersOf(s)))normalizeTorvaldPlayer(q,turn);
  return s;
}
function markRevivalUsed(s:any){
  if(!s)return;
  for(const q of Object.values(playersOf(s)) as any[]){
    for(const c of q?.champions||[]){
      if(String(c?.id)!=='torvald')continue;
      if(c._torvaldTemporaryLifeTurn!==undefined&&c._torvaldTemporaryLifeTurn!==null)c._torvaldRevivedUsed=true;
    }
  }
}

export function newPlayer(...args:any[]){
  const q=(base.newPlayer as any)(...args);
  normalizeTorvaldPlayer(q,0);
  return q;
}
export function newState(...args:any[]){
  const s=(base.newState as any)(...args);
  return normalizeTorvaldState(s);
}
export function act(state:any,p:any,move:any){
  normalizeTorvaldState(state);
  const out=(base.act as any)(state,p,move);
  markRevivalUsed(state);
  normalizeTorvaldState(state);
  return out||state;
}
export function publicView(state:any,p:any){
  normalizeTorvaldState(state);
  markRevivalUsed(state);
  const v=(base.publicView as any)(state,p);
  // publicView contains cloned champion objects; enforce canonical values
  // there as well so an old 3/3 can never leak to the frontend.
  const turn=Number(state?.turn||0);
  for(const q of Object.values(v?.players||{}) as any[])normalizeTorvaldPlayer(q,turn);
  if(v?.championDefs?.torvald){v.championDefs.torvald.basePow=4;v.championDefs.torvald.hp=2}
  return v;
}
