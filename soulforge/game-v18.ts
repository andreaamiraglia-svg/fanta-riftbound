export const CARD_DEFS:any = {
  taglio_fiammante:{id:'taglio_fiammante',name:'Taglio Fiammante',color:'red',cost:0,speed:'response',type:'Magia',text:'Durante un combattimento, infliggi 1 danno al Campione attaccante.',effect:'taglio'},
  sfera_incandescente:{id:'sfera_incandescente',name:'Sfera Incandescente',color:'red',cost:0,speed:'base',type:'Magia',text:'Infliggi 1 danno a un nemico e 1 danno a un tuo Campione.',effect:'sfera'},
  corazza_esplosiva:{id:'corazza_esplosiva',name:'Corazza Esplosiva',color:'red',cost:0,speed:'instant',type:'Magia',text:'Infliggi 1 danno a un tuo Campione. Poi ottiene +1 POW fino alla fine del turno.',effect:'corazza'},
  occhio_di_drago:{id:'occhio_di_drago',name:'Occhio di Drago',color:'red',cost:0,speed:'response',type:'Magia',text:'Metti 5 carte dal tuo mazzo nel Cimitero. Un tuo Campione ottiene +1 POW fino alla fine del turno.',effect:'occhio'},
  mano_del_caos:{id:'mano_del_caos',name:'Mano del Caos',color:'red',cost:1,speed:'base',type:'Magia',text:'Scarta la tua mano. Un tuo Campione ottiene +1 POW per ogni carta scartata fino alla fine del turno.',effect:'mano'},
  nube_di_fuoco:{id:'nube_di_fuoco',name:'Nube di Fuoco',color:'red',cost:1,speed:'base',type:'Magia',text:'Fino alla fine del turno, le tue Magie infliggono 1 danno aggiuntivo.',effect:'nube'},
  tornado_bollente:{id:'tornado_bollente',name:'Tornado Bollente',color:'red',cost:1,speed:'base',type:'Magia',text:'Infliggi 1 danno a ogni Campione e a ogni Mostro.',effect:'tornado'},
  fendente_di_fuoco:{id:'fendente_di_fuoco',name:'Fendente di Fuoco',color:'red',cost:1,speed:'base',type:'Magia',text:'Infliggi 2 danni ad un Nemico.',effect:'fendente'},
  berserk:{id:'berserk',name:'Berserk',color:'red',cost:2,speed:'instant',type:'Magia',text:'Attiva un tuo Campione danneggiato e forniscigli +2 POW.',effect:'berserk'},

  stupido:{id:'stupido',name:'Stupido',color:'green',cost:0,speed:'instant',type:'Magia',text:'Infliggi 1 danno a un Mostro.',effect:'stupido'},
  riflesso:{id:'riflesso',name:'Riflesso',color:'green',cost:0,speed:'instant',type:'Magia',text:'Scegli un tuo Campione. Infliggi a un Mostro danni pari ai danni attualmente subiti da quel Campione.',effect:'riflesso'},
  tutto_per_la_festa:{id:'tutto_per_la_festa',name:'Tutto per la Festa',color:'green',cost:0,speed:'base',type:'Magia',text:'Guarda le prime 3 carte del tuo Monster Deck. Puoi scartarne quante ne vuoi. Rimetti le altre in cima nell’ordine che preferisci.',effect:'festa'},
  taglio_ninjitsu:{id:'taglio_ninjitsu',name:'Tecnica del Taglio Ninjitsu',color:'green',cost:0,speed:'base',type:'Magia',text:'Infliggi 2 danni a un Mostro.',effect:'taglio_ninjitsu'},
  doppia_katana:{id:'doppia_katana',name:'Doppia Katana',color:'green',cost:1,speed:'base',type:'Magia',text:'Attiva un tuo Campione.',effect:'katana'},
  alta_marea:{id:'alta_marea',name:'Alta Marea',color:'green',cost:1,speed:'instant',type:'Magia',text:'Scegli un tuo Campione in combattimento. Annulla il combattimento che lo coinvolge.',effect:'marea'},
  albero_della_vita:{id:'albero_della_vita',name:'Albero della Vita',color:'green',cost:1,speed:'instant',type:'Supporto',text:'Un tuo Campione ottiene +2 POW fino alla fine del turno.',effect:'albero'},
  sguardo_ninjitsu:{id:'sguardo_ninjitsu',name:'Tecnica dello Sguardo Ninjitsu',color:'green',cost:1,speed:'instant',type:'Magia',text:'Uccidi un Mostro.',effect:'sguardo'},
  mille_lame:{id:'mille_lame',name:'Tecnica delle Mille Lame Ninjitsu',color:'green',cost:12,speed:'instant',type:'Magia',text:'Costa 1 Anima Verde in meno per ogni Mostro nel tuo Cimitero. Un tuo Campione ottiene +4 POW fino alla fine del turno.',effect:'mille'},

  evocatore_anime_vacue:{id:'evocatore_anime_vacue',name:'Evocatore di Anime Vacue',color:'black',cost:0,speed:'base',type:'Magia',text:'Scegli un Mostro con 2 POW o meno nel tuo Cimitero e mettilo in gioco sotto il tuo controllo.',effect:'evocatore_anime_vacue'},
  anima_esplosiva:{id:'anima_esplosiva',name:'Anima Esplosiva',color:'black',cost:0,speed:'base',type:'Magia',text:'Scegli un Mostro. Alla fine del turno, uccidi quel Mostro.',effect:'anima_esplosiva'},
  sacrificio:{id:'sacrificio',name:'Sacrificio',color:'black',cost:0,speed:'instant',type:'Magia',text:'Uccidi un Mostro sotto il tuo controllo. Non ottieni Anime per la sua morte.',effect:'sacrificio'},
  collasso:{id:'collasso',name:'Collasso',color:'black',cost:0,speed:'response',type:'Magia',text:'Consuma tutte le tue Anime. Scegli un tuo Campione: ottiene +1 POW per ogni Anima consumata fino alla fine del turno.',effect:'collasso'},
  spacca_ossa:{id:'spacca_ossa',name:'Spacca Ossa',color:'black',cost:1,speed:'response',type:'Magia',text:'Uccidi un Mostro. Poi mettilo in gioco sotto il tuo controllo.',effect:'spacca_ossa'},
  eclipse_fang:{id:'eclipse_fang',name:'Eclipse Fang',color:'black',cost:1,speed:'base',type:'Magia',text:'Infliggi 1 danno a un nemico. Se questo danno gli infligge una Ferita o lo uccide, ottieni 2 Anime Nere.',effect:'eclipse_fang'},
  fino_alla_morte:{id:'fino_alla_morte',name:'Fino alla Morte',color:'black',cost:1,speed:'instant',type:'Magia',text:'Scegli un tuo Campione. Bandisci tutti i Mostri dal tuo Cimitero. Quel Campione ottiene +1 POW per ogni Mostro bandito in questo modo fino alla fine del turno. Non può attaccare fino alla fine del turno.',effect:'fino_alla_morte'},
  mietitore:{id:'mietitore',name:'Mietitore',color:'black',cost:2,speed:'base',type:'Supporto',text:'Uccidi tutti i Mostri con 2 POW o meno.',effect:'mietitore'},
  ammazza_morte:{id:'ammazza_morte',name:'Ammazza Morte',color:'black',cost:3,speed:'response',type:'Magia',text:'Infliggi 1 Ferita a un Campione.',effect:'ammazza_morte'},
};

