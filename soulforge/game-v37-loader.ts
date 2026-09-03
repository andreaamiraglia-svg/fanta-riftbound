import * as base from './game-v36-loader.ts?rev=souls-uncapped-v3';

export const CARD_DEFS=base.CARD_DEFS;
export const MONSTER_DEFS=base.MONSTER_DEFS;
export const CHAMPION_DEFS=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;
export const publicView=base.publicView;

export function act(state:any,p:any,move:any){
 const restores:Array<()=>void>=[];

 // Taglio Fiammante è sempre una Risposta valida mentre esiste un combattimento.
 // Il motore base considera solo le Istantanee quando una carta è già in Catena,
 // quindi durante la sola validazione del cast lo trattiamo come instant.
 if(move?.type==='cast'&&move?.cardId==='taglio_fiammante'&&state?.combat){
  const def=CARD_DEFS?.taglio_fiammante;
  if(def){const old=def.speed;def.speed='instant';restores.push(()=>{def.speed=old;});}
 }

 // Specchio d'Acqua deve poter rispondere a una Magia anche fuori dal combattimento:
 // quando c'è una Catena e il giocatore ha priorità, il motore deve accettarlo
 // come Istantanea. La validazione specifica di game-v34 continua a controllare
 // che il bersaglio sia una Magia dal costo stampato 0 o 1.
 if(move?.type==='cast'&&move?.cardId==='specchio_acqua'&&(state?.stack||[]).length){
  const def=CARD_DEFS?.specchio_acqua;
  if(def){const old=def.speed;def.speed='instant';restores.push(()=>{def.speed=old;});}
 }

 try{return base.act(state,p,move);}
 finally{for(let i=restores.length-1;i>=0;i--)try{restores[i]();}catch{}}
}
