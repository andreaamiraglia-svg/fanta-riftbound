import * as base from './game-v36-loader.ts';

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
 let restore:null|(()=>void)=null;
 // Taglio Fiammante è sempre una Risposta valida mentre esiste un combattimento.
 // Il motore base considera solo le Istantanee quando una carta è già in Catena,
 // quindi durante la sola risoluzione del cast lo trattiamo come instant.
 if(move?.type==='cast'&&move?.cardId==='taglio_fiammante'&&state?.combat){
  const def=CARD_DEFS?.taglio_fiammante;
  if(def){
   const old=def.speed;
   def.speed='instant';
   restore=()=>{def.speed=old;};
  }
 }
 try{return base.act(state,p,move);}
 finally{try{restore?.();}catch{}}
}