export const MONSTER_DEFS:any = {
  lucertola_fuoco:{id:'lucertola_fuoco',name:'Lucertola di fuoco',color:'red',pow:3,text:''},
  segugio_infernale:{id:'segugio_infernale',name:'Segugio Infernale',color:'red',pow:3,text:'Quando questo Mostro entra in gioco, infligge 1 danno a ogni Mostro adiacente.'},
  fenice_cremisi:{id:'fenice_cremisi',name:'Fenice Cremisi',color:'red',pow:3,text:'Puoi pagare 1 Anima per giocare questo Mostro dal Cimitero.'},
  golem_magmatico:{id:'golem_magmatico',name:'Golem Magmatico',color:'red',pow:3,text:'Quando entra in gioco infligge 1 danno a tutti i Campioni.'},
  drago_delle_ceneri:{id:'drago_delle_ceneri',name:'Drago delle Ceneri',color:'red',pow:4,text:'Quando entra in gioco, infligge 1 danno a tutti gli altri Mostri.'},
  salamandra_vulcanica:{id:'salamandra_vulcanica',name:'Salamandra Vulcanica',color:'red',pow:5,text:'Ogni volta che un Campione attacca, questa perde 1 POW fino alla fine del turno.'},
  ragno_dei_germogli:{id:'ragno_dei_germogli',name:'Ragno dei Germogli',color:'green',pow:2,text:'Finché questo Mostro è in gioco, le Magie costano 1 Anima in più.'},
  serpente_della_giungla:{id:'serpente_della_giungla',name:'Serpente della Giungla',color:'green',pow:3,text:'Lascito — L’avversario perde 1 Anima a tua scelta.',lascito:'serpente'},
  lupo_delle_radici:{id:'lupo_delle_radici',name:'Lupo delle Radici',color:'green',pow:3,text:'Tutti gli altri Mostri hanno +1 POW.'},
  cervo_antico:{id:'cervo_antico',name:'Cervo Antico',color:'green',pow:3,text:'Quando un Mostro subisce 1 danno, ottiene +1 POW per questo turno.'},
  guardiano_della_foresta:{id:'guardiano_della_foresta',name:'Guardiano della Foresta',color:'green',pow:4,text:'Provocazione — Deve essere scelto come difensore, se possibile.',provocazione:true},
  orso_furioso:{id:'orso_furioso',name:'Orso Furioso',color:'green',pow:2,text:'Ogni volta che muore un altro Mostro, questo ottiene +2 POW fino alla fine del turno.'},

  segugio_dei_morti:{id:'segugio_dei_morti',name:'Segugio dei Morti',color:'black',pow:2,text:'Lascito — Infliggi 1 danno a un Campione nemico.',lascito:'segugio_morti'},
  custode_sepolcrale:{id:'custode_sepolcrale',name:'Custode Sepolcrale',color:'black',pow:2,text:'Lascito — I tuoi Campioni ottengono +1 POW fino alla fine del turno.',lascito:'custode'},
  cavaliere_senza_volto:{id:'cavaliere_senza_volto',name:'Cavaliere Senza Volto',color:'black',pow:3,text:'Lascito — Infliggi 2 danni a un Campione nemico.',lascito:'cavaliere'},
  cerbero:{id:'cerbero',name:'Cerbero',color:'black',pow:3,text:'Quando questo Mostro entra in gioco, evoca un Mostro con 2 POW dal tuo Cimitero.'},
  re_dei_non_morti:{id:'re_dei_non_morti',name:'Re dei non morti',color:'black',pow:4,text:'Gli effetti con Lascito si attivano una volta aggiuntiva.'},
  divoratore_di_anime_mostro:{id:'divoratore_di_anime_mostro',name:'Divoratore di Anime',color:'black',pow:5,text:'Quando entra in gioco, uccide i Mostri adiacenti. Lascito — Fornisce le Anime dei Mostri che ha ucciso.',lascito:'divoratore'},
};


export const CHAMPION_DEFS:any = {
  kael:{id:'kael',name:'Kael Infuocato',color:'red',basePow:3,hp:3},
  lyrandel:{id:'lyrandel',name:'Lyrandel Spirito della Natura',color:'green',basePow:3,hp:3},
  divoratore_campione:{id:'divoratore_campione',name:'Il Divoratore di Anime',color:'black',basePow:2,hp:4},
};

export const DECK_RULES={champions:2,cards:18,monsters:12,maxColors:2};

export const STARTER_DECK=Object.keys(CARD_DEFS);
export const STARTER_MONSTERS=Object.keys(MONSTER_DEFS);
const clone=(x:any)=>JSON.parse(JSON.stringify(x));
export const other=(p:number)=>p===1?2:1;
export const shuffle=(arr:any[])=>{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a};
const pl=(s:any,p:number)=>s.players[String(p)];
const champ=(s:any,p:number,id:string)=>pl(s,p)?.champions?.find((c:any)=>c.id===id);
const monster=(s:any,uid:string)=>s.board.monsters.find((m:any)=>m.uid===uid);
const log=(s:any,msg:string)=>{s.log.push(msg);if(s.log.length>160)s.log=s.log.slice(-160)};
const colorLabel=(c:string)=>c==='red'?'Rossa':c==='green'?'Verde':'Nera';

