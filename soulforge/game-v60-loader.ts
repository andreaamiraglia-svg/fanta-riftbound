import * as base from './game-v59-loader.ts?rev=new-monsters-wave-15-v1';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

Object.assign(MONSTER_DEFS,{
 scorpione_delle_ceneri:{
  id:'scorpione_delle_ceneri',name:'Scorpione delle Ceneri',color:'red',pow:2,
  text:'Lascito — Scarta 1 carta dalla tua mano.',lascito:'v60_scorpione'
 },
 gigante_del_cratere:{
  id:'gigante_del_cratere',name:'Gigante del Cratere',color:'red',pow:4,
  text:'Ogni volta che questo Mostro subisce danni, infligge 1 danno a ciascun Campione dell’avversario del giocatore che lo ha danneggiato.'
 },
 cinghiale_zannaverde:{
  id:'cinghiale_zannaverde',name:'Cinghiale Zannaverde',color:'green',pow:2,
  text:'Quando entra in gioco, ottiene +2 POW fino alla fine del turno.'
 },
 gorilla_della_giungla:{
  id:'gorilla_della_giungla',name:'Gorilla della Giungla',color:'green',pow:3,
  text:'I Campioni con 1 solo HP rimasto non possono subire danni.'
 },
 medusa_delle_maree:{
  id:'medusa_delle_maree',name:'Medusa delle Maree',color:'blue',pow:1,
  text:'Ogni volta che un effetto dovrebbe ridurre il POW di un bersaglio, gli infligge invece altrettanti danni.'
 },
 elementale_della_brina:{
  id:'elementale_della_brina',name:'Elementale della Brina',color:'blue',pow:3,
  text:'Quando entra in gioco, ottiene 2 Armatura fino alla fine del turno.'
 },
 ariete_sacro:{
  id:'ariete_sacro',name:'Ariete Sacro',color:'orange',pow:3,
  text:'La prima volta in ogni turno che ciascun Campione dovrebbe subire danni, previeni quei danni.'
 },
 guardiano_del_tesoro:{
  id:'guardiano_del_tesoro',name:'Guardiano del Tesoro',color:'orange',pow:3,
  text:'Ogni volta che peschi una o più carte, pescane 1 aggiuntiva. Questa abilità non si attiva per la carta pescata in questo modo.'
 },
 marionetta_maledetta:{
  id:'marionetta_maledetta',name:'Marionetta Maledetta',color:'black',pow:4,
  text:'Lascito — Scegli una carta nel Cimitero dell’avversario e bandiscila.',lascito:'v60_marionetta'
 },
 verme_delle_tombe:{
  id:'verme_delle_tombe',name:'Verme delle Tombe',color:'black',pow:3,
  text:'Quando entra in gioco, se nel tuo Monster Deck rimane esattamente 1 carta, evoca dal tuo Cimitero fino a 3 Mostri con 2 POW o meno.'
 }
});

const NEW_MONSTERS=[
 'scorpione_delle_ceneri','gigante_del_cratere','cinghiale_zannaverde','gorilla_della_giungla',
 'medusa_delle_maree','elementale_della_brina','ariete_sacro','guardiano_del_tesoro',
 'marionetta_maledetta','verme_delle_tombe'
];
export const STARTER_MONSTERS=[...new Set([...(base.STARTER_MONSTERS||[]),...NEW_MONSTERS])];

const COLORS=['red','green','black','blue','orange'];
const clone=(x:any)=>JSON.parse(JSON.stringify(x));
const other=(p:number)=>p===1?2:1;
const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const champ=(s:any,p:number,id:any)=>(player(s,p)?.champions||[]).find((c:any)=>String(c?.id)===String(id));
const monster=(s:any,uid:any)=>(s?.board?.monsters||[]).find((m:any)=>String(m?.uid)===String(uid));
const monsterName=(id:any)=>MONSTER_DEFS?.[String(id)]?.name||String(id||'Mostro');
const cardName=(id:any)=>CARD_DEFS?.[String(id)]?.name||String(id||'Carta');
const log=(s:any,msg:string)=>{s.log ||= [];s.log.push(msg);if(s.log.length>180)s.log=s.log.slice(-180)};
const activeChampions=(s:any,p:number)=>(player(s,p)?.champions||[]).filter((c:any)=>!c.defeated);
const hasMonster=(s:any,id:string)=>(s?.board?.monsters||[]).some((m:any)=>String(m.cardId)===id);
const remainingHp=(c:any)=>Math.max(0,Number(c?.hp||1)-Number(c?.wounds||0));
const colorLabel=(c:string)=>c==='red'?'Rossa':c==='green'?'Verde':c==='black'?'Nera':c==='blue'?'Blu':'Arancione';

