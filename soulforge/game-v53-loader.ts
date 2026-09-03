import * as base from './game-v52-loader.ts?rev=tiro-lascito-v1';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;
export const publicView=base.publicView;

const COLORS=['red','green','black','blue','orange'];
const clone=(x:any)=>JSON.parse(JSON.stringify(x));
const other=(p:number)=>p===1?2:1;
const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const colorLabel=(c:string)=>c==='red'?'Rossa':c==='green'?'Verde':c==='black'?'Nera':c==='blue'?'Blu':'Arancione';
const log=(s:any,msg:string)=>{s.log ||= [];s.log.push(msg);if(s.log.length>180)s.log=s.log.slice(-180)};

function lascitoDescriptor(dead:any,killer:number){
 const d=MONSTER_DEFS?.[dead?.cardId];if(!d?.lascito)return null;
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
  return(player(s,other(Number(tr.actor)))?.champions||[]).filter((c:any)=>!c.defeated).map((c:any)=>({id:String(c.id),label:String(c.name||c.id)}));
 }
 if(tr.choiceType==='enemySoul'){
  const q=player(s,other(Number(tr.actor)));
  return COLORS.filter(c=>Number(q?.souls?.[c]||0)>0).map(c=>({id:c,label:`Anima ${colorLabel(c)}`}));
 }
 return [];
}
function processTiroTriggers(s:any){
 if(s?.pendingChoice)return;
 const q=s?._v48Triggers;
 if(!Array.isArray(q)||!q.length)return;
 while(q.length&&!s.pendingChoice){
  const tr=q.shift();
  if(tr.choiceType){
   const opts=triggerOptions(s,tr);
   if(!opts.length){log(s,`${tr.effectName||'Lascito'} non ha bersagli validi.`);continue}
   s.pendingChoice={type:'trigger_target',player:Number(tr.actor),trigger:tr,options:opts};
   s.priority=null;
   return;
  }
  s.stack ||= [];
  s.stack.push({uid:crypto.randomUUID(),kind:'effect',actor:Number(tr.actor),sourceCardId:tr.sourceCardId,effectId:tr.effectId,effectName:tr.effectName||'Lascito',targets:{},meta:tr.meta||{}});
 }
 if(s.stack?.length){s.priority=other(Number(s.stack[s.stack.length-1].actor));s.priorityPasses=0}
}

function snapshotTiro(s:any,item:any){
 const actor=Number(item?.actor);
 const ids=new Set((item?.targets?.monsterUids||[]).map(String));
 const board=(s?.board?.monsters||[]).map((m:any)=>clone(m));
 const targets=board.filter((m:any)=>ids.has(String(m.uid)));
 const q=player(s,actor);
 const souls:any={};for(const c of COLORS)souls[c]=Number(q?.souls?.[c]||0);
 let kings=board.filter((m:any)=>String(m.cardId)==='re_dei_non_morti').length;
 const expected:any[]=[];
 for(const m of board){
  if(!ids.has(String(m.uid)))continue;
  const desc=lascitoDescriptor(m,actor);
  if(desc)expected.push({dead:m,desc,count:1+kings});
  if(String(m.cardId)==='re_dei_non_morti')kings=Math.max(0,kings-1);
 }
 const beforeCounts=new Map<string,number>();
 for(const ex of expected){
  const key=`${ex.desc.effectId}|${ex.desc.sourceCardId}`;
  if(!beforeCounts.has(key))beforeCounts.set(key,triggerCount(s,ex.desc.effectId,ex.desc.sourceCardId));
 }
 return{actor,targets,expected,souls,beforeCounts};
}

function compensateTiroKills(s:any,snap:any){
 const actor=Number(snap?.actor);if(actor!==1&&actor!==2)return;
 const alive=new Set((s?.board?.monsters||[]).map((m:any)=>String(m.uid)));
 const dead=(snap?.targets||[]).filter((m:any)=>!alive.has(String(m.uid)));
 if(!dead.length)return;
 const q=player(s,actor);if(!q)return;
 q.killedMonsterThisTurn=true;

 const allowed=new Set(Array.isArray(q.deckColors)?q.deckColors:(q.champions||[]).map((c:any)=>c.color));
 const deathsByColor=new Map<string,number>();
 for(const m of dead){
  const color=String(MONSTER_DEFS?.[m.cardId]?.color||'');
  if(COLORS.includes(color)&&allowed.has(color))deathsByColor.set(color,(deathsByColor.get(color)||0)+1);
 }
 for(const [color,count] of deathsByColor){
  q.souls ||= {};
  const gained=Math.max(0,Number(q.souls[color]||0)-Number(snap.souls?.[color]||0));
  const missing=Math.max(0,count-gained);
  if(missing){
   q.souls[color]=Number(q.souls[color]||0)+missing;
   log(s,`Tiro Rotante: ${q.name} recupera ${missing} Anima${missing===1?'':'e'} ${missing===1?colorLabel(color):(color==='orange'?'Arancioni':colorLabel(color))}.`);
  }
 }

 const wanted=new Map<string,{desc:any,count:number}>();
 for(const ex of snap.expected||[]){
  if(!dead.some((m:any)=>String(m.uid)===String(ex.dead.uid)))continue;
  const key=`${ex.desc.effectId}|${ex.desc.sourceCardId}`;
  const row=wanted.get(key)||{desc:ex.desc,count:0};
  row.count+=Number(ex.count||1);wanted.set(key,row);
 }
 s._v48Triggers ||= [];
 for(const [key,row] of wanted){
  const before=Number(snap.beforeCounts?.get(key)||0);
  const already=Math.max(0,triggerCount(s,row.desc.effectId,row.desc.sourceCardId)-before);
  const missing=Math.max(0,row.count-already);
  for(let i=0;i<missing;i++)s._v48Triggers.push(clone(row.desc));
  if(missing){
   const name=MONSTER_DEFS?.[row.desc.sourceCardId]?.name||row.desc.sourceCardId;
   log(s,`${name}: Lascito viene attivato dalla kill di Tiro Rotante${row.count>1?` (${row.count} attivazioni totali)`:''}.`);
  }
 }
 processTiroTriggers(s);
}

export function act(state:any,p0:any,move:any){
 const p=Number(p0);
 const top=(move?.type==='pass_priority'&&state?.stack?.length)?state.stack[state.stack.length-1]:null;
 const snap=top?.kind==='card'&&String(top.cardId)==='tiro_rotante'?snapshotTiro(state,top):null;
 const out=(base.act as any)(state,p,move);
 if(snap)compensateTiroKills(state,snap);
 else processTiroTriggers(state);
 return out||state;
}