function defaultDeckConfig(){
 const colors=['red','green'];
 return {champions:['kael','lyrandel'],cards:Object.values(CARD_DEFS).filter((x:any)=>colors.includes(x.color)).map((x:any)=>x.id),monsters:Object.values(MONSTER_DEFS).filter((x:any)=>colors.includes(x.color)).map((x:any)=>x.id)};
}
function uniqueStrings(v:any){return [...new Set((Array.isArray(v)?v:[]).map((x:any)=>String(x)))] as string[]}
export function validateDeckConfig(input:any){
 const raw=input&&typeof input==='object'?input:defaultDeckConfig();
 const champions=uniqueStrings(raw.champions),cards=uniqueStrings(raw.cards),monsters=uniqueStrings(raw.monsters);
 if(champions.length!==DECK_RULES.champions)throw new Error(`Il mazzo deve avere ${DECK_RULES.champions} Campioni diversi.`);
 if(cards.length!==DECK_RULES.cards)throw new Error(`Il mazzo deve avere ${DECK_RULES.cards} carte base tutte diverse.`);
 if(monsters.length!==DECK_RULES.monsters)throw new Error(`Il Monster Deck deve avere ${DECK_RULES.monsters} Mostri tutti diversi.`);
 if(champions.some(id=>!CHAMPION_DEFS[id]))throw new Error('Il mazzo contiene un Campione non valido.');
 if(cards.some(id=>!CARD_DEFS[id]))throw new Error('Il mazzo contiene una carta base non valida.');
 if(monsters.some(id=>!MONSTER_DEFS[id]))throw new Error('Il Monster Deck contiene un Mostro non valido.');
 const championColors=[...new Set(champions.map(id=>CHAMPION_DEFS[id].color))] as string[];
 const colors=[...new Set([...championColors,...cards.map(id=>CARD_DEFS[id].color),...monsters.map(id=>MONSTER_DEFS[id].color)])] as string[];
 if(colors.length>DECK_RULES.maxColors)throw new Error(`Puoi giocare al massimo ${DECK_RULES.maxColors} colori diversi.`);
 if(cards.some(id=>!championColors.includes(CARD_DEFS[id].color))||monsters.some(id=>!championColors.includes(MONSTER_DEFS[id].color)))throw new Error('Carte e Mostri devono appartenere ai colori dei Campioni scelti.');
 return {champions,cards,monsters,colors:championColors};
}
function freshChampion(id:string){const d=CHAMPION_DEFS[id];return {...d,wounds:0,damage:0,tempPow:0,tapped:false,defeated:false,cantAttackTurn:null}}
export function newPlayer(name:string,deckConfig?:any){
 const cfg=validateDeckConfig(deckConfig);const souls:any={red:0,green:0,black:0};for(const c of cfg.colors)souls[c]=3;
 return {name,souls,recycleCount:0,deckColors:[...cfg.colors],champions:cfg.champions.map(freshChampion),
  deck:shuffle(cfg.cards),grave:[],hand:[],selected:false,monsterDeck:shuffle(cfg.monsters),monsterGrave:[],banishedMonsters:[],
  fireCloud:false,lyrandelUsed:false,firstMagicCast:false,killedMonsterThisTurn:false};
}
export function newState(name:string,deckConfig?:any){return {status:'waiting',turn:1,focus:1,priority:null,priorityPasses:0,mainPasses:0,stack:[],stackInitiator:null,combat:null,pendingChoice:null,winner:null,players:{'1':newPlayer(name,deckConfig),'2':null},board:{monsters:[]},triggerQueue:[],enterQueue:[],delayedKills:[],endTurnPending:false,log:[`Partita creata da ${name}.`]};}

export function currentPow(s:any,p:number,c:any){let v=(c?.basePow||0)+(c?.tempPow||0);if(c?.id==='kael'&&pl(s,p)?.hand?.length===0&&s.status==='main')v+=3;return Math.max(0,v)}
export function currentMonsterPow(s:any,m:any){const d=MONSTER_DEFS[m?.cardId];if(!d)return 0;let v=d.pow+(m.tempPow||0);v+=(s.board.monsters||[]).filter((x:any)=>x.cardId==='lupo_delle_radici'&&x.uid!==m.uid).length;return Math.max(0,v)}
function dynamicCost(s:any,p:number,c:any){let cost=c.id==='mille_lame'?Math.max(0,12-(pl(s,p)?.monsterGrave?.length||0)):c.cost;if(c.type==='Magia')cost+=(s.board.monsters||[]).filter((m:any)=>m.cardId==='ragno_dei_germogli').length;return Math.max(0,cost)}
function canPay(s:any,p:number,c:any){return (pl(s,p)?.souls?.[c.color]||0)>=dynamicCost(s,p,c)}
function pay(s:any,p:number,c:any){const n=dynamicCost(s,p,c);pl(s,p).souls[c.color]-=n;return n}
function gainSoul(s:any,p:number,color:string,n=1){if(p!==1&&p!==2)return;const q=pl(s,p);if(!q||!['red','green','black'].includes(color))return;const before=q.souls[color]||0;q.souls[color]=Math.min(3,before+n);const got=q.souls[color]-before;if(got>0)log(s,`${q.name} recupera ${got} Anima${got===1?'':'e'} ${colorLabel(color)}${got===1?'':'e'}.`)}
function checkWinner(s:any){for(const p of [1,2]){const q=pl(s,p);if(q&&q.champions.every((c:any)=>c.defeated)){s.status='gameover';s.winner=other(p);log(s,`${pl(s,other(p)).name} vince la partita!`)}}}
function woundChampion(s:any,p:number,c:any,source=''){if(!c||c.defeated)return;c.wounds++;c.damage=0;log(s,`${c.name} subisce una Ferita (${c.wounds}/${c.hp})${source?` da ${source}`:''}.`);if(c.wounds>=c.hp){c.defeated=true;c.tapped=true;log(s,`${c.name} è sconfitto.`);checkWinner(s)}}
export function damageChampion(s:any,p:number,id:string,n:number,source=''){const c=champ(s,p,id);if(!c||c.defeated||n<=0)return{wounded:false};c.damage+=n;log(s,`${c.name} subisce ${n} dann${n===1?'o':'i'} (${c.damage}/${currentPow(s,p,c)}).`);if(c.damage>=currentPow(s,p,c)){woundChampion(s,p,c,source);return{wounded:true}}return{wounded:false}}

function beginDamageEvent(s:any,p:number|null){s._damageEvent=(p===1||p===2)?{player:p,uids:[]} : null}
function recordLyrandel(s:any,p:number|null,uid:string,n:number,allow=true){if(!allow||n!==1||(p!==1&&p!==2))return;const e=s._damageEvent;if(e&&e.player===p&&!e.uids.includes(uid))e.uids.push(uid)}
function endDamageEvent(s:any){const e=s._damageEvent;delete s._damageEvent;if(!e?.uids?.length)return;const q=pl(s,e.player),lyr=champ(s,e.player,'lyrandel');if(!q||q.lyrandelUsed||!lyr||lyr.defeated)return;const ids=e.uids.filter((uid:string)=>!!monster(s,uid));if(!ids.length)return;q.lyrandelUsed=true;s.triggerQueue.push({actor:e.player,sourceCardId:'lyrandel',effectId:'lyrandel_bonus',choiceType:'monsterUids',meta:{uids:ids},effectName:'Effetto di Lyrandel'});log(s,`${lyr.name} attiva la sua abilità.`)}

function applyMonsterDamage(s:any,m:any,n:number){if(!m||n<=0)return false;m.damage+=n;if(n===1){const deer=(s.board.monsters||[]).filter((x:any)=>x.cardId==='cervo_antico').length;if(deer){m.tempPow=(m.tempPow||0)+deer;log(s,`${MONSTER_DEFS[m.cardId]?.name||m.cardId} ottiene +${deer} POW dal Cervo Antico fino alla fine del turno.`)}}log(s,`${MONSTER_DEFS[m.cardId]?.name||m.cardId} subisce ${n} dann${n===1?'o':'i'} (${m.damage}/${currentMonsterPow(s,m)}).`);return m.damage>=currentMonsterPow(s,m)}
export function damageMonster(s:any,p:number|null,uid:string,n:number,source='',allowLyrandel=true){const m=monster(s,uid);if(!m||n<=0)return{died:false};recordLyrandel(s,p,uid,n,allowLyrandel);if(applyMonsterDamage(s,m,n)){killMonster(s,p,m,source,true);return{died:true}}return{died:false}}

