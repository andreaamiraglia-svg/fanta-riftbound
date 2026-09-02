import {
  newState,
  newPlayer,
  act as baseAct,
  publicView,
} from "https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v14.ts";

export { newState, newPlayer, publicView };

export function act(s:any,p:number,a:any){
  const wasHeldByPlayer = s?.chainHoldPriority === p;

  // Quando il giocatore decide di passare, termina la finestra in cui
  // poteva concatenare proprie Istantanee prima di cedere la priorità.
  if(wasHeldByPlayer && a?.type === 'pass_priority'){
    delete s.chainHoldPriority;
  }

  const out = baseAct(s,p,a);

  // Ogni volta che una Magia viene aggiunta alla Catena, chi l'ha giocata
  // mantiene la priorità. Può quindi aggiungere una o più Istantanee proprie
  // prima di premere "Passa priorità".
  if(a?.type === 'cast' && out?.status === 'main' && (out?.stack?.length || 0) > 0){
    const top = out.stack[out.stack.length - 1];
    if(top?.actor === p && top?.cardId === a.cardId){
      out.priority = p;
      out.priorityPasses = 0;
      out.chainHoldPriority = p;

      // Il client usa già questo flag per non fare auto-pass automatico.
      // Lo riutilizziamo anche fuori dal combattimento per la finestra di auto-chain.
      out.combatSpellPriority = p;
    }
  }

  if(wasHeldByPlayer && a?.type === 'pass_priority'){
    delete out.chainHoldPriority;
  }

  if(!(out?.stack?.length)){
    delete out.chainHoldPriority;
    if(!out?.combat) delete out.combatSpellPriority;
  }

  return out;
}