function currentChampionPow(s:any,p:number,c:any){
 let n=Number(c?.basePow??CHAMPION_DEFS?.[c?.id]?.basePow??0)+Number(c?.tempPow||0);
 if(String(c?.id)==='kael'&&(player(s,p)?.hand?.length||0)===0&&s?.status==='main')n+=3;
 return Math.max(1,n);
}
function currentMonsterPow(s:any,m:any){
 const d=MONSTER_DEFS?.[m?.cardId];if(!d)return 0;
 const ms=s?.board?.monsters||[];
 let n=Number(d.pow||0)+Number(m?.powMod||0)+Number(m?.tempPow||0);
 n+=ms.filter((x:any)=>x.uid!==m.uid&&x.cardId==='lupo_delle_radici').length;
 const wolves=ms.filter((x:any)=>x.uid!==m.uid&&x.cardId==='lupo_glaciale').length;
 const griffins=ms.filter((x:any)=>x.cardId==='grifone_della_tempesta').length;
 if(wolves)n-=wolves*(1+griffins);
 return Math.max(0,n);
}

function snapshot(s:any){
 const board=new Map<string,any>();
 for(const m of s?.board?.monsters||[])board.set(String(m.uid),clone(m));
 return{
  board,
  order:[...(s?.board?.monsters||[])].map((m:any)=>String(m.uid)),
  decks:{1:(player(s,1)?.monsterDeck||[]).length,2:(player(s,2)?.monsterDeck||[]).length},
  logLength:(s?.log||[]).length,
  turn:Number(s?.turn||0),
  pending:clone(s?.pendingChoice||null)
 };
}

function sourceActor(s:any,p:number,move:any){
 if(move?.type==='pass_priority'){
  const top=s?.stack?.[s.stack.length-1];
  if(Number(top?.actor)===1||Number(top?.actor)===2)return Number(top.actor);
  const a=Number(s?.combat?.attacker?.player||s?.combat?.initiator);
  if(a===1||a===2)return a;
 }
 const a=Number(s?.combat?.attacker?.player);
 return a===1||a===2?a:p;
}
function sourceText(s:any,move:any){
 if(move?.type!=='pass_priority')return'';
 const top=s?.stack?.[s.stack.length-1];
 const d=CARD_DEFS?.[top?.cardId]||MONSTER_DEFS?.[top?.sourceCardId]||CARD_DEFS?.[top?.sourceCardId];
 return`${d?.text||''} ${top?.effectName||''} ${top?.effectId||''}`;
}
function mayDealDamage(s:any,move:any){
 if(move?.type==='select_cards')return true;
 if(move?.type!=='pass_priority')return false;
 if(s?.combat&&!s?.stack?.length)return true;
 return/(dann|ferita|contrattacc)/i.test(sourceText(s,move));
}
function mayReducePow(s:any,move:any){
 if(move?.type==='select_cards')return true;
 return move?.type==='pass_priority'&&/(riduc|perde[^.]*pow)/i.test(sourceText(s,move));
}

/*
 * Ariete e Gorilla sono applicati prima dell'Armatura. I descrittori temporanei
 * permettono di intercettare tutte le funzioni di danno già presenti nelle
 * diverse patch del motore senza cambiare il comportamento delle altre carte.
 */
type PreventionEvent={name:string;amount:number};
function installChampionDamagePrevention(s:any,enabled:boolean){
 const events:PreventionEvent[]=[];
 if(!enabled)return{events,restore:()=>{}};
 const restorers:Array<()=>void>=[];
 for(const p of [1,2])for(const c of activeChampions(s,p)){
  let armor=Math.max(0,Number(c.armor||0));
  let lastRead=armor;
  let protectionAtRead:''|'gorilla'|'ariete'='';
  const sentinel=1000000;
  const descriptor=Object.getOwnPropertyDescriptor(c,'armor');
  Object.defineProperty(c,'armor',{
   configurable:true,enumerable:true,
   get(){
    protectionAtRead=hasMonster(s,'gorilla_della_giungla')&&remainingHp(c)===1
     ?'gorilla'
     :hasMonster(s,'ariete_sacro')&&Number(c._v60ArietePreventTurn)!==Number(s.turn)
      ?'ariete':'';
    lastRead=protectionAtRead?sentinel+armor:armor;
    return lastRead;
   },
   set(value:any){
    const next=Math.max(0,Number(value)||0);
    /*
     * Le funzioni di danno leggono l'Armatura e poi la riscrivono. Il valore
     * sentinella distingue quel percorso da un effetto che imposta direttamente
     * l'Armatura (per esempio Spacca Corazze), che deve continuare a funzionare.
     */
    if(next>=sentinel/2&&protectionAtRead==='gorilla'){
     if(next>=lastRead)armor+=next-lastRead;
     else{const amount=lastRead-next;events.push({name:String(c.name),amount});log(s,`Gorilla della Giungla previene ${amount} dann${amount===1?'o':'i'} a ${c.name}.`)}
     return;
    }
    if(next>=sentinel/2&&protectionAtRead==='ariete'){
     if(next>=lastRead){armor+=next-lastRead;return}
     c._v60ArietePreventTurn=Number(s.turn);
     const amount=lastRead-next;events.push({name:String(c.name),amount});log(s,`Ariete Sacro previene ${amount} dann${amount===1?'o':'i'} a ${c.name}.`);
     return;
    }
    armor=next;
   }
  });
  restorers.push(()=>{
   delete c.armor;
   if(descriptor&&descriptor.get)Object.defineProperty(c,'armor',descriptor);
   else c.armor=armor;
  });
 }
 return{events,restore:()=>{for(const restore of restorers.reverse())restore()}};
}

