import * as base from './game-v46-loader.ts?rev=souls-uncapped-v3';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;

const COLORS=['red','green','black','blue','orange'];
const CUSTOM_IDS=new Set([
 'bang','barile_esplosivo','spacca_corazze','tiro_rotante','circo_infestato',
 'scatola_incantata','cacciatrice_della_tempesta','tempesta_di_ghiaccio',
 'servo_del_sovrano','dono_ai_poveri'
]);

Object.assign(CARD_DEFS,{
 bang:{id:'bang',name:'BANG!!!',color:'red',cost:1,speed:'base',type:'Magia',text:'Come costo aggiuntivo, scarta 2 carte dalla tua mano. Infliggi 2 danni a un Campione e 1 danno a un altro Campione.',effect:'v48_bang'},
 barile_esplosivo:{id:'barile_esplosivo',name:'Barile Esplosivo',color:'red',cost:0,speed:'instant',type:'Magia',text:'Scegli un Mostro. Quel Mostro subisce il doppio dei danni dalle Magie.',effect:'v48_barile'},
 spacca_corazze:{id:'spacca_corazze',name:'Spacca Corazze',color:'green',cost:1,speed:'response',type:'Magia',text:'Scegli un nemico. Rimuovi tutta la sua Armatura.',effect:'v48_spacca_corazze'},
 tiro_rotante:{id:'tiro_rotante',name:'Tiro Rotante',color:'green',cost:0,speed:'base',type:'Magia',text:'Infliggi 1 danno a 3 Mostri.',effect:'v48_tiro_rotante'},
 circo_infestato:{id:'circo_infestato',name:'Circo Infestato',color:'black',cost:0,speed:'instant',type:'Magia',text:'Metti un Mostro che controlli in cima al tuo Mazzo dei Mostri.',effect:'v48_circo'},
 scatola_incantata:{id:'scatola_incantata',name:'Scatola Incantata',color:'black',cost:3,speed:'base',type:'Magia',text:'Evoca 2 Mostri dal tuo Mazzo dei Mostri, poi uccidili.',effect:'v48_scatola'},
 cacciatrice_della_tempesta:{id:'cacciatrice_della_tempesta',name:'Cacciatrice della Tempesta',color:'blue',cost:2,speed:'instant',type:'Magia',text:'Riduci di 2 il POW di un nemico e aumenta di 2 il POW di un tuo Campione per questo turno.',effect:'v48_cacciatrice'},
 tempesta_di_ghiaccio:{id:'tempesta_di_ghiaccio',name:'Tempesta di Ghiaccio',color:'blue',cost:0,speed:'instant',type:'Magia',text:'Riduci di 1 il POW di un nemico e di un tuo Campione per questo turno.',effect:'v48_tempesta'},
 servo_del_sovrano:{id:'servo_del_sovrano',name:'Servo del Sovrano',color:'orange',cost:1,speed:'base',type:'Supporto',supportChampion:true,text:'Pesca 1 carta dal tuo Mazzo.',effect:'v48_servo'},
 dono_ai_poveri:{id:'dono_ai_poveri',name:'Dono ai Poveri',color:'orange',cost:0,speed:'base',type:'Magia',text:'Infliggi 1 danno a un Mostro per ogni carta che hai in più rispetto al tuo avversario.',effect:'v48_dono'}
});
Object.assign(CHAMPION_DEFS,{
 scarlet:{id:'scarlet',name:'Scarlet, Fiamma dei Mari',color:'red',basePow:3,hp:3},
 torvald:{id:'torvald',name:'Torvald, Spezzatronchi',color:'green',basePow:3,hp:3},
 grinn:{id:'grinn',name:'Grinn, il Folle',color:'black',basePow:3,hp:3},
 hilda:{id:'hilda',name:"Hilda, Ira d'Inverno",color:'blue',basePow:2,hp:4},
 aurelius:{id:'aurelius',name:"Aurelius, Re dell'Opulenza",color:'orange',basePow:1,hp:5},
 servo_del_sovrano:{id:'servo_del_sovrano',name:'Servo del Sovrano',color:'orange',basePow:1,hp:1,supportChampion:true}
});

export const STARTER_DECK=Object.keys(CARD_DEFS).filter(id=>!CARD_DEFS[id]?.tokenSupport);
export const STARTER_MONSTERS=Object.keys(MONSTER_DEFS);
export const newPlayer=base.newPlayer;
export const newState=base.newState;

