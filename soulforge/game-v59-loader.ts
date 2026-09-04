import * as base from './game-v58-loader.ts?rev=set-one-wave-order-v1';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

const COLORS=['red','green','black','blue','orange'];
const CUSTOM_IDS=new Set([
 'arrivano_i_pirati','colpo_di_cannone','galeone_fantasma','furia_della_natura','shuriken',
 'zampata_amichevole','offerta_maligna','scambio_di_anime','visione_distorta',
 'protettore_del_villaggio','valanga','esercito_tormenta_neve',
 'cavaliere_pioggia_frecce','forgia_nanica'
]);
const clone=(x:any)=>JSON.parse(JSON.stringify(x));
const other=(p:number)=>p===1?2:1;
const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const champ=(s:any,p:number,id:any)=>(player(s,p)?.champions||[]).find((c:any)=>String(c?.id)===String(id));
const monster=(s:any,uid:any)=>(s?.board?.monsters||[]).find((m:any)=>String(m?.uid)===String(uid));
const log=(s:any,msg:string)=>{s.log ||= [];s.log.push(msg);if(s.log.length>180)s.log=s.log.slice(-180)};
const colorLabel=(c:string)=>c==='red'?'Rossa':c==='green'?'Verde':c==='black'?'Nera':c==='blue'?'Blu':'Arancione';