type PowReplacement={kind:'champion'|'monster';player?:number;id:string;amount:number;name:string};
function installMedusaReplacement(s:any,enabled:boolean){
 const events:PowReplacement[]=[];
 if(!enabled)return{events,restore:()=>{}};
 const restorers:Array<()=>void>=[];
 const watch=(target:any,key:'tempPow'|'powMod',info:Omit<PowReplacement,'amount'>)=>{
  let value=Number(target?.[key]||0),last=value;
  const descriptor=Object.getOwnPropertyDescriptor(target,key);
  Object.defineProperty(target,key,{
   configurable:true,enumerable:true,
   get(){last=value;return value},
   set(nextValue:any){
    const next=Number(nextValue)||0;
    if(next<value&&hasMonster(s,'medusa_delle_maree')){events.push({...info,amount:value-next});return}
    value=next;
   }
  });
  restorers.push(()=>{delete target[key];if(descriptor&&descriptor.get)Object.defineProperty(target,key,descriptor);else target[key]=value});
 };
 for(const p of [1,2])for(const c of activeChampions(s,p))watch(c,'tempPow',{kind:'champion',player:p,id:String(c.id),name:String(c.name||c.id)});
 for(const m of s?.board?.monsters||[]){
  const info={kind:'monster' as const,id:String(m.uid),name:monsterName(m.cardId)};
  watch(m,'tempPow',info);watch(m,'powMod',info);
 }
 return{events,restore:()=>{for(const restore of restorers.reverse())restore()}};
}

type GiantHit={uid:string;actor:number;amount:number};
function installGiganteWatcher(s:any,enabled:boolean,actor:number){
 const events:GiantHit[]=[];
 if(!enabled||actor!==1&&actor!==2)return{events,restore:()=>{}};
 const restorers:Array<()=>void>=[];
 for(const m of s?.board?.monsters||[]){
  if(m.cardId!=='gigante_del_cratere')continue;
  let damage=Number(m.damage||0);
  const descriptor=Object.getOwnPropertyDescriptor(m,'damage');
  Object.defineProperty(m,'damage',{
   configurable:true,enumerable:true,get(){return damage},set(v:any){const next=Math.max(0,Number(v)||0);if(next>damage)events.push({uid:String(m.uid),actor,amount:next-damage});damage=next}
  });
  restorers.push(()=>{delete m.damage;if(descriptor&&descriptor.get)Object.defineProperty(m,'damage',descriptor);else m.damage=damage});
 }
 return{events,restore:()=>{for(const restore of restorers.reverse())restore()}};
}

function queue(s:any,tr:any){s._v60Triggers ||= [];s._v60Triggers.push(tr)}
function queueEffect(s:any,actor:number,sourceCardId:string,effectId:string,effectName:string,targets:any={},meta:any={}){
 queue(s,{mode:'effect',actor,sourceCardId,effectId,effectName,targets,meta});
}
function queueChoice(s:any,actor:number,sourceCardId:string,effectId:string,effectName:string,choiceType:string,meta:any={}){
 queue(s,{mode:'choice',actor,sourceCardId,effectId,effectName,choiceType,meta});
}
function queueEntry(s:any,m:any,vermeCondition:boolean){
 const p=Number(m.owner),id=String(m.cardId);
 if(id==='cinghiale_zannaverde')queueEffect(s,p,id,'v60_cinghiale_enter','Effetto — Cinghiale Zannaverde',{}, {uid:String(m.uid)});
 else if(id==='elementale_della_brina')queueEffect(s,p,id,'v60_elementale_enter','Effetto — Elementale della Brina',{}, {uid:String(m.uid)});
 else if(id==='verme_delle_tombe'&&vermeCondition)queueChoice(s,p,id,'v60_verme_enter','Effetto — Verme delle Tombe','graveMonstersUpTo3');
 else return;
 log(s,`${monsterName(id)} attiva il suo effetto: entra in Catena.`);
}