function kingsInPlay(s:any){return (s.board.monsters||[]).filter((m:any)=>m.cardId==='re_dei_non_morti').length}
function lascitoDescriptor(m:any,owner:number){const d=MONSTER_DEFS[m.cardId];if(!d?.lascito)return null;switch(d.lascito){
 case'segugio_morti':return {actor:owner,sourceCardId:m.cardId,effectId:'lascito_segugio',choiceType:'enemyChampion',effectName:`Lascito — ${d.name}`};
 case'custode':return {actor:owner,sourceCardId:m.cardId,effectId:'lascito_custode',effectName:`Lascito — ${d.name}`};
 case'cavaliere':return {actor:owner,sourceCardId:m.cardId,effectId:'lascito_cavaliere',choiceType:'enemyChampion',effectName:`Lascito — ${d.name}`};
 case'serpente':return {actor:owner,sourceCardId:m.cardId,effectId:'lascito_serpente',choiceType:'enemySoul',effectName:`Lascito — ${d.name}`};
 case'divoratore':return {actor:owner,sourceCardId:m.cardId,effectId:'lascito_divoratore',meta:{colors:[...(m.devouredColors||[])]},effectName:`Lascito — ${d.name}`};
 }
 return null;
}
function enqueueLascito(s:any,m:any,kingCount:number){const x=lascitoDescriptor(m,m.owner);if(!x)return;const count=1+kingCount;for(let i=0;i<count;i++)s.triggerQueue.push(clone(x));log(s,`${MONSTER_DEFS[m.cardId].name}: Lascito entra in Catena${count>1?` (${count} attivazioni)`:''}.`)}
export function killMonster(s:any,killer:number|null,m:any,reason='',grantSoul=true,kingOverride?:number){const i=s.board.monsters.findIndex((x:any)=>x.uid===m.uid);if(i<0)return;const kings=kingOverride??kingsInPlay(s);const dead=clone(m);s.board.monsters.splice(i,1);pl(s,dead.owner)?.monsterGrave.push(dead.cardId);log(s,`${MONSTER_DEFS[dead.cardId]?.name||dead.cardId} viene sconfitto${reason?` da ${reason}`:''}.`);if(killer===1||killer===2){pl(s,killer).killedMonsterThisTurn=true;if(grantSoul)gainSoul(s,killer,MONSTER_DEFS[dead.cardId]?.color,1)}for(const b of s.board.monsters.filter((x:any)=>x.cardId==='orso_furioso')){b.tempPow=(b.tempPow||0)+2;log(s,'Orso Furioso ottiene +2 POW fino alla fine del turno.')}enqueueLascito(s,dead,kings)}
function killMany(s:any,items:any[],killer:number|null,reason='',grantSoul=true){const kings=kingsInPlay(s);for(const x of [...items]){const m=monster(s,x.uid);if(m)killMonster(s,killer,m,reason,grantSoul,kings)}}

function addMonsterToBoard(s:any,cardId:string,owner:number,front=false,extra:any={}){const m={uid:crypto.randomUUID(),cardId,owner,damage:0,tempPow:0,...extra};if(front)s.board.monsters.unshift(m);else s.board.monsters.push(m);s.enterQueue.push(m.uid);return m}
function reviveFromGrave(s:any,p:number,cardId:string){const q=pl(s,p),i=q.monsterGrave.indexOf(cardId);if(i<0)return null;q.monsterGrave.splice(i,1);const m=addMonsterToBoard(s,cardId,p);log(s,`${q.name} mette ${MONSTER_DEFS[cardId].name} in gioco dal Cimitero.`);return m}
function processMonsterEnter(s:any,m:any){if(!m||!monster(s,m.uid))return;
 if(m.cardId==='segugio_infernale'){const i=s.board.monsters.findIndex((x:any)=>x.uid===m.uid),ids=[s.board.monsters[i-1]?.uid,s.board.monsters[i+1]?.uid].filter(Boolean);beginDamageEvent(s,null);for(const uid of ids)if(monster(s,uid))damageMonster(s,null,uid,1,'Segugio Infernale',false);endDamageEvent(s)}
 else if(m.cardId==='drago_delle_ceneri'){beginDamageEvent(s,null);for(const uid of s.board.monsters.filter((x:any)=>x.uid!==m.uid).map((x:any)=>x.uid))if(monster(s,uid))damageMonster(s,null,uid,1,'Drago delle Ceneri',false);endDamageEvent(s)}
 else if(m.cardId==='golem_magmatico'){for(const p of [1,2])for(const c of pl(s,p)?.champions||[])if(!c.defeated)damageChampion(s,p,c.id,1,'Golem Magmatico');log(s,'Golem Magmatico entra in gioco e infligge 1 danno a tutti i Campioni.')}
 else if(m.cardId==='cerbero'){const opts=(pl(s,m.owner)?.monsterGrave||[]).filter((id:string)=>MONSTER_DEFS[id]&&MONSTER_DEFS[id].pow===2);if(opts.length){s.pendingChoice={type:'cerbero',player:m.owner,monsterUid:m.uid,cardIds:[...new Set(opts)]};log(s,`${MONSTER_DEFS[m.cardId].name}: scegli un Mostro con 2 POW dal Cimitero.`);}}
 else if(m.cardId==='divoratore_di_anime_mostro'){const i=s.board.monsters.findIndex((x:any)=>x.uid===m.uid);const victims=[s.board.monsters[i-1],s.board.monsters[i+1]].filter(Boolean).filter((x:any)=>x.uid!==m.uid);m.devouredColors=[];for(const v0 of victims){const v=monster(s,v0.uid);if(!v)continue;m.devouredColors.push(MONSTER_DEFS[v.cardId]?.color);killMonster(s,m.owner,v,'Divoratore di Anime',false);}if(victims.length)log(s,`Divoratore di Anime divora ${victims.length} Mostr${victims.length===1?'o':'i'}.`)}
}
function processEnterQueue(s:any){while(!s.pendingChoice&&s.enterQueue.length){const uid=s.enterQueue.shift(),m=monster(s,uid);if(m)processMonsterEnter(s,m)}}

function addMonstersForTurn(s:any){const amount=s.turn===1?1:2;for(const p of [1,2]){const q=pl(s,p);for(let i=0;i<amount&&q.monsterDeck.length;i++){const id=q.monsterDeck.shift();const m=addMonsterToBoard(s,id,p);log(s,`${q.name} rivela ${MONSTER_DEFS[id].name}.`)}}processEnterQueue(s)}
function startMainIfReady(s:any){if(pl(s,1)?.selected&&pl(s,2)?.selected){s.status='main';s.focus=s.turn%2?1:2;s.priority=null;s.mainPasses=0;s.stack=[];s.stackInitiator=null;s.combat=null;addMonstersForTurn(s);if(!s.pendingChoice)prepareTriggers(s);log(s,`Inizia il turno ${s.turn}. Il Focus è di ${pl(s,s.focus).name}.`)}}

