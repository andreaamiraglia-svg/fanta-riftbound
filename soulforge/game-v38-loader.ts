import * as base from './game-v37-loader.ts';

export const CARD_DEFS=base.CARD_DEFS;
export const MONSTER_DEFS=base.MONSTER_DEFS;
export const CHAMPION_DEFS=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;
export const publicView=base.publicView;

if(CARD_DEFS?.specchio_acqua){
 CARD_DEFS.specchio_acqua.text='Annulla l’effetto di una carta che costa 1 Anima o meno.';
}

function counterTarget(state:any,move:any){
 let uid:any=null;
 if(move?.type==='cast'&&move?.cardId==='specchio_acqua')uid=move?.targets?.stackUid;
 else if(move?.type==='pass_priority'){
  const top=(state?.stack||[])[(state?.stack||[]).length-1];
  if(top?.kind==='card'&&top?.cardId==='specchio_acqua')uid=top?.targets?.stackUid;
 }
 if(uid==null)return null;
 const item=(state?.stack||[]).find((x:any)=>String(x?.uid)===String(uid));
 if(!item||item.kind!=='card')return null;
 const def=CARD_DEFS?.[item.cardId];
 if(!def||Number(def.cost)>1)return null;
 return {item,def};
}

export function act(state:any,p:any,move:any){
 const restores:Array<()=>void>=[];

 // Il motore precedente di Specchio controllava anche type === 'Magia'.
 // La regola reale è invece: qualsiasi CARTA in Catena dal costo stampato 0 o 1.
 // Per la sola validazione/risoluzione facciamo quindi passare anche Supporti
 // (es. Albero della Vita) attraverso quel controllo, senza alterarne il tipo reale.
 const target=counterTarget(state,move);
 if(target&&target.def.type!=='Magia'){
  const oldType=target.def.type;
  target.def.type='Magia';
  restores.push(()=>{target.def.type=oldType;});
 }

 try{return base.act(state,p,move);}
 finally{for(let i=restores.length-1;i>=0;i--)try{restores[i]();}catch{}}
}