function optionList(s:any,tr:any){
 const p=Number(tr.actor);
 if(tr.choiceType==='handCard')return[...new Set(player(s,p)?.hand||[])].map((id:any)=>({id:String(id),cardId:String(id),label:cardName(id)}));
 if(tr.choiceType==='opponentGraveCard')return[...new Set(player(s,other(p))?.grave||[])].map((id:any)=>({id:String(id),cardId:String(id),label:cardName(id)}));
 if(tr.choiceType==='enemyChampion')return activeChampions(s,other(p)).map((c:any)=>({id:String(c.id),cardId:String(c.id),label:String(c.name||c.id)}));
 if(tr.choiceType==='enemySoul')return COLORS.filter(c=>Number(player(s,other(p))?.souls?.[c]||0)>0).map(c=>({id:c,label:`Anima ${colorLabel(c)}`}));
 if(tr.choiceType==='graveMonstersUpTo3'){
  return(player(s,p)?.monsterGrave||[]).map((id:any,index:number)=>({id:`${index}:${id}`,cardId:String(id),label:monsterName(id),pow:Number(MONSTER_DEFS?.[id]?.pow||0)})).filter((x:any)=>x.pow<=2);
 }
 return[];
}
function targetsForChoice(tr:any,choice:string){
 if(tr.choiceType==='enemyChampion')return{champion:{player:other(Number(tr.actor)),champId:choice}};
 if(tr.choiceType==='enemySoul')return{color:choice};
 if(tr.choiceType==='handCard'||tr.choiceType==='opponentGraveCard')return{cardId:choice};
 return{choice};
}
function pushStackEffect(s:any,tr:any,targets:any){
 s.stack ||= [];
 s.stack.push({uid:crypto.randomUUID(),kind:'effect',actor:Number(tr.actor),sourceCardId:tr.sourceCardId,effectId:tr.effectId,effectName:tr.effectName,targets:targets||tr.targets||{},meta:tr.meta||{}});
 s.priority=other(Number(tr.actor));s.priorityPasses=0;
}
function promote(s:any){
 if(s?.status==='gameover'||s?.pendingChoice)return;
 const q=s?._v60Triggers;
 if(!Array.isArray(q)||!q.length)return;
 while(q.length&&!s.pendingChoice){
  const tr=q.shift();
  if(tr.mode==='choice'){
   const options=optionList(s,tr);
   if(tr.choiceType==='graveMonstersUpTo3'){
    if(!options.length){pushStackEffect(s,tr,{graveMonsterIds:[]});break}
    s.pendingChoice={type:'v60_multi_target',player:Number(tr.actor),trigger:tr,options,max:3,min:0};s.priority=null;return;
   }
   if(!options.length){log(s,`${tr.effectName} non ha bersagli validi.`);continue}
   s.pendingChoice={type:'trigger_target',player:Number(tr.actor),trigger:tr,options};s.priority=null;return;
  }
  pushStackEffect(s,tr,tr.targets||{});
 }
 if(!q.length)delete s._v60Triggers;
}

function resolveChoice(s:any,p:number,move:any){
 const pc=s?.pendingChoice;
 if(!pc||Number(pc.player)!==p||move?.type!=='resolve_choice')throw new Error('Scelta non valida.');
 const tr=pc.trigger;
 if(pc.type==='v60_multi_target'){
  const raw=Array.isArray(move.choices)?move.choices.map(String):[];
  const selected=[...new Set(raw)];
  if(selected.length>Number(pc.max||3))throw new Error('Puoi scegliere al massimo 3 Mostri.');
  const options=new Map((pc.options||[]).map((o:any)=>[String(o.id),o]));
  if(selected.some(id=>!options.has(id)))throw new Error('Mostro scelto non valido.');
  const ids=selected.map(id=>String(options.get(id)?.cardId||''));
  s.pendingChoice=null;pushStackEffect(s,tr,{graveMonsterIds:ids});
  log(s,ids.length?`${player(s,p)?.name} sceglie ${ids.map(monsterName).join(', ')} per Verme delle Tombe.`:`${player(s,p)?.name} non sceglie Mostri per Verme delle Tombe.`);
  return s;
 }
 const id=String(move.choice||move.cardId||'');
 if(!(pc.options||[]).some((o:any)=>String(o.id)===id))throw new Error('Bersaglio non valido.');
 s.pendingChoice=null;pushStackEffect(s,tr,targetsForChoice(tr,id));
 log(s,`${tr.effectName} sceglie ${pc.options.find((o:any)=>String(o.id)===id)?.label||id} come bersaglio.`);
 return s;
}