function validEnemyTarget(s:any,p:number,t:any){if(t?.type==='champion'){const c=champ(s,t.player,t.champId);return t.player===other(p)&&!!c&&!c.defeated}if(t?.type==='monster')return !!monster(s,t.uid);return false}
function provocationsAgainst(s:any,p:number){const op=other(p);const ms=s.board.monsters.filter((m:any)=>m.owner===op&&MONSTER_DEFS[m.cardId]?.provocazione).map((m:any)=>({type:'monster',uid:m.uid}));const cs=(pl(s,op)?.champions||[]).filter((c:any)=>!c.defeated&&c.provocazione).map((c:any)=>({type:'champion',player:op,champId:c.id}));return [...ms,...cs]}
function validateAttackTarget(s:any,p:number,t:any){const guards=provocationsAgainst(s,p);if(guards.length){return guards.some((g:any)=>g.type===t?.type&&(g.type==='monster'?g.uid===t?.uid:(g.player===t?.player&&g.champId===t?.champId)))}return validEnemyTarget(s,p,t)}

function spellDamage(s:any,p:number,n:number){return n+(pl(s,p).fireCloud?1:0)}
function resolveCardEffect(s:any,item:any){const p=item.actor,q=pl(s,p),c=CARD_DEFS[item.cardId],t=item.targets||{};log(s,`Si risolve ${c.name}.`);let pause=false;
 switch(c.effect){
  case'taglio':if(s.combat){const a=s.combat.attacker;damageChampion(s,a.player,a.champId,spellDamage(s,p,1),c.name)}break;
  case'sfera':{const d=spellDamage(s,p,1);if(t.enemy?.type==='champion')damageChampion(s,t.enemy.player,t.enemy.champId,d,c.name);else if(t.enemy?.type==='monster'){beginDamageEvent(s,p);damageMonster(s,p,t.enemy.uid,d,c.name,true);endDamageEvent(s)}damageChampion(s,p,t.ownChamp,d,c.name);break}
  case'corazza':{damageChampion(s,p,t.ownChamp,spellDamage(s,p,1),c.name);const x=champ(s,p,t.ownChamp);if(x&&!x.defeated){x.tempPow++;log(s,`${x.name} ottiene +1 POW fino alla fine del turno.`)}break}
  case'occhio':{const n=Math.min(5,q.deck.length);q.grave.push(...q.deck.splice(0,n));const x=champ(s,p,t.ownChamp);if(x&&!x.defeated){x.tempPow++;log(s,`${q.name} mette ${n} carte dal mazzo nel Cimitero. ${x.name} ottiene +1 POW fino alla fine del turno.`)}break}
  case'mano':{const ids=q.hand.filter((id:string)=>id!==item.cardId),n=ids.length;q.grave.push(...ids);q.hand=q.hand.filter((id:string)=>!ids.includes(id));const x=champ(s,p,t.ownChamp);if(x&&!x.defeated){x.tempPow+=n;log(s,`${q.name} scarta ${n} carte. ${x.name} ottiene +${n} POW.`)}break}
  case'nube':q.fireCloud=true;log(s,`Le Magie di ${q.name} infliggono +1 danno fino alla fine del turno.`);break;
  case'tornado':{const d=spellDamage(s,p,1);for(const z of [1,2])for(const x of pl(s,z).champions.filter((x:any)=>!x.defeated))damageChampion(s,z,x.id,d,c.name);beginDamageEvent(s,p);for(const m0 of [...s.board.monsters])if(monster(s,m0.uid))damageMonster(s,p,m0.uid,d,c.name,true);endDamageEvent(s);break}
  case'fendente':{const d=spellDamage(s,p,2);if(t.enemy?.type==='champion')damageChampion(s,t.enemy.player,t.enemy.champId,d,c.name);else if(t.enemy?.type==='monster'){beginDamageEvent(s,p);damageMonster(s,p,t.enemy.uid,d,c.name,true);endDamageEvent(s)}break}
  case'berserk':{const x=champ(s,p,t.ownChamp);if(x&&!x.defeated&&x.damage>0){x.tempPow+=2;x.tapped=false;log(s,`${x.name} viene attivato da Berserk e ottiene +2 POW.`)}break}
  case'stupido':beginDamageEvent(s,p);damageMonster(s,p,t.monsterUid,spellDamage(s,p,1),c.name,true);endDamageEvent(s);break;
  case'riflesso':{const x=champ(s,p,t.ownChamp);if(x&&!x.defeated){beginDamageEvent(s,p);damageMonster(s,p,t.monsterUid,spellDamage(s,p,x.damage),c.name,true);endDamageEvent(s)}break}
  case'festa':{const top=q.monsterDeck.slice(0,3);s.pendingChoice={type:'festa',player:p,top};log(s,`${q.name} guarda le prime ${top.length} carte del proprio Monster Deck.`);pause=true;break}
  case'taglio_ninjitsu':beginDamageEvent(s,p);damageMonster(s,p,t.monsterUid,spellDamage(s,p,2),c.name,true);endDamageEvent(s);break;
  case'katana':{const x=champ(s,p,t.ownChamp);if(x&&!x.defeated){x.tapped=false;log(s,`${x.name} diventa attivo.`)}break}
  case'marea':if(s.combat){const involved=(s.combat.attacker.player===p&&s.combat.attacker.champId===t.ownChamp)||(s.combat.target.type==='champion'&&s.combat.target.player===p&&s.combat.target.champId===t.ownChamp);if(involved){s.combat.cancelled=true;log(s,'Alta Marea annulla il combattimento.')}}break;
  case'albero':{const x=champ(s,p,t.ownChamp);if(x&&!x.defeated){x.tempPow+=2;log(s,`${x.name} ottiene +2 POW fino alla fine del turno.`)}break}
  case'sguardo':{const m=monster(s,t.monsterUid);if(m)killMonster(s,p,m,c.name,true);break}
  case'mille':{const x=champ(s,p,t.ownChamp);if(x&&!x.defeated){x.tempPow+=4;log(s,`${x.name} ottiene +4 POW fino alla fine del turno.`)}break}

  case'evocatore_anime_vacue':{const id=String(t.graveMonsterId||'');if(id&&q.monsterGrave.includes(id)&&MONSTER_DEFS[id]?.pow<=2){reviveFromGrave(s,p,id);processEnterQueue(s);if(s.pendingChoice)pause=true}break}
  case'anima_esplosiva':if(monster(s,t.monsterUid)){s.delayedKills.push({uid:t.monsterUid,killer:p});log(s,`${MONSTER_DEFS[monster(s,t.monsterUid).cardId].name} verrà ucciso alla fine del turno.`)}break;
  case'sacrificio':{const m=monster(s,t.monsterUid);if(m&&m.owner===p)killMonster(s,p,m,c.name,false);break}
  case'collasso':{const n=(q.souls.red||0)+(q.souls.green||0)+(q.souls.black||0);q.souls.red=0;q.souls.green=0;q.souls.black=0;const x=champ(s,p,t.ownChamp);if(x&&!x.defeated){x.tempPow+=n;log(s,`${x.name} ottiene +${n} POW consumando tutte le Anime.`)}break}
  case'spacca_ossa':{const m=monster(s,t.monsterUid);if(m){const id=m.cardId;killMonster(s,p,m,c.name,true);const ownerGraves=[1,2].map(z=>pl(s,z)).filter(Boolean);for(const g of ownerGraves){const i=g.monsterGrave.lastIndexOf(id);if(i>=0){g.monsterGrave.splice(i,1);break}}const n=addMonsterToBoard(s,id,p);log(s,`${MONSTER_DEFS[id].name} torna in gioco sotto il controllo di ${q.name}.`);processEnterQueue(s);if(s.pendingChoice)pause=true}break}
  case'eclipse_fang':{let success=false;if(t.enemy?.type==='champion'){const r=damageChampion(s,t.enemy.player,t.enemy.champId,spellDamage(s,p,1),c.name);success=r.wounded}else if(t.enemy?.type==='monster'){const before=!!monster(s,t.enemy.uid);beginDamageEvent(s,p);const r=damageMonster(s,p,t.enemy.uid,spellDamage(s,p,1),c.name,true);endDamageEvent(s);success=before&&r.died}if(success)gainSoul(s,p,'black',2);break}
  case'fino_alla_morte':{const n=q.monsterGrave.length;q.banishedMonsters.push(...q.monsterGrave);q.monsterGrave=[];const x=champ(s,p,t.ownChamp);if(x&&!x.defeated){x.tempPow+=n;x.cantAttackTurn=s.turn;log(s,`${x.name} ottiene +${n} POW e non può attaccare fino alla fine del turno.`)}break}
  case'mietitore':{const victims=s.board.monsters.filter((m:any)=>currentMonsterPow(s,m)<=2);killMany(s,victims,p,c.name,true);break}
  case'ammazza_morte':{const x=champ(s,t.champion?.player,t.champion?.champId);if(x&&!x.defeated)woundChampion(s,t.champion.player,x,c.name);break}
 }
 return pause;
}

