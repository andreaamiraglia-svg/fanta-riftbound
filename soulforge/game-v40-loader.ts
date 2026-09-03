import * as base from './game-v39-loader.ts?rev=souls-uncapped-v3';

export const CARD_DEFS=base.CARD_DEFS;
export const MONSTER_DEFS=base.MONSTER_DEFS;
export const CHAMPION_DEFS=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;
export const publicView=base.publicView;

// I Supporti Campione sono carte del mazzo: vengono pescati e giocati dalla mano,
// ma una volta risolti entrano nella zona Campioni e seguono le normali regole dei Campioni.
CARD_DEFS.alabardo={
 id:'alabardo',
 name:'Alabardo',
 color:'red',
 cost:1,
 speed:'base',
 type:'Campione',
 subtype:'Supporto',
 supportChampion:true,
 text:'Quando entra in gioco fornisce Provocazione a un altro tuo Campione per questo turno.',
 effect:'support_champion_alabardo'
};
CHAMPION_DEFS.alabardo={
 id:'alabardo',
 name:'Alabardo',
 color:'red',
 basePow:1,
 hp:1,
 supportChampion:true
};

const other=(p:number)=>p===1?2:1;
const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const champ=(s:any,p:number,id:string)=>(player(s,p)?.champions||[]).find((c:any)=>String(c?.id)===String(id));
const hasStackUid=(s:any,uid:any)=>(s?.stack||[]).some((x:any)=>String(x?.uid)===String(uid));
function log(s:any,msg:string){
 if(!Array.isArray(s?.log))return;
 s.log.push(msg);
 if(s.log.length>180)s.log=s.log.slice(-180);
}
function freshSupportChampion(id:string){
 const d:any=CHAMPION_DEFS[id];
 return {...d,wounds:0,damage:0,tempPow:0,armor:0,tapped:false,defeated:false,cantAttackTurn:null,supportChampion:true,sourceCardId:id,turnEffects:[]};
}
function moveSupportToField(s:any,p:number,id:string){
 const q=player(s,p),d:any=CHAMPION_DEFS[id];
 if(!q||!d)return null;
 const gi=q.grave?.lastIndexOf?.(id)??-1;
 if(gi>=0)q.grave.splice(gi,1);
 const existing=(q.champions||[]).find((c:any)=>String(c.id)===id&&!c.defeated);
 if(existing)return existing;
 const c=freshSupportChampion(id);
 q.champions.push(c);
 log(s,`${d.name} entra in gioco come Campione Supporto.`);
 return c;
}
function beginAlabardoTrigger(s:any,p:number){
 const q=player(s,p);if(!q)return;
 const options=(q.champions||[])
  .filter((c:any)=>!c.defeated&&String(c.id)!=='alabardo')
  .map((c:any)=>({id:String(c.id),label:String(c.name||c.id)}));
 if(!options.length){
  log(s,'Effetto — Alabardo non ha un altro Campione valido da scegliere.');
  return;
 }
 s.pendingChoice={
  type:'trigger_target',
  player:p,
  trigger:{actor:p,sourceCardId:'alabardo',effectId:'alabardo_provocazione',choiceType:'ownChampion',effectName:'Effetto — Alabardo'},
  options
 };
 s.priority=null;
 log(s,'Alabardo attiva il suo effetto: scegli un altro tuo Campione.');
}
function resolveAlabardoChoice(s:any,p:number,move:any){
 const pc=s?.pendingChoice;
 if(!pc||pc.type!=='trigger_target'||pc.trigger?.effectId!=='alabardo_provocazione')return false;
 if(Number(pc.player)!==Number(p))throw new Error('C’è una scelta in attesa dell’altro giocatore.');
 const id=String(move?.choice||move?.champId||'');
 if(!pc.options?.some((x:any)=>String(x.id)===id))throw new Error('Campione bersaglio non valido.');
 const c=champ(s,p,id);
 if(!c||c.defeated||String(c.id)==='alabardo')throw new Error('Alabardo richiede un altro tuo Campione.');
 s.pendingChoice=null;
 s.stack ||= [];
 s.stack.push({
  uid:crypto.randomUUID(),
  kind:'effect',
  actor:p,
  sourceCardId:'alabardo',
  effectId:'alabardo_provocazione',
  effectName:'Effetto — Alabardo',
  targets:{ownChamp:id},
  meta:{}
 });
 s.priority=other(p);
 s.priorityPasses=0;
 log(s,`Effetto — Alabardo entra in Catena bersagliando ${c.name}.`);
 return true;
}
function applyAlabardoProvocation(s:any,p:number,id:string){
 const c=champ(s,p,id);
 if(!c||c.defeated){log(s,'Effetto — Alabardo non trova più un Campione valido.');return;}
 c.alabardoProvocazioneTurn=Number(s.turn);
 c.alabardoProvocazionePrev=!!c.provocazione;
 c.provocazione=true;
 const list=Array.isArray(c.turnEffects)?c.turnEffects:[];
 list.push({turn:Number(s.turn),sourceCardId:'alabardo',kind:'status',label:'Provocazione'});
 c.turnEffects=list.filter((x:any)=>Number(x?.turn)===Number(s.turn)).slice(-24);
 log(s,`${c.name} ottiene Provocazione fino alla fine del turno grazie ad Alabardo.`);
}
function cleanupExpiredProvocation(s:any){
 for(const p of [1,2])for(const c of player(s,p)?.champions||[]){
  if(c.alabardoProvocazioneTurn!=null&&Number(c.alabardoProvocazioneTurn)!==Number(s.turn)){
   c.provocazione=!!c.alabardoProvocazionePrev;
   delete c.alabardoProvocazioneTurn;
   delete c.alabardoProvocazionePrev;
  }
 }
}
function cleanupDefeatedSupports(s:any){
 for(const p of [1,2]){
  const q=player(s,p);if(!q)continue;
  const keep:any[]=[];
  for(const c of q.champions||[]){
   if(c?.supportChampion&&c.defeated){
    q.grave ||= [];
    q.grave.push(String(c.sourceCardId||c.id));
    log(s,`${c.name} viene messo nel Cimitero.`);
   }else keep.push(c);
  }
  q.champions=keep;
 }
}
function enforceStarterLoss(s:any){
 if(s?.status==='gameover')return;
 for(const p of [1,2]){
  const q=player(s,p);if(!q)continue;
  const starters=(q.champions||[]).filter((c:any)=>!c.supportChampion);
  if(starters.length&&starters.every((c:any)=>c.defeated)){
   s.status='gameover';
   s.winner=other(p);
   const w=player(s,other(p))?.name||`Giocatore ${other(p)}`;
   log(s,`${w} vince la partita!`);
   return;
  }
 }
}