function gainSoul(s:any,p:number,color:string,n=1){
 const q=player(s,p);if(!q||!COLORS.includes(color)||!(q.deckColors||[]).includes(color))return;
 q.souls ||= {};q.souls[color]=Number(q.souls[color]||0)+n;
 log(s,`${q.name} recupera ${n} Anima${n===1?'':'e'} ${n===1?colorLabel(color):(color==='orange'?'Arancioni':colorLabel(color))}.`);
}
function noteKill(s:any,p:number,n=1){
 const q=player(s,p);if(!q)return;q.killedMonsterThisTurn=true;
 if(Number(q._v59KillsTurn)!==Number(s.turn)){q._v59KillsTurn=Number(s.turn);q._v59Kills=0}
 q._v59Kills=Number(q._v59Kills||0)+n;
}
function baseLascito(dead:any,actor:number){
 const d=MONSTER_DEFS?.[dead.cardId];
 if(d?.lascito==='segugio_morti')return{effectId:'lascito_segugio',choiceType:'enemyChampion'};
 if(d?.lascito==='custode')return{effectId:'lascito_custode'};
 if(d?.lascito==='cavaliere')return{effectId:'lascito_cavaliere',choiceType:'enemyChampion'};
 if(d?.lascito==='serpente')return{effectId:'lascito_serpente',choiceType:'enemySoul'};
 if(d?.lascito==='divoratore')return{effectId:'lascito_divoratore',meta:{colors:[...(dead.devouredColors||[])]}};
 if(d?.lascito==='sciamano')return{effectId:'lascito_sciamano'};
 if(d?.lascito==='scarabeo_dorato')return{effectId:'v60_scarabeo_draw'};
 return null;
}
function queueLascito(s:any,dead:any,killer:number,kings:number){
 if(killer!==1&&killer!==2)return;
 const count=1+Math.max(0,kings);
 if(dead.cardId==='scorpione_delle_ceneri'){
  for(let i=0;i<count;i++)queueChoice(s,killer,dead.cardId,'v60_scorpione_lascito','Lascito — Scorpione delle Ceneri','handCard');
 }else if(dead.cardId==='marionetta_maledetta'){
  for(let i=0;i<count;i++)queueChoice(s,killer,dead.cardId,'v60_marionetta_lascito','Lascito — Marionetta Maledetta','opponentGraveCard');
 }else{
  const tr=baseLascito(dead,killer);if(!tr)return;
  for(let i=0;i<count;i++){
   if(tr.choiceType)queueChoice(s,killer,dead.cardId,tr.effectId,`Lascito — ${monsterName(dead.cardId)}`,tr.choiceType,tr.meta||{});
   else queueEffect(s,killer,dead.cardId,tr.effectId,`Lascito — ${monsterName(dead.cardId)}`,{},tr.meta||{});
  }
 }
 log(s,`${monsterName(dead.cardId)}: Lascito viene ottenuto da ${player(s,killer)?.name}${count>1?` (${count} attivazioni)`:''}.`);
}
function applyGhoulDeath(s:any,dead:any){
 for(const g of s?.board?.monsters||[]){
  if(g.cardId!=='ghoul_affamato'||String(g.uid)===String(dead.uid))continue;
  const q=player(s,Number(g.owner));if(!q)continue;
  if(Number(q._ghoulDiscountTurn)!==Number(s.turn)){q._ghoulDiscountTurn=Number(s.turn);q._ghoulDiscountAmount=0}
  q._ghoulDiscountAmount=Number(q._ghoulDiscountAmount||0)+1;
  log(s,`Ghoul Affamato: le Magie di costo 3 o superiore di ${q.name} costano ${q._ghoulDiscountAmount} Anima${q._ghoulDiscountAmount===1?'':'e'} in meno per questo turno.`);
 }
}
function killMonster(s:any,killer:number,m:any,source:string){
 const index=(s?.board?.monsters||[]).findIndex((x:any)=>String(x.uid)===String(m?.uid));if(index<0)return;
 const kings=(s.board.monsters||[]).filter((x:any)=>x.cardId==='re_dei_non_morti').length;
 const dead=clone(s.board.monsters[index]);s.board.monsters.splice(index,1);
 const owner=player(s,Number(dead.owner));if(owner){owner.monsterGrave ||= [];owner.monsterGrave.push(dead.cardId)}
 log(s,`${monsterName(dead.cardId)} viene sconfitto${source?` da ${source}`:''}.`);
 if(killer===1||killer===2){noteKill(s,killer);gainSoul(s,killer,String(MONSTER_DEFS?.[dead.cardId]?.color||''),1)}
 for(const b of s.board.monsters.filter((x:any)=>x.cardId==='orso_furioso')){b.tempPow=Number(b.tempPow||0)+2;log(s,'Orso Furioso ottiene +2 POW fino alla fine del turno.')}
 applyGhoulDeath(s,dead);queueLascito(s,dead,killer,kings);
 if(Number(dead.richiamoBrancoTurn)===Number(s.turn))for(let i=0;i<1+kings;i++)queueChoice(s,killer,'richiamo_del_branco','lascito_richiamo_branco','Lascito — Richiamo del Branco','enemyChampion');
}