function effectChoices(s:any,tr:any){if(tr.choiceType==='enemyChampion')return pl(s,other(tr.actor)).champions.filter((c:any)=>!c.defeated).map((c:any)=>({id:c.id,label:c.name}));if(tr.choiceType==='enemySoul'){const o=pl(s,other(tr.actor));return ['red','green','black'].filter(c=>(o.souls[c]||0)>0).map(c=>({id:c,label:`Anima ${colorLabel(c)}`}));}
 if(tr.choiceType==='monsterUids')return (tr.meta?.uids||[]).filter((uid:string)=>!!monster(s,uid)).map((uid:string)=>({id:uid,label:MONSTER_DEFS[monster(s,uid).cardId]?.name||uid}));return[]}
function pushEffect(s:any,tr:any,choice?:string){const targets:any={};if(tr.choiceType==='enemyChampion')targets.champion={player:other(tr.actor),champId:choice};if(tr.choiceType==='enemySoul')targets.color=choice;if(tr.choiceType==='monsterUids')targets.monsterUid=choice;s.stack.push({kind:'effect',actor:tr.actor,sourceCardId:tr.sourceCardId,effectId:tr.effectId,effectName:tr.effectName||'Effetto',targets,meta:tr.meta||{}})}
function prepareTriggers(s:any){if(s.pendingChoice)return;while(s.triggerQueue.length){const tr=s.triggerQueue.shift();const opts=effectChoices(s,tr);if(tr.choiceType){if(!opts.length){log(s,`${tr.effectName||'Effetto'} non ha bersagli validi.`);continue}s.pendingChoice={type:'trigger_target',player:tr.actor,trigger:tr,options:opts};s.priority=null;return}else pushEffect(s,tr)}if(s.stack.length){s.priority=other(s.stack[s.stack.length-1].actor);s.priorityPasses=0;return}if(s.enterQueue.length){processEnterQueue(s);if(s.pendingChoice)return;if(s.triggerQueue.length){prepareTriggers(s);return}}if(s.combat){s.priority=other(s.combat.initiator);return}if(s.endTurnPending){finalizeEndTurn(s);return}if(s.stackInitiator!=null){const init=s.stackInitiator;s.stackInitiator=null;s.focus=other(init);s.mainPasses=0;s.priority=null}}

function resolveEffect(s:any,item:any){const p=item.actor,t=item.targets||{},m=item.meta||{};log(s,`Si risolve ${item.effectName||'un effetto'}.`);switch(item.effectId){
 case'lyrandel_bonus':if(monster(s,t.monsterUid)){beginDamageEvent(s,null);damageMonster(s,p,t.monsterUid,1,'Lyrandel',false);endDamageEvent(s)}break;
 case'lascito_segugio':if(champ(s,t.champion?.player,t.champion?.champId))damageChampion(s,t.champion.player,t.champion.champId,1,'Lascito — Segugio dei Morti');break;
 case'lascito_custode':for(const c of pl(s,p).champions)if(!c.defeated)c.tempPow++;log(s,`I Campioni di ${pl(s,p).name} ottengono +1 POW fino alla fine del turno.`);break;
 case'lascito_cavaliere':if(champ(s,t.champion?.player,t.champion?.champId))damageChampion(s,t.champion.player,t.champion.champId,2,'Lascito — Cavaliere Senza Volto');break;
 case'lascito_serpente':{const o=pl(s,other(p)),c=t.color;if(c&&o.souls[c]>0){o.souls[c]--;log(s,`${o.name} perde 1 Anima ${colorLabel(c)}.`)}break}
 case'lascito_divoratore':for(const c of m.colors||[])if(c)gainSoul(s,p,c,1);break;
 case'ritorno_anime':{const q=pl(s,p),id=t.graveCardId,i=q.grave.indexOf(id);if(i>=0){q.grave.splice(i,1);q.hand.push(id);log(s,`${q.name} riprende ${CARD_DEFS[id]?.name||id} dal Cimitero.`)}break}
 }}

function afterTopResolution(s:any){if(s.pendingChoice)return;processEnterQueue(s);if(s.pendingChoice)return;prepareTriggers(s)}
function resolveTop(s:any){const item=s.stack.pop();if(!item)return;if(item.kind==='effect')resolveEffect(s,item);else{const pause=resolveCardEffect(s,item);pl(s,item.actor).grave.push(item.cardId);if(pause)return}afterTopResolution(s)}

function resolveCombat(s:any){const c=s.combat;if(!c)return;const init=c.initiator,atk=champ(s,c.attacker.player,c.attacker.champId);if(!atk||atk.defeated||c.cancelled){log(s,'Il combattimento viene annullato.');s.combat=null;prepareTriggers(s);return}const n=currentPow(s,c.attacker.player,atk);if(c.target.type==='champion'){const t=champ(s,c.target.player,c.target.champId);if(t&&!t.defeated){log(s,`${atk.name} attacca ${t.name} con ${n} POW.`);damageChampion(s,c.target.player,t.id,n,atk.name)}else log(s,'Il bersaglio del combattimento non è più valido.')}else{const m=monster(s,c.target.uid);if(m){log(s,`${atk.name} attacca ${MONSTER_DEFS[m.cardId].name} con ${n} POW.`);beginDamageEvent(s,c.attacker.player);damageMonster(s,c.attacker.player,m.uid,n,atk.name,true);endDamageEvent(s)}else log(s,'Il Mostro bersaglio non è più sul campo: l’attacco fallisce.')}s.combat=null;s.stackInitiator=init;afterTopResolution(s)}

