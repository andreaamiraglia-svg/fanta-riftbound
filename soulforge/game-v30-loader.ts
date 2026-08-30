import * as base from './game-v22-loader.ts';

export const CARD_DEFS=base.CARD_DEFS;
export const MONSTER_DEFS=base.MONSTER_DEFS;
export const CHAMPION_DEFS=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;
export const publicView=base.publicView;

type Snap={tempPow:number;powMod:number;armor:number;cantAttackTurn:any;tapped:boolean;cardId?:string};

function num(v:any){const n=Number(v);return Number.isFinite(n)?n:0;}
function keyChamp(p:number,id:string){return `c:${p}:${id}`;}
function keyMonster(uid:string){return `m:${uid}`;}

function capture(state:any){
  const out=new Map<string,Snap>();
  for(const p of [1,2]){
    for(const c of state?.players?.[String(p)]?.champions||[]){
      out.set(keyChamp(p,String(c.id)),{tempPow:num(c.tempPow),powMod:0,armor:num(c.armor),cantAttackTurn:c.cantAttackTurn??null,tapped:!!c.tapped,cardId:String(c.id)});
    }
  }
  for(const m of state?.board?.monsters||[]){
    out.set(keyMonster(String(m.uid)),{tempPow:num(m.tempPow),powMod:num(m.powMod),armor:num(m.armor),cantAttackTurn:null,tapped:false,cardId:String(m.cardId)});
  }
  return out;
}

function sourceFromState(state:any,move:any){
  const type=String(move?.type||'');
  if(type==='pass_priority'){
    const top=state?.stack?.[state.stack.length-1];
    if(top)return String(top.cardId||top.sourceCardId||'')||null;
  }
  if(type==='cast'&&move?.cardId)return String(move.cardId);
  if(type==='activate_champion'&&move?.champId)return String(move.champId);
  return null;
}

function addEffect(target:any,turn:number,sourceCardId:string|null,kind:'buff'|'debuff'|'status',label:string){
  if(!target||!sourceCardId||!label)return;
  const list=Array.isArray(target.turnEffects)?target.turnEffects:[];
  list.push({turn,sourceCardId,kind,label});
  target.turnEffects=list.filter((x:any)=>Number(x?.turn)===Number(turn)).slice(-24);
}

function clearEffects(state:any){
  for(const p of [1,2])for(const c of state?.players?.[String(p)]?.champions||[])c.turnEffects=[];
  for(const m of state?.board?.monsters||[])m.turnEffects=[];
}

function recordDiff(before:Map<string,Snap>,after:any,sourceCardId:string|null,turn:number){
  for(const p of [1,2]){
    for(const c of after?.players?.[String(p)]?.champions||[]){
      const b=before.get(keyChamp(p,String(c.id)));
      if(!b)continue;
      const powDelta=num(c.tempPow)-b.tempPow;
      if(powDelta!==0)addEffect(c,turn,sourceCardId,powDelta>0?'buff':'debuff',`POW ${powDelta>0?'+':''}${powDelta}`);
      const armorDelta=num(c.armor)-b.armor;
      if(armorDelta>0)addEffect(c,turn,sourceCardId,'buff',`Armatura +${armorDelta}`);
      if((c.cantAttackTurn??null)!==b.cantAttackTurn&&Number(c.cantAttackTurn)===Number(turn))addEffect(c,turn,sourceCardId,'debuff','Non può attaccare');
      if(b.tapped&&!c.tapped&&sourceCardId)addEffect(c,turn,sourceCardId,'status','Riattivato');
    }
  }
  for(const m of after?.board?.monsters||[]){
    const b=before.get(keyMonster(String(m.uid)));
    if(!b)continue;
    const powDelta=(num(m.tempPow)-b.tempPow)+(num(m.powMod)-b.powMod);
    let powSource=sourceCardId;
    if(String(m.cardId)==='orso_furioso'&&powDelta>0)powSource='orso_furioso';
    if(powDelta!==0)addEffect(m,turn,powSource,powDelta>0?'buff':'debuff',`POW ${powDelta>0?'+':''}${powDelta}`);
    const armorDelta=num(m.armor)-b.armor;
    if(armorDelta>0)addEffect(m,turn,sourceCardId,'buff',`Armatura +${armorDelta}`);
  }
}

export function act(state:any,p:any,move:any){
  const turnBefore=Number(state?.turn||0);
  const snap=capture(state);
  const sourceCardId=sourceFromState(state,move);
  const next=base.act(state,p,move);
  const turnAfter=Number(next?.turn||0);
  if(turnAfter!==turnBefore){
    clearEffects(next);
    return next;
  }
  recordDiff(snap,next,sourceCardId,turnAfter);
  return next;
}
