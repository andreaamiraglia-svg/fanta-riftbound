import * as base from './game-v60-loader.ts';
import {engine61 as E,rules61 as R} from './game-v32-loader.ts?rev=souls-uncapped-v3';
import {cards,monsters} from './september-catalog.js';
export const CARD_DEFS:any=base.CARD_DEFS,MONSTER_DEFS:any=base.MONSTER_DEFS,CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES,newState=base.newState,newPlayer=base.newPlayer;
for(const c of cards)CARD_DEFS[c.id]=c;
for(const m of monsters)MONSTER_DEFS[m.id]=m;
export const STARTER_DECK=[...new Set([...base.STARTER_DECK,...cards.map(c=>c.id)])];
export const STARTER_MONSTERS=[...new Set([...base.STARTER_MONSTERS,...monsters.map(c=>c.id)])];
const ids=new Set(cards.map(c=>c.id));
const player=(s:any,p:number)=>s.players[String(p)];
const champions=(s:any,p:number)=>(player(s,p)?.champions||[]).filter((c:any)=>!c.defeated);
const monster=(s:any,uid:string)=>s.board.monsters.find((m:any)=>m.uid===uid);
const entity=(s:any,t:any)=>t?.type==='monster'?monster(s,t.uid):t?.type==='champion'?champions(s,Number(t.player)).find((c:any)=>c.id===t.champId):null;
const power=(s:any,t:any)=>t.type==='monster'?E.monsterPow(s,entity(s,t)):E.pow(s,Number(t.player),entity(s,t));
function valid(s:any,p:number,t:any,kind:string){
 const x=entity(s,t);if(!x)return false;
 if(kind==='monster')return t.type==='monster';
 if(kind==='ownMonster')return t.type==='monster'&&Number(x.owner)===p;
 if(kind==='own')return t.type==='champion'&&Number(t.player)===p;
 if(kind==='enemyChampion')return t.type==='champion'&&Number(t.player)===3-p;
 if(kind==='enemy')return t.type==='monster'||Number(t.player)===3-p;
 if(kind==='zeroChampion')return t.type==='champion'&&power(s,t)<=0;
 return true;
}
R.validate=(s:any,p:number,c:any,t:any)=>{
 if(!ids.has(c.id))return false;
 if(c.target==='none')return true;
 if(c.target==='spell'){
  if(!s.stack.some((x:any)=>x.uid===t.stackUid&&x.kind==='card'&&CARD_DEFS[x.cardId]?.type==='Magia'))throw Error('Scegli una Magia nella pila.');
 }else if(c.target==='monsters'){
  if(!Array.isArray(t.monsterUids)||t.monsterUids.length>3||new Set(t.monsterUids).size!==t.monsterUids.length||t.monsterUids.some((u:any)=>!monster(s,u)))throw Error('Scegli fino a 3 Mostri diversi.');
 }else if(c.target==='reflection'){
  if(!valid(s,p,t.champion,'own')||!valid(s,p,t.enemy,'enemy'))throw Error('Scegli un tuo Campione e un nemico.');
 }else if(!valid(s,p,t.target,c.target))throw Error('Bersaglio non valido.');
 return true;
};
const damage=(s:any,p:number,t:any,n:number,name:string)=>{if(!entity(s,t)||n<=0)return;if(t.type==='monster')E.damageMonster(s,p,t.uid,n,name);else E.damageChampion(s,Number(t.player),t.champId,n,name)};
R.resolve=(s:any,item:any)=>{
 const id=item.cardId;if(!ids.has(id))return false;
 const p=Number(item.actor),t=item.targets||{},x=entity(s,t.target),d=CARD_DEFS[id];
 if(!['none','monsters','reflection','spell'].includes(d.target)&&!valid(s,p,t.target,d.target)){s.log.push(d.name+': bersaglio non più valido.');return true}
 switch(id){
 case'pelle_di_quercia_antica':x.immuneDamageTurn=s.turn;break;
 case'ira_del_sottobosco':for(const uid of t.monsterUids)damage(s,p,{type:'monster',uid},3+(player(s,p).fireCloud?1:0),d.name);break;
 case'patto_della_foresta':{
  const pow=E.monsterPow(s,x),def=MONSTER_DEFS[x.cardId];
  s.board.monsters.splice(s.board.monsters.indexOf(x),1);
  const c={...def,...x,id:'patto_'+x.uid,name:def.name,basePow:pow-Number(x.tempPow||0),hp:1,wounds:0,tapped:false,defeated:false,supportChampion:true,tokenSupport:true,sourceCardId:x.cardId,monsterOrigin:{cardId:x.cardId,owner:x.owner},turnEffects:[]};
  player(s,p).champions.push(c);s.log.push(def.name+' diventa un Supporto attivo con 1 HP.');break;
 }
 case'colpo_al_cuore':x.extraWoundTurn=s.turn;break;
 case'linfa_vitale':x.damage=Math.max(0,Number(x.damage||0)-2);break;
 case'furia_della_selva':{
  const cardId=player(s,p).monsterDeck.shift();if(!cardId)break;
  const m=E.addMonster(s,cardId,p);
  s.septemberCombat={initiator:p,attacker:{type:'monster',player:p,uid:m.uid},target:t.target,cancelled:false};break;
 }
 case'furia_del_ferito':x.reactivateDamageTurn=s.turn;break;
 case'sigillo_dell_oblio':x.noSoulsTurn=s.turn;damage(s,p,t.target,1+(player(s,p).fireCloud?1:0),d.name);break;
 case'scaglie_di_gelo':x.armor=Number(x.armor||0)+3;break;
 case'fortezza_di_cristallo':x.armor=Number(x.armor||0)*2;break;
 case'respiro_dell_inverno':E.wound(s,Number(t.target.player),x,d.name);break;
 case'riflesso_polare':{const c=entity(s,t.champion);if(c)damage(s,p,t.enemy,Number(c.armor||0)+(player(s,p).fireCloud?1:0),d.name);break}
 case'stasi_del_leviatano':x.tempPow=Number(x.tempPow||0)-power(s,t.target);x.armor=Number(x.armor||0)+10;break;
 case'morsa_dell_inverno':x.tempPow=Number(x.tempPow||0)+2-power(s,t.target);break;
 case'distruttore_dell_oscurita':{
  const i=s.stack.findIndex((z:any)=>z.uid===t.stackUid&&z.kind==='card'&&CARD_DEFS[z.cardId]?.type==='Magia');
  if(i>=0){const [cancelled]=s.stack.splice(i,1);player(s,Number(cancelled.actor)).grave.push(cancelled.cardId);s.log.push(CARD_DEFS[cancelled.cardId].name+' viene annullata.')}break;
 }
 case'egida_d_acciaio':x.armor=Number(x.armor||0)+2;break;
 case'stendardi_della_legione_dorata':x.septemberCounterTurn=s.turn;break;
 case'carica_degli_impavidi':for(const c of champions(s,p).filter((z:any)=>z.supportChampion)){c.charge=c.chargeTurn===s.turn?Number(c.charge||0)+1:1;c.chargeTurn=s.turn}break;
 }
 s.log.push(d.name+': effetto risolto.');return true;
};
function readyCombat(s:any){
 if(s.septemberCombat&&!s.pendingChoice&&!s.stack.length&&!(s.enterQueue||[]).length){
  const c=s.septemberCombat;delete s.septemberCombat;
  if(s.status==='gameover'||!monster(s,c.attacker.uid)||!entity(s,c.target))return;
  s.combat=c;s.combatPasses=0;s.priority=3-c.initiator;s.stackInitiator=c.initiator;s.log.push('Furia della Selva apre un combattimento.');
 }
}
export function act(s:any,p:any,move:any){
 const turn=s.turn,transformed=[1,2].flatMap(owner=>champions(s,owner).filter((c:any)=>c.monsterOrigin).map((c:any)=>({owner,c})));
 const out=base.act(s,p,move);
 for(const {owner,c} of transformed)if(c.defeated){
  const q=player(s,owner),i=q.grave.indexOf(c.sourceCardId);if(i>=0)q.grave.splice(i,1);
  q.champions=q.champions.filter((z:any)=>z!==c);
  player(s,Number(c.monsterOrigin.owner)).monsterGrave.push(c.monsterOrigin.cardId);
  E.lascito(s,{...c,cardId:c.monsterOrigin.cardId},owner,s.board.monsters.filter((m:any)=>m.cardId==='re_dei_non_morti').length);
  E.prepare(s);
 }
 if(s.turn!==turn)for(const owner of [1,2])for(const c of player(s,owner)?.champions||[])
  for(const k of ['immuneDamageTurn','extraWoundTurn','reactivateDamageTurn','chargeTurn','charge','septemberCounterTurn'])delete c[k];
 readyCombat(s);return out;
}
export function targetRefs(item:any){
 const t=item.targets||{},rows:any[]=[];
 const walk=(v:any)=>{if(!v||typeof v!=='object')return;if(v.type==='monster'&&v.uid||v.champId&&v.player){rows.push({...v,type:v.type||'champion'});return}for(const x of Object.values(v))walk(x)};walk(t);
 for(const k of ['ownChamp','supportId'])if(t[k])rows.push({type:'champion',player:Number(item.actor),champId:t[k]});
 for(const uid of [t.monsterUid,...(t.monsterUids||[])].filter(Boolean))rows.push({type:'monster',uid});
 if(t.stackUid)rows.push({type:'stack',uid:t.stackUid});
 return [...new Map(rows.map(x=>[JSON.stringify(x),x])).values()];
}
export function publicView(s:any,p:any){
 const v=base.publicView(s,p);
 for(const item of v.stack||[]){const raw=s.stack.find((x:any)=>x.uid===item.uid);if(raw){item.targets=raw.targets;item.targetRefs=targetRefs(raw)}}
 for(const owner of [1,2])for(const c of v.players[String(owner)]?.champions||[]){const raw=player(s,owner).champions.find((x:any)=>x.id===c.id);if(raw)c.pow=E.pow(s,owner,raw)}
 delete v.septemberCombat;return v;
}
