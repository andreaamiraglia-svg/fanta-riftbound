import * as base from './game-v45-loader.ts';

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
const monster=(s:any,uid:any)=>(s?.board?.monsters||[]).find((m:any)=>String(m?.uid)===String(uid));
const log=(s:any,msg:string)=>{s.log ||= [];s.log.push(msg);if(s.log.length>180)s.log=s.log.slice(-180)};
const colorLabel=(c:string)=>c==='red'?'Rossa':c==='green'?'Verde':c==='black'?'Nera':c==='blue'?'Blu':'Arancione';

function monsterPow(s:any,m:any){
 const d=MONSTER_DEFS?.[m?.cardId];if(!d)return 0;
 const monsters=s?.board?.monsters||[];
 let v=Number(d.pow||0)+Number(m?.powMod||0)+Number(m?.tempPow||0);
 v+=monsters.filter((x:any)=>x.cardId==='lupo_delle_radici'&&x.uid!==m.uid).length;
 const ice=monsters.filter((x:any)=>x.cardId==='lupo_glaciale'&&x.uid!==m.uid).length;
 const storms=monsters.filter((x:any)=>x.cardId==='grifone_della_tempesta').length;
 if(ice)v-=ice*(1+storms);
 return Math.max(0,v);
}

function snapshotPow(s:any){
 const out=new Map<string,number>();
 for(const m of s?.board?.monsters||[])out.set(String(m.uid),monsterPow(s,m));
 return out;
}

function snapshotMonsters(s:any){
 const out=new Map<string,any>();
 for(const m of s?.board?.monsters||[])out.set(String(m.uid),clone(m));
 return out;
}

function inferKiller(move:any,top:any,beforeCombat:any,beforeDelayed:any[]){
 if(move?.type==='pass_priority'&&top){
  if(top.kind==='card'){
   const effect=CARD_DEFS?.[top.cardId]?.effect;
   if(effect==='sacrificio')return null;
   return Number(top.actor)||null;
  }
  if(top.kind==='effect')return Number(top.actor)||null;
 }
 if(move?.type==='pass_priority'&&!top&&beforeCombat)return Number(beforeCombat?.attacker?.player)||null;
 if(move?.type==='pass'){
  const d=(beforeDelayed||[])[0];
  if(d)return Number(d.killer)||null;
 }
 return null;
}

function gainSoulUncapped(s:any,p:number,color:string,n=1){
 const q=player(s,p);if(!q||!COLORS.includes(color))return;
 q.souls ||= {};
 q.souls[color]=Number(q.souls[color]||0)+n;
 log(s,`${q.name} recupera ${n} Anima${n===1?'':'e'} ${n===1?colorLabel(color):(color==='orange'?'Arancioni':colorLabel(color))}.`);
}

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

function triggerOptions(s:any,tr:any){
 if(tr.choiceType==='enemyChampion')return(player(s,other(tr.actor))?.champions||[]).filter((c:any)=>!c.defeated).map((c:any)=>({id:String(c.id),label:c.name}));
 if(tr.choiceType==='enemySoul'){
  const q=player(s,other(tr.actor));
  return COLORS.filter(c=>Number(q?.souls?.[c]||0)>0).map(c=>({id:c,label:`Anima ${colorLabel(c)}`}));
 }
 return [];
}

function processQueuedLascito(s:any){
 if(s?.pendingChoice)return;
 const q=s?._orangeTriggers;
 if(!Array.isArray(q)||!q.length)return;
 while(q.length&&!s.pendingChoice){
  const tr=q.shift();
  if(tr.choiceType){
   const opts=triggerOptions(s,tr);
   if(!opts.length){log(s,`${tr.effectName||'Effetto'} non ha bersagli validi.`);continue;}
   s.pendingChoice={type:'trigger_target',player:tr.actor,trigger:tr,options:opts};
   s.priority=null;
   return;
  }
  s.stack ||= [];
  s.stack.push({uid:crypto.randomUUID(),kind:'effect',actor:tr.actor,sourceCardId:tr.sourceCardId,effectId:tr.effectId,effectName:tr.effectName||'Effetto',targets:{},meta:tr.meta||{}});
 }
 if(s.stack?.length){s.priority=other(Number(s.stack[s.stack.length-1].actor));s.priorityPasses=0;}
}

