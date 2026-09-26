import * as base from './game-v69-loader.ts';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const SUPERIOR_CHAMPIONS:any=(base as any).SUPERIOR_CHAMPIONS;
export const newPlayer:any=base.newPlayer;
export const newState:any=base.newState;

const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const other=(p:number)=>p===1?2:1;
const num=(v:any)=>Number.isFinite(Number(v))?Number(v):0;
const clone=(x:any)=>JSON.parse(JSON.stringify(x));
const uid=()=>crypto.randomUUID();

type Fx={id:string;kind:'buff'|'debuff'|'status';stat:string;amount?:number;label:string;source:string;sourcePlayer?:string;turn:number;expires?:'turn'|'persistent'};

type Ctx={name:string;playerName:string;actor:number;kind:string};

function nameForSource(id:any,state:any){
 const k=String(id||'');
 if(!k)return 'Effetto di gioco';
 if(CARD_DEFS?.[k]?.name)return CARD_DEFS[k].name;
 if(MONSTER_DEFS?.[k]?.name)return MONSTER_DEFS[k].name;
 if(CHAMPION_DEFS?.[k]?.name)return CHAMPION_DEFS[k].name;
 for(const p of [1,2]){const c=(player(state,p)?.champions||[]).find((x:any)=>String(x?.id)===k);if(c?.name)return c.name}
 return k.replaceAll('_',' ');
}
function sourceContext(state:any,p:number,move:any):Ctx{
 let actor=p===1||p===2?p:1,name='Effetto di gioco',kind=String(move?.type||'azione');
 if(move?.type==='pass_priority'&&state?.stack?.length){
  const top=state.stack[state.stack.length-1];actor=[1,2].includes(Number(top?.actor))?Number(top.actor):actor;
  name=top?.effectName||nameForSource(top?.cardId||top?.sourceCardId,state);kind=top?.kind||'effetto';
 }else if(move?.cardId){name=nameForSource(move.cardId,state);kind='carta'}
 else if(move?.type==='activate_champion'){name=nameForSource(move.champId,state);kind='abilità'}
 else if(move?.type==='attack'){name=nameForSource(move.champId,state);kind='attacco'}
 else if(move?.type==='revive_phoenix'){name='Rinascita — Fenice Cremisi';kind='abilità'}
 const playerName=player(state,actor)?.name||`Giocatore ${actor}`;
 return{name,playerName,actor,kind};
}
function snap(state:any){
 const m=new Map<string,any>();
 for(const p of [1,2])for(const c of player(state,p)?.champions||[])m.set(`c:${p}:${c.id}`,{
  kind:'champion',p,id:String(c.id),tempPow:num(c.tempPow),powMod:num(c.powMod),armor:num(c.armor),charge:num(c.charge),wounds:num(c.wounds),
  provocazione:!!c.provocazione,tapped:!!c.tapped,cantAttackTurn:c.cantAttackTurn,immuneDamageTurn:c.immuneDamageTurn,noProv63:clone(c.noProv63||null),
  counterattack:!!c.counterattack,counterattackTurn:c.counterattackTurn,septemberCounterTurn:c.septemberCounterTurn,extraWoundTurn:c.extraWoundTurn
 });
 for(const x of state?.board?.monsters||[])m.set(`m:${x.uid}`,{
  kind:'monster',uid:String(x.uid),id:String(x.cardId),owner:Number(x.owner),tempPow:num(x.tempPow),powMod:num(x.powMod),armor:num(x.armor),charge:num(x.charge),
  provocazione:!!x.provocazione,cantAttackTurn:x.cantAttackTurn,immuneDamageTurn:x.immuneDamageTurn,noProv63:clone(x.noProv63||null)
 });
 return{turn:num(state?.turn),map:m};
}
function fxList(obj:any):Fx[]{if(!Array.isArray(obj?._statusEffects))obj._statusEffects=[];return obj._statusEffects}
function addFx(obj:any,fx:Omit<Fx,'id'>){
 const xs=fxList(obj);xs.push({id:uid(),...fx});if(xs.length>30)xs.splice(0,xs.length-30);
}
function passiveSourceForChampion(c:any,stat:string,delta:number,ctx:Ctx){
 const id=String(c?.id||'');
 if(stat==='pow'&&delta>0&&id==='kael')return{name:c.superior?'Apocalisse Draconica':'Ammazza Draghi',playerName:c.name};
 if(stat==='pow'&&delta>0&&id==='kroth')return{name:c.superior?'Baluardo del Fulmine':'Scudo di Guerra',playerName:c.name};
 if(stat==='armor'&&delta>0&&id==='valtheris')return{name:c.superior?'Egida dell’Eternità':'Protettore dell’Anima',playerName:c.name};
 return{name:ctx.name,playerName:ctx.playerName};
}
function recordDelta(obj:any,stat:string,delta:number,ctx:Ctx,turn:number,expires:'turn'|'persistent',override?:{name:string;playerName:string}){
 if(!delta)return;const src=override||{name:ctx.name,playerName:ctx.playerName};
 addFx(obj,{kind:delta>0?'buff':'debuff',stat,amount:delta,label:`${delta>0?'+':''}${delta} ${stat==='pow'?'POW':stat==='armor'?'Armatura':stat==='charge'?'Carica':stat}`,source:src.name,sourcePlayer:src.playerName,turn,expires});
}
function consumePositive(obj:any,stat:string,amount:number){
 if(amount<=0)return;const xs=fxList(obj);for(let i=xs.length-1;i>=0&&amount>0;i--){const f=xs[i];if(f.stat!==stat||num(f.amount)<=0)continue;const take=Math.min(amount,num(f.amount));f.amount=num(f.amount)-take;amount-=take;if(f.amount<=0)xs.splice(i,1);else f.label=`+${f.amount} ${stat==='armor'?'Armatura':stat==='charge'?'Carica':'POW'}`}
}
function cleanup(obj:any,turn:number){
 const xs=fxList(obj).filter((f:Fx)=>f.expires!=='turn'||Number(f.turn)===turn);
 obj._statusEffects=xs;
}
function trackChanges(state:any,before:any,ctx:Ctx){
 const turn=num(state.turn),turnChanged=turn!==before.turn;
 for(const p of [1,2])for(const c of player(state,p)?.champions||[]){
  cleanup(c,turn);const b=before.map.get(`c:${p}:${c.id}`);if(!b)continue;
  const dTemp=num(c.tempPow)-num(b.tempPow),dMod=num(c.powMod)-num(b.powMod),dArmor=num(c.armor)-num(b.armor),dCharge=num(c.charge)-num(b.charge);
  if(dTemp&&!turnChanged)recordDelta(c,'pow',dTemp,ctx,turn,'turn',passiveSourceForChampion(c,'pow',dTemp,ctx));
  if(dMod)recordDelta(c,'pow',dMod,ctx,turn,'persistent',passiveSourceForChampion(c,'pow',dMod,ctx));
  if(dArmor>0)recordDelta(c,'armor',dArmor,ctx,turn,'persistent',passiveSourceForChampion(c,'armor',dArmor,ctx));else if(dArmor<0)consumePositive(c,'armor',-dArmor);
  if(dCharge>0)recordDelta(c,'charge',dCharge,ctx,turn,'turn');else if(dCharge<0)consumePositive(c,'charge',-dCharge);
 }
 for(const m of state?.board?.monsters||[]){
  cleanup(m,turn);const b=before.map.get(`m:${m.uid}`);if(!b)continue;
  const dTemp=num(m.tempPow)-num(b.tempPow),dMod=num(m.powMod)-num(b.powMod),dArmor=num(m.armor)-num(b.armor),dCharge=num(m.charge)-num(b.charge);
  if(dTemp&&!turnChanged)recordDelta(m,'pow',dTemp,ctx,turn,'turn');
  if(dMod)recordDelta(m,'pow',dMod,ctx,turn,'persistent');
  if(dArmor>0)recordDelta(m,'armor',dArmor,ctx,turn,'persistent');else if(dArmor<0)consumePositive(m,'armor',-dArmor);
  if(dCharge>0)recordDelta(m,'charge',dCharge,ctx,turn,'turn');else if(dCharge<0)consumePositive(m,'charge',-dCharge);
 }
}
function uniqueFx(xs:any[]){const seen=new Set<string>();return xs.filter(x=>{const k=[x.kind,x.stat,x.label,x.source,x.sourcePlayer].join('|');if(seen.has(k))return false;seen.add(k);return true})}
function passiveFx(name:string,text:string,turn:number){return text?{id:'passive',kind:'status',stat:'passive',label:'Passiva',source:name,sourcePlayer:'',text,turn,expires:'persistent'}:null}
function derivedChampionEffects(state:any,p:number,c:any){
 const out:any[]=[];const turn=num(state.turn);const pass=passiveFx(c.name,c.text||CHAMPION_DEFS?.[c.id]?.text||'',turn);if(pass)out.push(pass);
 const own=player(state,p),opp=player(state,other(p));const aurelius=(own?.champions||[]).find((x:any)=>x.id==='aurelius'&&!x.defeated);
 if(c.supportChampion&&aurelius&&(own?.hand?.length||0)>(opp?.hand?.length||0))out.push({id:'aurelius-support',kind:'buff',stat:'pow',amount:1,label:'+1 POW',source:aurelius.superior?'Opulenza Assoluta':'Ricchezza Ostentata',sourcePlayer:aurelius.name,turn,expires:'persistent'});
 if(c.provocazione)out.push({id:'prov',kind:'buff',stat:'status',label:'Provocazione',source:'Effetto attivo',sourcePlayer:'',turn,expires:'persistent'});
 if(c.cantAttackTurn===turn)out.push({id:'cantattack',kind:'debuff',stat:'status',label:'Non può attaccare',source:'Effetto attivo',sourcePlayer:'',turn,expires:'turn'});
 if(c.immuneDamageTurn===turn)out.push({id:'immune',kind:'buff',stat:'status',label:'Immune ai danni',source:'Effetto attivo',sourcePlayer:'',turn,expires:'turn'});
 if(c.noProv63?.turn===turn)out.push({id:'noprov',kind:'debuff',stat:'status',label:'Provocazione disattivata',source:'Effetto attivo',sourcePlayer:'',turn,expires:'turn'});
 if(c.counterattack||c.counterattackTurn===turn||c.septemberCounterTurn===turn)out.push({id:'counter',kind:'buff',stat:'status',label:'Contrattacco',source:'Effetto attivo',sourcePlayer:'',turn,expires:c.counterattack?'persistent':'turn'});
 if(c.extraWoundTurn===turn)out.push({id:'extrawound',kind:'debuff',stat:'status',label:'Prossima Ferita +1',source:'Colpo al Cuore',sourcePlayer:'',turn,expires:'turn'});
 return out;
}
function derivedMonsterEffects(state:any,m:any){
 const out:any[]=[];const turn=num(state.turn),d=MONSTER_DEFS?.[m.cardId];const pass=passiveFx(d?.name||m.cardId,d?.text||'',turn);if(pass)out.push(pass);
 const board=state?.board?.monsters||[];
 for(const src of board.filter((x:any)=>x.uid!==m.uid&&x.cardId==='lupo_delle_radici'))out.push({id:`root:${src.uid}`,kind:'buff',stat:'pow',amount:1,label:'+1 POW',source:'Lupo delle Radici',sourcePlayer:player(state,Number(src.owner))?.name||'',turn,expires:'persistent'});
 const griffins=board.filter((x:any)=>x.cardId==='grifone_della_tempesta').length;
 for(const src of board.filter((x:any)=>x.uid!==m.uid&&x.cardId==='lupo_glaciale')){const n=1+griffins;out.push({id:`ice:${src.uid}`,kind:'debuff',stat:'pow',amount:-n,label:`-${n} POW`,source:'Lupo Glaciale',sourcePlayer:player(state,Number(src.owner))?.name||'',turn,expires:'persistent'})}
 if(m.provocazione||d?.provocazione)out.push({id:'prov',kind:'buff',stat:'status',label:'Provocazione',source:d?.name||'Effetto attivo',sourcePlayer:player(state,Number(m.owner))?.name||'',turn,expires:'persistent'});
 if(m.cantAttackTurn===turn)out.push({id:'cantattack',kind:'debuff',stat:'status',label:'Non può attaccare',source:'Effetto attivo',sourcePlayer:'',turn,expires:'turn'});
 if(m.noProv63?.turn===turn)out.push({id:'noprov',kind:'debuff',stat:'status',label:'Provocazione disattivata',source:'Effetto attivo',sourcePlayer:'',turn,expires:'turn'});
 return out;
}
function reconcileFallback(obj:any,effects:any[]){
 const has=(stat:string)=>effects.some(x=>x.stat===stat&&num(x.amount)!==0);
 if(num(obj.tempPow)!==0&&!has('pow'))effects.push({id:'pow-fallback',kind:num(obj.tempPow)>0?'buff':'debuff',stat:'pow',amount:num(obj.tempPow),label:`${num(obj.tempPow)>0?'+':''}${num(obj.tempPow)} POW`,source:'Effetto già attivo',sourcePlayer:'',turn:0,expires:'persistent'});
 if(num(obj.powMod)!==0&&!has('pow'))effects.push({id:'powmod-fallback',kind:num(obj.powMod)>0?'buff':'debuff',stat:'pow',amount:num(obj.powMod),label:`${num(obj.powMod)>0?'+':''}${num(obj.powMod)} POW`,source:'Effetto già attivo',sourcePlayer:'',turn:0,expires:'persistent'});
 if(num(obj.armor)>0&&!has('armor'))effects.push({id:'armor-fallback',kind:'buff',stat:'armor',amount:num(obj.armor),label:`+${num(obj.armor)} Armatura`,source:'Effetto già attivo',sourcePlayer:'',turn:0,expires:'persistent'});
 if(num(obj.charge)>0&&!has('charge'))effects.push({id:'charge-fallback',kind:'buff',stat:'charge',amount:num(obj.charge),label:`+${num(obj.charge)} Carica`,source:'Effetto già attivo',sourcePlayer:'',turn:0,expires:'persistent'});
 return effects;
}

