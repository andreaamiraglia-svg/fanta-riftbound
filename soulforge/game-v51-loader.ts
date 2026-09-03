import * as base from './game-v50-loader.ts?rev=souls-uncapped-v3';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

const COLORS=['red','green','black','blue','orange'];
const SCATOLA='scatola_incantata';
const KILL_EFFECT='v50_scatola_kill';
const clone=(x:any)=>JSON.parse(JSON.stringify(x));
const other=(p:number)=>p===1?2:1;
const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const log=(s:any,msg:string)=>{s.log ||= [];s.log.push(msg);if(s.log.length>180)s.log=s.log.slice(-180)};
const colorLabel=(c:string)=>c==='red'?'Rossa':c==='green'?'Verde':c==='black'?'Nera':c==='blue'?'Blu':'Arancione';

function lascitoDescriptor(dead:any,killer:number){
  const d=MONSTER_DEFS?.[dead?.cardId];
  if(!d?.lascito)return null;
  if(d.lascito==='segugio_morti')return{actor:killer,sourceCardId:dead.cardId,effectId:'lascito_segugio',choiceType:'enemyChampion',effectName:`Lascito — ${d.name}`};
  if(d.lascito==='custode')return{actor:killer,sourceCardId:dead.cardId,effectId:'lascito_custode',effectName:`Lascito — ${d.name}`};
  if(d.lascito==='cavaliere')return{actor:killer,sourceCardId:dead.cardId,effectId:'lascito_cavaliere',choiceType:'enemyChampion',effectName:`Lascito — ${d.name}`};
  if(d.lascito==='serpente')return{actor:killer,sourceCardId:dead.cardId,effectId:'lascito_serpente',choiceType:'enemySoul',effectName:`Lascito — ${d.name}`};
  if(d.lascito==='divoratore')return{actor:killer,sourceCardId:dead.cardId,effectId:'lascito_divoratore',meta:{colors:[...(dead.devouredColors||[])]},effectName:`Lascito — ${d.name}`};
  if(d.lascito==='sciamano')return{actor:killer,sourceCardId:dead.cardId,effectId:'lascito_sciamano',effectName:`Lascito — ${d.name}`};
  return null;
}

function sameTrigger(x:any,effectId:string,sourceCardId:string){
  return String(x?.effectId||x?.trigger?.effectId||'')===effectId
    && String(x?.sourceCardId||x?.trigger?.sourceCardId||'')===sourceCardId;
}
function triggerCount(s:any,effectId:string,sourceCardId:string){
  let n=0;
  if(s?.pendingChoice&&sameTrigger(s.pendingChoice,effectId,sourceCardId))n++;
  for(const a of [s?.stack,s?.triggerQueue,s?._orangeTriggers,s?._v48Triggers]){
    for(const x of Array.isArray(a)?a:[])if(sameTrigger(x,effectId,sourceCardId))n++;
  }
  return n;
}

function triggerOptions(s:any,tr:any){
  if(tr.choiceType==='enemyChampion'){
    return(player(s,other(Number(tr.actor)))?.champions||[])
      .filter((c:any)=>!c.defeated)
      .map((c:any)=>({id:String(c.id),label:String(c.name||c.id)}));
  }
  if(tr.choiceType==='enemySoul'){
    const q=player(s,other(Number(tr.actor)));
    return COLORS.filter(c=>Number(q?.souls?.[c]||0)>0)
      .map(c=>({id:c,label:`Anima ${colorLabel(c)}`}));
  }
  return [];
}

function processV48Triggers(s:any){
  if(s?.pendingChoice)return;
  const q=s?._v48Triggers;
  if(!Array.isArray(q)||!q.length)return;
  while(q.length&&!s.pendingChoice){
    const tr=q.shift();
    if(tr.choiceType){
      const opts=triggerOptions(s,tr);
      if(!opts.length){
        log(s,`${tr.effectName||'Lascito'} non ha bersagli validi.`);
        continue;
      }
      s.pendingChoice={type:'trigger_target',player:Number(tr.actor),trigger:tr,options:opts};
      s.priority=null;
      return;
    }
    s.stack ||= [];
    s.stack.push({
      uid:crypto.randomUUID(),kind:'effect',actor:Number(tr.actor),
      sourceCardId:tr.sourceCardId,effectId:tr.effectId,
      effectName:tr.effectName||'Lascito',targets:{},meta:tr.meta||{}
    });
  }
  if(s.stack?.length){
    s.priority=other(Number(s.stack[s.stack.length-1].actor));
    s.priorityPasses=0;
  }
}

