import {
  newState,
  newPlayer,
  act as baseAct,
  publicView,
} from "./game-v15.ts";

export { newState, newPlayer, publicView };

const pl=(s:any,p:number)=>s?.players?.[String(p)];

export function act(s:any,p:number,a:any){
  if(a?.type!=='select_cards'||s?.status!=='select') return baseAct(s,p,a);

  const player=pl(s,p);
  if(!player) return baseAct(s,p,a);

  const available=[...(player.deck||[])];
  if(available.length>=6) return baseAct(s,p,a);

  // Con meno di 6 carte disponibili il giocatore deve giocarle tutte.
  const submitted=[...new Set((a.cardIds||[]).map((x:any)=>String(x)))];
  if(submitted.length!==available.length||available.some((id:string)=>!submitted.includes(id))){
    throw new Error(`Hai meno di 6 carte: devi giocare tutte le ${available.length} carte disponibili.`);
  }

  // Il motore base richiede esattamente 6 ID. Aggiungiamo segnaposto temporanei,
  // lasciamo che gestisca normalmente selezione/inizio turno, poi li eliminiamo subito.
  const fillers=Array.from({length:6-available.length},(_,i)=>`__sf_select_fill_${p}_${s.turn}_${i}`);
  player.deck=[...available,...fillers];

  let out:any;
  try{
    out=baseAct(s,p,{...a,cardIds:[...available,...fillers]});
  }catch(e){
    const current=pl(s,p);
    if(current){
      current.deck=available;
      current.hand=(current.hand||[]).filter((id:string)=>!fillers.includes(id));
    }
    throw e;
  }

  const outPlayer=pl(out,p);
  if(outPlayer){
    outPlayer.hand=(outPlayer.hand||[]).filter((id:string)=>!fillers.includes(id));
    outPlayer.deck=(outPlayer.deck||[]).filter((id:string)=>!fillers.includes(id));
    outPlayer.grave=(outPlayer.grave||[]).filter((id:string)=>!fillers.includes(id));
  }

  // Rende il log coerente con il numero reale di carte giocate.
  if(Array.isArray(out?.log)){
    const name=outPlayer?.name||'Il giocatore';
    for(let i=out.log.length-1;i>=0;i--){
      if(String(out.log[i]).includes(`${name} ha scelto le 6 carte.`)){
        out.log[i]=available.length===1
          ? `${name} gioca l'unica carta disponibile.`
          : `${name} gioca tutte le ${available.length} carte disponibili.`;
        break;
      }
    }
  }

  return out;
}