const clone=(x:any)=>JSON.parse(JSON.stringify(x));
const other=(p:number)=>p===1?2:1;
const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const champ=(s:any,p:number,id:any)=>(player(s,p)?.champions||[]).find((c:any)=>String(c?.id)===String(id));
const monster=(s:any,uid:any)=>(s?.board?.monsters||[]).find((m:any)=>String(m?.uid)===String(uid));
const log=(s:any,msg:string)=>{s.log ||= [];s.log.push(msg);if(s.log.length>180)s.log=s.log.slice(-180)};
const colorLabel=(c:string)=>c==='red'?'Rossa':c==='green'?'Verde':c==='black'?'Nera':c==='blue'?'Blu':'Arancione';

function rawChampionPow(s:any,p:number,c:any){
 if(!c)return 0;
 let v=Number(c.basePow??CHAMPION_DEFS?.[c.id]?.basePow??0)+Number(c.tempPow||0);
 if(String(c.id)==='kael'&&(player(s,p)?.hand?.length||0)===0&&s?.status==='main')v+=3;
 return v;
}
function rawMonsterPow(s:any,m:any){
 const d=MONSTER_DEFS?.[m?.cardId];if(!d)return 0;
 const ms=s?.board?.monsters||[];
 let v=Number(d.pow||0)+Number(m.powMod||0)+Number(m.tempPow||0);
 v+=ms.filter((x:any)=>x.uid!==m.uid&&x.cardId==='lupo_delle_radici').length;
 const ice=ms.filter((x:any)=>x.uid!==m.uid&&x.cardId==='lupo_glaciale').length;
 const storms=ms.filter((x:any)=>x.cardId==='grifone_della_tempesta').length;
 if(ice)v-=ice*(1+storms);
 return v;
}
function currentMonsterPow(s:any,m:any){return Math.max(0,rawMonsterPow(s,m))}
function currentChampionPow(s:any,p:number,c:any){return Math.max(1,rawChampionPow(s,p,c))}
function spellAmount(s:any,p:number,n:number){return Math.max(0,Number(n||0)+(player(s,p)?.fireCloud?1:0))}

function applyAura(obj:any,key:string,desired:number){
 let old=Math.max(0,Number(obj?.[key]||0));
 let pow=Number(obj?.tempPow||0);
 if(pow<old&&old>0)old=0;
 obj.tempPow=pow-old+Math.max(0,desired);
 obj[key]=Math.max(0,desired);
}
function syncAurelius(s:any){
 for(const p of [1,2]){
  const q=player(s,p),o=player(s,other(p));if(!q)continue;
  const a=champ(s,p,'aurelius');
  const active=!!a&&!a.defeated&&(q.hand?.length||0)>(o?.hand?.length||0);
  for(const c of q.champions||[])if(c?.supportChampion&&!c.defeated)applyAura(c,'_aureliusAura',active?1:0);
 }
}

function discountFor(s:any,p:number,c:any){
 if(!c)return 0;
 const q=player(s,p);if(!q)return 0;
 let n=0;
 if(c.type==='Magia'&&Number(c.cost||0)>=3&&Number(q._grinnDiscountTurn)===Number(s.turn))n++;
 if(Number(q?._scarletDiscounts?.[String(c.id)])===Number(s.turn))n++;
 return n;
}
function withAdjustedCastCost(s:any,p:number,move:any,fn:()=>any){
 if(move?.type!=='cast')return fn();
 const c=CARD_DEFS?.[String(move.cardId||'')];if(!c)return fn();
 const original=Number(c.cost||0),d=discountFor(s,p,c);
 if(!d)return fn();
 c.cost=Math.max(0,original-d);
 try{return fn()}finally{c.cost=original}
}

function validChampionRef(s:any,t:any){
 if(!t||![1,2].includes(Number(t.player)))return null;
 const c=champ(s,Number(t.player),String(t.champId||''));
 return c&&!c.defeated?c:null;
}
function validEnemy(s:any,p:number,t:any){
 if(t?.type==='monster')return !!monster(s,String(t.uid||''));
 if(t?.type==='champion')return Number(t.player)===other(p)&&!!validChampionRef(s,t);
 return false;
}
function ownChampion(s:any,p:number,id:any){const c=champ(s,p,String(id||''));return c&&!c.defeated?c:null}

