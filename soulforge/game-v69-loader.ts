import * as base from './game-v68-loader.ts';
import {engine61 as E} from './game-v32-loader.ts?rev=souls-uncapped-v3';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const SUPERIOR_CHAMPIONS:any=(base as any).SUPERIOR_CHAMPIONS;
export const newPlayer:any=base.newPlayer;
export const newState:any=base.newState;

const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const log=(s:any,msg:string)=>{s.log ||= [];s.log.push(msg);if(s.log.length>220)s.log=s.log.slice(-220)};

function sourceActorBeforeMove(state:any,p:number,move:any){
 if(move?.type==='pass_priority'&&state?.stack?.length){
  const top=state.stack[state.stack.length-1];
  const actor=Number(top?.actor);
  if(actor===1||actor===2)return actor;
 }
 return p===1||p===2?p:1;
}

/*
 Regola universale: se una riduzione di POW porta un personaggio che ha già
 danni a danni >= POW, la soglia viene applicata immediatamente.
 - Campioni/Supporti: 1 Ferita e pulizia dei danni tramite il motore normale.
 - Mostri: vengono sconfitti, come quando i danni raggiungono il loro POW.
 Il controllo richiede almeno 1 danno: portare semplicemente un'unità a 0 POW
 senza danni non crea una Ferita automatica (gli effetti che feriscono a 0 POW,
 come Hilda Superiore, continuano a farlo esplicitamente).
*/
function enforceDamageThresholds(state:any,killer:number){
 let changed=true,guard=0;
 while(changed&&guard++<24){
  changed=false;
  for(const p of [1,2]){
   for(const c of [...(player(state,p)?.champions||[])]){
    if(!c||c.defeated)continue;
    const damage=Math.max(0,Number(c.damage||0));
    const pow=Math.max(0,Number(E.pow(state,p,c)||0));
    if(damage<=0||damage<pow)continue;
    const beforeWounds=Number(c.wounds||0);
    E.wound(state,p,c,'danni pari o superiori al POW dopo una riduzione');
    if(Number(c.wounds||0)>beforeWounds){
     changed=true;
     if(String(c.id)==='torvald'&&!c.defeated){
      c.tapped=false;
      log(state,`${c.superior?'Furia Inarrestabile':'Ascia Furiosa'}: ${c.name} diventa attivo.`);
     }
    }
   }
  }
  for(const m of [...(state?.board?.monsters||[])]){
   if(!m)continue;
   const damage=Math.max(0,Number(m.damage||0));
   const pow=Math.max(0,Number(E.monsterPow(state,m)||0));
   if(damage<=0||damage<pow)continue;
   E.kill(state,killer,m,'danni pari o superiori al POW dopo una riduzione',true);
   changed=true;
  }
 }
 try{E.prepare(state)}catch{}
}

export function act(state:any,p0:any,move:any){
 const p=Number(p0),killer=sourceActorBeforeMove(state,p,move);
 const out=(base.act as any)(state,p,move);
 enforceDamageThresholds(state,killer);
 // publicView di v68 completa anche eventuali Ascensioni nate da una Ferita qui sopra.
 try{(base.publicView as any)(state,p)}catch{}
 enforceDamageThresholds(state,killer);
 return out||state;
}

export function publicView(state:any,p0:any){
 return (base.publicView as any)(state,Number(p0));
}