function beginEndTurn(s:any){s.endTurnPending=true;const kills=[...s.delayedKills];s.delayedKills=[];for(const d of kills){const m=monster(s,d.uid);if(m)killMonster(s,d.killer,m,'Anima Esplosiva',true)}prepareTriggers(s)}
function finalizeEndTurn(s:any){s.endTurnPending=false;for(const p of [1,2]){const q=pl(s,p);for(const c of q.champions){c.damage=0;c.tempPow=0;c.cantAttackTurn=null;if(!c.defeated)c.tapped=false}q.fireCloud=false;q.lyrandelUsed=false;q.firstMagicCast=false;q.killedMonsterThisTurn=false;q.deck=shuffle([...q.deck,...q.hand]);q.hand=[];q.selected=false}for(const m of s.board.monsters){m.damage=0;m.tempPow=0}s.turn++;s.status='select';s.focus=s.turn%2?1:2;s.priority=null;s.mainPasses=0;s.stack=[];s.stackInitiator=null;s.combat=null;s.pendingChoice=null;s.triggerQueue=[];log(s,`Fine turno. Scegliete le carte per il turno ${s.turn}.`)}

function validateCardTargets(s:any,p:number,c:any,t:any){const own=(id:string)=>{const x=champ(s,p,id);return !!x&&!x.defeated};const mon=(uid:string)=>!!monster(s,uid);
 if(['corazza','mano','occhio','berserk','katana','albero','mille','collasso','fino_alla_morte'].includes(c.effect)&&!own(String(t?.ownChamp||'')))throw new Error('Campione bersaglio non valido.');
 if(c.effect==='berserk'&&Number(champ(s,p,t.ownChamp)?.damage||0)<=0)throw new Error('Berserk richiede un tuo Campione danneggiato.');
 if(c.effect==='marea'){if(!s.combat||!own(String(t?.ownChamp||'')))throw new Error('Alta Marea richiede un tuo Campione nel combattimento.');}
 if(['stupido','taglio_ninjitsu','sguardo','anima_esplosiva','spacca_ossa'].includes(c.effect)&&!mon(String(t?.monsterUid||'')))throw new Error('Mostro bersaglio non valido.');
 if(c.effect==='sacrificio'){const m=monster(s,String(t?.monsterUid||''));if(!m||m.owner!==p)throw new Error('Sacrificio richiede un Mostro sotto il tuo controllo.');}
 if(c.effect==='riflesso'&&(!own(String(t?.ownChamp||''))||!mon(String(t?.monsterUid||''))))throw new Error('Bersagli non validi.');
 if(['sfera','fendente','eclipse_fang'].includes(c.effect)&&!validEnemyTarget(s,p,t?.enemy))throw new Error('Nemico bersaglio non valido.');
 if(c.effect==='evocatore_anime_vacue'){const id=String(t?.graveMonsterId||'');if(!pl(s,p).monsterGrave.includes(id)||!MONSTER_DEFS[id]||MONSTER_DEFS[id].pow>2)throw new Error('Mostro del Cimitero non valido.');}
 if(c.effect==='ammazza_morte'){const x=t?.champion;if(!x||![1,2].includes(Number(x.player))||!champ(s,Number(x.player),String(x.champId))||champ(s,Number(x.player),String(x.champId)).defeated)throw new Error('Campione bersaglio non valido.');}
 if(c.effect==='occhio'&&pl(s,p).deck.length<5)throw new Error('Occhio di Drago richiede almeno 5 carte nel mazzo.');
}

function resolvePendingChoice(s:any,p:number,a:any){const pc=s.pendingChoice;if(!pc||pc.player!==p)throw new Error('C’è una scelta in attesa.');
 if(pc.type==='festa'){const q=pl(s,p),top=pc.top,discard=(a.discard||[]).filter((id:string)=>top.includes(id)),remain=top.filter((id:string)=>!discard.includes(id)),order=a.order||[];if(order.length!==remain.length||order.some((id:string)=>!remain.includes(id)))throw new Error('Ordine non valido.');q.monsterDeck=[...order,...q.monsterDeck.slice(top.length)];q.monsterGrave.push(...discard);s.pendingChoice=null;log(s,`${q.name} scarta ${discard.length} Mostr${discard.length===1?'o':'i'} e riordina gli altri.`);afterTopResolution(s);return s}
 if(pc.type==='trigger_target'){const id=String(a.choice||a.monsterUid||a.champId||a.color||'');if(!pc.options.some((x:any)=>String(x.id)===id))throw new Error('Scelta non valida.');const tr=pc.trigger;s.pendingChoice=null;pushEffect(s,tr,id);prepareTriggers(s);return s}
 if(pc.type==='cerbero'){const id=String(a.cardId||a.choice||'');if(!pc.cardIds.includes(id)||!pl(s,p).monsterGrave.includes(id)||MONSTER_DEFS[id]?.pow!==2)throw new Error('Mostro non valido.');s.pendingChoice=null;reviveFromGrave(s,p,id);processEnterQueue(s);if(!s.pendingChoice)afterTopResolution(s);return s}
 throw new Error('Scelta non valida.');
}