function validateCustomCast(s:any,p:number,move:any){
 const c=CARD_DEFS?.[String(move.cardId||'')];if(!c||!CUSTOM_IDS.has(c.id))return;
 const t=move.targets||{},q=player(s,p);
 switch(c.id){
  case'bang':{
   const ds=[...new Set((t.discardIds||[]).map(String))];
   if(ds.length!==2||ds.some((id:string)=>id===c.id||!q?.hand?.includes(id)))throw new Error('BANG!!! richiede di scartare 2 altre carte dalla tua mano.');
   const a=t.championA,b=t.championB,ca=validChampionRef(s,a),cb=validChampionRef(s,b);
   if(!ca||!cb||`${a.player}:${a.champId}`===`${b.player}:${b.champId}`)throw new Error('BANG!!! richiede due Campioni diversi.');
   break;
  }
  case'barile_esplosivo':case'dono_ai_poveri':if(!monster(s,String(t.monsterUid||'')))throw new Error('Mostro bersaglio non valido.');break;
  case'circo_infestato':{const m=monster(s,String(t.monsterUid||''));if(!m||Number(m.owner)!==p)throw new Error('Circo Infestato richiede un Mostro che controlli.');break;}
  case'scatola_incantata':{
   const ids=[...new Set((t.monsterIds||[]).map(String))];
   if(ids.length!==2||ids.some((id:string)=>!q?.monsterDeck?.includes(id)))throw new Error('Scatola Incantata richiede 2 Mostri diversi dal tuo Mazzo dei Mostri.');
   break;
  }
  case'cacciatrice_della_tempesta':case'tempesta_di_ghiaccio':
   if(!validEnemy(s,p,t.enemy)||!ownChampion(s,p,t.ownChamp))throw new Error('Bersagli non validi.');
   break;
  case'spacca_corazze':if(!validEnemy(s,p,t.enemy))throw new Error('Nemico bersaglio non valido.');break;
  case'tiro_rotante':{
   const u=[...new Set((t.monsterUids||[]).map(String))];
   if(u.length!==3||u.some((id:string)=>!monster(s,id)))throw new Error('Tiro Rotante richiede 3 Mostri diversi.');
   break;
  }
 }
}

function woundChampionLocal(s:any,p:number,c:any,source:string){
 if(!c||c.defeated)return;
 c.wounds=Number(c.wounds||0)+1;c.damage=0;
 log(s,`${c.name} subisce una Ferita (${c.wounds}/${c.hp})${source?` da ${source}`:''}.`);
 if(c.wounds>=Number(c.hp||1)){c.defeated=true;c.tapped=true;log(s,`${c.name} è sconfitto.`)}
}
function damageChampionLocal(s:any,p:number,id:string,n:number,source:string){
 const c=champ(s,p,id);if(!c||c.defeated||n<=0)return;
 let left=n;const a=Math.max(0,Number(c.armor||0)),blocked=Math.min(a,left);
 if(blocked){c.armor=a-blocked;left-=blocked;log(s,`${c.name} usa ${blocked} Armatura e annulla ${blocked} dann${blocked===1?'o':'i'}.`)}
 if(left<=0)return;
 c.damage=Number(c.damage||0)+left;
 const th=currentChampionPow(s,p,c);
 log(s,`${c.name} subisce ${left} dann${left===1?'o':'i'} (${c.damage}/${th}).`);
 if(c.damage>=th)woundChampionLocal(s,p,c,source);
}
function addLyrandelTrigger(s:any,p:number,uid:string){
 const q=player(s,p),lyr=champ(s,p,'lyrandel');
 if(!q||!lyr||lyr.defeated||q.lyrandelUsed||!monster(s,uid))return;
 q.lyrandelUsed=true;s.triggerQueue ||= [];
 s.triggerQueue.push({actor:p,sourceCardId:'lyrandel',effectId:'lyrandel_bonus',choiceType:'monsterUids',meta:{uids:[uid]},effectName:'Effetto di Lyrandel'});
}
function applyMonsterRawDamage(s:any,p:number,uid:string,n:number,source:string,react=true){
 const m=monster(s,uid);if(!m||n<=0)return 0;
 let left=n;const a=Math.max(0,Number(m.armor||0)),blocked=Math.min(a,left);
 if(blocked){m.armor=a-blocked;left-=blocked;log(s,`${MONSTER_DEFS[m.cardId]?.name||m.cardId} usa ${blocked} Armatura e annulla ${blocked} dann${blocked===1?'o':'i'}.`)}
 if(left<=0)return n;
 m.damage=Number(m.damage||0)+left;
 const th=currentMonsterPow(s,m);
 log(s,`${MONSTER_DEFS[m.cardId]?.name||m.cardId} subisce ${left} dann${left===1?'o':'i'} (${m.damage}/${th}).`);
 if(react&&!(m.damage>=th&&m.damage>=1)){
  const deer=(s.board?.monsters||[]).filter((x:any)=>x.uid!==m.uid&&x.cardId==='cervo_antico').length;
  if(deer){m.tempPow=Number(m.tempPow||0)+deer;log(s,`${MONSTER_DEFS[m.cardId]?.name||m.cardId} ottiene +${deer} POW dal Cervo Antico fino alla fine del turno.`)}
  if(!(m.damage>=currentMonsterPow(s,m)&&m.damage>=1))addLyrandelTrigger(s,p,uid);
 }
 return n;
}
function damageMonsterSpell(s:any,p:number,uid:string,baseN:number,source:string){
 const m=monster(s,uid);if(!m)return;
 let n=spellAmount(s,p,baseN);
 if(m._barileEsplosivo)n*=2;
 applyMonsterRawDamage(s,p,uid,n,source,true);
}

