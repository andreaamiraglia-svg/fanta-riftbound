import * as base from './game-v62-loader.ts';
import {engine61 as E,rules61 as R} from './game-v32-loader.ts?rev=souls-uncapped-v3';
import {queueLascito,promote} from './game-v60-loader.ts';
import {targetRefs} from './game-v61-loader.ts';
import {cards} from './batch3-catalog.js';
export const CARD_DEFS:any=base.CARD_DEFS,MONSTER_DEFS:any=base.MONSTER_DEFS,CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES,newState=base.newState,newPlayer=base.newPlayer,STARTER_MONSTERS=base.STARTER_MONSTERS;
export const STARTER_DECK=[...new Set([...base.STARTER_DECK,...cards.map(x=>x.id)])];
Object.assign(CARD_DEFS,Object.fromEntries(cards.map(x=>[x.id,x])));
const ids=new Set(cards.map(x=>x.id));
const q=(s:any,p:any)=>s.players[String(p)];
const active=(s:any,p:any)=>(q(s,p)?.champions||[]).filter((x:any)=>!x.defeated);
const mon=(s:any,uid:any)=>s.board.monsters.find((x:any)=>x.uid===uid);
function entity(s:any,t:any){return t?.type==='monster'?mon(s,t.uid):t?.type==='champion'?active(s,t.player).find((x:any)=>x.id===t.champId):null}
function valid(s:any,p:number,t:any,kind:string){const x=entity(s,t);if(!x)return false;if(kind==='monster')return t.type==='monster';if(kind==='ownMonster')return t.type==='monster'&&Number(x.owner)===p;if(kind==='own')return t.type==='champion'&&Number(t.player)===p;if(kind==='enemy')return t.type==='monster'||Number(t.player)===3-p;return true}
function power(s:any,t:any){const x=entity(s,t);return x?(t.type==='monster'?E.monsterPow(s,x):E.pow(s,t.player,x)):0}
function hasLascito(s:any,m:any){return !!MONSTER_DEFS[m?.cardId]?.lascito||['scorpione_delle_ceneri','marionetta_maledetta'].includes(m?.cardId)||m?.richiamoBrancoTurn===s.turn||!!m?.rinascita63}
function queue(s:any,p:any,id:string,effect:string,targets:any={},meta:any={},first=false){const tr={actor:Number(p),sourceCardId:id,effectId:'batch3_'+effect,effectName:CARD_DEFS[id]?.name||id,targets,meta:{...meta,targets}};first?s.triggerQueue.unshift(tr):s.triggerQueue.push(tr)}
function charge(s:any,x:any,n:number){x.charge=x.chargeTurn===s.turn?Number(x.charge||0)+n:n;x.chargeTurn=s.turn}
function damage(s:any,p:number,t:any,n:number,name:string){if(!entity(s,t))return;const amount=n+(q(s,p).fireCloud?1:0);t.type==='monster'?E.damageMonster(s,p,t.uid,amount,name):E.damageChampion(s,t.player,t.champId,amount,name)}
const previousValidate=R.validate;
R.validate=(s:any,p:number,d:any,t:any)=>{
 // Preserve protections such as Mantide even for this batch.
 if(!ids.has(d.id))return previousValidate(s,p,d,t);
 for(const ref of targetRefs({actor:p,targets:t}))if(ref.type==='monster'&&mon(s,ref.uid)?.cardId==='mantide_della_giungla')throw Error('Mantide della Giungla non può essere bersagliata dalle Magie.');
 const require=(v:any,k:string)=>{if(!valid(s,p,v,k))throw Error('Bersaglio non valido.');};
 switch(d.target){
 case'none':break;
 case'enemySoul':if(!['red','green','black','blue','orange'].includes(t.color)||!(q(s,3-p).souls[t.color]>0))throw Error('Scegli un colore di cui l’avversario possiede anime.');break;
 case'graveMonster':if(!q(s,p).monsterGrave.includes(t.graveMonsterId))throw Error('Scegli un Mostro dal tuo Cimitero.');break;
 case'tapEnemy':require(t.champion,'own');require(t.enemy,'enemy');if(entity(s,t.champion).tapped)throw Error('Il Campione da tappare deve essere attivo.');break;
 case'damageHeal':require(t.enemy,'enemy');require(t.champion,'own');break;
 case'twoEnemies':if(!Array.isArray(t.enemies)||t.enemies.length!==2||JSON.stringify(t.enemies[0])===JSON.stringify(t.enemies[1]))throw Error('Scegli due nemici diversi.');for(const x of t.enemies)require(x,'enemy');break;
 case'chargeDiscard':require(t.target,'own');if(t.discardId===d.id||!q(s,p).hand.includes(t.discardId))throw Error('Scegli un’altra carta da scartare.');break;
 case'lascitoMonster':require(t.target,'monster');if(power(s,t.target)>2||!hasLascito(s,entity(s,t.target)))throw Error('Scegli un Mostro in gioco con Lascito e al massimo 2 POW.');break;
 default:require(t.target,d.target);
 }
 return true;
};
const previousResolve=R.resolve;
const previousPaid=R.paid;
R.paid=(s:any,p:number,d:any,t:any)=>{
 previousPaid?.(s,p,d,t);
 if(d.id==='vincolo_di_brina')entity(s,t.champion).tapped=true;
 if(d.id==='tutto_per_la_vittoria'){const i=q(s,p).hand.indexOf(t.discardId);q(s,p).hand.splice(i,1);q(s,p).grave.push(t.discardId)}
};
R.resolve=(s:any,item:any)=>{
 if(!ids.has(item.cardId)){
  const t=item.targets?.target,before=t?.type==='monster'?power(s,t):null;
  const out=previousResolve(s,item);
  const m=t?.type==='monster'?entity(s,t):null;
  if(m&&before!==null&&power(s,t)<before&&['stasi_del_leviatano','morsa_dell_inverno'].includes(item.cardId))R.reduced(s,m);
  return out;
 }
 const d=CARD_DEFS[item.cardId],p=Number(item.actor),t=item.targets||{},x=entity(s,t.target);
 switch(d.id){
 case'erosione_polare':if(x){x.erosione63={turn:s.turn,actor:p};}break;
 case'vincolo_di_brina':{const enemy=entity(s,t.enemy);if(enemy&&valid(s,p,t.enemy,'enemy'))t.enemy.type==='monster'?E.reduceMonster(s,enemy,2,d.name):E.reduceChampion(s,t.enemy.player,t.enemy.champId,2,d.name);break}
 case'esazione_delle_anime':q(s,3-p).souls[t.color]=Math.max(0,Number(q(s,3-p).souls[t.color]||0)-1);break;
 case'richiamo_sepolcrale':{const i=q(s,p).monsterGrave.indexOf(t.graveMonsterId);if(i>=0){q(s,p).monsterGrave.splice(i,1);E.addMonster(s,t.graveMonsterId,p)}break}
 case'rinascita':if(x&&Number(x.owner)===p)x.rinascita63={actor:p};break;
 case'marea_necrotica':E.beginDamage(s,p);try{for(const uid of s.board.monsters.map((m:any)=>m.uid))damage(s,p,{type:'monster',uid},1,d.name)}finally{E.endDamage(s)}for(const c of active(s,p))c.damage=Math.max(0,Number(c.damage||0)-1);break;
 case'corazza_dei_caduti':if(x&&valid(s,p,t.target,'own')){x.corazza63 ||= [];x.corazza63.push(s.turn)}break;
 case'mandato_di_morte':if(x)E.kill(s,p,x,d.name,true);break;
 case'sifone_d_anime':E.beginDamage(s,p);try{if(valid(s,p,t.enemy,'enemy'))damage(s,p,t.enemy,1,d.name)}finally{E.endDamage(s)}{const own=entity(s,t.champion);if(own&&valid(s,p,t.champion,'own'))own.damage=Math.max(0,Number(own.damage||0)-2)}break;
 case'lascito_profanato':if(x&&power(s,t.target)<=2&&hasLascito(s,x)){
  const kings=s.board.monsters.filter((m:any)=>m.cardId==='re_dei_non_morti').length;
  if(['scorpione_delle_ceneri','marionetta_maledetta'].includes(x.cardId)||['sciamano','scarabeo_dorato'].includes(MONSTER_DEFS[x.cardId]?.lascito)){queueLascito(s,x,p,kings);promote(s)}else E.lascito(s,x,p,kings);
  if(x.richiamoBrancoTurn===s.turn)for(let i=0;i<=kings;i++)s.triggerQueue.push({actor:p,sourceCardId:'richiamo_del_branco',effectId:'lascito_richiamo_branco',choiceType:'enemyChampion',effectName:'Lascito — Richiamo del Branco'});
  // A granted resurrection Lascito on a living Monster has nothing to revive.
 }break;
 case'risveglio_selvaggio':for(const c of active(s,p))c.tapped=false;break;
 case'guardiano_delle_radici':if(x){x.tempPow=Number(x.tempPow||0)+4;x.provocazione62Prev=!!x.provocazione;x.provocazione62Turn=s.turn;x.provocazione=true}break;
 case'richiamo_del_branco_verde':if(x){if(!x.noProv63||x.noProv63.turn!==s.turn)x.noProv63={turn:s.turn,previous:!!x.provocazione&&(!x.provocazione62Turn||!!x.provocazione62Prev)};x.provocazione=false}break;
 case'spaccacorazze_della_giungla':if(x)damage(s,p,t.target,x.armor>0?3:1,d.name);break;
 case'tutto_per_la_vittoria':if(x&&valid(s,p,t.target,'own'))charge(s,x,6);break;
 case'doppio_colpo':E.beginDamage(s,p);try{for(const enemy of t.enemies||[])if(valid(s,p,enemy,'enemy'))damage(s,p,enemy,2,d.name)}finally{E.endDamage(s)}break;
 case'grido_di_guerra':for(const c of active(s,p))charge(s,c,2);break;
 case'ritorsione_cremisi':if(x)damage(s,p,t.target,4,d.name);break;
 case'sangue_bollente':if(x&&valid(s,p,t.target,'own'))charge(s,x,1);break;
 case'carica_incendiaria':if(x&&valid(s,p,t.target,'own'))charge(s,x,3);break;
 }
 s.log.push(d.name+': effetto risolto.');return true;
};
R.reduced=(s:any,m:any)=>{if(m.erosione63?.turn===s.turn&&mon(s,m.uid))E.kill(s,m.erosione63.actor,m,'Erosione Polare',true)};
const previousDead=R.dead;
R.dead=(s:any,dead:any,killer:any)=>{
 previousDead?.(s,dead,killer);
 for(const p of [1,2])for(const c of active(s,p))for(const turn of c.corazza63||[])if(turn===s.turn)queue(s,p,'corazza_dei_caduti','armor',{type:'champion',player:p,champId:c.id});
 if(dead.rinascita63)queue(s,dead.rinascita63.actor,'rinascita','revive',{}, {owner:dead.owner,cardId:dead.cardId},true);
};
const previousEffect=R.effect;
R.effect=(s:any,item:any)=>{
 if(!String(item.effectId).startsWith('batch3_'))return previousEffect(s,item);
 if(item.effectId==='batch3_armor'){const x=entity(s,item.meta.targets);if(x)x.armor=Number(x.armor||0)+2;}
 if(item.effectId==='batch3_revive'){
  const {owner,cardId}=item.meta,q0=q(s,owner),i=q0.monsterGrave.indexOf(cardId);
  if(i>=0){q0.monsterGrave.splice(i,1);E.addMonster(s,cardId,owner,false,{skipEnter63:true});s.log.push(MONSTER_DEFS[cardId].name+' ritorna in vita senza attivare gli effetti di entrata.');}
 }
 return true;
};
function sync(s:any){for(const x of [...s.board.monsters,...active(s,1),...active(s,2)]){
 if(x.noProv63){if(x.noProv63.turn===s.turn)x.provocazione=false;else{if(x.noProv63.previous)x.provocazione=true;delete x.noProv63}}
 if(x.erosione63&&x.erosione63.turn!==s.turn)delete x.erosione63;
 if(x.corazza63)x.corazza63=x.corazza63.filter((turn:any)=>turn===s.turn);
}}
function discardTriggers(s:any,before:any,move:any){
 for(const p of [1,2]){
  const n=before[p].hand.filter((id:any)=>id==='ritorsione_cremisi').length-q(s,p).hand.filter((id:any)=>id==='ritorsione_cremisi').length;
  const added=q(s,p).grave.filter((id:any)=>id==='ritorsione_cremisi').length-before[p].grave.filter((id:any)=>id==='ritorsione_cremisi').length;
  if(n>0&&added>0&&!(move.type==='cast'&&move.cardId==='ritorsione_cremisi'))(s.discardOffers63 ||= []).push({player:p,cardId:'ritorsione_cremisi'});
 }
}
function offer(s:any){if(s.pendingChoice||s.status==='gameover')return;while(s.discardOffers63?.length){const x=s.discardOffers63.shift();if(!q(s,x.player).grave.includes(x.cardId)||!E.canPay(s,x.player,CARD_DEFS[x.cardId]))continue;s.pendingChoice={type:'batch3_discard',...x,resumePriority:s.priority};s.priority=null;return}}
export function act(s:any,p0:any,move:any){
 const p=Number(p0);sync(s);
 if(s.pendingChoice?.type==='batch3_discard'){
  const pc=s.pendingChoice;if(Number(pc.player)!==p||move.type!=='resolve_choice')throw Error('Completa la scelta di Ritorsione Cremisi.');
  if(move.decline){s.pendingChoice=null;s.priority=pc.resumePriority;offer(s);return s}
  const d=CARD_DEFS[pc.cardId];E.validate(s,p,d,move.targets||{});if(!E.canPay(s,p,d))throw Error('Anime insufficienti.');
  const i=q(s,p).grave.indexOf(pc.cardId);if(i<0)throw Error('La carta non è più nel Cimitero.');const cost=E.pay(s,p,d);q(s,p).grave.splice(i,1);s.pendingChoice=null;
  s.stack.push({uid:crypto.randomUUID(),kind:'card',actor:p,cardId:d.id,targets:move.targets||{},paidCost:cost});if(s.stackInitiator==null)s.stackInitiator=p;s.priority=3-p;s.mainPasses=0;E.prepare(s);sync(s);return s;
 }
 const before=Object.fromEntries([1,2].map(p=>[p,{hand:[...(q(s,p)?.hand||[])],grave:[...(q(s,p)?.grave||[])]}]));
 const id=move.type==='cast'?move.cardId:move.type==='resolve_choice'&&s.pendingChoice?.type==='new20_angelo'?move.cardId:null;
 const additional=id==='vincolo_di_brina'||id==='tutto_per_la_vittoria';
 if(additional)E.validate(s,p,CARD_DEFS[id],move.targets||{});
 const out=base.act(s,p,move);
 sync(s);discardTriggers(s,before,move);offer(s);return out;
}
export function publicView(s:any,p:any){sync(s);const v=base.publicView(s,p);for(const m of v.board.monsters){const raw=mon(s,m.uid);if(raw?.noProv63?.turn===s.turn)m.provocazione=false}for(const owner of [1,2])for(const c of v.players[String(owner)]?.champions||[]){const raw=active(s,owner).find((x:any)=>x.id===c.id);if(raw?.noProv63?.turn===s.turn)c.provocazione=false}delete v.discardOffers63;return v}
