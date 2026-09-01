import * as base from './game-v44-loader.ts';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;

const COLORS=['red','green','black','blue','orange'];
const clone=(x:any)=>JSON.parse(JSON.stringify(x));
const pl=(s:any,p:number)=>s?.players?.[String(p)]||null;
const monsterDef=(id:any)=>MONSTER_DEFS?.[String(id)]||null;

function setInitialSouls(q:any){
 if(!q)return q;
 q.souls ||= {};
 for(const c of COLORS)q.souls[c]=0;
 for(const c of q.deckColors||[])q.souls[c]=2;
 return q;
}
export function newPlayer(name:any,deckConfig:any){
 return setInitialSouls(base.newPlayer(name,deckConfig));
}
export function newState(name:any,deckConfig:any){
 const s:any=base.newState(name,deckConfig);
 setInitialSouls(s?.players?.['1']);
 return s;
}

function addGain(g:any,p:number,color:string,n:number){
 if((p!==1&&p!==2)||!COLORS.includes(color)||!n)return;
 g[p] ||= {};
 g[p][color]=Number(g[p][color]||0)+Number(n||0);
}
function likelyKiller(move:any,top:any,beforeCombat:any,beforeDelayed:any[],deadUid:string){
 if(move?.type==='pass_priority'&&top){
  if(top.kind==='card'){
   const effect=CARD_DEFS?.[top.cardId]?.effect;
   if(effect==='sacrificio')return null;
   return Number(top.actor)||null;
  }
  if(top.kind==='effect')return Number(top.actor)||null;
 }
 if(move?.type==='pass_priority'&&!top&&beforeCombat){
  return Number(beforeCombat?.attacker?.player)||null;
 }
 if(move?.type==='pass'){
  const x=(beforeDelayed||[]).find((d:any)=>String(d?.uid)===String(deadUid));
  if(x)return Number(x.killer)||null;
 }
 return null;
}
function excludedDeathReason(newLogs:string[],name:string){
 return newLogs.some(x=>x.includes(name)&&(
  x.includes('Segugio Infernale')||
  x.includes('Drago delle Ceneri')||
  x.includes('Divoratore di Anime')||
  x.includes('Sacrificio')
 ));
}
function championSnapshot(s:any,p:number,id:any){
 const c=(pl(s,p)?.champions||[]).find((x:any)=>String(x?.id)===String(id));
 return c?{wounds:Number(c.wounds||0),defeated:!!c.defeated}:null;
}
function inferIntendedGains(before:any,state:any,move:any,top:any,beforeCombat:any,beforeDelayed:any[],logStart:number){
 const gains:any={1:{},2:{}};
 const afterUids=new Set((state?.board?.monsters||[]).map((m:any)=>String(m.uid)));
 const newLogs=(state?.log||[]).slice(logStart).map(String);
 for(const m of before.boardMonsters||[]){
  if(afterUids.has(String(m.uid)))continue;
  const d=monsterDef(m.cardId);if(!d)continue;
  const killer=likelyKiller(move,top,beforeCombat,beforeDelayed,String(m.uid));
  if(!killer)continue;
  if(excludedDeathReason(newLogs,String(d.name||m.cardId)))continue;
  addGain(gains,killer,String(d.color||''),1);
 }
 if(move?.type==='pass_priority'&&top?.kind==='card'&&String(top.cardId)==='eclipse_fang'){
  const p=Number(top.actor),t=top.targets?.enemy;
  let success=false;
  if(t?.type==='champion'){
   const b=before.champions?.[`${t.player}:${t.champId}`];
   const a=championSnapshot(state,Number(t.player),String(t.champId));
   success=!!b&&!!a&&(a.wounds>b.wounds||(!b.defeated&&a.defeated));
  }else if(t?.type==='monster'){
   success=!!(before.boardMonsters||[]).find((m:any)=>String(m.uid)===String(t.uid))&&!afterUids.has(String(t.uid));
  }
  if(success)addGain(gains,p,'black',2);
 }
 if(move?.type==='pass_priority'&&top?.kind==='effect'&&String(top.effectId)==='lascito_divoratore'){
  for(const c of top.meta?.colors||[])addGain(gains,Number(top.actor),String(c),1);
 }
 return gains;
}
function normalizeUncappedSouls(state:any,beforeSouls:any,gains:any){
 for(const p of [1,2]){
  const q=pl(state,p);if(!q)continue;q.souls ||= {};
  for(const c of COLORS){
   const g=Number(gains?.[p]?.[c]||0);
   if(g>0)q.souls[c]=Number(beforeSouls?.[p]?.[c]||0)+g;
   else q.souls[c]=Number(q.souls[c]||0);
  }
 }
}
export function publicView(state:any,p:any){return base.publicView(state,p)}

export function act(state:any,p:any,move:any){
 const beforeSouls:any={1:{},2:{}};
 for(const z of [1,2])for(const c of COLORS)beforeSouls[z][c]=Number(pl(state,z)?.souls?.[c]||0);
 const before:any={boardMonsters:clone(state?.board?.monsters||[]),champions:{}};
 for(const z of [1,2])for(const c of pl(state,z)?.champions||[])before.champions[`${z}:${c.id}`]={wounds:Number(c.wounds||0),defeated:!!c.defeated};
 const top=(move?.type==='pass_priority'&&state?.stack?.length)?clone(state.stack[state.stack.length-1]):null;
 const beforeCombat=state?.combat?clone(state.combat):null;
 const beforeDelayed=clone(state?.delayedKills||[]);
 const logStart=Array.isArray(state?.log)?state.log.length:0;
 const out=base.act(state,p,move);
 const gains=inferIntendedGains(before,state,move,top,beforeCombat,beforeDelayed,logStart);
 normalizeUncappedSouls(state,beforeSouls,gains);
 return out;
}