function addMonsterToBoard(s:any,id:string,p:number){
 const m={uid:crypto.randomUUID(),cardId:id,owner:p,damage:0,tempPow:0,powMod:0,armor:0};
 s.board ||= {monsters:[]};s.board.monsters ||= [];s.enterQueue ||= [];
 s.board.monsters.push(m);s.enterQueue.push(m.uid);return m;
}
function moveControlledMonsterToDeckTop(s:any,p:number,uid:string,ctx:any){
 const i=(s.board?.monsters||[]).findIndex((m:any)=>String(m.uid)===uid);if(i<0)return;
 const m=s.board.monsters[i];if(Number(m.owner)!==p)return;
 s.board.monsters.splice(i,1);
 const q=player(s,p);q.monsterDeck ||= [];q.monsterDeck.unshift(m.cardId);
 s.enterQueue=(s.enterQueue||[]).filter((u:any)=>String(u)!==uid);
 s.delayedKills=(s.delayedKills||[]).filter((d:any)=>String(d?.uid)!==uid);
 ctx.nonDeathUids.add(uid);
 log(s,`${MONSTER_DEFS[m.cardId]?.name||m.cardId} viene messo in cima al Mazzo dei Mostri di ${q.name}.`);
}

function reduceEnemy(s:any,p:number,t:any,n:number,source:string){
 if(t?.type==='champion'){
  const c=validChampionRef(s,t);if(c){c.tempPow=Number(c.tempPow||0)-n;log(s,`${c.name} perde ${n} POW fino alla fine del turno da ${source}.`)}
 }else if(t?.type==='monster'){
  const m=monster(s,String(t.uid||''));if(m){m.tempPow=Number(m.tempPow||0)-n;log(s,`${MONSTER_DEFS[m.cardId]?.name||m.cardId} perde ${n} POW fino alla fine del turno da ${source}.`)}
 }
}

function preResolveCustom(s:any,item:any,ctx:any){
 const p=Number(item.actor),t=item.targets||{},q=player(s,p),c=CARD_DEFS[item.cardId];
 if(!c)return;
 switch(c.id){
  case'bang':{
   const a=t.championA,b=t.championB;
   if(validChampionRef(s,a))damageChampionLocal(s,Number(a.player),String(a.champId),spellAmount(s,p,2),c.name);
   if(validChampionRef(s,b))damageChampionLocal(s,Number(b.player),String(b.champId),spellAmount(s,p,1),c.name);
   break;
  }
  case'barile_esplosivo':{const m=monster(s,String(t.monsterUid||''));if(m){m._barileEsplosivo=true;log(s,`${MONSTER_DEFS[m.cardId]?.name||m.cardId} subirà il doppio dei danni dalle Magie.`)}break;}
  case'spacca_corazze':{
   if(t.enemy?.type==='champion'){const x=validChampionRef(s,t.enemy);if(x){x.armor=0;log(s,`${x.name} perde tutta la sua Armatura.`)}}
   else{const m=monster(s,String(t.enemy?.uid||''));if(m){m.armor=0;log(s,`${MONSTER_DEFS[m.cardId]?.name||m.cardId} perde tutta la sua Armatura.`)}}
   break;
  }
  case'tiro_rotante':for(const u of [...new Set((t.monsterUids||[]).map(String))])damageMonsterSpell(s,p,String(u),1,c.name);break;
  case'circo_infestato':moveControlledMonsterToDeckTop(s,p,String(t.monsterUid||''),ctx);break;
  case'scatola_incantata':{
   for(const id of [...new Set((t.monsterIds||[]).map(String))].slice(0,2)){
    const i=q?.monsterDeck?.indexOf(id)??-1;if(i<0)continue;
    q.monsterDeck.splice(i,1);const m=addMonsterToBoard(s,id,p);m.damage=999999;
    ctx.scatolaSummons.push({uid:String(m.uid),cardId:id,pow:Math.max(0,rawMonsterPow(s,m))});
    log(s,`${MONSTER_DEFS[id]?.name||id} viene evocato da Scatola Incantata e sarà ucciso.`);
   }
   break;
  }
  case'cacciatrice_della_tempesta':{
   reduceEnemy(s,p,t.enemy,2,c.name);const x=ownChampion(s,p,t.ownChamp);if(x){x.tempPow=Number(x.tempPow||0)+2;log(s,`${x.name} ottiene +2 POW fino alla fine del turno.`)}break;
  }
  case'tempesta_di_ghiaccio':{
   reduceEnemy(s,p,t.enemy,1,c.name);const x=ownChampion(s,p,t.ownChamp);if(x){x.tempPow=Number(x.tempPow||0)-1;log(s,`${x.name} perde 1 POW fino alla fine del turno.`)}break;
  }
  case'servo_del_sovrano':{
   const id=q?.deck?.shift?.();if(id){q.hand ||= [];q.hand.push(id);log(s,`${q.name} pesca ${CARD_DEFS[id]?.name||id} grazie a Servo del Sovrano.`)}else log(s,'Servo del Sovrano non trova carte da pescare.');
   break;
  }
  case'dono_ai_poveri':{
   const diff=Math.max(0,(q?.hand?.length||0)-(player(s,other(p))?.hand?.length||0));
   damageMonsterSpell(s,p,String(t.monsterUid||''),diff,c.name);break;
  }
 }
}

