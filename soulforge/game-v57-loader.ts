import * as base from './game-v56-loader.ts?rev=valtheris-protector-v1';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

Object.assign(CHAMPION_DEFS,{
 valtheris:{...(CHAMPION_DEFS?.valtheris||{}),id:'valtheris',name:'Valtheris Spirito Eterno',color:'blue',basePow:3,hp:3,text:'Protettore dell’Anima — All’inizio del tuo turno, ottiene 1 Armatura. Tappa: ottiene 1 Armatura e Provocazione per questo turno.'}
});

const other=(p:number)=>p===1?2:1;
const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const champ=(s:any,p:number,id:string)=>(player(s,p)?.champions||[]).find((c:any)=>String(c?.id)===id);
const log=(s:any,msg:string)=>{s.log ||= [];s.log.push(msg);if(s.log.length>180)s.log=s.log.slice(-180);};

function clearExpiredValtherisProvocation(s:any){
 for(const p of [1,2]){
  const c=champ(s,p,'valtheris');
  if(c&&Number(c._valtherisProvTurn)!==Number(s?.turn))c.provocazione=false;
 }
}
function activateValtheris(s:any,p:number){
 if(s.status!=='main'||s.priority||s.stack?.length||s.combat||s.pendingChoice||Number(s.focus)!==p)throw new Error('Puoi usare Protettore dell’Anima solo con il Focus e senza Catene.');
 const c=champ(s,p,'valtheris');
 if(!c||c.defeated||c.tapped)throw new Error('Valtheris non è disponibile.');
 c.tapped=true;
 s.stackInitiator=p;
 s.stack ||= [];
 s.stack.push({uid:crypto.randomUUID(),kind:'effect',actor:p,sourceCardId:'valtheris',effectId:'valtheris_protettore',effectName:'Protettore dell’Anima',targets:{},meta:{}});
 s.priority=other(p);s.priorityPasses=0;s.mainPasses=0;
 log(s,`${c.name} attiva Protettore dell’Anima e si tappa.`);
 return s;
}
function resolveValtheris(s:any,p:number){
 const c=champ(s,p,'valtheris');
 if(!c||c.defeated)return;
 c.armor=Math.max(0,Number(c.armor||0))+1;
 c.provocazione=true;c._valtherisProvTurn=Number(s.turn);
 log(s,`Protettore dell’Anima: ${c.name} ottiene 1 Armatura e Provocazione fino alla fine del turno.`);
}
export function act(state:any,p0:any,move:any){
 const p=Number(p0);
 clearExpiredValtherisProvocation(state);
 if(move?.type==='activate_champion'&&String(move?.champId)==='valtheris')return activateValtheris(state,p);
 const top=move?.type==='pass_priority'&&Array.isArray(state?.stack)&&state.stack.length?state.stack[state.stack.length-1]:null;
 const resolvesValtheris=String(top?.effectId||'')==='valtheris_protettore'&&Number(top?.actor)===p;
 const out=(base.act as any)(state,p,move);
 if(resolvesValtheris)resolveValtheris(state,p);
 clearExpiredValtherisProvocation(state);
 return out||state;
}
export function publicView(state:any,p:any){
 clearExpiredValtherisProvocation(state);
 return (base.publicView as any)(state,p);
}
