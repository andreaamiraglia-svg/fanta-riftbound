import * as base from './game-v33-loader.ts';

export const CARD_DEFS=base.CARD_DEFS;
export const MONSTER_DEFS=base.MONSTER_DEFS;
export const CHAMPION_DEFS=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;
export const publicView=base.publicView;

function printedCounterTarget(state:any,uid:any){
  const target=(state?.stack||[]).find((x:any)=>String(x?.uid)===String(uid));
  if(!target||target.kind!=='card')return null;
  const def=CARD_DEFS?.[target.cardId];
  if(!def||def.type!=='Magia'||Number(def.cost)>1)return null;
  return target;
}

function specchioTargetForMove(state:any,move:any){
  if(move?.type==='cast'&&move?.cardId==='specchio_acqua'){
    return printedCounterTarget(state,move?.targets?.stackUid);
  }
  if(move?.type==='pass_priority'){
    const top=(state?.stack||[])[(state?.stack||[]).length-1];
    if(top?.kind==='card'&&top?.cardId==='specchio_acqua'){
      return printedCounterTarget(state,top?.targets?.stackUid);
    }
  }
  return null;
}

export function act(state:any,p:any,move:any){
  let restoreTaglio:null|(()=>void)=null;
  let restoreCounter:null|(()=>void)=null;

  // Taglio Fiammante è una Risposta di combattimento: se c'è già una Catena
  // durante il combattimento deve poter essere aggiunto quando il giocatore ha priorità.
  if(move?.type==='cast'&&move?.cardId==='taglio_fiammante'&&state?.combat&&(state?.stack||[]).length){
    const def=CARD_DEFS?.taglio_fiammante;
    if(def){
      const old=def.speed;
      def.speed='instant';
      restoreTaglio=()=>{def.speed=old;};
    }
  }

  // Specchio d'Acqua guarda il costo stampato della Magia (0 o 1), non il costo
  // effettivamente pagato dopo modificatori come Ragno dei Germogli.
  const counterTarget=specchioTargetForMove(state,move);
  if(counterTarget){
    const had=Object.prototype.hasOwnProperty.call(counterTarget,'paidCost');
    const old=counterTarget.paidCost;
    counterTarget.paidCost=Number(CARD_DEFS[counterTarget.cardId]?.cost??old??99);
    restoreCounter=()=>{
      if(had)counterTarget.paidCost=old;
      else delete counterTarget.paidCost;
    };
  }

  try{
    return base.act(state,p,move);
  }finally{
    try{restoreCounter?.();}catch{}
    try{restoreTaglio?.();}catch{}
  }
}