function woundChampion(s:any,p:number,c:any,source:string){
 if(!c||c.defeated)return;c.wounds=Number(c.wounds||0)+1;c.damage=0;
 log(s,`${c.name} subisce una Ferita (${c.wounds}/${c.hp})${source?` da ${source}`:''}.`);
 if(c.wounds>=Number(c.hp||1)){c.defeated=true;c.tapped=true;log(s,`${c.name} è sconfitto.`)}
}
function damageChampion(s:any,p:number,id:string,n:number,source:string){
 const c=champ(s,p,id);if(!c||c.defeated||n<=0)return;
 if(hasMonster(s,'gorilla_della_giungla')&&remainingHp(c)===1){log(s,`Gorilla della Giungla previene ${n} dann${n===1?'o':'i'} a ${c.name}.`);return}
 if(hasMonster(s,'ariete_sacro')&&Number(c._v60ArietePreventTurn)!==Number(s.turn)){
  c._v60ArietePreventTurn=Number(s.turn);log(s,`Ariete Sacro previene ${n} dann${n===1?'o':'i'} a ${c.name}.`);return;
 }
 let left=n;const armor=Math.max(0,Number(c.armor||0)),blocked=Math.min(armor,left);
 if(blocked){c.armor=armor-blocked;left-=blocked;log(s,`${c.name} usa ${blocked} Armatura e annulla ${blocked} dann${blocked===1?'o':'i'}.`)}
 if(left<=0)return;c.damage=Number(c.damage||0)+left;
 const threshold=currentChampionPow(s,p,c);log(s,`${c.name} subisce ${left} dann${left===1?'o':'i'} (${c.damage}/${threshold}).`);
 if(c.damage>=threshold)woundChampion(s,p,c,source);
}
function damageMonster(s:any,killer:number,uid:string,n:number,source:string){
 const m=monster(s,uid);if(!m||n<=0)return;
 let left=n;const armor=Math.max(0,Number(m.armor||0)),blocked=Math.min(armor,left);
 if(blocked){m.armor=armor-blocked;left-=blocked;log(s,`${monsterName(m.cardId)} usa ${blocked} Armatura e annulla ${blocked} dann${blocked===1?'o':'i'}.`)}
 if(left<=0)return;m.damage=Number(m.damage||0)+left;log(s,`${monsterName(m.cardId)} subisce ${left} dann${left===1?'o':'i'} (${m.damage}/${currentMonsterPow(s,m)}).`);
 if(m.cardId==='gigante_del_cratere'&&(killer===1||killer===2))queueEffect(s,killer,m.cardId,'v60_gigante_hit','Effetto — Gigante del Cratere');
 if(Number(m.damage)>=currentMonsterPow(s,m)){killMonster(s,killer,m,source);return}
 if(m.cardId==='treant_millenario'){m.armor=Number(m.armor||0)+2;log(s,'Treant Millenario subisce danni e ottiene 2 Armatura.')}
 for(const cervo of s.board.monsters.filter((x:any)=>x.cardId==='cervo_antico'&&x.uid!==m.uid))queueEffect(s,Number(cervo.owner),cervo.cardId,'cervo_antico_pow','Effetto — Cervo Antico',{}, {targetUid:String(m.uid)});
}

function applyScarletDiscard(s:any,p:number){
 const q=player(s,p),c=champ(s,p,'scarlet');if(!q||!c||c.defeated||Number(q._scarletTriggeredTurn)===Number(s.turn))return;
 q._scarletTriggeredTurn=Number(s.turn);const i=(q.deck||[]).findIndex((id:string)=>CARD_DEFS[id]?.color==='red');
 if(i<0){log(s,'Fuoco e Fiamme non trova una carta Rossa nel Mazzo.');return}
 const[id]=q.deck.splice(i,1);q.hand ||= [];q.hand.push(id);log(s,`Fuoco e Fiamme: ${q.name} pesca ${cardName(id)}.`);
}
function addMonsterFromGrave(s:any,p:number,id:string){
 const q=player(s,p),index=(q?.monsterGrave||[]).indexOf(id);if(index<0||Number(MONSTER_DEFS?.[id]?.pow)>2)return null;
 q.monsterGrave.splice(index,1);const m={uid:crypto.randomUUID(),cardId:id,owner:p,damage:0,tempPow:0,powMod:0,armor:0};
 s.board ||= {monsters:[]};s.board.monsters ||= [];s.board.monsters.push(m);
 log(s,`${q.name} evoca ${monsterName(id)} dal proprio Cimitero.`);queueEntry(s,m,(q.monsterDeck||[]).length===1);return m;
}
function resolveCustomEffect(s:any,item:any){
 const p=Number(item.actor),t=item.targets||{},m=item.meta||{};
 switch(String(item.effectId)){
  case'v60_cinghiale_enter':{const x=monster(s,m.uid);if(x){x.tempPow=Number(x.tempPow||0)+2;log(s,'Cinghiale Zannaverde ottiene +2 POW fino alla fine del turno.')}break}
  case'v60_elementale_enter':{const x=monster(s,m.uid);if(x){x.armor=Number(x.armor||0)+2;log(s,'Elementale della Brina ottiene 2 Armatura fino alla fine del turno.')}break}
  case'v60_gigante_hit':for(const c of [...activeChampions(s,other(p))])damageChampion(s,other(p),String(c.id),1,'Gigante del Cratere');break;
  case'v60_scorpione_lascito':{
   const q=player(s,p),id=String(t.cardId||''),i=(q?.hand||[]).indexOf(id);
   if(i<0){log(s,'Lascito — Scorpione delle Ceneri non trova più la carta scelta.');break}
   q.hand.splice(i,1);q.grave ||= [];q.grave.push(id);log(s,`${q.name} scarta ${cardName(id)} per Scorpione delle Ceneri.`);applyScarletDiscard(s,p);break;
  }
  case'v60_marionetta_lascito':{
   const foe=player(s,other(p)),id=String(t.cardId||''),i=(foe?.grave||[]).indexOf(id);
   if(i<0){log(s,'Lascito — Marionetta Maledetta non trova più la carta scelta.');break}
   foe.grave.splice(i,1);foe.banishedCards ||= [];foe.banishedCards.push(id);log(s,`${player(s,p)?.name} bandisce ${cardName(id)} dal Cimitero di ${foe.name}.`);break;
  }
  case'v60_verme_enter':{
   let count=0;for(const id of (Array.isArray(t.graveMonsterIds)?t.graveMonsterIds:[]).slice(0,3))if(addMonsterFromGrave(s,p,String(id)))count++;
   if(!count)log(s,'Verme delle Tombe non evoca alcun Mostro.');break;
  }
  case'v60_scarabeo_draw':{
   const q=player(s,p),id=q?.deck?.shift?.();if(id){q.hand ||= [];q.hand.push(id);log(s,`Lascito — Scarabeo Dorato: ${q.name} pesca ${cardName(id)}.`)}else log(s,'Lascito — Scarabeo Dorato non trova carte da pescare.');break;
  }
 }
}

