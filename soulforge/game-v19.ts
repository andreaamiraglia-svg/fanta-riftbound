import {
  newState,
  newPlayer,
  act as baseAct,
  publicView as basePublicView,
  CARD_DEFS,
  MONSTER_DEFS,
  CHAMPION_DEFS,
} from './game-v18.ts';

export { newState, newPlayer };

function normalizeState(s:any){
  if(!s || typeof s!=='object') return s;
  s.board ||= {monsters:[]};
  s.board.monsters ||= [];
  s.stack ||= [];
  s.triggerQueue ||= [];
  s.enterQueue ||= [];
  s.delayedKills ||= [];
  s.log ||= [];
  s.mainPasses = Number(s.mainPasses||0);
  s.priorityPasses = Number(s.priorityPasses||0);
  s.stackInitiator ??= null;
  s.combat ??= null;
  s.pendingChoice ??= null;
  s.endTurnPending = !!s.endTurnPending;

  for(const p of [1,2]){
    const q=s.players?.[String(p)];
    if(!q) continue;
    q.souls ||= {};
    q.souls.red = Number(q.souls.red||0);
    q.souls.green = Number(q.souls.green||0);
    q.souls.black = Number(q.souls.black||0);
    q.deck ||= [];
    q.grave ||= [];
    q.hand ||= [];
    q.monsterDeck ||= [];
    q.monsterGrave ||= [];
    q.banishedMonsters ||= [];
    q.recycleCount = Number(q.recycleCount||0);
    q.selected = !!q.selected;
    q.fireCloud = !!q.fireCloud;
    q.lyrandelUsed = !!q.lyrandelUsed;
    q.firstMagicCast = !!q.firstMagicCast;
    q.killedMonsterThisTurn = !!q.killedMonsterThisTurn;
    q.champions ||= [];
    for(const c of q.champions){
      const d=CHAMPION_DEFS[c.id];
      if(d){
        c.name ||= d.name;
        c.color ||= d.color;
        c.basePow = Number(c.basePow ?? d.basePow);
        c.hp = Number(c.hp ?? d.hp);
      }
      c.wounds = Number(c.wounds||0);
      c.damage = Number(c.damage||0);
      c.tempPow = Number(c.tempPow||0);
      c.tapped = !!c.tapped;
      c.defeated = !!c.defeated;
      c.cantAttackTurn ??= null;
    }
    if(!Array.isArray(q.deckColors) || !q.deckColors.length){
      q.deckColors=[...new Set(q.champions.map((c:any)=>c.color).filter(Boolean))];
    }
  }

  for(const m of s.board.monsters){
    m.damage=Number(m.damage||0);
    m.tempPow=Number(m.tempPow||0);
  }
  return s;
}

export function act(s:any,p:number,a:any){
  normalizeState(s);
  return baseAct(s,p,a);
}

export function publicView(s:any,p:number){
  normalizeState(s);
  return basePublicView(s,p);
}