export function act(state:any,p0:any,move:any){
 const p=Number(p0),before=snap(state),ctx=sourceContext(state,p,move);
 const out=(base.act as any)(state,p,move)||state;
 trackChanges(out,before,ctx);
 return out;
}

export function publicView(state:any,p0:any){
 for(const p of [1,2])for(const c of player(state,p)?.champions||[])cleanup(c,num(state.turn));
 for(const m of state?.board?.monsters||[])cleanup(m,num(state.turn));
 const v:any=(base.publicView as any)(state,Number(p0));if(!v)return v;
 for(const p of [1,2]){
  const raw=player(state,p);for(const shown of v.players?.[String(p)]?.champions||[]){const src=(raw?.champions||[]).find((c:any)=>String(c.id)===String(shown.id));if(!src)continue;let effects=[...(src._statusEffects||[]),...derivedChampionEffects(state,p,src)];shown.effects=uniqueFx(reconcileFallback(src,effects));shown.charge=Math.max(0,num(src.charge));}
 }
 for(const shown of v.board?.monsters||[]){const src=(state?.board?.monsters||[]).find((m:any)=>String(m.uid)===String(shown.uid));if(!src)continue;let effects=[...(src._statusEffects||[]),...derivedMonsterEffects(state,src)];shown.effects=uniqueFx(reconcileFallback(src,effects));shown.charge=Math.max(0,num(src.charge));}
 return v;
}
