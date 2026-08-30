import * as base from './game-v32-loader.ts';

export const CARD_DEFS=base.CARD_DEFS;
export const MONSTER_DEFS=base.MONSTER_DEFS;
export const CHAMPION_DEFS=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;
export const publicView=base.publicView;

type MonsterSnap={uid:string,tempPow:number,powMod:number,turnEffects:any[]|null,name:string};
type GrandineSnap={stackUid:string,actor:number,logLength:number,monsters:MonsterSnap[]};

function grandineSnapshot(state:any,move:any):GrandineSnap|null{
  if(String(move?.type||'')!=='pass_priority')return null;
  const top=state?.stack?.[state.stack.length-1];
  if(!top||String(top.cardId||'')!=='grandine_brillante')return null;
  const actor=Number(top.actor);
  if(actor!==1&&actor!==2)return null;
  const monsters=(state?.board?.monsters||[])
    .filter((m:any)=>Number(m.owner)===actor)
    .map((m:any)=>({
      uid:String(m.uid),
      tempPow:Number(m.tempPow||0),
      powMod:Number(m.powMod||0),
      turnEffects:Array.isArray(m.turnEffects)?structuredClone(m.turnEffects):null,
      name:String(base.MONSTER_DEFS?.[m.cardId]?.name||m.cardId||'Mostro')
    }));
  return {stackUid:String(top.uid||''),actor,logLength:Number(state?.log?.length||0),monsters};
}

function restoreFriendlyMonsters(next:any,snap:GrandineSnap){
  // If the same stack item is still present, this was only the first priority pass.
  if((next?.stack||[]).some((x:any)=>String(x?.uid||'')===snap.stackUid))return;
  const restoredNames=new Set<string>();
  for(const before of snap.monsters){
    const m=(next?.board?.monsters||[]).find((x:any)=>String(x.uid)===before.uid);
    if(!m)continue;
    m.tempPow=before.tempPow;
    m.powMod=before.powMod;
    if(before.turnEffects===null)delete m.turnEffects;
    else m.turnEffects=structuredClone(before.turnEffects);
    restoredNames.add(before.name);
  }
  // Remove only the misleading lines produced by the old all-monsters implementation.
  if(Array.isArray(next?.log)&&next.log.length>snap.logLength&&restoredNames.size){
    const head=next.log.slice(0,snap.logLength);
    const tail=next.log.slice(snap.logLength).filter((line:any)=>{
      const s=String(line||'');
      if(!s.includes('Grandine Brillante'))return true;
      for(const name of restoredNames)if(s.includes(name))return false;
      return true;
    });
    next.log=[...head,...tail];
  }
}

export function act(state:any,p:any,move:any){
  const snap=grandineSnapshot(state,move);
  const next=base.act(state,p,move);
  if(snap)restoreFriendlyMonsters(next,snap);
  return next;
}