function detectEntries(s:any,before:any){
 const entered=(s?.board?.monsters||[]).filter((m:any)=>!before.board.has(String(m.uid)));
 const byOwner:{[key:string]:any[]}={'1':[],'2':[]};for(const m of entered)if(byOwner[String(m.owner)])byOwner[String(m.owner)].push(m);
 for(const p of [1,2]){
  const list=byOwner[String(p)],drawn=Math.max(0,Number(before.decks[p])-Number((player(s,p)?.monsterDeck||[]).length));
  for(let i=0;i<list.length;i++){
   const remaining=i<drawn?Number(before.decks[p])-i-1:Number((player(s,p)?.monsterDeck||[]).length);
   queueEntry(s,list[i],remaining===1);
  }
 }
}
function detectNewLasciti(s:any,before:any,defaultKiller:number,killerByUid:Map<string,number>){
 const alive=new Set((s?.board?.monsters||[]).map((m:any)=>String(m.uid)));
 const kings=[...before.board.values()].filter((m:any)=>m.cardId==='re_dei_non_morti').length;
 for(const dead of before.board.values()){
  if(alive.has(String(dead.uid))||!['scorpione_delle_ceneri','marionetta_maledetta'].includes(String(dead.cardId)))continue;
  queueLascito(s,dead,killerByUid.get(String(dead.uid))||defaultKiller,kings);
 }
}
function applyMedusaEvents(s:any,events:PowReplacement[],actor:number,logStart:number){
 if(!events.length)return;
 let cursor=logStart;
 for(const event of events){
  for(let i=cursor;i<(s.log||[]).length;i++)if(new RegExp(`^${event.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')} perde \\d+ POW`,'i').test(String(s.log[i]))){s.log[i]=`Medusa delle Maree converte la riduzione di ${event.amount} POW su ${event.name} in altrettanti danni.`;cursor=i+1;break}
  if(event.kind==='champion')damageChampion(s,Number(event.player),event.id,event.amount,'Medusa delle Maree');
  else damageMonster(s,actor,event.id,event.amount,'Medusa delle Maree');
 }
}
function applyGuardianoDraws(s:any,lines:string[]){
 if(!lines.length)return;
 const events:{[key:string]:number}={'1':0,'2':0};
 for(const line of lines){
  if(line.includes('Guardiano del Tesoro:'))continue;
  for(const p of [1,2]){const name=String(player(s,p)?.name||'');if(name&&line.includes(`${name} pesca`))events[String(p)]++}
 }
 for(const p of [1,2]){
  const guardians=(s?.board?.monsters||[]).filter((m:any)=>m.cardId==='guardiano_del_tesoro'&&Number(m.owner)===p).length;
  const count=events[String(p)]*guardians,q=player(s,p);
  for(let i=0;i<count;i++){
   const id=q?.deck?.shift?.();if(!id){log(s,`Guardiano del Tesoro non trova altre carte nel Mazzo di ${q?.name}.`);continue}
   q.hand ||= [];q.hand.push(id);log(s,`Guardiano del Tesoro: ${q.name} pesca 1 carta aggiuntiva (${cardName(id)}).`);
  }
 }
}
function removeSyntheticArmorLogs(s:any,start:number,events:PreventionEvent[]){
 for(const event of events){
  const pattern=new RegExp(`^${event.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')} usa ${event.amount} Armatura`);
  const index=(s.log||[]).findIndex((line:any,i:number)=>i>=start&&pattern.test(String(line)));
  if(index>=0)s.log.splice(index,1);
 }
}
function settleGameover(s:any){
 const lost=[1,2].filter(p=>{const all=(player(s,p)?.champions||[]).filter((c:any)=>!c.supportChampion);return all.length>0&&all.every((c:any)=>c.defeated)});
 if(!lost.length)return;
 s.status='gameover';s.winner=lost.length===2?null:other(lost[0]);s.draw=lost.length===2;s.priority=null;s.priorityPasses=0;s.mainPasses=0;s.stack=[];s.stackInitiator=null;s.combat=null;s.pendingChoice=null;s.triggerQueue=[];s.enterQueue=[];s.delayedKills=[];s.endTurnPending=false;s._v60Triggers=[];
 const msg=lost.length===2?'Entrambi i giocatori non hanno più Campioni: la partita termina in pareggio.':`${player(s,s.winner)?.name||`Giocatore ${s.winner}`} vince la partita!`;
 if(!String((s.log||[])[s.log.length-1]||'').includes(lost.length===2?'pareggio':'vince la partita'))log(s,msg);
}
function cleanupInternalView(v:any){
 delete v._v60Triggers;
 for(const p of [1,2])for(const c of v?.players?.[String(p)]?.champions||[])delete c._v60ArietePreventTurn;
}

