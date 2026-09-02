import * as base from './game-v38-loader.ts';

export const CARD_DEFS=base.CARD_DEFS;
export const MONSTER_DEFS=base.MONSTER_DEFS;
export const CHAMPION_DEFS=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;
export const publicView=base.publicView;

CARD_DEFS.spacca_teste={
 id:'spacca_teste',
 name:'Spacca Teste',
 color:'red',
 cost:1,
 speed:'response',
 type:'Magia',
 text:'Risposta (Puoi giocarla quando hai il Focus o durante un combattimento.) Seleziona un tuo Campione. Fino alla fine del turno, quando quel Campione difende, alla fine del combattimento infligge danni al Campione attaccante pari al proprio POW.',
 effect:'spacca_teste'
};

const other=(p:number)=>p===1?2:1;
const champ=(s:any,p:number,id:string)=>(s?.players?.[String(p)]?.champions||[]).find((c:any)=>String(c?.id)===String(id));
function rawPow(s:any,p:number,c:any){
 let v=Number(c?.basePow||0)+Number(c?.tempPow||0);
 if(c?.id==='kael'&&(s?.players?.[String(p)]?.hand?.length||0)===0&&s?.status==='main')v+=3;
 return v;
}
function log(s:any,msg:string){if(Array.isArray(s?.log))s.log.push(msg)}
function wound(s:any,p:number,c:any,source:string){
 if(!c||c.defeated)return;
 c.wounds=Number(c.wounds||0)+1;
 c.damage=0;
 log(s,`${c.name} subisce una Ferita (${c.wounds}/${c.hp}) da ${source}.`);
 if(c.wounds>=Number(c.hp||0)){
  c.defeated=true;c.tapped=true;
  log(s,`${c.name} è sconfitto.`);
  const q=s?.players?.[String(p)];
  if(q?.champions?.every((x:any)=>x.defeated)){
   s.status='gameover';s.winner=other(p);
   const w=s?.players?.[String(other(p))]?.name||`Giocatore ${other(p)}`;
   log(s,`${w} vince la partita!`);
  }
 }
}
function damageChampion(s:any,p:number,id:string,n:number,source:string){
 const c=champ(s,p,id);if(!c||c.defeated||n<=0)return;
 const armor=Math.max(0,Number(c.armor||0));
 const blocked=Math.min(armor,n);
 if(blocked){c.armor=armor-blocked;log(s,`${c.name} usa ${blocked} Armatura e annulla ${blocked} dann${blocked===1?'o':'i'}.`)}
 n-=blocked;if(n<=0)return;
 c.damage=Number(c.damage||0)+n;
 const threshold=Math.max(1,rawPow(s,p,c));
 log(s,`${c.name} subisce ${n} dann${n===1?'o':'i'} (${c.damage}/${threshold}).`);
 if(c.damage>=threshold)wound(s,p,c,source);
}

export function act(state:any,p:any,move:any){
 const restores:Array<()=>void>=[];
 let resolvingSpacca:any=null;
 let endingCombat:any=null;

 if(move?.type==='cast'&&move?.cardId==='spacca_teste'){
  const id=String(move?.targets?.ownChamp||'');
  const c=champ(state,Number(p),id);
  if(!c||c.defeated)throw new Error('Spacca Teste richiede un tuo Campione.');
  if((state?.stack||[]).length&&state?.combat){
   const def=CARD_DEFS.spacca_teste;const old=def.speed;def.speed='instant';restores.push(()=>{def.speed=old;});
  }
 }

 if(move?.type==='pass_priority'&&(state?.stack||[]).length){
  const top=state.stack[state.stack.length-1];
  if(top?.kind==='card'&&top?.cardId==='spacca_teste')resolvingSpacca={uid:top.uid,actor:Number(top.actor),ownChamp:String(top.targets?.ownChamp||'')};
 }

 if(move?.type==='pass_priority'&&state?.combat&&!(state?.stack||[]).length&&Number(state?.combatPasses||0)>=1){
  const c=state.combat;
  if(c?.target?.type==='champion'){
   const defender=champ(state,Number(c.target.player),String(c.target.champId));
   if(defender&&Number(defender.spaccaTesteTurn)===Number(state.turn)){
    endingCombat={
     cancelled:!!c.cancelled,
     attackerPlayer:Number(c.attacker.player),
     attackerId:String(c.attacker.champId),
     defenderPlayer:Number(c.target.player),
     defenderId:String(c.target.champId),
     defenderName:defender.name,
     damage:Math.max(0,rawPow(state,Number(c.target.player),defender))
    };
   }
  }
 }

 try{
  const out=base.act(state,p,move);
  if(resolvingSpacca){
   const still=(state?.stack||[]).some((x:any)=>String(x?.uid)===String(resolvingSpacca.uid));
   if(!still){
    const c=champ(state,resolvingSpacca.actor,resolvingSpacca.ownChamp);
    if(c&&!c.defeated){c.spaccaTesteTurn=state.turn;log(state,`${c.name} può infliggere il proprio POW quando difende fino alla fine del turno grazie a Spacca Teste.`)}
   }
  }
  if(endingCombat&&!endingCombat.cancelled&&!state?.combat&&endingCombat.damage>0){
   const atk=champ(state,endingCombat.attackerPlayer,endingCombat.attackerId);
   if(atk&&!atk.defeated){
    log(state,`${endingCombat.defenderName} contrattacca in difesa con ${endingCombat.damage} POW grazie a Spacca Teste.`);
    damageChampion(state,endingCombat.attackerPlayer,endingCombat.attackerId,endingCombat.damage,'Spacca Teste');
   }
  }
  return out;
 }finally{
  for(let i=restores.length-1;i>=0;i--)try{restores[i]();}catch{}
 }
}
