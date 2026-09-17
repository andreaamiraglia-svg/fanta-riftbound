export const extensionSource=String.raw`
function abilitySources61(s){return [...s.board.monsters,...[1,2].flatMap(p=>(pl(s,p)?.champions||[]).filter(c=>c.monsterOrigin&&!c.defeated))]}
export const rules61={};
export const engine61={
 pow:(...a)=>currentPow(...a), monsterPow:(...a)=>currentMonsterPow(...a),
 damageChampion:(...a)=>damageChampion(...a),damageMonster:(...a)=>damageMonster(...a),
 wound:(...a)=>woundChampion(...a),kill:(...a)=>killMonster(...a),
 addMonster:(...a)=>addMonsterToBoard(...a),after:(...a)=>afterTopResolution(...a),
 lascito:(...a)=>enqueueLascito(...a),prepare:(...a)=>prepareTriggers(...a),
 validate:(...a)=>validateCardTargets(...a),resolve:(...a)=>resolveCardEffect(...a),
 reduceMonster:(...a)=>reduceMonsterPow(...a),reduceChampion:(...a)=>reduceChampionPow(...a),cost:(...a)=>dynamicCost(...a),pay:(...a)=>pay(...a),canPay:(...a)=>canPay(...a),
 beginDamage:(...a)=>beginDamageEvent(...a),endDamage:(...a)=>endDamageEvent(...a)
};
const oldReduce63=reduceMonsterPow;
reduceMonsterPow=function(s,m,n,source){const before=m?currentMonsterPow(s,m):0;const result=oldReduce63(s,m,n,source);if(m&&s.resolvingCard63&&currentMonsterPow(s,m)<before)rules61.reduced?.(s,m);return result};
const oldPow61=currentPow;
currentPow=function(s,p,c){return Math.max(0,oldPow61(s,p,c)+(c?.chargeTurn===s.turn&&s.combat?.attacker?.champId===c?.id&&Number(s.combat.attacker.player)===Number(p)?Number(c.charge||0):0)+(rules61.pow?.(s,p,c)||0))};
const oldCost62=dynamicCost;
dynamicCost=function(s,p,c){return rules61.cost?.(s,p,c)??oldCost62(s,p,c)};
const oldGuards62=provocationsAgainst;
provocationsAgainst=function(s,p){const existing=oldGuards62(s,p);for(const m of s.board.monsters)if(Number(m.owner)===Number(other(p))&&m.provocazione&&!existing.some(x=>x.type==='monster'&&x.uid===m.uid))existing.push({type:'monster',uid:m.uid});return existing.filter(t=>{const x=t.type==='monster'?monster(s,t.uid):champ(s,t.player,t.champId);return x?.noProv63?.turn!==s.turn})};
const oldDamage61=damageChampion;
damageChampion=function(s,p,id,n,source=''){
 const c=champ(s,p,id);if(c?.immuneDamageTurn===s.turn||rules61.prevent?.(s,p,c))return {wounded:false};
 const old=Number(c?.damage||0),w=Number(c?.wounds||0),out=oldDamage61(s,p,id,n,source);
 if(c&&!c.defeated&&c.chargeOnDamageTurn===s.turn&&(c.damage>old||c.wounds>w)){
  c.charge=(c.chargeTurn===s.turn?Number(c.charge||0):0)+4;c.chargeTurn=s.turn;
  log(s,c.name+' ottiene Carica 4 grazie a Furia del Ferito.');
 }
 rules61.damage?.(s,p,c,old,w);return out;
};
const oldWound61=woundChampion;
woundChampion=function(s,p,c,source=''){
 if(!c||c.defeated)return;
 const extra=c.extraWoundTurn===s.turn;if(extra)delete c.extraWoundTurn;
 oldWound61(s,p,c,source);
 if(extra&&!c.defeated)oldWound61(s,p,c,'Colpo al Cuore');
};
const oldKill61=killMonster;
killMonster=function(s,killer,m,reason='',grantSoul=true,kingOverride){
 if(!m||!monster(s,m.uid))return;
 const dead=clone(m);
 const effectiveKiller=s.monsterSource61?Number(s.monsterSource61.owner):killer;
 const grants=grantSoul&&m.noSoulsTurn!==s.turn&&!s.monsterSource61;
 if(!grants){s.noSoulDeaths61 ||= [];s.noSoulDeaths61.push(m.uid)}
 const out=oldKill61(s,effectiveKiller,m,reason,grants,kingOverride);
 if(s.monsterSource61&&MONSTER_DEFS[dead.cardId]?.lascito==='sciamano')
  for(let i=0;i<1+(kingOverride??kingsInPlay(s));i++)s.triggerQueue.push({actor:effectiveKiller,sourceCardId:dead.cardId,effectId:'lascito_sciamano',effectName:'Lascito — Sciamano del Sole'});
 rules61.dead?.(s,dead,effectiveKiller);
 return out;
};
const oldEffect61=resolveEffect;
resolveEffect=function(s,item){
 if(rules61.effect?.(s,item))return;
 const source=MONSTER_DEFS[item.sourceCardId];
 if(source&&String(item.effectId).startsWith('enter_'))s.monsterSource61={owner:item.actor,cardId:source.id};
 try{return oldEffect61(s,item)}finally{delete s.monsterSource61}
};
const oldEnter61=processMonsterEnter;
processMonsterEnter=function(s,m){
 if(m?.skipEnter63)return;
 if(rules61.enter?.(s,m))return;
 if(m?.cardId==='vampiro'){
  const i=s.board.monsters.findIndex(x=>x.uid===m.uid),target=s.board.monsters[i+1];
  if(target){s.monsterSource61=m;try{killMonster(s,Number(m.owner),target,'Vampiro',false)}finally{delete s.monsterSource61}}return;
 }
 const previous=s.monsterSource61;s.monsterSource61=m;
 try{return oldEnter61(s,m)}finally{if(previous)s.monsterSource61=previous;else delete s.monsterSource61}
};
const oldValidate61=validateCardTargets;
validateCardTargets=function(s,p,c,t){if(rules61.validate?.(s,p,c,t))return;return oldValidate61(s,p,c,t)};
const oldResolve61=resolveCardEffect;
resolveCardEffect=function(s,item){const old=s.resolvingCard63;s.resolvingCard63=item;try{if(rules61.resolve?.(s,item))return false;return oldResolve61(s,item)}finally{if(old)s.resolvingCard63=old;else delete s.resolvingCard63}};
const oldCombat61=resolveCombat;
resolveCombat=function(s){
 const c=s.combat;
 if(c?.attacker?.type==='monster'){
  const m=monster(s,c.attacker.uid),d=c.target?.type==='champion'?champ(s,c.target.player,c.target.champId):null;
  if(m&&d&&!d.defeated&&!c.cancelled){
   const n=currentMonsterPow(s,m),retaliation=d.counterattack||d.counterattackTurn===s.turn||d.septemberCounterTurn===s.turn?currentPow(s,c.target.player,d):0;
   damageChampion(s,c.target.player,d.id,n,MONSTER_DEFS[m.cardId]?.name);
   if(retaliation>0)damageMonster(s,c.target.player,m.uid,retaliation,d.name);
  }
  s.combat=null;s.stackInitiator=c.initiator;afterTopResolution(s);return;
 }
 const d=c?.target?.type==='champion'?champ(s,c.target.player,c.target.champId):null;
 const retaliation=d?.septemberCounterTurn===s.turn&&!d.defeated?currentPow(s,c.target.player,d):0;
 oldCombat61(s);
 if(retaliation&&c&&!c.cancelled)damageChampion(s,c.attacker.player,c.attacker.champId,retaliation,d.name);
};
`;