export function act(state:any,p:any,move:any){
 // La scelta del bersaglio di Alabardo è gestita qui per poter usare un tipo
 // di bersaglio "un altro tuo Campione" senza alterare i trigger esistenti.
 if(state?.pendingChoice?.type==='trigger_target'&&state.pendingChoice?.trigger?.effectId==='alabardo_provocazione'){
  if(move?.type!=='resolve_choice')throw new Error('C’è una scelta in attesa.');
  resolveAlabardoChoice(state,Number(p),move);
  return state;
 }

 cleanupExpiredProvocation(state);

 let resolvingSupport:any=null;
 let resolvingAlabardoEffect:any=null;
 if(move?.type==='pass_priority'&&(state?.stack||[]).length){
  const top=state.stack[state.stack.length-1];
  if(top?.kind==='card'&&CARD_DEFS?.[top.cardId]?.supportChampion){
   resolvingSupport={uid:top.uid,actor:Number(top.actor),cardId:String(top.cardId)};
  }
  if(top?.kind==='effect'&&top?.effectId==='alabardo_provocazione'){
   resolvingAlabardoEffect={uid:top.uid,actor:Number(top.actor),ownChamp:String(top.targets?.ownChamp||'')};
  }
 }

 const out=base.act(state,p,move);

 if(resolvingSupport&&!hasStackUid(state,resolvingSupport.uid)){
  const c=moveSupportToField(state,resolvingSupport.actor,resolvingSupport.cardId);
  if(c&&resolvingSupport.cardId==='alabardo')beginAlabardoTrigger(state,resolvingSupport.actor);
 }
 if(resolvingAlabardoEffect&&!hasStackUid(state,resolvingAlabardoEffect.uid)){
  applyAlabardoProvocation(state,resolvingAlabardoEffect.actor,resolvingAlabardoEffect.ownChamp);
 }

 cleanupExpiredProvocation(state);
 cleanupDefeatedSupports(state);
 enforceStarterLoss(state);
 return out;
}