export function act(state:any,p0:any,move:any){
 const p=Number(p0);
 if(state?.pendingChoice&&(state.pendingChoice.type==='v60_multi_target'||state.pendingChoice.type==='trigger_target'&&String(state.pendingChoice?.trigger?.effectId||'').startsWith('v60_')))return resolveChoice(state,p,move);
 const before=snapshot(state),actor=sourceActor(state,p,move),killerByUid=new Map<string,number>();
 if(before.pending?.type==='v59_offerta_second'&&move?.type==='resolve_choice'){
  killerByUid.set(String(before.pending.firstUid),Number(before.pending.actor));
  killerByUid.set(String(move.monsterUid||move.choice||''),p);
 }
 const top=move?.type==='pass_priority'&&state?.stack?.length?clone(state.stack[state.stack.length-1]):null;
 const custom=top?.kind==='effect'&&String(top.effectId||'').startsWith('v60_')?top:null;
 const protection=installChampionDamagePrevention(state,mayDealDamage(state,move));
 const medusa=installMedusaReplacement(state,mayReducePow(state,move));
 const gigante=installGiganteWatcher(state,mayDealDamage(state,move),actor);
 let out:any;
 try{out=(base.act as any)(state,p,move)}finally{gigante.restore();medusa.restore();protection.restore()}
 const afterBaseLines=(state.log||[]).slice(before.logLength);
 removeSyntheticArmorLogs(state,before.logLength,protection.events);
 detectNewLasciti(state,before,actor,killerByUid);
 detectEntries(state,before);
 for(const hit of gigante.events)queueEffect(state,hit.actor,'gigante_del_cratere','v60_gigante_hit','Effetto — Gigante del Cratere');
 applyMedusaEvents(state,medusa.events,actor,before.logLength);
 applyGuardianoDraws(state,afterBaseLines);
 if(custom&&!state.stack?.some((x:any)=>String(x.uid)===String(custom.uid)))resolveCustomEffect(state,custom);
 settleGameover(state);promote(state);return out||state;
}

function customTargetSummary(s:any,item:any){
 const t=item?.targets||{};
 if(item?.effectId==='v60_scorpione_lascito')return`Carta: ${cardName(t.cardId)}`;
 if(item?.effectId==='v60_marionetta_lascito')return`Carta nel Cimitero avversario: ${cardName(t.cardId)}`;
 if(item?.effectId==='v60_verme_enter')return Array.isArray(t.graveMonsterIds)&&t.graveMonsterIds.length?`Mostri: ${t.graveMonsterIds.map(monsterName).join(', ')}`:'Nessun Mostro';
 return'';
}
function customTargetCards(item:any){
 const t=item?.targets||{};
 if(['v60_scorpione_lascito','v60_marionetta_lascito'].includes(String(item?.effectId))&&t.cardId)return[{id:String(t.cardId),cardId:String(t.cardId),name:cardName(t.cardId)}];
 if(item?.effectId==='v60_verme_enter')return(t.graveMonsterIds||[]).map((id:any)=>({id:String(id),cardId:String(id),name:monsterName(id)}));
 return[];
}
export function publicView(state:any,p0:any){
 promote(state);const p=Number(p0),v:any=(base.publicView as any)(state,p),raw=state?.stack||[];
 for(const shown of v?.stack||[]){
  const item=raw.find((x:any)=>String(x.uid)===String(shown.uid));if(!item)continue;
  const summary=customTargetSummary(state,item);if(summary)shown.targetSummary=summary;
  const cards=customTargetCards(item);if(cards.length)shown.targetCards=cards;
 }
 cleanupInternalView(v);return v;
}