function payBangDiscard(s:any,p:number,move:any){
 if(move?.type!=='cast'||String(move.cardId)!=='bang')return;
 const q=player(s,p);if(!q)return;
 const ids=[...new Set((move.targets?.discardIds||[]).map(String))].slice(0,2);
 for(const id of ids){const i=q.hand.indexOf(id);if(i>=0){q.hand.splice(i,1);q.grave ||= [];q.grave.push(id)}}
 if(ids.length)log(s,`${q.name} scarta ${ids.length} carte come costo aggiuntivo di BANG!!!.`);
}

function multiset(a:any[]){const m=new Map<string,number>();for(const x of a||[]){const k=String(x);m.set(k,(m.get(k)||0)+1)}return m}
function discardedFromHand(before:any,state:any,p:number){
 const q=player(state,p),bh=multiset(before.hand[p]||[]),ah=multiset(q?.hand||[]),bg=multiset(before.grave[p]||[]),ag=multiset(q?.grave||[]),out:string[]=[];
 for(const [id,n] of bh){const left=Math.max(0,n-(ah.get(id)||0)),added=Math.max(0,(ag.get(id)||0)-(bg.get(id)||0)),k=Math.min(left,added);for(let i=0;i<k;i++)out.push(id)}
 return out;
}
function triggerScarlet(s:any,p:number,discarded:string[]){
 if(!discarded.length)return;const q=player(s,p),c=champ(s,p,'scarlet');
 if(!q||!c||c.defeated||Number(q._scarletTriggeredTurn)===Number(s.turn))return;
 q._scarletTriggeredTurn=Number(s.turn);
 const i=(q.deck||[]).findIndex((id:string)=>CARD_DEFS[id]?.color==='red');
 if(i<0){log(s,'Fuoco e Fiamme non trova una carta Rossa nel Mazzo.');return;}
 const [id]=q.deck.splice(i,1);q.hand.push(id);q._scarletDiscounts ||= {};q._scarletDiscounts[id]=Number(s.turn);
 log(s,`Fuoco e Fiamme: ${q.name} pesca ${CARD_DEFS[id]?.name||id}; costa 1 Anima Rossa in meno per questo turno.`);
}

function snapshotState(s:any){
 const snap:any={hand:{1:clone(player(s,1)?.hand||[]),2:clone(player(s,2)?.hand||[])},grave:{1:clone(player(s,1)?.grave||[]),2:clone(player(s,2)?.grave||[])},champions:new Map(),monsters:new Map()};
 for(const p of [1,2])for(const c of player(s,p)?.champions||[])snap.champions.set(`${p}:${c.id}`,{player:p,id:String(c.id),defeated:!!c.defeated,pow:rawChampionPow(s,p,c),wounds:Number(c.wounds||0)});
 for(const m of s?.board?.monsters||[])snap.monsters.set(String(m.uid),{uid:String(m.uid),cardId:String(m.cardId),owner:Number(m.owner),pow:rawMonsterPow(s,m),damage:Number(m.damage||0),armor:Number(m.armor||0),barile:!!m._barileEsplosivo});
 return snap;
}