function killByPowState(s:any,uid:string,killer:number|null){
 const m=monster(s,uid);if(!m)return;
 const idx=(s.board?.monsters||[]).findIndex((x:any)=>String(x.uid)===uid);if(idx<0)return;
 const kings=(s.board.monsters||[]).filter((x:any)=>x.cardId==='re_dei_non_morti').length;
 const dead=clone(m),def=MONSTER_DEFS?.[dead.cardId];
 s.board.monsters.splice(idx,1);
 const owner=player(s,Number(dead.owner));
 if(owner){owner.monsterGrave ||= [];owner.monsterGrave.push(dead.cardId);}
 log(s,`${def?.name||dead.cardId} viene sconfitto perché i suoi danni sono pari o superiori al suo POW.`);
 if(killer===1||killer===2){
  const q=player(s,killer);if(q)q.killedMonsterThisTurn=true;
  gainSoulUncapped(s,killer,String(def?.color||''),1);
  const desc=lascitoDescriptor(dead,killer);
  if(desc){
   s._orangeTriggers ||= [];
   for(let i=0;i<1+kings;i++)s._orangeTriggers.push(clone(desc));
   log(s,`${def?.name||dead.cardId}: Lascito viene ottenuto da ${q?.name||`Giocatore ${killer}`}${kings?` (${1+kings} attivazioni)`:''}.`);
  }
 }
 for(const b of s.board.monsters.filter((x:any)=>x.cardId==='orso_furioso')){
  b.tempPow=Number(b.tempPow||0)+2;
  log(s,'Orso Furioso ottiene +2 POW fino alla fine del turno.');
 }
}

function resolveStateBasedPowDeaths(s:any,beforePow:Map<string,number>,killer:number|null){
 const lethal:{uid:string,credited:number|null}[]=[];
 for(const m of s?.board?.monsters||[]){
  const uid=String(m.uid),now=monsterPow(s,m),before=beforePow.get(uid),damage=Number(m.damage||0);
  if(damage>=1&&damage>=now){
   const credited=(before!=null&&now<before)?killer:null;
   lethal.push({uid,credited});
  }
 }
 for(const x of lethal)if(monster(s,x.uid))killByPowState(s,x.uid,x.credited);
 processQueuedLascito(s);
}

function serpentLascitoAlreadyPresent(s:any){
 const pc=s?.pendingChoice;
 if(pc?.type==='trigger_target'&&pc?.trigger?.effectId==='lascito_serpente')return true;
 if((s?.stack||[]).some((x:any)=>x?.effectId==='lascito_serpente'))return true;
 if((s?.triggerQueue||[]).some((x:any)=>x?.effectId==='lascito_serpente'))return true;
 if((s?._orangeTriggers||[]).some((x:any)=>x?.effectId==='lascito_serpente'))return true;
 return false;
}

function restoreMissingSerpentLascito(s:any,beforeMonsters:Map<string,any>,killer:number|null){
 if(killer!==1&&killer!==2)return;
 if(serpentLascitoAlreadyPresent(s))return;
 const after=new Set((s?.board?.monsters||[]).map((m:any)=>String(m.uid)));
 const deadSerpents=[...beforeMonsters.values()].filter((m:any)=>m?.cardId==='serpente_della_giungla'&&!after.has(String(m.uid)));
 if(!deadSerpents.length)return;
 const enemy=player(s,other(killer));
 if(!COLORS.some(c=>Number(enemy?.souls?.[c]||0)>0))return;
 s._orangeTriggers ||= [];
 for(const dead of deadSerpents){
  const desc=lascitoDescriptor(dead,killer);
  if(desc)s._orangeTriggers.push(desc);
 }
 if(deadSerpents.length){
  log(s,`Serpente della Giungla: Lascito viene ottenuto da ${player(s,killer)?.name||`Giocatore ${killer}`} ed entra in Catena.`);
  processQueuedLascito(s);
 }
}

export function act(state:any,p:any,move:any){
 const beforePow=snapshotPow(state);
 const beforeMonsters=snapshotMonsters(state);
 const top=(move?.type==='pass_priority'&&state?.stack?.length)?clone(state.stack[state.stack.length-1]):null;
 const beforeCombat=state?.combat?clone(state.combat):null;
 const beforeDelayed=clone(state?.delayedKills||[]);
 const killer=inferKiller(move,top,beforeCombat,beforeDelayed);
 const out=base.act(state,p,move);
 resolveStateBasedPowDeaths(state,beforePow,killer);
 restoreMissingSerpentLascito(state,beforeMonsters,killer);
 return out;
}
