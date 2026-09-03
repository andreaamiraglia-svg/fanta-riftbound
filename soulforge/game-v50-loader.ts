import * as base from './game-v49-loader.ts?rev=bang-champion-monster-v2';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

const SCATOLA='scatola_incantata';
const SHELL='__v50_scatola_shell';
const KILL_EFFECT='v50_scatola_kill';

if(CARD_DEFS?.[SCATOLA]){
  CARD_DEFS[SCATOLA].text='Evoca i primi 2 Mostri dalla cima del tuo Mazzo dei Mostri. Poi crea un effetto che li uccide.';
}

// Card interna usata solo durante la risoluzione. Ha un effect sconosciuto al
// motore base, quindi la risoluzione della carta non esegue il vecchio effetto
// di Scatola Incantata (scelta manuale + danno letale immediato).
Object.defineProperty(CARD_DEFS,SHELL,{
  enumerable:false,
  configurable:true,
  writable:true,
  value:{
    ...(CARD_DEFS?.[SCATOLA]||{}),
    id:SHELL,
    name:'Scatola Incantata',
    effect:'v50_scatola_shell'
  }
});

const other=(p:number)=>p===1?2:1;
const pl=(s:any,p:number)=>s?.players?.[String(p)]||null;
const monster=(s:any,uid:any)=>(s?.board?.monsters||[]).find((m:any)=>String(m?.uid)===String(uid));
const log=(s:any,msg:string)=>{s.log ||= [];s.log.push(msg);if(s.log.length>180)s.log=s.log.slice(-180)};

function addMonsterToBoard(s:any,id:string,p:number){
  const m={uid:crypto.randomUUID(),cardId:id,owner:p,damage:0,tempPow:0,powMod:0,armor:0};
  s.board ||= {monsters:[]};
  s.board.monsters ||= [];
  s.enterQueue ||= [];
  s.board.monsters.push(m);
  s.enterQueue.push(m.uid);
  return m;
}

function topTwoForValidation(s:any,p:number){
  return (pl(s,p)?.monsterDeck||[]).slice(0,2).map(String);
}

function prepareScatolaResolution(s:any,item:any){
  const p=Number(item?.actor);
  const q=pl(s,p);
  if(!q)return null;

  const summoned:string[]=[];
  for(let i=0;i<2;i++){
    const id=String(q.monsterDeck?.shift?.()||'');
    if(!id)break;
    const m=addMonsterToBoard(s,id,p);
    summoned.push(String(m.uid));
    log(s,`${MONSTER_DEFS?.[id]?.name||id} viene evocato dalla cima del Mazzo dei Mostri da Scatola Incantata.`);
  }

  // Nasconde al vecchio game-v48 l'ID di Scatola durante questa sola
  // risoluzione: così non può applicare il precedente danno 999999 immediato.
  item.cardId=SHELL;
  return {actor:p,uids:summoned};
}

function restoreScatolaGrave(s:any,p:number){
  const q=pl(s,p);
  if(!q)return;
  const i=(q.grave||[]).lastIndexOf(SHELL);
  if(i>=0)q.grave[i]=SCATOLA;
}

function enqueueKillTrigger(s:any,actor:number,uids:string[]){
  if(!uids.length)return;
  s._v50ScatolaTriggers ||= [];
  s._v50ScatolaTriggers.push({actor:Number(actor),uids:[...uids]});
  log(s,'Scatola Incantata crea un effetto secondario che ucciderà i Mostri evocati.');
}

function canOpenSecondaryTrigger(s:any){
  return !s?.pendingChoice
    && !(s?.stack?.length)
    && !(s?.enterQueue?.length)
    && !(s?.triggerQueue?.length)
    && !(s?._v48Triggers?.length)
    && !(s?._orangeTriggers?.length)
    && !s?.combat
    && !s?.endTurnPending;
}

function pushSecondaryTriggerIfReady(s:any){
  const q=s?._v50ScatolaTriggers;
  if(!Array.isArray(q)||!q.length||!canOpenSecondaryTrigger(s))return;
  const tr=q.shift();
  const alive=(tr.uids||[]).map(String).filter((u:string)=>!!monster(s,u));
  if(!alive.length){
    log(s,'L’effetto secondario di Scatola Incantata non trova più i Mostri evocati.');
    pushSecondaryTriggerIfReady(s);
    return;
  }
  s.stack ||= [];
  s.stack.push({
    uid:crypto.randomUUID(),
    kind:'effect',
    actor:Number(tr.actor),
    sourceCardId:SCATOLA,
    effectId:KILL_EFFECT,
    effectName:'Scatola Incantata — Uccidi i Mostri evocati',
    targets:{},
    meta:{uids:alive}
  });
  s.stackInitiator=Number(tr.actor);
  s.priority=other(Number(tr.actor));
  s.priorityPasses=0;
  log(s,'L’effetto secondario di Scatola Incantata entra in Catena.');
}

function armSecondaryKill(s:any,item:any){
  const uids=[...new Set((item?.meta?.uids||[]).map(String))];
  for(const uid of uids){
    const m=monster(s,uid);
    if(!m)continue;
    // Il game-v46 esegue subito dopo il normale state-based death check e
    // attribuisce la morte all'actor dell'effetto in cima alla Catena. In
    // questo modo Anime, Cimitero, Lascito e trigger di morte restano quelli
    // del motore stabile.
    m.damage=Math.max(Number(m.damage||0),999999);
  }
}

function sanitizePublic(v:any){
  if(v?.cardDefs?.[SHELL])delete v.cardDefs[SHELL];
  return v;
}

export function act(state:any,p0:any,move0:any){
  const p=Number(p0);
  let move=move0;

  // Scatola non richiede più una scelta. I due ID servono solo a superare la
  // validazione legacy di game-v48; alla risoluzione vengono ignorati e si
  // leggono i primi due Mostri che sono DAVVERO in cima in quel momento.
  if(move0?.type==='cast'&&String(move0?.cardId)===SCATOLA){
    move={...move0,targets:{...(move0?.targets||{}),monsterIds:topTwoForValidation(state,p)}};
  }

  const top=(move?.type==='pass_priority'&&state?.stack?.length)?state.stack[state.stack.length-1]:null;
  let prepared:any=null;

  if(top?.kind==='card'&&String(top.cardId)===SCATOLA){
    if(Number(state.priority)!==p)throw new Error('Non hai priorità.');
    prepared=prepareScatolaResolution(state,top);
  }else if(top?.kind==='effect'&&String(top.effectId)===KILL_EFFECT){
    if(Number(state.priority)!==p)throw new Error('Non hai priorità.');
    armSecondaryKill(state,top);
  }

  let out:any;
  try{
    out=base.act(state,p,move);
  }finally{
    if(prepared)restoreScatolaGrave(state,prepared.actor);
  }

  if(prepared)enqueueKillTrigger(state,prepared.actor,prepared.uids);
  // Questa funzione gira soltanto dopo una MOVE realmente persistita. Non
  // viene mai chiamata dal polling/publicView, quindi lo stato restituito e lo
  // stato salvato nel DB restano sempre identici.
  pushSecondaryTriggerIfReady(state);
  return out||state;
}

export function publicView(state:any,p:any){
  return sanitizePublic(base.publicView(state,p));
}