function gainSoulUncapped(s:any,p:number,color:string,n=1){
 const q=player(s,p);if(!q||!COLORS.includes(color)||!(q.deckColors||[]).includes(color))return;
 q.souls ||= {};q.souls[color]=Number(q.souls[color]||0)+n;
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
function queueLocalLascito(s:any,tr:any){s._v48Triggers ||= [];s._v48Triggers.push(tr)}
function localTriggerOptions(s:any,tr:any){
 if(tr.choiceType==='enemyChampion')return(player(s,other(Number(tr.actor)))?.champions||[]).filter((c:any)=>!c.defeated).map((c:any)=>({id:String(c.id),label:String(c.name||c.id)}));
 if(tr.choiceType==='enemySoul'){const q=player(s,other(Number(tr.actor)));return COLORS.filter(c=>Number(q?.souls?.[c]||0)>0).map(c=>({id:c,label:`Anima ${colorLabel(c)}`}))}
 return [];
}
function processLocalTriggers(s:any){
 if(s.pendingChoice)return;const q=s._v48Triggers;if(!Array.isArray(q)||!q.length)return;
 while(q.length&&!s.pendingChoice){const tr=q.shift();if(tr.choiceType){const opts=localTriggerOptions(s,tr);if(!opts.length){log(s,`${tr.effectName} non ha bersagli validi.`);continue}s.pendingChoice={type:'trigger_target',player:Number(tr.actor),trigger:tr,options:opts};s.priority=null;return}s.stack ||= [];s.stack.push({uid:crypto.randomUUID(),kind:'effect',actor:Number(tr.actor),sourceCardId:tr.sourceCardId,effectId:tr.effectId,effectName:tr.effectName,targets:{},meta:tr.meta||{}})}
 if(s.stack?.length){s.priority=other(Number(s.stack[s.stack.length-1].actor));s.priorityPasses=0}
}
function killMonsterLocal(s:any,m:any,killer:number,source:string,ctx:any){
 const i=(s.board?.monsters||[]).findIndex((x:any)=>String(x.uid)===String(m.uid));if(i<0)return;
 const kings=(s.board.monsters||[]).filter((x:any)=>x.cardId==='re_dei_non_morti').length;
 const pow=currentMonsterPow(s,m),dead=clone(m);s.board.monsters.splice(i,1);
 const owner=player(s,Number(dead.owner));if(owner){owner.monsterGrave ||= [];owner.monsterGrave.push(dead.cardId)}
 log(s,`${MONSTER_DEFS[dead.cardId]?.name||dead.cardId} viene sconfitto${source?` da ${source}`:''}.`);
 if(killer===1||killer===2){const q=player(s,killer);if(q)q.killedMonsterThisTurn=true;gainSoulUncapped(s,killer,String(MONSTER_DEFS[dead.cardId]?.color||''),1);const tr=lascitoDescriptor(dead,killer);if(tr)for(let z=0;z<1+kings;z++)queueLocalLascito(s,clone(tr))}
 for(const b of s.board.monsters.filter((x:any)=>x.cardId==='orso_furioso')){b.tempPow=Number(b.tempPow||0)+2;log(s,'Orso Furioso ottiene +2 POW fino alla fine del turno.')}
 ctx.localDeaths.push({kind:'monster',pow,cardId:String(dead.cardId)});
}
function resolveLocalStateDeaths(s:any,killer:number,source:string,ctx:any){
 for(let pass=0;pass<Math.max(8,(s.board?.monsters?.length||0)+8);pass++){
  const lethal=(s.board?.monsters||[]).filter((m:any)=>Number(m.damage||0)>=1&&Number(m.damage||0)>=currentMonsterPow(s,m));
  if(!lethal.length)break;for(const m of [...lethal])if(monster(s,m.uid))killMonsterLocal(s,m,killer,source,ctx)
 }
 processLocalTriggers(s);
}

function compensateBarileForBaseSpell(s:any,top:any,before:any,ctx:any){
 if(!top||top.kind!=='card'||CUSTOM_IDS.has(String(top.cardId)))return;
 const d=CARD_DEFS?.[top.cardId];if(d?.type!=='Magia')return;
 const p=Number(top.actor);let added=false;
 for(const [uid,b] of before.monsters){
  if(!b.barile)continue;const m=monster(s,uid);if(!m)continue;
  const damageGain=Math.max(0,Number(m.damage||0)-Number(b.damage||0));
  const armorSpent=Math.max(0,Number(b.armor||0)-Number(m.armor||0));
  const raw=damageGain+armorSpent;if(raw<=0)continue;
  applyMonsterRawDamage(s,p,uid,raw,`${d.name} + Barile Esplosivo`,false);added=true;
 }
 if(added)resolveLocalStateDeaths(s,p,'Barile Esplosivo',ctx);
}

function collectDeaths(s:any,before:any,ctx:any){
 const deaths:any[]=[...ctx.localDeaths];
 for(const [key,b] of before.champions){const c=champ(s,b.player,b.id);if(c&&!b.defeated&&c.defeated)deaths.push({kind:'champion',pow:Number(b.pow||0),player:b.player,id:b.id})}
 const afterUids=new Set((s.board?.monsters||[]).map((m:any)=>String(m.uid)));
 for(const [uid,b] of before.monsters){if(ctx.nonDeathUids.has(uid)||afterUids.has(uid))continue;deaths.push({kind:'monster',pow:Number(b.pow||0),cardId:b.cardId,uid})}
 for(const x of ctx.scatolaSummons)if(!afterUids.has(String(x.uid)))deaths.push({kind:'monster',pow:Number(x.pow||0),cardId:x.cardId,uid:x.uid});
 return deaths;
}
function triggerGrinn(s:any,before:any,deaths:any[],eventTurn:number){
 if(!deaths.some(d=>Number(d.pow||0)>=4))return;
 for(const p of [1,2]){
  const b=before.champions.get(`${p}:grinn`),now=champ(s,p,'grinn'),wasActive=!!b&&!b.defeated,activeNow=!!now&&!now.defeated;
  const q=player(s,p);if(!q||(!wasActive&&!activeNow)||Number(q._grinnTriggeredTurn)===Number(eventTurn))continue;
  q._grinnTriggeredTurn=Number(eventTurn);q._grinnDiscountTurn=Number(eventTurn);
  log(s,`Risata Omicida: le Magie di costo 3 o superiore di ${q.name} costano 1 Anima in meno per questo turno.`);
 }
}

function queueHildaAttacks(s:any,before:any,actor:number|null){
 if(actor!==1&&actor!==2)return;
 const hBefore=before.champions.get(`${actor}:hilda`),h=champ(s,actor,'hilda');if((!hBefore||hBefore.defeated)&&(!h||h.defeated))return;
 const targets:any[]=[];
 for(const [key,b] of before.champions){if(b.player!==other(actor)||b.defeated)continue;const c=champ(s,b.player,b.id);if(!c||c.defeated)continue;const after=rawChampionPow(s,b.player,c);if(after<=0&&after<Number(b.pow))targets.push({type:'champion',player:b.player,champId:b.id})}
 for(const [uid,b] of before.monsters){const m=monster(s,uid);if(!m)continue;const after=rawMonsterPow(s,m);if(after<=0&&after<Number(b.pow))targets.push({type:'monster',uid})}
 if(!targets.length)return;s._v48HildaAttacks ||= [];
 const existing=new Set(s._v48HildaAttacks.map((x:any)=>JSON.stringify(x.target)));
 for(const target of targets){const k=JSON.stringify(target);if(!existing.has(k)){s._v48HildaAttacks.push({player:actor,target});existing.add(k)}}
}
function tryStartHildaAttack(s:any){
 const q=s._v48HildaAttacks;if(!Array.isArray(q)||!q.length||s.status!=='main'||s.priority||s.stack?.length||s.combat||s.pendingChoice)return;
 while(q.length){const x=q.shift(),h=champ(s,Number(x.player),'hilda');if(!h||h.defeated)continue;
  let ok=false;if(x.target?.type==='monster')ok=!!monster(s,String(x.target.uid));else if(x.target?.type==='champion')ok=!!validChampionRef(s,x.target);
  if(!ok)continue;
  s.combat={initiator:Number(x.player),attacker:{player:Number(x.player),champId:'hilda'},target:clone(x.target),cancelled:false,forcedBy:'Furia del Valhalla'};
  s.combatPasses=0;s.stackInitiator=Number(x.player);s.priority=other(Number(x.player));s.mainPasses=0;
  log(s,`Furia del Valhalla: Hilda attacca ${x.target.type==='monster'?(MONSTER_DEFS[monster(s,x.target.uid)?.cardId]?.name||'il Mostro'):(validChampionRef(s,x.target)?.name||'il Campione')} senza tapparsi.`);
  return;
 }
}

function reviveTorvaldIfNeeded(s:any,before:any,oldStatus:any,logStart:number,eventTurn:number){
 for(const p of [1,2]){
  const b=before.champions.get(`${p}:torvald`),c=champ(s,p,'torvald');if(!b||b.defeated||!c||!c.defeated)continue;
  if(Number(c._torvaldRevivedTurn)===Number(eventTurn))continue;
  c._torvaldRevivedTurn=Number(eventTurn);c._torvaldTemporaryLifeTurn=Number(eventTurn);c.defeated=false;c.tapped=false;c.damage=0;c.wounds=Math.max(0,Number(c.hp||3)-1);
  log(s,`${c.name}: Ascia Inarrestabile lo riporta in vita e lo stappa fino alla fine del turno.`);
 }
 const anyTemp=[1,2].some(p=>{const c=champ(s,p,'torvald');return c&&!c.defeated&&Number(c._torvaldTemporaryLifeTurn)===Number(eventTurn)});
 if(anyTemp&&s.status==='gameover'){
  const losers=[1,2].filter(p=>{const starters=(player(s,p)?.champions||[]).filter((c:any)=>!c.supportChampion);return starters.length&&starters.every((c:any)=>c.defeated)});
  if(!losers.length){s.status=oldStatus==='gameover'?'main':oldStatus;s.winner=null;const prefix=(s.log||[]).slice(0,logStart);const tail=(s.log||[]).slice(logStart).filter((x:any)=>!String(x).includes('vince la partita'));s.log=[...prefix,...tail]}
 }
}
function expireTorvaldAtTurnChange(s:any,oldTurn:number){
 if(Number(s.turn)===Number(oldTurn))return;
 for(const p of [1,2]){const c=champ(s,p,'torvald');if(!c)continue;if(Number(c._torvaldTemporaryLifeTurn)===Number(oldTurn)&&!c.defeated){c.defeated=true;c.tapped=true;c.damage=0;c.wounds=Number(c.hp||3);log(s,`${c.name} muore alla fine del turno dopo Ascia Inarrestabile.`)}delete c._torvaldTemporaryLifeTurn}
}

function terminalGameover(s:any){
 if(!s?.players)return s;
 let loser:number|null=null;
 for(const p of [1,2]){const starters=(player(s,p)?.champions||[]).filter((c:any)=>!c.supportChampion);if(starters.length&&starters.every((c:any)=>!!c.defeated)){loser=p;break}}
 if(loser!=null){const win=other(loser);if(s.status!=='gameover'||Number(s.winner)!==win){s.status='gameover';s.winner=win;const name=player(s,win)?.name||`Giocatore ${win}`;const last=String((s.log||[])[(s.log||[]).length-1]||'');if(!last.includes('vince la partita'))log(s,`${name} vince la partita!`)}}
 if(s.status==='gameover'){
  for(const x of s.stack||[]){if(x?.kind!=='card')continue;const q=player(s,Number(x.actor)),id=String(x.cardId||'');if(q&&id){q.grave ||= [];if(!q.grave.includes(id))q.grave.push(id)}}
  s.priority=null;s.priorityPasses=0;s.mainPasses=0;s.stack=[];s.stackInitiator=null;s.combat=null;s.pendingChoice=null;s.triggerQueue=[];s.enterQueue=[];s.delayedKills=[];s.endTurnPending=false;s._v48HildaAttacks=[];s._v48Triggers=[];if(s._orangeTriggers)s._orangeTriggers=[];if(s._damageEvent)delete s._damageEvent;
 }
 return s;
}

export function act(state:any,p0:any,move:any){
 const p=Number(p0);syncAurelius(state);
 const before=snapshotState(state),oldTurn=Number(state.turn||0),oldStatus=state.status,logStart=(state.log||[]).length;
 const top=(move?.type==='pass_priority'&&state?.stack?.length)?clone(state.stack[state.stack.length-1]):null;
 const ctx:any={nonDeathUids:new Set<string>(),scatolaSummons:[],localDeaths:[]};
 if(move?.type==='cast')validateCustomCast(state,p,move);
 if(top?.kind==='card'&&CUSTOM_IDS.has(String(top.cardId))){
  if(Number(state.priority)!==p)throw new Error('Non hai priorità.');
  preResolveCustom(state,top,ctx);
 }
 const reducerActor=(top&&(top.kind==='card'||top.kind==='effect'))?Number(top.actor):null;
 let out:any;
 out=withAdjustedCastCost(state,p,move,()=>base.act(state,p,move));
 if(move?.type==='cast'&&String(move.cardId)==='bang')payBangDiscard(state,p,move);
 compensateBarileForBaseSpell(state,top,before,ctx);
 const deaths=collectDeaths(state,before,ctx);
 reviveTorvaldIfNeeded(state,before,oldStatus,logStart,oldTurn);
 expireTorvaldAtTurnChange(state,oldTurn);
 for(const z of [1,2])triggerScarlet(state,z,discardedFromHand(before,state,z));
 triggerGrinn(state,before,deaths,oldTurn);
 queueHildaAttacks(state,before,reducerActor);
 syncAurelius(state);
 processLocalTriggers(state);
 tryStartHildaAttack(state);
 terminalGameover(state);
 return out||state;
}

export function publicView(state:any,p0:any){
 syncAurelius(state);terminalGameover(state);
 const p=Number(p0),v:any=base.publicView(state,p),q=player(state,p);
 if(v?.players?.[String(p)]?.handCards){
  for(const c of v.players[String(p)].handCards){const def=CARD_DEFS?.[c.id];const d=discountFor(state,p,def);if(d)c.effectiveCost=Math.max(0,Number(c.effectiveCost??c.cost??0)-d)}
 }
 delete v._v48HildaAttacks;delete v._v48Triggers;
 for(const z of [1,2]){const x=v?.players?.[String(z)];if(!x)continue;delete x._grinnTriggeredTurn;delete x._grinnDiscountTurn;delete x._scarletTriggeredTurn;delete x._scarletDiscounts}
 return v;
}
