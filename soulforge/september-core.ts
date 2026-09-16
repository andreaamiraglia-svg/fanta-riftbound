export const extensionSource=String.raw`
export const rules61={};
export const engine61={
 pow:(...a)=>currentPow(...a), monsterPow:(...a)=>currentMonsterPow(...a),
 damageChampion:(...a)=>damageChampion(...a),damageMonster:(...a)=>damageMonster(...a),
 wound:(...a)=>woundChampion(...a),kill:(...a)=>killMonster(...a),
 addMonster:(...a)=>addMonsterToBoard(...a),after:(...a)=>afterTopResolution(...a),
 lascito:(...a)=>enqueueLascito(...a),prepare:(...a)=>prepareTriggers(...a)
};
const oldPow61=currentPow;
currentPow=function(s,p,c){return Math.max(0,oldPow61(s,p,c)+(c?.chargeTurn===s.turn&&s.combat?.attacker?.champId===c?.id&&Number(s.combat.attacker.player)===Number(p)?Number(c.charge||0):0))};
const oldDamage61=damageChampion;
damageChampion=function(s,p,id,n,source=''){
 const c=champ(s,p,id);if(c?.immuneDamageTurn===s.turn)return {wounded:false};
 const old=Number(c?.damage||0),w=Number(c?.wounds||0),out=oldDamage61(s,p,id,n,source);
 if(c&&!c.defeated&&c.reactivateDamageTurn===s.turn&&(c.damage>old||c.wounds>w))c.tapped=false;
 return out;
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
 const dead=clone(m),abominations=s.board.monsters.filter(x=>x.cardId==='abominio_ricucito'&&x.uid!==m.uid);
 const effectiveKiller=s.monsterSource61?Number(s.monsterSource61.owner):killer;
 const out=oldKill61(s,effectiveKiller,m,reason,grantSoul&&m.noSoulsTurn!==s.turn&&!s.monsterSource61,kingOverride);
 for(const source of abominations)for(const x of s.board.monsters)if(x.uid!==source.uid)x.tempPow=(x.tempPow||0)+1;
 rules61.dead?.(s,dead,effectiveKiller);
 return out;
};
const oldEffect61=resolveEffect;
resolveEffect=function(s,item){
 const source=MONSTER_DEFS[item.sourceCardId];
 if(source&&String(item.effectId).startsWith('enter_'))s.monsterSource61={owner:item.actor,cardId:source.id};
 try{return oldEffect61(s,item)}finally{delete s.monsterSource61}
};
const oldEnter61=processMonsterEnter;
processMonsterEnter=function(s,m){
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
resolveCardEffect=function(s,item){if(rules61.resolve?.(s,item))return false;return oldResolve61(s,item)};
const oldCombat61=resolveCombat;
resolveCombat=function(s){
 const c=s.combat;
 if(c?.attacker?.type==='monster'){
  const m=monster(s,c.attacker.uid),d=c.target?.type==='champion'?champ(s,c.target.player,c.target.champId):null;
  if(m&&d&&!d.defeated&&!c.cancelled){
   const n=currentMonsterPow(s,m),retaliation=d.counterattack||d.counterattackTurn===s.turn?currentPow(s,c.target.player,d):0;
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