Object.assign(CARD_DEFS,{
 arrivano_i_pirati:{id:'arrivano_i_pirati',name:'Arrivano i Pirati',color:'red',cost:0,speed:'response',type:'Magia',text:'Risposta. Come costo aggiuntivo per giocare questa carta, scarta 1 carta dalla tua mano. Infliggi 2 danni a un Mostro.',effect:'v59_arrivano'},
 colpo_di_cannone:{id:'colpo_di_cannone',name:'Colpo di Cannone',color:'red',cost:2,speed:'base',type:'Magia',text:'Infliggi a un nemico 5 danni, ridotti di 1 per ogni carta nella tua mano.',effect:'v59_cannone'},
 galeone_fantasma:{id:'galeone_fantasma',name:'Galeone Fantasma',color:'red',cost:3,speed:'base',type:'Magia',text:'Se non hai carte né nel Mazzo né in mano, infliggi 3 danni a ciascun Campione nemico, poi infliggi altri 3 danni a ciascuno di essi.',effect:'v59_galeone'},
 furia_della_natura:{id:'furia_della_natura',name:'Furia della Natura',color:'green',cost:1,speed:'response',type:'Magia',text:'Risposta. Scegli un tuo Campione. Fino alla fine del turno, raddoppia il suo POW. Alla fine del turno, quel Campione perde 1 HP.',effect:'v59_furia'},
 shuriken:{id:'shuriken',name:'Shuriken',color:'green',cost:2,speed:'base',type:'Magia',text:'Scegli un tuo Campione. Infliggi a un Campione nemico e a un Mostro danni pari al POW del Campione scelto.',effect:'v59_shuriken'},
 zampata_amichevole:{id:'zampata_amichevole',name:'Zampata amichevole',color:'green',cost:2,speed:'instant',type:'Magia',text:'Istantanea. Scegli un tuo Campione. Ottiene +2 POW fino alla fine del turno per ogni Mostro che hai ucciso in questo turno.',effect:'v59_zampata'},
 offerta_maligna:{id:'offerta_maligna',name:'Offerta Maligna',color:'black',cost:0,speed:'base',type:'Magia',text:'Scegli un Mostro. Il tuo avversario sceglie un altro Mostro. Uccidi entrambi i Mostri.',effect:'v59_offerta'},
 scambio_di_anime:{id:'scambio_di_anime',name:'Scambio di Anime',color:'black',cost:3,speed:'instant',type:'Magia',text:'Istantanea. Scegli due Campioni. Scambia il loro POW fino alla fine del turno.',effect:'v59_scambio'},
 visione_distorta:{id:'visione_distorta',name:'Visione Distorta',color:'black',cost:5,speed:'base',type:'Magia',text:'Bandisci tutte le carte dal Mazzo dell’avversario.',effect:'v59_visione'},
 protettore_del_villaggio:{id:'protettore_del_villaggio',name:'Protettore del villaggio',color:'blue',cost:1,speed:'instant',type:'Magia',text:'Istantanea. Fornisci 3 Armatura a un Personaggio.',effect:'v59_protettore'},
 valanga:{id:'valanga',name:'Valanga',color:'blue',cost:2,speed:'base',type:'Magia',text:'Riduci di 2 il POW di tutti i Campioni nemici per questo turno.',effect:'v59_valanga'},
 esercito_tormenta_neve:{id:'esercito_tormenta_neve',name:'Esercito della Tormenta di Neve',color:'blue',cost:3,speed:'base',type:'Magia',text:'Fornisci 3 Armatura a tutti i tuoi Campioni. All’inizio di ogni turno, rigioca questa Magia fornendo 1 Armatura in meno.',effect:'v59_esercito'},
 cavaliere_pioggia_frecce:{id:'cavaliere_pioggia_frecce',name:'Cavaliere della pioggia di frecce',color:'orange',cost:0,speed:'base',type:'Magia',text:'Un tuo Supporto ottiene Provocazione fino alla fine del turno.',effect:'v59_cavaliere'},
 forgia_nanica:{id:'forgia_nanica',name:'Forgia nanica',color:'orange',cost:1,speed:'base',type:'Magia',text:'Tutti i tuoi Supporti ottengono +1 POW e Provocazione per questo turno.',effect:'v59_forgia'},
 guardia_reale:{id:'guardia_reale',name:'Guardia Reale',color:'orange',cost:3,speed:'base',type:'Supporto',supportChampion:true,text:'Non può attaccare. Contrattacco. Provocazione.',effect:'support_guardia_reale'}
});
Object.assign(CARD_DEFS.legionario_troll,{cost:2,text:'Quando attacca, fornisce +2 POW e Provocazione a un tuo Campione per questo turno.'});
Object.assign(CHAMPION_DEFS,{
 legionario_troll:{...(CHAMPION_DEFS.legionario_troll||{}),id:'legionario_troll',name:'Legionario Troll',color:'orange',basePow:2,hp:1,supportChampion:true},
 guardia_reale:{id:'guardia_reale',name:'Guardia Reale',color:'orange',basePow:4,hp:1,supportChampion:true,provocazione:true,counterattack:true,cannotAttack:true}
});
export const STARTER_DECK=Object.keys(CARD_DEFS).filter(id=>!CARD_DEFS[id]?.tokenSupport);

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
 const ice=ms.filter((x:any)=>x.uid!==m.uid&&x.cardId==='lupo_glaciale').length;
 const storms=ms.filter((x:any)=>x.cardId==='grifone_della_tempesta').length;
 if(ice)n-=ice*(1+storms);
 return Math.max(0,n);
}
function activeChampions(s:any,p:number){return(player(s,p)?.champions||[]).filter((c:any)=>!c.defeated)}
function validChampionRef(s:any,t:any){if(!t||![1,2].includes(Number(t.player)))return null;const c=champ(s,Number(t.player),String(t.champId||''));return c&&!c.defeated?c:null}
function ownChampion(s:any,p:number,id:any){const c=champ(s,p,String(id||''));return c&&!c.defeated?c:null}
function ownSupport(s:any,p:number,id:any){const c=ownChampion(s,p,id);return c?.supportChampion?c:null}
function validEnemy(s:any,p:number,t:any){if(t?.type==='monster')return !!monster(s,t.uid);if(t?.type==='champion')return Number(t.player)===other(p)&&!!validChampionRef(s,t);return false}
function spellAmount(s:any,p:number,n:number){return Math.max(0,Number(n)+(player(s,p)?.fireCloud?1:0))}