export function act(s:any,p:number,a:any){
 if(s.status==='gameover')throw new Error('La partita è terminata.');
 if(s.pendingChoice){if(a.type!=='resolve_choice')throw new Error('C’è una scelta in attesa.');return resolvePendingChoice(s,p,a)}
 if(a.type==='select_cards'){
  if(s.status!=='select')throw new Error('Non è il momento di scegliere le carte.');const q=pl(s,p);if(q.selected)throw new Error('Hai già confermato.');const ids=[...new Set((a.cardIds||[]).map((x:any)=>String(x)))];const need=Math.min(6,q.deck.length);if(ids.length!==need||ids.some((id:string)=>!q.deck.includes(id)))throw new Error(need===6?'Devi scegliere esattamente 6 carte disponibili.':`Devi scegliere tutte le ${need} carte disponibili.`);q.hand=ids;q.deck=q.deck.filter((id:string)=>!ids.includes(id));q.selected=true;log(s,`${q.name} ha scelto ${ids.length} carte.`);startMainIfReady(s);return s;
 }
 if(s.status!=='main')throw new Error('La fase principale non è attiva.');

 if(a.type==='attack'){
  if(s.priority||s.stack.length||s.combat)throw new Error('Non puoi attaccare durante una Catena.');if(s.focus!==p)throw new Error('Non hai il Focus.');const c=champ(s,p,String(a.champId||''));if(!c||c.defeated||c.tapped||c.cantAttackTurn===s.turn)throw new Error('Campione non disponibile.');if(!validateAttackTarget(s,p,a.target))throw new Error('Devi attaccare un difensore con Provocazione, se presente.');
  for(const m of [...s.board.monsters].filter((x:any)=>x.cardId==='salamandra_vulcanica')){m.tempPow=(m.tempPow||0)-1;log(s,'Salamandra Vulcanica perde 1 POW fino alla fine del turno.');if(m.damage>=currentMonsterPow(s,m))killMonster(s,null,m,'Salamandra Vulcanica',false)}
  c.tapped=true;s.combat={initiator:p,attacker:{player:p,champId:c.id},target:a.target,cancelled:false};s.stackInitiator=p;s.priority=other(p);s.mainPasses=0;log(s,`${pl(s,p).name} dichiara un attacco con ${c.name}.`);prepareTriggers(s);return s;
 }

 if(a.type==='cast'){
  const q=pl(s,p),c=CARD_DEFS[a.cardId];if(!c||!q.hand.includes(c.id))throw new Error('Carta non disponibile in mano.');
  if(s.stack.length){if(s.priority!==p)throw new Error('Non hai priorità nella Catena.');if(c.speed!=='instant')throw new Error('Durante una Catena puoi giocare solo Istantanee.');}
  else if(s.combat){if(s.priority!==p)throw new Error('Non hai priorità nel combattimento.');if(c.speed!=='response'&&c.effect!=='marea')throw new Error('Durante un combattimento puoi iniziare con una Risposta.');}
  else if(s.focus!==p)throw new Error('Non hai il Focus.');
  validateCardTargets(s,p,c,a.targets||{});if(!canPay(s,p,c))throw new Error('Anime insufficienti.');const cost=pay(s,p,c);q.hand=q.hand.filter((id:string)=>id!==c.id);s.stack.push({kind:'card',actor:p,cardId:c.id,targets:a.targets||{}});if(s.stackInitiator==null)s.stackInitiator=s.combat?.initiator??p;s.priority=other(p);s.mainPasses=0;log(s,`${q.name} gioca ${c.name}${cost?` pagando ${cost} Anima${cost===1?'':'e'} ${colorLabel(c.color)}`:''}.`);return s;
 }

 if(a.type==='activate_champion'){
  if(s.priority||s.stack.length||s.combat||s.focus!==p)throw new Error('Puoi usare questa abilità solo con il Focus e senza Catene.');const c=champ(s,p,String(a.champId||''));if(!c||c.id!=='divoratore_campione'||c.defeated||c.tapped)throw new Error('Campione non disponibile.');if(!pl(s,p).killedMonsterThisTurn)throw new Error('Devi aver ucciso almeno un Mostro in questo turno.');const id=String(a.graveCardId||'');if(!pl(s,p).grave.includes(id))throw new Error('Carta del Cimitero non valida.');c.tapped=true;s.stackInitiator=p;s.stack.push({kind:'effect',actor:p,sourceCardId:'divoratore_campione',effectId:'ritorno_anime',effectName:'Ritorno delle Anime',targets:{graveCardId:id},meta:{}});s.priority=other(p);log(s,`${c.name} attiva Ritorno delle Anime.`);return s;
 }

 if(a.type==='revive_phoenix'){
  if(s.priority||s.stack.length||s.combat||s.focus!==p)throw new Error('Puoi rianimare la Fenice solo con il Focus e senza Catene.');const q=pl(s,p),i=q.monsterGrave.indexOf('fenice_cremisi'),color=['red','green','black'].includes(a.color)?a.color:null;if(i<0)throw new Error('Fenice Cremisi non è nel tuo Cimitero Mostri.');if(!color||q.souls[color]<1)throw new Error('Devi pagare 1 Anima disponibile.');q.souls[color]--;q.monsterGrave.splice(i,1);addMonsterToBoard(s,'fenice_cremisi',p);log(s,`${q.name} paga 1 Anima ${colorLabel(color)} e gioca Fenice Cremisi dal Cimitero.`);s.stackInitiator=p;processEnterQueue(s);if(!s.pendingChoice)prepareTriggers(s);return s;
 }

 if(a.type==='pass_priority'){
  if(s.priority!==p)throw new Error('Non hai priorità.');if(s.stack.length){s.priority=null;resolveTop(s);return s}if(s.combat){s.priority=null;resolveCombat(s);return s}throw new Error('Non c’è una priorità da passare.');
 }

 if(a.type==='pass'){
  if(s.priority||s.stack.length||s.combat)throw new Error('Usa Passa priorità durante combattimenti o Catene.');if(s.focus!==p)throw new Error('Non hai il Focus.');s.mainPasses++;log(s,`${pl(s,p).name} passa.`);if(s.mainPasses>=2)beginEndTurn(s);else s.focus=other(p);return s;
 }

 if(a.type==='recycle'){
  if(s.priority||s.stack.length||s.combat||s.focus!==p)throw new Error('Puoi Riciclare solo con il Focus e senza Catene.');const q=pl(s,p),cost=q.recycleCount+1,r=Number(a.red||0),g=Number(a.green||0),b=Number(a.black||0);if(r+g+b!==cost||[r,g,b].some(x=>x<0)||r>q.souls.red||g>q.souls.green||b>q.souls.black)throw new Error('Pagamento del Riciclo non valido.');if(!q.grave.length)throw new Error('Il Cimitero è vuoto.');q.souls.red-=r;q.souls.green-=g;q.souls.black-=b;q.deck=shuffle([...q.deck,...q.grave]);q.grave=[];q.recycleCount++;log(s,`${q.name} Ricicla il Cimitero pagando ${cost} Anime.`);s.focus=other(p);s.mainPasses=0;return s;
 }
 throw new Error('Azione sconosciuta.');
}

export function publicView(state:any,p:number){const s=clone(state);delete s._damageEvent;delete s.triggerQueue;delete s.enterQueue;for(const qn of [1,2]){const src=pl(state,qn),q=s.players[String(qn)];if(!q)continue;q.champions=q.champions.map((c:any)=>({...c,pow:currentPow(state,qn,src.champions.find((x:any)=>x.id===c.id))}));q.graveCards=src.grave.map((id:string)=>CARD_DEFS[id]);q.monsterGraveCards=src.monsterGrave.map((id:string)=>MONSTER_DEFS[id]);if(qn!==p){q.handCount=src.hand.length;delete q.hand;q.deckCount=src.deck.length;delete q.deck;q.graveCount=src.grave.length;delete q.grave;q.monsterDeckCount=src.monsterDeck.length;delete q.monsterDeck;q.monsterGraveCount=src.monsterGrave.length;delete q.monsterGrave;delete q.banishedMonsters}else{q.handCards=src.hand.map((id:string)=>({...CARD_DEFS[id],effectiveCost:dynamicCost(state,qn,CARD_DEFS[id])}));q.deckCards=src.deck.map((id:string)=>CARD_DEFS[id])}}
 s.board.monsters=s.board.monsters.map((m:any)=>({...m,...MONSTER_DEFS[m.cardId],pow:currentMonsterPow(state,m)}));s.cardDefs=CARD_DEFS;s.monsterDefs=MONSTER_DEFS;s.championDefs=CHAMPION_DEFS;s.deckRules=DECK_RULES;s.you=p;if(s.pendingChoice&&s.pendingChoice.player!==p)s.pendingChoice={type:s.pendingChoice.type,player:s.pendingChoice.player,hidden:true};return s;}
