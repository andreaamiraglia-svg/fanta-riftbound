import * as base from './game-v57-loader.ts?rev=valtheris-resolve-fix-v1';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const champ=(s:any,p:number,id:string)=>(player(s,p)?.champions||[]).find((c:any)=>String(c?.id)===id);
const log=(s:any,msg:string)=>{s.log ||= [];s.log.push(msg);if(s.log.length>180)s.log=s.log.slice(-180);};

function isLegacy(item:any){return String(item?.effectId||item?.trigger?.effectId||'')==='valtheris_armor'&&String(item?.sourceCardId||item?.trigger?.sourceCardId||'')==='valtheris';}
function removeLegacyAutoTrigger(s:any){
 if(!s)return;
 if(Array.isArray(s.triggerQueue))s.triggerQueue=s.triggerQueue.filter((x:any)=>!isLegacy(x));
 if(Array.isArray(s._v48Triggers))s._v48Triggers=s._v48Triggers.filter((x:any)=>!isLegacy(x));
 if(Array.isArray(s.stack))s.stack=s.stack.filter((x:any)=>!isLegacy(x));
 if(isLegacy(s.pendingChoice))s.pendingChoice=null;
 if(!s.pendingChoice&&!s.stack?.length){s.priority=null;s.priorityPasses=0;}
}
function applyTurnStartArmor(s:any){
 if(s?.status!=='main')return;
 for(const p of [1,2]){
  const c=champ(s,p,'valtheris');
  if(!c||c.defeated||Number(c._valtherisStartArmorTurn)===Number(s.turn))continue;
  c.armor=Math.max(0,Number(c.armor||0))+1;
  c._valtherisStartArmorTurn=Number(s.turn);
  log(s,`Protettore dell’Anima: all’inizio del turno, ${c.name} ottiene 1 Armatura.`);
 }
}
function resolveManualProtector(s:any,actor:number){
 const c=champ(s,actor,'valtheris');
 if(!c||c.defeated)return;
 c.armor=Math.max(0,Number(c.armor||0))+1;
 c.provocazione=true;
 c._valtherisProvTurn=Number(s.turn);
 log(s,`Protettore dell’Anima: ${c.name} ottiene 1 Armatura e Provocazione fino alla fine del turno.`);
}
export function act(state:any,p:any,move:any){
 const top=move?.type==='pass_priority'&&Array.isArray(state?.stack)&&state.stack.length?state.stack[state.stack.length-1]:null;
 const resolvesManual=String(top?.effectId||'')==='valtheris_protettore';
 const actor=Number(top?.actor);
 const out=(base.act as any)(state,p,move);
 if(resolvesManual)resolveManualProtector(state,actor);
 removeLegacyAutoTrigger(state);
 applyTurnStartArmor(state);
 return out||state;
}
export function publicView(state:any,p:any){
 removeLegacyAutoTrigger(state);
 applyTurnStartArmor(state);
 return (base.publicView as any)(state,p);
}