function woundChampion(s:any,p:number,c:any,source:string){
 if(!c||c.defeated)return;
 c.wounds=Number(c.wounds||0)+1;c.damage=0;
 log(s,`${c.name} subisce una Ferita (${c.wounds}/${c.hp})${source?` da ${source}`:''}.`);
 if(c.wounds>=Number(c.hp||1)){c.defeated=true;c.tapped=true;log(s,`${c.name} è sconfitto.`)}
}
function damageChampion(s:any,p:number,id:string,n:number,source:string){
 const c=champ(s,p,id);if(!c||c.defeated||n<=0)return;
 let left=n;const armor=Math.max(0,Number(c.armor||0)),blocked=Math.min(armor,left);
 if(blocked){c.armor=armor-blocked;left-=blocked;log(s,`${c.name} usa ${blocked} Armatura e annulla ${blocked} dann${blocked===1?'o':'i'}.`)}
 if(left<=0)return;c.damage=Number(c.damage||0)+left;
 const threshold=currentChampionPow(s,p,c);log(s,`${c.name} subisce ${left} dann${left===1?'o':'i'} (${c.damage}/${threshold}).`);
 if(c.damage>=threshold)woundChampion(s,p,c,source);
}
function gainSoul(s:any,p:number,color:string,n=1){
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
function promoteLocalTriggers(s:any){
 if(s.pendingChoice)return;const q=s._v48Triggers;if(!Array.isArray(q)||!q.length)return;
 while(q.length&&!s.pendingChoice){
  const tr=q.shift();let options:any[]=[];
  if(tr.choiceType==='enemyChampion')options=activeChampions(s,other(Number(tr.actor))).map((c:any)=>({id:String(c.id),label:String(c.name||c.id)}));
  else if(tr.choiceType==='enemySoul'){const foe=player(s,other(Number(tr.actor)));options=COLORS.filter(c=>Number(foe?.souls?.[c]||0)>0).map(c=>({id:c,label:`Anima ${colorLabel(c)}`}))}
  if(tr.choiceType){if(!options.length){log(s,`${tr.effectName||'Lascito'} non ha bersagli validi.`);continue}s.pendingChoice={type:'trigger_target',player:Number(tr.actor),trigger:tr,options};s.priority=null;return}
  s.stack ||= [];s.stack.push({uid:crypto.randomUUID(),kind:'effect',actor:Number(tr.actor),sourceCardId:tr.sourceCardId,effectId:tr.effectId,effectName:tr.effectName||'Lascito',targets:{},meta:tr.meta||{}});
 }
 if(s.stack?.length){s.priority=other(Number(s.stack[s.stack.length-1].actor));s.priorityPasses=0}
}
function noteMonsterKill(s:any,p:number,n=1){
 const q=player(s,p);if(!q)return;
 if(Number(q._v59KillsTurn)!==Number(s.turn)){q._v59KillsTurn=Number(s.turn);q._v59Kills=0}
 q._v59Kills=Number(q._v59Kills||0)+n;q.killedMonsterThisTurn=true;
}
function killMonster(s:any,p:number,m:any,source:string){
 const i=(s?.board?.monsters||[]).findIndex((x:any)=>String(x.uid)===String(m?.uid));if(i<0)return null;
 const kings=(s.board.monsters||[]).filter((x:any)=>x.cardId==='re_dei_non_morti').length;
 const dead=clone(s.board.monsters[i]);s.board.monsters.splice(i,1);
 const owner=player(s,Number(dead.owner));if(owner){owner.monsterGrave ||= [];owner.monsterGrave.push(dead.cardId)}
 log(s,`${MONSTER_DEFS[dead.cardId]?.name||dead.cardId} viene sconfitto${source?` da ${source}`:''}.`);
 noteMonsterKill(s,p);gainSoul(s,p,String(MONSTER_DEFS[dead.cardId]?.color||''),1);
 const tr=lascitoDescriptor(dead,p);if(tr){s._v48Triggers ||= [];for(let z=0;z<1+kings;z++)s._v48Triggers.push(clone(tr))}
 for(const b of s.board.monsters.filter((x:any)=>x.cardId==='orso_furioso')){b.tempPow=Number(b.tempPow||0)+2;log(s,'Orso Furioso ottiene +2 POW fino alla fine del turno.')}
 return dead;
}
function damageMonster(s:any,p:number,uid0:string,n:number,source:string){
 const m=monster(s,uid0);if(!m||n<=0)return;
 let left=n;const armor=Math.max(0,Number(m.armor||0)),blocked=Math.min(armor,left);
 if(blocked){m.armor=armor-blocked;left-=blocked;log(s,`${MONSTER_DEFS[m.cardId]?.name||m.cardId} usa ${blocked} Armatura e annulla ${blocked} dann${blocked===1?'o':'i'}.`)}
 if(left<=0)return;m.damage=Number(m.damage||0)+left;
 log(s,`${MONSTER_DEFS[m.cardId]?.name||m.cardId} subisce ${left} dann${left===1?'o':'i'} (${m.damage}/${currentMonsterPow(s,m)}).`);
 if(m.damage>=1&&m.damage>=currentMonsterPow(s,m))killMonster(s,p,m,source);
}
function cleanupSupportDeaths(s:any){
 for(const p of [1,2]){const q=player(s,p);if(!q)continue;const keep=[];for(const c of q.champions||[]){if(c?.supportChampion&&c.defeated){q.grave ||= [];q.grave.push(String(c.sourceCardId||c.id));log(s,`${c.name} viene messo nel Cimitero di ${q.name}.`)}else keep.push(c)}q.champions=keep}
}
function settleGameover(s:any){
 const lost=[1,2].filter(p=>{const starters=activeChampions(s,p).filter((c:any)=>!c.supportChampion);const all=(player(s,p)?.champions||[]).filter((c:any)=>!c.supportChampion);return all.length>0&&starters.length===0});
 if(!lost.length)return;
 s.status='gameover';s.winner=lost.length===2?null:other(lost[0]);s.draw=lost.length===2;
 s.priority=null;s.priorityPasses=0;s.mainPasses=0;s.stack=[];s.stackInitiator=null;s.combat=null;s.pendingChoice=null;s.triggerQueue=[];s.enterQueue=[];s.delayedKills=[];s.endTurnPending=false;
 log(s,lost.length===2?'Entrambi i giocatori non hanno più Campioni: la partita termina in pareggio.':`${player(s,s.winner)?.name||`Giocatore ${s.winner}`} vince la partita!`);
}

function validateCast(s:any,p:number,a:any){
 const c=CARD_DEFS?.[String(a?.cardId||'')];if(!c||!CUSTOM_IDS.has(c.id))return;
 const t=a.targets||{},q=player(s,p);
 switch(c.id){
  case'arrivano_i_pirati':{const id=String(t.discardId||'');if(!id||id===c.id||!q?.hand?.includes(id))throw new Error('Arrivano i Pirati richiede di scartare 1 altra carta.');if(!monster(s,t.monsterUid))throw new Error('Scegli un Mostro.');break}
  case'colpo_di_cannone':if(!validEnemy(s,p,t.enemy))throw new Error('Scegli un nemico.');break;
  case'furia_della_natura':case'zampata_amichevole':if(!ownChampion(s,p,t.ownChamp))throw new Error('Scegli un tuo Campione.');break;
  case'shuriken':if(!ownChampion(s,p,t.ownChamp)||!validChampionRef(s,t.enemyChampion)||Number(t.enemyChampion.player)!==other(p)||!monster(s,t.monsterUid))throw new Error('Shuriken richiede un tuo Campione, un Campione nemico e un Mostro.');break;
  case'offerta_maligna':if(!monster(s,t.monsterUid))throw new Error('Scegli un Mostro.');if((s.board?.monsters||[]).length<2)throw new Error('Servono almeno 2 Mostri.');break;
  case'scambio_di_anime':{const a0=validChampionRef(s,t.championA),b0=validChampionRef(s,t.championB);if(!a0||!b0||Number(t.championA.player)===Number(t.championB.player)&&String(t.championA.champId)===String(t.championB.champId))throw new Error('Scegli due Campioni diversi.');break}
  case'protettore_del_villaggio':if(!(validChampionRef(s,t.character)||t.character?.type==='monster'&&monster(s,t.character.uid)))throw new Error('Scegli un Personaggio.');break;
  case'cavaliere_pioggia_frecce':if(!ownSupport(s,p,t.supportId))throw new Error('Scegli un tuo Supporto.');break;
 }
}
function payAdditionalCosts(s:any,p:number,a:any){
 if(a?.type!=='cast'||String(a.cardId)!=='arrivano_i_pirati')return;
 const q=player(s,p),id=String(a.targets?.discardId||''),i=q?.hand?.indexOf(id)??-1;if(i<0)return;
 q.hand.splice(i,1);q.grave ||= [];q.grave.push(id);log(s,`${q.name} scarta ${CARD_DEFS[id]?.name||id} come costo aggiuntivo di Arrivano i Pirati.`);
 const scarlet=champ(s,p,'scarlet');if(!scarlet||scarlet.defeated||Number(q._scarletTriggeredTurn)===Number(s.turn))return;
 q._scarletTriggeredTurn=Number(s.turn);const j=(q.deck||[]).findIndex((x:string)=>CARD_DEFS[x]?.color==='red');
 if(j<0){log(s,'Fuoco e Fiamme non trova una carta Rossa nel Mazzo.');return}const[drawn]=q.deck.splice(j,1);q.hand.push(drawn);log(s,`Fuoco e Fiamme: ${q.name} pesca ${CARD_DEFS[drawn]?.name||drawn}.`);
}

function markProvocation(c:any,turn:number){if(Number(c._v59ProvTurn)!==turn){c._v59ProvPrev=!!c.provocazione;c._v59ProvTurn=turn}c.provocazione=true}
function resolveCard(s:any,item:any){
 const p=Number(item.actor),t=item.targets||{},q=player(s,p),c=CARD_DEFS[item.cardId];if(!c)return;
 switch(String(item.cardId)){
  case'arrivano_i_pirati':damageMonster(s,p,String(t.monsterUid||''),spellAmount(s,p,2),c.name);break;
  case'colpo_di_cannone':{const n=spellAmount(s,p,Math.max(0,5-(q?.hand?.length||0)));if(t.enemy?.type==='champion')damageChampion(s,Number(t.enemy.player),String(t.enemy.champId),n,c.name);else damageMonster(s,p,String(t.enemy?.uid||''),n,c.name);break}
  case'galeone_fantasma':{
   if((q?.deck?.length||0)!==0||(q?.hand?.length||0)!==0){log(s,'Galeone Fantasma non si attiva: hai ancora carte nel Mazzo o in mano.');break}
   const enemy=other(p),targets=activeChampions(s,enemy).map((x:any)=>String(x.id));
   log(s,'Galeone Fantasma — prima salva di 3 danni.');for(const id of targets)damageChampion(s,enemy,id,spellAmount(s,p,3),c.name);
   cleanupSupportDeaths(s);log(s,'Galeone Fantasma — cleanup completato; seconda salva di 3 danni.');
   for(const id of targets)if(champ(s,enemy,id)&&!champ(s,enemy,id).defeated)damageChampion(s,enemy,id,spellAmount(s,p,3),c.name);
   cleanupSupportDeaths(s);break;
  }
  case'furia_della_natura':{const x=ownChampion(s,p,t.ownChamp);if(x){const pow=currentChampionPow(s,p,x);x.tempPow=Number(x.tempPow||0)+pow;s._v59EndTurnHp ||= [];s._v59EndTurnHp.push({turn:Number(s.turn),player:p,champId:String(x.id),source:c.name});log(s,`${x.name} raddoppia il proprio POW fino alla fine del turno.`)}break}
  case'shuriken':{const x=ownChampion(s,p,t.ownChamp);if(!x)break;const n=currentChampionPow(s,p,x);damageChampion(s,other(p),String(t.enemyChampion?.champId||''),spellAmount(s,p,n),c.name);damageMonster(s,p,String(t.monsterUid||''),spellAmount(s,p,n),c.name);break}
  case'zampata_amichevole':{const x=ownChampion(s,p,t.ownChamp);if(!x)break;const kills=Number(q?._v59KillsTurn)===Number(s.turn)?Number(q?._v59Kills||0):Number(q?.killedMonsterThisTurn?1:0);x.tempPow=Number(x.tempPow||0)+2*kills;log(s,`${x.name} ottiene +${2*kills} POW per ${kills} Mostr${kills===1?'o':'i'} uccis${kills===1?'o':'i'} in questo turno.`);break}
  case'offerta_maligna':{const first=monster(s,String(t.monsterUid||''));const opts=(s.board?.monsters||[]).filter((m:any)=>String(m.uid)!==String(first?.uid)).map((m:any)=>({id:String(m.uid),label:MONSTER_DEFS[m.cardId]?.name||m.cardId}));if(!first||!opts.length){log(s,'Offerta Maligna non trova due Mostri validi.');break}s.pendingChoice={type:'v59_offerta_second',player:other(p),actor:p,firstUid:String(first.uid),sourceCardId:c.id,options:opts};s.priority=null;s.priorityPasses=0;log(s,`${player(s,other(p))?.name} deve scegliere il secondo Mostro per Offerta Maligna.`);break}
  case'scambio_di_anime':{const a=validChampionRef(s,t.championA),b=validChampionRef(s,t.championB);if(!a||!b)break;const pa=currentChampionPow(s,Number(t.championA.player),a),pb=currentChampionPow(s,Number(t.championB.player),b);a.tempPow=Number(a.tempPow||0)+(pb-pa);b.tempPow=Number(b.tempPow||0)+(pa-pb);log(s,`${a.name} e ${b.name} scambiano il loro POW fino alla fine del turno.`);break}
  case'visione_distorta':{const o=player(s,other(p));const n=o?.deck?.length||0;o.banishedCards ||= [];o.banishedCards.push(...(o.deck||[]));o.deck=[];log(s,`Visione Distorta bandisce ${n} carte dal Mazzo di ${o.name}.`);break}
  case'protettore_del_villaggio':{const ref=t.character,x=ref?.type==='monster'?monster(s,ref.uid):validChampionRef(s,ref);if(x){x.armor=Number(x.armor||0)+3;const name=ref?.type==='monster'?(MONSTER_DEFS[x.cardId]?.name||x.cardId):x.name;log(s,`${name} ottiene 3 Armatura.`)}break}
  case'valanga':for(const x of activeChampions(s,other(p))){x.tempPow=Number(x.tempPow||0)-2;log(s,`${x.name} perde 2 POW fino alla fine del turno.`);if(Number(x.damage||0)>=currentChampionPow(s,other(p),x))woundChampion(s,other(p),x,c.name)}break;
  case'esercito_tormenta_neve':applySnowArmy(s,p,Number(item.meta?.armor||3),String(item.meta?.replay||'')==='1');break;
  case'cavaliere_pioggia_frecce':{const x=ownSupport(s,p,t.supportId);if(x){markProvocation(x,Number(s.turn));log(s,`${x.name} ottiene Provocazione fino alla fine del turno.`)}break}
  case'forgia_nanica':for(const x of activeChampions(s,p).filter((z:any)=>z.supportChampion)){x.tempPow=Number(x.tempPow||0)+1;markProvocation(x,Number(s.turn))}log(s,`I Supporti di ${q?.name} ottengono +1 POW e Provocazione fino alla fine del turno.`);break;
 }
}
function applySnowArmy(s:any,p:number,amount:number,replay:boolean){
 if(amount<=0)return;for(const x of activeChampions(s,p))x.armor=Number(x.armor||0)+amount;
 log(s,`${replay?'Esercito della Tormenta di Neve viene rigiocato':'Esercito della Tormenta di Neve'}: i Campioni di ${player(s,p)?.name} ottengono ${amount} Armatura.`);
 if(amount>1){s._v59Snow ||= [];s._v59Snow.push({player:p,amount:amount-1,afterTurn:Number(s.turn)})}
}
function queueSnowAtNewTurn(s:any,oldTurn:number){
 if(Number(s.turn)===oldTurn||s.status!=='main'||s.pendingChoice)return;
 const due=(s._v59Snow||[]).filter((x:any)=>Number(x.afterTurn)<Number(s.turn));s._v59Snow=(s._v59Snow||[]).filter((x:any)=>Number(x.afterTurn)>=Number(s.turn));
  for(const x of due){s.stack ||= [];s.stack.push({uid:crypto.randomUUID(),kind:'effect',actor:Number(x.player),cardId:'esercito_tormenta_neve',effectId:'v59_esercito',effectName:'Esercito della Tormenta di Neve',targets:{},meta:{armor:Number(x.amount),replay:'1'},virtual:true});log(s,`Esercito della Tormenta di Neve viene rigiocato con ${x.amount} Armatura.`)}
 if(due.length){s.stackInitiator=Number(due[due.length-1].player);s.priority=other(Number(due[due.length-1].player));s.priorityPasses=0}
}
function resolveOffertaChoice(s:any,p:number,a:any){
 const pc=s.pendingChoice;if(!pc||pc.type!=='v59_offerta_second'||Number(pc.player)!==p||a?.type!=='resolve_choice')throw new Error('Scelta non valida.');
 const secondUid=String(a.monsterUid||a.choice||''),allowed=(pc.options||[]).some((x:any)=>String(x.id)===secondUid),first=monster(s,pc.firstUid),second=monster(s,secondUid);if(!allowed||!first||!second||String(first.uid)===String(second.uid))throw new Error('Mostro non valido.');
 const actor=Number(pc.actor);s.pendingChoice=null;
 const dead=[clone(first),clone(second)];for(const m of dead){const i=(s.board?.monsters||[]).findIndex((x:any)=>String(x.uid)===String(m.uid));if(i>=0)s.board.monsters.splice(i,1)}
 for(const m of dead){const owner=player(s,Number(m.owner));if(owner){owner.monsterGrave ||= [];owner.monsterGrave.push(m.cardId)}log(s,`${MONSTER_DEFS[m.cardId]?.name||m.cardId} viene ucciso da Offerta Maligna.`);noteMonsterKill(s,actor);gainSoul(s,actor,String(MONSTER_DEFS[m.cardId]?.color||''),1)}
 const kings=dead.filter((m:any)=>m.cardId==='re_dei_non_morti').length+(s.board?.monsters||[]).filter((m:any)=>m.cardId==='re_dei_non_morti').length;
 for(const m of dead){const tr=lascitoDescriptor(m,actor);if(tr){s._v48Triggers ||= [];for(let z=0;z<1+kings;z++)s._v48Triggers.push(clone(tr))}}
 for(const b of s.board.monsters.filter((x:any)=>x.cardId==='orso_furioso')){b.tempPow=Number(b.tempPow||0)+4;log(s,'Orso Furioso ottiene +4 POW fino alla fine del turno per i due Mostri morti.')}
 promoteLocalTriggers(s);settleGameover(s);return s;
}
function expireTurnEffects(s:any,oldTurn:number){
 if(Number(s.turn)===oldTurn)return;
 const due=s._v59EndTurnHp||[];s._v59EndTurnHp=[];
 for(const x of due.filter((z:any)=>Number(z.turn)===oldTurn)){const c=champ(s,Number(x.player),String(x.champId));if(c&&!c.defeated)woundChampion(s,Number(x.player),c,String(x.source||'Furia della Natura'))}
 for(const p of [1,2]){const q=player(s,p);if(q){q._v59KillsTurn=Number(s.turn);q._v59Kills=0}for(const c of q?.champions||[]){if(c._v59ProvTurn!=null&&Number(c._v59ProvTurn)!==Number(s.turn)){c.provocazione=!!c._v59ProvPrev;delete c._v59ProvTurn;delete c._v59ProvPrev}}}
}
function trackBaseMonsterKills(s:any,p:number,beforeGraves:number[]){
 const after=[(player(s,1)?.monsterGrave||[]).length,(player(s,2)?.monsterGrave||[]).length],n=Math.max(0,after[0]-beforeGraves[0])+Math.max(0,after[1]-beforeGraves[1]);if(n)noteMonsterKill(s,p,n)
}
function guardiaCannotAttack(s:any,p:number,move:any){
 if(move?.type==='attack'&&String(move.champId||move.attacker?.champId||'')==='guardia_reale')throw new Error('Guardia Reale non può attaccare.');
 if(move?.type==='cast'&&String(move.cardId)==='pugno_in_faccia'&&String(move.targets?.supportId||'')==='guardia_reale')throw new Error('Guardia Reale non può attaccare.');
}
function combatSnapshot(s:any){
 const cb=s?.combat;if(!cb||cb.target?.type!=='champion')return null;const d=champ(s,Number(cb.target.player),String(cb.target.champId));if(d?.id!=='guardia_reale'||cb.cancelled)return null;
 return{key:`${cb.attacker?.player}:${cb.attacker?.champId}>${cb.target?.player}:${cb.target?.champId}`,attackerPlayer:Number(cb.attacker.player),attackerId:String(cb.attacker.champId),pow:currentChampionPow(s,Number(cb.target.player),d)};
}
function ensureCombatPriority(s:any){
 if(!s?.combat||s.pendingChoice||s.stack?.length||s.priority)return;
 const attacker=Number(s.combat.attacker?.player||s.combat.initiator);if(attacker!==1&&attacker!==2)return;
 s.priority=Number(s.combatPasses||0)>0?attacker:other(attacker);
}
function repairOrangePaymentLog(s:any,move:any){
 if(move?.type!=='cast'||CARD_DEFS?.[move.cardId]?.color!=='orange')return;
 for(let i=Math.max(0,(s.log||[]).length-6);i<(s.log||[]).length;i++)s.log[i]=String(s.log[i]).replace(/Animae? Blu/g,'Anime Arancioni').replace(/Anime Blu/g,'Anime Arancioni').replace(/Anima Blu/g,'Anima Arancione');
}

export function act(state:any,p0:any,move:any){
 const p=Number(p0);if(state?.pendingChoice?.type==='v59_offerta_second')return resolveOffertaChoice(state,p,move);
 ensureCombatPriority(state);
 guardiaCannotAttack(state,p,move);if(move?.type==='cast')validateCast(state,p,move);
 const oldTurn=Number(state?.turn||0),guard= combatSnapshot(state),beforeGraves=[(player(state,1)?.monsterGrave||[]).length,(player(state,2)?.monsterGrave||[]).length];
 const top=move?.type==='pass_priority'&&state?.stack?.length?clone(state.stack[state.stack.length-1]):null;
 const custom=((top?.kind==='card'&&CUSTOM_IDS.has(String(top.cardId)))||(top?.kind==='effect'&&String(top.effectId)==='v59_esercito'))?top:null;
 const killer=top?Number(top.actor):(state?.combat?Number(state.combat.attacker?.player):p);
 const out=(base.act as any)(state,p,move);
 repairOrangePaymentLog(state,move);
 payAdditionalCosts(state,p,move);
 trackBaseMonsterKills(state,killer,beforeGraves);
 if(custom&&!state.stack?.some((x:any)=>String(x.uid)===String(custom.uid)))resolveCard(state,custom);
 if(guard&&!state.combat&&state.status!=='gameover'){const a=champ(state,guard.attackerPlayer,guard.attackerId);if(a&&!a.defeated&&guard.pow>0){log(state,`Guardia Reale contrattacca con ${guard.pow} POW.`);damageChampion(state,guard.attackerPlayer,guard.attackerId,guard.pow,'Guardia Reale')}}
 expireTurnEffects(state,oldTurn);cleanupSupportDeaths(state);queueSnowAtNewTurn(state,oldTurn);promoteLocalTriggers(state);ensureCombatPriority(state);settleGameover(state);return out||state;
}

function targetName(s:any,t:any){if(!t)return'';if(t.type==='monster')return MONSTER_DEFS?.[monster(s,t.uid)?.cardId]?.name||'Mostro';return champ(s,Number(t.player),String(t.champId))?.name||'Campione'}
function targetSummary(s:any,item:any){
 const t=item?.targets||{},out:string[]=[];const add=(a:string,b:any)=>{if(b)out.push(`${a}${b}`)};
 add('Nemico: ',targetName(s,t.enemy));add('Campione: ',t.ownChamp&&champ(s,Number(item.actor),t.ownChamp)?.name);add('Campione nemico: ',targetName(s,t.enemyChampion));add('Mostro: ',t.monsterUid&&targetName(s,{type:'monster',uid:t.monsterUid}));add('Personaggio: ',targetName(s,t.character));add('Primo: ',targetName(s,t.championA));add('Secondo: ',targetName(s,t.championB));add('Supporto: ',t.supportId&&champ(s,Number(item.actor),t.supportId)?.name);return out.join(' • ');
}
export function publicView(state:any,p0:any){
 ensureCombatPriority(state);const p=Number(p0),v:any=(base.publicView as any)(state,p),raw=state?.stack||[];ensureCombatPriority(state);v.priority=state.priority;
 for(const shown of v?.stack||[]){const item=raw.find((x:any)=>String(x.uid)===String(shown.uid));const summary=targetSummary(state,item);if(summary)shown.targetSummary=summary}
 for(const z of [1,2]){const q=v?.players?.[String(z)];if(!q)continue;delete q._v59KillsTurn;delete q._v59Kills}
 delete v._v59EndTurnHp;delete v._v59Snow;return v;
}