function snapshotScatolaDeaths(s:any,item:any){
  const ids=new Set((item?.meta?.uids||[]).map(String));
  const board=(s?.board?.monsters||[]).map((m:any)=>clone(m));
  const targets=board.filter((m:any)=>ids.has(String(m.uid)));
  let kings=board.filter((m:any)=>String(m.cardId)==='re_dei_non_morti').length;
  const expected:any[]=[];

  // Il motore elimina i Mostri letali seguendo l'ordine del campo. Simuliamo
  // lo stesso ordine solo per calcolare quante copie di Lascito concede Re dei
  // Non Morti se uno dei due Mostri di Scatola è proprio il Re.
  for(const m of board){
    if(!ids.has(String(m.uid)))continue;
    const desc=lascitoDescriptor(m,Number(item.actor));
    if(desc)expected.push({dead:m,desc,count:1+kings});
    if(String(m.cardId)==='re_dei_non_morti')kings=Math.max(0,kings-1);
  }
  return {targets,expected};
}

function completeScatolaKillRewards(s:any,actor:number,snap:any,beforeCounts:Map<string,number>){
  if(actor!==1&&actor!==2)return;
  const alive=new Set((s?.board?.monsters||[]).map((m:any)=>String(m.uid)));
  const deadTargets=(snap?.targets||[]).filter((m:any)=>!alive.has(String(m.uid)));
  if(!deadTargets.length)return;

  const q=player(s,actor);
  if(q)q.killedMonsterThisTurn=true;

  // Il vecchio state-based death spostava già correttamente il Mostro nel
  // Cimitero e applicava gli altri effetti globali, ma non attribuiva questa
  // kill a Scatola. Completiamo quindi solo le ricompense mancanti.
  for(const dead of deadTargets){
    const color=String(MONSTER_DEFS?.[dead.cardId]?.color||'');
    if(q&&COLORS.includes(color)){
      q.souls ||= {};
      q.souls[color]=Number(q.souls[color]||0)+1;
      log(s,`${q.name} recupera 1 Anima ${colorLabel(color)} grazie alla kill di Scatola Incantata.`);
    }
  }

  s._v48Triggers ||= [];
  for(const ex of snap?.expected||[]){
    if(!deadTargets.some((m:any)=>String(m.uid)===String(ex.dead.uid)))continue;
    const key=`${ex.desc.effectId}|${ex.desc.sourceCardId}`;
    const before=Number(beforeCounts.get(key)||0);
    const already=Math.max(0,triggerCount(s,ex.desc.effectId,ex.desc.sourceCardId)-before);
    const missing=Math.max(0,Number(ex.count||1)-already);
    for(let i=0;i<missing;i++)s._v48Triggers.push(clone(ex.desc));
    if(missing>0){
      const name=MONSTER_DEFS?.[ex.dead.cardId]?.name||ex.dead.cardId;
      log(s,`${name}: Lascito viene attivato dalla kill di Scatola Incantata${ex.count>1?` (${ex.count} attivazioni totali)`:''}.`);
    }
  }
  processV48Triggers(s);
}

export function act(state:any,p0:any,move:any){
  const p=Number(p0);
  const top=(move?.type==='pass_priority'&&state?.stack?.length)?state.stack[state.stack.length-1]:null;
  const isKill=top?.kind==='effect'&&String(top.effectId)===KILL_EFFECT;
  let snap:any=null;
  const beforeCounts=new Map<string,number>();

  if(isKill){
    snap=snapshotScatolaDeaths(state,top);
    for(const ex of snap.expected||[]){
      const key=`${ex.desc.effectId}|${ex.desc.sourceCardId}`;
      if(!beforeCounts.has(key))beforeCounts.set(key,triggerCount(state,ex.desc.effectId,ex.desc.sourceCardId));
    }
  }

  const out=(base.act as any)(state,p,move);
  if(isKill)completeScatolaKillRewards(state,Number(top.actor),snap,beforeCounts);
  return out||state;
}

export function publicView(state:any,p:any){
  return (base.publicView as any)(state,p);
}
