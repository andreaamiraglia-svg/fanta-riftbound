import * as base from './game-v61-loader.ts';
import {engine61 as E,rules61 as R} from './game-v32-loader.ts?rev=souls-uncapped-v3';
import {cards,monsters} from './new20-catalog.js';
import {abilitySources61} from './september-runtime.ts';
import {moveSupportToField} from './game-v40-loader.ts';
export const CARD_DEFS:any=base.CARD_DEFS,MONSTER_DEFS:any=base.MONSTER_DEFS,CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES,newState=base.newState,newPlayer=base.newPlayer;
Object.assign(CARD_DEFS,Object.fromEntries(cards.map(c=>[c.id,c])));
Object.assign(MONSTER_DEFS,Object.fromEntries(monsters.map(c=>[c.id,c])));
export const STARTER_DECK=[...base.STARTER_DECK,...cards.map(c=>c.id)];
export const STARTER_MONSTERS=[...base.STARTER_MONSTERS,...monsters.map(m=>m.id)];
const ids=new Set(cards.map(c=>c.id)),monsterIds=new Set(monsters.map(m=>m.id));
const q=(s:any,p:any)=>s.players[String(p)];
const active=(s:any,p:any)=>(q(s,p)?.champions||[]).filter((c:any)=>!c.defeated);
const m=(s:any,id:any)=>s.board.monsters.find((x:any)=>x.uid===id);
const c=(s:any,p:any,id:any)=>active(s,p).find((x:any)=>x.id===id);
const sources=(s:any,id:any)=>abilitySources61(s).filter((x:any)=>x.cardId===id);
const ref=(p:any,x:any)=>({type:'champion',player:Number(p),champId:x.id});
function queue(s:any,p:any,id:any,effect:any,targets:any={},meta:any={}){s.triggerQueue.push({actor:Number(p),sourceCardId:id,effectId:'new20_'+effect,effectName:CARD_DEFS[id]?.name||MONSTER_DEFS[id]?.name||id,targets,meta:{...meta,targets}})}
function support(s:any,p:any,id:any){
 const d=CARD_DEFS[id];if(d?.type!=='Supporto')return;
 if(!ids.has(id)){
  if(!CHAMPION_DEFS[id]){E.resolve(s,{actor:Number(p),cardId:id,targets:{}});return}
  const x=moveSupportToField(s,Number(p),id);
  if(id==='servo_del_sovrano')draw(s,p,1,true);
  if(id==='alabardo'&&x){s.pendingChoice={type:'new20_alabardo',player:p,cardIds:active(s,p).filter((z:any)=>!z.supportChampion).map((z:any)=>z.id)};s.priority=null}
  return x;
 }
 const x={...d,id:active(s,p).some((x:any)=>x.id===id)?id+'_'+crypto.randomUUID():id,sourceCardId:id,basePow:d.basePow??0,hp:1,wounds:0,damage:0,tempPow:0,armor:0,tapped:false,defeated:false,supportChampion:true,turnEffects:[]};
 q(s,p).champions.push(x);(s.createdSupports62 ||= []).push({p,id});
 if(id==='angelo'||id==='guerriero_di_bronzo')queue(s,p,id,id,{}, {sourceId:x.id});
 return x;
}
function draw(s:any,p:any,n:any,direct=false){
 const z=q(s,p),drawn=z.deck.splice(0,Math.max(0,n));z.hand.push(...drawn);
 (s.drawn62 ||= {})[p]=Number(s.drawn62?.[p]||0)+drawn.length;
 for(const x of active(s,p).filter((x:any)=>x.sourceCardId==='araldo_dell_opulenza'))for(const _ of drawn)queue(s,p,'araldo_dell_opulenza','araldo',ref(p,x));
 s.log.push(z.name+' pesca '+drawn.length+' carte.');
 const extra=direct?sources(s,'guardiano_del_tesoro').filter((x:any)=>Number(x.owner)===Number(p)).length:0;
 if(drawn.length&&extra){const bonus=z.deck.splice(0,extra);z.hand.push(...bonus);s.drawn62[p]+=bonus.length;for(const x of active(s,p).filter((x:any)=>x.sourceCardId==='araldo_dell_opulenza'))for(const _ of bonus)queue(s,p,'araldo_dell_opulenza','araldo',ref(p,x));}
}
R.cost=(s:any,p:any,d:any)=>d.id==='viaggiatore_smarrito'?Math.max(0,4-Math.max(0,q(s,p).hand.length-q(s,3-p).hand.length)):undefined;
R.pow=(s:any,p:any,x:any)=>s.combat?.attacker?.champId===x?.id&&Number(s.combat.attacker.player)===Number(p)?sources(s,'demone_della_fornace').length:0;
R.prevent=(s:any,p:any,x:any)=>!!x&&sources(s,'cobra_reale').length>0&&q(s,p).hand.length>q(s,3-p).hand.length;
R.damage=(s:any,p:any,x:any,old:any,w:any)=>{
 if(x&&!x.defeated&&x.sourceCardId==='furia_del_ferito_supporto'&&(x.damage>old||x.wounds>w))queue(s,p,'furia_del_ferito_supporto','ferito',ref(p,x));
};
const previousValidate=R.validate;
R.validate=(s:any,p:any,d:any,t:any)=>{
 if(d.type==='Magia')for(const target of base.targetRefs({actor:p,targets:t}))if(target.type==='monster'&&m(s,target.uid)?.cardId==='mantide_della_giungla')throw Error('Mantide della Giungla non può essere bersagliata dalle Magie.');
 if(!ids.has(d.id))return previousValidate(s,p,d,t);
 if(d.target==='monsterDiscard'){
  if(!m(s,t.target?.uid)||t.target?.type!=='monster')throw Error('Scegli un Mostro valido.');
  if(!q(s,p).hand.includes(t.discardId)||t.discardId===d.id)throw Error('Scegli un’altra carta da scartare.');
 }
 return true;
};
const previousResolve=R.resolve;
R.resolve=(s:any,item:any)=>{
 const d=CARD_DEFS[item.cardId];if(!ids.has(item.cardId))return previousResolve(s,item);
 const p=Number(item.actor);
 if(d.type==='Supporto'){support(s,p,d.id);return true}
 if(d.id==='tesoro_del_sovrano')draw(s,p,3);
 if(d.id==='munizioni_d_emergenza'&&m(s,item.targets?.target?.uid))E.damageMonster(s,p,item.targets.target.uid,3+(q(s,p).fireCloud?1:0),d.name);
 return true;
};
R.enter=(s:any,x:any)=>{
 if(!monsterIds.has(x?.cardId))return false;
 const id=x.cardId,p=x.owner,i=s.board.monsters.indexOf(x),neighbors=[s.board.monsters[i-1],s.board.monsters[i+1]].filter(Boolean);
 if(id==='pappagallo_pirata')queue(s,p,id,'pappagallo',{type:'monster',uid:x.uid});
 if(id==='tartaruga_delle_radici')queue(s,p,id,'tartaruga',{}, {uids:s.board.monsters.filter((z:any)=>E.monsterPow(s,z)<=2).map((z:any)=>z.uid)});
 if(id==='serpente_glaciale')queue(s,p,id,'serpente',{}, {uids:neighbors.map((z:any)=>z.uid)});
 if(id==='serafino_guardiano'&&neighbors[0]===s.board.monsters[i-1])queue(s,p,id,'serafino',{type:'monster',uid:s.board.monsters[i-1].uid});
 if(id==='sfinge_dell_alba')queue(s,p,id,'sfinge');
 if(id==='ragno_dei_cadaveri')queue(s,p,id,'ragno',{}, {players:[p,3-p]});
 return true;
};
R.effect=(s:any,item:any)=>{
 if(!String(item.effectId).startsWith('new20_'))return false;
 const p=Number(item.actor),t=item.meta?.targets||item.targets||{},x=t.type==='monster'?m(s,t.uid):c(s,t.player,t.champId);
 switch(item.effectId.slice(6)){
 case'araldo':if(x)x.tempPow=Number(x.tempPow||0)+1;break;
 case'ferito':if(x)x.tempPow=Number(x.tempPow||0)+2;break;
 case'alabardo':if(x){x.provocazione62Turn=s.turn;x.provocazione62Prev=!!x.provocazione;x.provocazione=true}break;
 case'pappagallo':if(x){s.monsterSource61={owner:p};try{E.damageMonster(s,p,x.uid,1,'Pappagallo Pirata')}finally{delete s.monsterSource61}}break;
 case'tartaruga':for(const z of s.board.monsters.filter((z:any)=>E.monsterPow(s,z)<=2))z.tempPow=Number(z.tempPow||0)+2;break;
 case'serpente':for(const uid of item.meta.uids||[]){const z=m(s,uid);if(z)E.reduceMonster(s,z,1,'Serpente Glaciale')}break;
 case'serafino':if(x){x.provocazione62Turn=s.turn;x.provocazione62Prev=!!x.provocazione;x.provocazione=true}break;
 case'sfinge':draw(s,p,1);draw(s,3-p,1);break;
 case'idra':if(x)E.damageChampion(s,t.player,t.champId,1,'Idra della Palude');break;
 case'viverna':for(const target of item.meta.participants||[]){if(target.type==='monster'){if(m(s,target.uid)){s.monsterSource61={owner:p};try{E.damageMonster(s,p,target.uid,1,'Viverna')}finally{delete s.monsterSource61}}}else if(c(s,target.player,target.champId))E.damageChampion(s,target.player,target.champId,1,'Viverna')}break;
 case'angelo':{
  const options=[...new Set(q(s,p).deck.filter((id:any)=>CARD_DEFS[id]?.cost===0&&!CARD_DEFS[id]?.tokenSupport))];
  if(options.length){s.pendingChoice={type:'new20_angelo',player:p,cardIds:options};s.priority=null}break;
 }
 case'guerriero_di_bronzo':{
  const list=q(s,p).hand.filter((id:any)=>CARD_DEFS[id]?.type==='Supporto'&&[1,2].includes(CARD_DEFS[id].cost));
  if(list.length){s.pendingChoice={type:'new20_bronzo',player:p,cardIds:list};s.priority=null}break;
 }
 case'ragno':{
  const players=(item.meta.players||[p,3-p]).filter((n:any)=>q(s,n).grave.length);
  if(players.length){const first=players.shift();s.pendingChoice={type:'new20_ragno',player:first,cardIds:[...new Set(q(s,first).grave)],remaining:players};s.priority=null}break;
 }
 }
 return true;
};
function sync(s:any,oldTurn:any){
 const aura=sources(s,'granchio_degli_abissi').length>0;
 for(const x of s.board.monsters){
  if(x.crab62){x.provocazione=!!x.crab62Prev;delete x.crab62;delete x.crab62Prev}
  if(x.provocazione62Turn&&x.provocazione62Turn!==s.turn){x.provocazione=!!x.provocazione62Prev;delete x.provocazione62Turn;delete x.provocazione62Prev}
  if(aura&&x.armor>0){x.crab62Prev=!!x.provocazione;x.crab62=true;x.provocazione=true}
 }
 for(const created of s.createdSupports62||[]){const grave=q(s,created.p).grave,i=grave.indexOf(created.id);if(i>=0)grave.splice(i,1)}delete s.createdSupports62;
 for(const p of [1,2])for(const x of active(s,p))if(x.provocazione62Turn&&x.provocazione62Turn!==s.turn){x.provocazione=!!x.provocazione62Prev;delete x.provocazione62Turn;delete x.provocazione62Prev}
 if(s.combat){const a=s.combat.attacker,target=s.combat.target;if(a?.type==='monster'&&!m(s,a.uid)||a?.champId&&!c(s,a.player,a.champId)||target?.type==='monster'&&!m(s,target.uid)||target?.type==='champion'&&!c(s,target.player,target.champId))s.combat.cancelled=true}
}
function opening(s:any){
 if(!s.combat||s.combat.opened62)return;s.combat.opened62=true;
 const a=s.combat.attacker,participants=[a.type==='monster'?{type:'monster',uid:a.uid}:{type:'champion',player:a.player,champId:a.champId},s.combat.target];
 for(const x of sources(s,'viverna'))queue(s,x.owner,'viverna','viverna',{}, {participants});
 E.prepare(s);
}
export function act(s:any,p:any,move:any){
 s.drawn62={};const previousLog=[...s.log];
 sync(s,s.turn);const turn=s.turn,before=[1,2].flatMap(n=>active(s,n).map((x:any)=>({p:n,id:x.id,armor:x.armor}))),hands={1:[...q(s,1)?.hand||[]],2:[...q(s,2)?.hand||[]]};
 if(s.pendingChoice?.type?.startsWith('new20_')){
  const pc=s.pendingChoice;if(Number(pc.player)!==Number(p)||move.type!=='resolve_choice')throw Error('Completa la scelta in attesa.');
  if(pc.type==='new20_ragno'){
   if(!pc.cardIds.includes(move.cardId)||!q(s,p).grave.includes(move.cardId))throw Error('Carta del Cimitero non valida.');
   q(s,p).grave.splice(q(s,p).grave.indexOf(move.cardId),1);q(s,p).hand.push(move.cardId);s.pendingChoice=null;
   const rest=(pc.remaining||[]).filter((n:any)=>q(s,n).grave.length);if(rest.length){const next=rest.shift();s.pendingChoice={type:pc.type,player:next,cardIds:[...new Set(q(s,next).grave)],remaining:rest}}else E.after(s);
  }else if(pc.type==='new20_bronzo'){
   const chosen=[...new Set(move.cardIds||[])];if(chosen.length>2||chosen.some((id:any)=>!pc.cardIds.includes(id)||!q(s,p).hand.includes(id))||new Set(chosen.map((id:any)=>CARD_DEFS[id].cost)).size!==chosen.length)throw Error('Scegli al massimo un Supporto di costo 1 e uno di costo 2.');
   s.pendingChoice=null;for(const id of chosen){q(s,p).hand.splice(q(s,p).hand.indexOf(id),1);support(s,p,id)}if(!s.pendingChoice)E.after(s);
  }else if(pc.type==='new20_alabardo'){
   const x=c(s,p,move.cardId);if(!pc.cardIds.includes(move.cardId)||!x)throw Error('Campione non valido.');
   s.pendingChoice=null;queue(s,p,'alabardo','alabardo',ref(p,x));E.after(s);
  }else{
   const id=move.cardId;if(!pc.cardIds.includes(id)||!q(s,p).deck.includes(id))throw Error('Carta del mazzo non valida.');
   E.validate(s,Number(p),CARD_DEFS[id],move.targets||{});
   if(!E.canPay(s,Number(p),CARD_DEFS[id]))throw Error('Non hai abbastanza anime per il costo modificato della carta.');
   const paid=E.pay(s,Number(p),CARD_DEFS[id]);
   if(id==='munizioni_d_emergenza'){const discard=move.targets.discardId;q(s,p).hand.splice(q(s,p).hand.indexOf(discard),1);q(s,p).grave.push(discard)}
   q(s,p).deck.splice(q(s,p).deck.indexOf(id),1);s.pendingChoice=null;
   s.stack.push({uid:crypto.randomUUID(),kind:'card',actor:Number(p),cardId:id,targets:move.targets||{},paidCost:paid});E.prepare(s);
  }
  sync(s,turn);return s;
 }
 if(move.type==='cast'&&move.cardId==='munizioni_d_emergenza')R.validate(s,Number(p),CARD_DEFS[move.cardId],move.targets||{});
 const discarded=move.type==='cast'&&move.cardId==='munizioni_d_emergenza'?move.targets.discardId:null;
 const top=move.type==='pass_priority'?s.stack.at(-1):null;
 const out=base.act(s,p,move);
 if(discarded){q(s,p).hand.splice(q(s,p).hand.indexOf(discarded),1);q(s,p).grave.push(discarded)}
 if(top?.kind==='card'&&CARD_DEFS[top.cardId]?.type==='Magia'&&!s.stack.some((x:any)=>x.uid===top.uid)){
  for(const prev of before){const x=c(s,prev.p,prev.id);if(x&&x.armor>prev.armor){const tritons=sources(s,'tritone_del_gelo').length;x.armor+=tritons;for(const idra of sources(s,'idra_della_palude'))queue(s,idra.owner,'idra_della_palude','idra',ref(prev.p,x))}}
 }
 let overlap=Math.min(previousLog.length,s.log.length);
 while(overlap>0&&!previousLog.slice(-overlap).every((line:any,i:any)=>line===s.log[i]))overlap--;
 const newLog=s.log.slice(overlap);
 for(const n of [1,2]){
  const drew=newLog.some((line:any)=>String(line).includes(q(s,n).name+' pesca'));
  const count=drew?Math.max(0,q(s,n).hand.filter((id:any)=>!hands[n].includes(id)).length-Number(s.drawn62[n]||0)):0;
  for(const x of active(s,n).filter((x:any)=>x.sourceCardId==='araldo_dell_opulenza'))for(let i=0;i<count;i++)queue(s,n,'araldo_dell_opulenza','araldo',ref(n,x));
 }
 sync(s,turn);opening(s);if(s.triggerQueue.length&&!s.pendingChoice)E.prepare(s);return out;
}
export function publicView(s:any,p:any){
 sync(s,s.turn);const v=base.publicView(s,p);
 for(const x of v.board.monsters){const raw=m(s,x.uid);x.provocazione=!!(raw?.provocazione||MONSTER_DEFS[raw?.cardId]?.provocazione)}
 for(const item of v.stack){const raw=s.stack.find((x:any)=>x.uid===item.uid);if(raw?.meta?.targets){item.targets=raw.meta.targets;item.targetRefs=base.targetRefs({actor:item.actor,targets:raw.meta.targets})}if(raw?.meta?.participants)item.targetRefs=raw.meta.participants}
 return v;
}
