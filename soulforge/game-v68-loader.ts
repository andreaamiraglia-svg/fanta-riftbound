import * as base from './game-v67-loader.ts';
import {engine61 as E} from './game-v32-loader.ts?rev=souls-uncapped-v3';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;

type ChampionVersion={name:string;basePow:number;hp:number;text:string;art:string};
type ChampionPair={base:ChampionVersion;superior:ChampionVersion};

export const SUPERIOR_CHAMPIONS:Record<string,ChampionPair>={
 kael:{
  base:{name:'Kael Infuocato',basePow:3,hp:3,art:'Kael Infuocato (Campione)(Rosso).webp',text:'Ammazza Draghi — La prima volta in ogni turno che la tua mano diventa vuota, Kael ottiene +2 POW fino alla fine del turno.'},
  superior:{name:'Kael Infuocato Superiore',basePow:3,hp:3,art:'Kael Infuocato (Campione)(Rosso) (2).webp',text:'Apocalisse Draconica — La prima volta in ogni turno che la tua mano diventa vuota, attiva Kael. Kael ottiene +4 POW fino alla fine del turno.'}
 },
 scarlet:{
  base:{name:'Scarlet, Fiamma dei Mari',basePow:3,hp:3,art:'Kael Infuocato (Campione)(Rosso) (3).webp',text:'Fuoco e Fiamme — La prima volta in ogni turno che scarti una carta dalla tua mano, pesca 1 carta dal tuo Mazzo.'},
  superior:{name:'Scarlet, Fiamma dei Mari Superiore',basePow:3,hp:3,art:'Kael Infuocato (Campione)(Rosso) (4).webp',text:'Marea Cremisi — Ogni volta che scarti una o più carte, pesca 1 carta e infliggi 1 danno a ciascun Campione nemico.'}
 },
 kroth:{
  base:{name:'Kroth il Fulminatore',basePow:3,hp:3,art:'Kroth il Fulminatore (Campione)(Arancione).webp',text:'Scudo di Guerra — Ogni volta che Kroth difende, ottiene +1 POW fino alla fine del turno.'},
  superior:{name:'Kroth il Fulminatore Superiore',basePow:4,hp:3,art:'Kroth il Fulminatore (Campione)(Arancione) (2).webp',text:'Baluardo del Fulmine — Ogni volta che Kroth difende, ottiene +1 POW fino alla fine del turno. Ogni volta che attacca, ottiene Protettore fino alla fine del turno.'}
 },
 aurelius:{
  base:{name:"Aurelius, Re dell'Opulenza",basePow:1,hp:5,art:'Kroth il Fulminatore (Campione)(Arancione) (3).webp',text:'Ricchezza Ostentata — Finché hai più carte in mano del tuo avversario, i tuoi Supporti ottengono +1 POW.'},
  superior:{name:"Aurelius, Re dell'Opulenza Superiore",basePow:1,hp:5,art:'Kroth il Fulminatore (Campione)(Arancione) (4).webp',text:'Opulenza Assoluta — Finché hai più carte in mano del tuo avversario, i tuoi Supporti ottengono +1 POW. Tappa: pesca 2 carte. Ascensione — Pesca 1 carta.'}
 },
 lyrandel:{
  base:{name:'Lyrandel Spirito della Natura',basePow:3,hp:3,art:'Lyrandel Spirito della Natura (Campione)(Verde).webp',text:'Tecnica Ninjitsu — La prima volta in ogni turno che uno o più Mostri subiscono danni da una tua fonte, scegline uno: subisce 1 danno aggiuntivo.'},
  superior:{name:'Lyrandel Spirito della Natura Superiore',basePow:3,hp:3,art:'Lyrandel Spirito della Natura (Campione)(Verde) (2).webp',text:'Tempesta Primordiale — La prima volta in ogni turno che uno o più Mostri subiscono danni da una tua fonte, infliggi 2 danni a tutti i Mostri.'}
 },
 torvald:{
  base:{name:'Torvald, Spezzatronchi',basePow:4,hp:2,art:'Lyrandel Spirito della Natura (Campione)(Verde) (3).webp',text:'Ascia Furiosa — Ogni volta che Torvald subisce una Ferita, attivalo.'},
  superior:{name:'Torvald, Spezzatronchi Superiore',basePow:4,hp:3,art:'Lyrandel Spirito della Natura (Campione)(Verde) (4).webp',text:'Furia Inarrestabile — Ogni volta che Torvald subisce una Ferita, attivalo. Ascensione — Attiva Torvald.'}
 },
 valtheris:{
  base:{name:'Valtheris Spirito Eterno',basePow:3,hp:3,art:'Valtheris Spirito Eterno (Campione)(Blu).webp',text:'Protettore dell’Anima — All’inizio di ogni turno, Valtheris ottiene 1 Armatura. Tappa: Valtheris ottiene 1 Armatura e Provocazione fino alla fine del turno.'},
  superior:{name:'Valtheris Spirito Eterno Superiore',basePow:3,hp:3,art:'Valtheris Spirito Eterno (Campione)(Blu) (2).webp',text:'Egida dell’Eternità — All’inizio di ogni turno, Valtheris ottiene 1 Armatura. Se Valtheris sta per ottenere Armatura da un effetto, ne ottiene invece il doppio.'}
 },
 hilda:{
  base:{name:"Hilda, Ira d'Inverno",basePow:2,hp:4,art:'Valtheris Spirito Eterno (Campione)(Blu) (3).webp',text:'Furia del Valhalla — Ogni volta che una tua fonte riduce a 0 o meno il POW di un nemico, Hilda lo attacca.'},
  superior:{name:"Hilda, Ira d'Inverno Superiore",basePow:3,hp:4,art:'Valtheris Spirito Eterno (Campione)(Blu) (4).webp',text:'Condanna Glaciale — Ogni volta che una tua fonte riduce a 0 o meno il POW di un nemico, quel nemico subisce 1 Ferita. Ascensione — Ogni nemico con 0 POW subisce 1 Ferita.'}
 },
 divoratore_campione:{
  base:{name:'Il Divoratore di Anime',basePow:2,hp:4,art:'Il Divoratore di Anime (Campione)(Nero).webp',text:'Ritorno delle Anime — Tappa, solo se hai ucciso un Mostro in questo turno: scegli una carta nel tuo Cimitero e aggiungila alla tua mano.'},
  superior:{name:'Il Divoratore di Anime Superiore',basePow:2,hp:4,art:'Il Divoratore di Anime (Campione)(Nero) (2).webp',text:'Dominio delle Anime — Una volta per turno, puoi giocare una carta dal tuo Cimitero. Se una carta giocata in questo modo sta per essere rimessa nel tuo Cimitero, bandiscila invece.'}
 },
 grinn:{
  base:{name:'Grinn, il Folle',basePow:3,hp:3,art:'Il Divoratore di Anime (Campione)(Nero) (3).webp',text:'Risata Omicida — La prima volta in ogni turno che muore un Campione o un Mostro con 4 o più POW, le tue Magie di costo base 3 o superiore costano 1 Anima in meno fino alla fine del turno.'},
  superior:{name:'Grinn, il Folle Superiore',basePow:3,hp:3,art:'Il Divoratore di Anime (Campione)(Nero) (4).webp',text:'Follia Arcana — Le tue Magie di costo base 3 o superiore costano 1 Anima in meno. Ascensione — La prossima Magia che giochi in questo turno costa 1 Anima in meno.'}
 }
};

for(const [id,pair] of Object.entries(SUPERIOR_CHAMPIONS))Object.assign(CHAMPION_DEFS[id]||={},pair.base,{id,superiorVersion:pair.superior});

const clone=(x:any)=>JSON.parse(JSON.stringify(x));
const other=(p:number)=>p===1?2:1;
const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const champ=(s:any,p:number,id:string)=>(player(s,p)?.champions||[]).find((c:any)=>String(c?.id)===id);
const monster=(s:any,uid:string)=>(s?.board?.monsters||[]).find((m:any)=>String(m?.uid)===uid);
const log=(s:any,msg:string)=>{s.log ||= [];s.log.push(msg);if(s.log.length>220)s.log=s.log.slice(-220)};
const draw=(s:any,p:number,n:number,source:string)=>{const q=player(s,p);let drawn=0;while(drawn<n&&q?.deck?.length){const id=q.deck.shift();q.hand ||= [];q.hand.push(id);drawn++;log(s,`${source}: ${q.name} pesca ${CARD_DEFS[id]?.name||id}.`)}return drawn};

function normalizeChampion(c:any){
 const pair=SUPERIOR_CHAMPIONS[String(c?.id||'')];if(!pair)return;
 const printed=c.superior?pair.superior:pair.base;
 c.name=printed.name;c.basePow=printed.basePow;c.hp=printed.hp;c.text=printed.text;c.art=printed.art;
 c.wounds=Math.max(0,Number(c.wounds||0));c.damage=Math.max(0,Number(c.damage||0));c.tempPow=Number(c.tempPow||0);c.armor=Math.max(0,Number(c.armor||0));
}
function normalize(s:any){for(const p of [1,2])for(const c of player(s,p)?.champions||[])normalizeChampion(c)}

function snapshot(s:any){
 const out:any={turn:Number(s?.turn||0),hands:{},graves:{},champions:new Map(),monsters:new Map(),combat:clone(s?.combat||null)};
 for(const p of [1,2]){
  const q=player(s,p);out.hands[p]=clone(q?.hand||[]);out.graves[p]=clone(q?.grave||[]);
  for(const c of q?.champions||[])out.champions.set(`${p}:${c.id}`,{player:p,id:String(c.id),defeated:!!c.defeated,wounds:Number(c.wounds||0),armor:Number(c.armor||0),pow:Number(E.pow(s,p,c)||0),superior:!!c.superior});
 }
 for(const m of s?.board?.monsters||[])out.monsters.set(String(m.uid),{uid:String(m.uid),damage:Number(m.damage||0),armor:Number(m.armor||0),pow:Number(E.monsterPow(s,m)||0)});
 return out;
}
function multiset(a:any[]){const m=new Map<string,number>();for(const x of a||[])m.set(String(x),(m.get(String(x))||0)+1);return m}
function discarded(before:any,s:any,p:number){
 const q=player(s,p),bh=multiset(before.hands[p]),ah=multiset(q?.hand||[]),bg=multiset(before.graves[p]),ag=multiset(q?.grave||[]),out:string[]=[];
 for(const [id,n] of bh){const k=Math.min(Math.max(0,n-(ah.get(id)||0)),Math.max(0,(ag.get(id)||0)-(bg.get(id)||0)));for(let i=0;i<k;i++)out.push(id)}return out;
}
function ascend(s:any,p:number,c:any){
 const pair=SUPERIOR_CHAMPIONS[String(c.id)];if(!pair||c.superior||c.defeated)return;
 c.superior=true;normalizeChampion(c);log(s,`${c.name} assorbe l’Anima del Campione alleato caduto e diventa Superiore.`);
 switch(String(c.id)){
  case'aurelius':draw(s,p,1,'Ascensione — Opulenza Assoluta');break;
  case'torvald':c.tapped=false;log(s,'Ascensione — Furia Inarrestabile: Torvald diventa attivo.');break;
  case'grinn':delete player(s,p)._grinnDiscountTurn;delete player(s,p)._grinnTriggeredTurn;player(s,p)._superiorGrinnNextSpellTurn=Number(s.turn);log(s,'Ascensione — Follia Arcana: la prossima Magia di questo turno costa 1 Anima in meno.');break;
 }
}
function transformSurvivors(s:any){
 for(const p of [1,2]){const mains=(player(s,p)?.champions||[]).filter((c:any)=>!c.supportChampion&&SUPERIOR_CHAMPIONS[String(c.id)]);if(mains.length!==2)continue;const dead=mains.filter((c:any)=>c.defeated),alive=mains.filter((c:any)=>!c.defeated);if(dead.length===1&&alive.length===1&&!alive[0].superior)ascend(s,p,alive[0])}
}
function settleGameover(s:any){
 const lost=[1,2].filter(p=>{const mains=(player(s,p)?.champions||[]).filter((c:any)=>!c.supportChampion);return mains.length&&mains.every((c:any)=>c.defeated)});if(!lost.length)return;
 s.status='gameover';s.winner=lost.length===1?other(lost[0]):null;s.draw=lost.length===2;s.priority=null;s.stack=[];s.combat=null;s.pendingChoice=null;
}

function handleAscensionHilda(s:any,p:number){
 const h=champ(s,p,'hilda');if(!h?.superior||h._ascensionResolved)return;h._ascensionResolved=true;
 for(const c of player(s,other(p))?.champions||[])if(!c.defeated&&Number(E.pow(s,other(p),c))<=0)E.wound(s,other(p),c,'Ascensione — Condanna Glaciale');
 for(const m of [...(s.board?.monsters||[])])if(Number(m.owner)!==p&&Number(E.monsterPow(s,m))<=0)E.kill(s,p,m,'Ascensione — Condanna Glaciale',true);
}
function passives(s:any,before:any,eventActor:number|null,move:any){
 for(const p of [1,2]){
  const q=player(s,p);if(!q)continue;
  const k=champ(s,p,'kael');if(k&&!k.defeated&&(before.hands[p]?.length||0)>0&&(q.hand?.length||0)===0&&Number(q._kaelEmptyTurn)!==Number(s.turn)){
   q._kaelEmptyTurn=Number(s.turn);const amount=k.superior?4:2;k.tempPow=Number(k.tempPow||0)+amount;if(k.superior)k.tapped=false;log(s,`${k.superior?'Apocalisse Draconica':'Ammazza Draghi'}: ${k.name} ottiene +${amount} POW${k.superior?' e diventa attivo':''} fino alla fine del turno.`);
  }
  const sc=champ(s,p,'scarlet'),disc=discarded(before,s,p);if(sc&&!sc.defeated&&disc.length&&(sc.superior||Number(q._scarletNewTurn)!==Number(s.turn))){
   if(!sc.superior)q._scarletNewTurn=Number(s.turn);draw(s,p,1,sc.superior?'Marea Cremisi':'Fuoco e Fiamme');if(sc.superior)for(const enemy of player(s,other(p))?.champions||[])if(!enemy.defeated)E.damageChampion(s,other(p),enemy.id,1,'Marea Cremisi');
  }
  const t=champ(s,p,'torvald'),oldT=before.champions.get(`${p}:torvald`);if(t&&!t.defeated&&oldT&&Number(t.wounds||0)>oldT.wounds){t.tapped=false;log(s,`${t.superior?'Furia Inarrestabile':'Ascia Furiosa'}: ${t.name} diventa attivo.`)}
  const v=champ(s,p,'valtheris'),oldV=before.champions.get(`${p}:valtheris`);if(v?.superior&&oldV){const gain=Number(v.armor||0)-oldV.armor;if(gain>0){v.armor+=gain;log(s,`Egida dell’Eternità raddoppia l’Armatura ottenuta da ${v.name} (+${gain}).`)}}
  handleAscensionHilda(s,p);
 }
 if(eventActor===1||eventActor===2){
  const lyr=champ(s,eventActor,'lyrandel'),q=player(s,eventActor);if(lyr?.superior&&Number(q._superiorLyrandelTurn)!==Number(s.turn)){
   const hit=[...before.monsters.values()].some((b:any)=>{const m=monster(s,b.uid);return !m||Number(m.damage||0)>b.damage||Number(m.armor||0)<b.armor});
   if(hit){q._superiorLyrandelTurn=Number(s.turn);log(s,'Tempesta Primordiale infligge 2 danni a tutti i Mostri.');for(const m of [...(s.board?.monsters||[])])if(monster(s,String(m.uid)))E.damageMonster(s,eventActor,String(m.uid),2,'Tempesta Primordiale',false)}
  }
  const h=champ(s,eventActor,'hilda');if(h?.superior){
   for(const b of before.champions.values()){if(b.player!==other(eventActor)||b.defeated||b.pow<=0)continue;const c=champ(s,b.player,b.id);if(c&&!c.defeated&&Number(E.pow(s,b.player,c))<=0)E.wound(s,b.player,c,'Condanna Glaciale')}
   for(const b of before.monsters.values()){if(b.pow<=0)continue;const m=monster(s,b.uid);if(m&&Number(E.monsterPow(s,m))<=0)E.kill(s,eventActor,m,'Condanna Glaciale',true)}
  }
 }
 const combat=s.combat;if(combat&&JSON.stringify(combat)!==JSON.stringify(before.combat)&&String(combat.attacker?.champId)==='kroth'){
  const p=Number(combat.attacker.player),k=champ(s,p,'kroth');if(k?.superior){k.provocazione=true;k.protettore=true;k._superiorProtectorTurn=Number(s.turn);log(s,'Baluardo del Fulmine: Kroth ottiene Protettore fino alla fine del turno.')}
 }
}

function clearExpired(s:any,oldTurn:number){if(Number(s.turn)===oldTurn)return;for(const p of [1,2]){const q=player(s,p);delete q?._kaelEmptyTurn;delete q?._scarletNewTurn;delete q?._superiorLyrandelTurn;delete q?._superiorDivoratoreTurn;delete q?._superiorGrinnNextSpellTurn;for(const c of q?.champions||[])if(Number(c._superiorProtectorTurn)!==Number(s.turn)){delete c.protettore;if(c._superiorProtectorTurn!=null)c.provocazione=false;delete c._superiorProtectorTurn}}}

function activateAurelius(s:any,p:number){
 if(s.status!=='main'||s.priority||s.stack?.length||s.combat||s.pendingChoice||Number(s.focus)!==p)throw new Error('Puoi usare Opulenza Assoluta solo con il Focus e senza Catene.');
 const c=champ(s,p,'aurelius');if(!c?.superior||c.defeated||c.tapped)throw new Error('Aurelius Superiore non è disponibile.');c.tapped=true;s.stack ||= [];s.stack.push({uid:crypto.randomUUID(),kind:'effect',actor:p,sourceCardId:'aurelius',effectId:'superior_aurelius_draw',effectName:'Opulenza Assoluta'});s.stackInitiator=p;s.priority=other(p);s.priorityPasses=0;s.mainPasses=0;log(s,'Aurelius attiva Opulenza Assoluta: l’effetto entra in Catena.');return s;
}
function withGrinnCost(s:any,p:number,move:any,fn:()=>any){
 if(!['cast','cast_from_grave'].includes(String(move?.type)))return fn();const q=player(s,p),g=champ(s,p,'grinn'),d=CARD_DEFS[String(move.cardId||'')];if(!g?.superior||g.defeated||d?.type!=='Magia'||Number(d.cost||0)<3)return fn();
 const bonus=Number(q._superiorGrinnNextSpellTurn)===Number(s.turn)?1:0,old=Number(d.cost||0);d.cost=Math.max(0,old-1-bonus);if(bonus)delete q._superiorGrinnNextSpellTurn;try{return fn()}catch(e){if(bonus)q._superiorGrinnNextSpellTurn=Number(s.turn);throw e}finally{d.cost=old}
}
function prepareGraveCast(s:any,p:number,move:any){
 const q=player(s,p),d=champ(s,p,'divoratore_campione'),id=String(move.cardId||'');if(!d?.superior||d.defeated)throw new Error('Serve Il Divoratore di Anime Superiore.');if(Number(q._superiorDivoratoreTurn)===Number(s.turn))throw new Error('Puoi giocare una sola carta dal Cimitero per turno.');const i=(q.grave||[]).indexOf(id);if(i<0)throw new Error('Questa carta non è nel tuo Cimitero.');q.grave.splice(i,1);q.hand ||= [];q.hand.push(id);return{id};
}
function markGraveStack(s:any,p:number,id:string){const item=[...(s.stack||[])].reverse().find((x:any)=>Number(x.actor)===p&&String(x.cardId)===id);if(item)item.superiorGravePlay=true;player(s,p)._superiorDivoratoreTurn=Number(s.turn)}
function banishResolvedGraveCard(s:any,top:any){if(!top?.superiorGravePlay)return;const q=player(s,Number(top.actor)),id=String(top.cardId||'');if((s.stack||[]).some((x:any)=>String(x.uid)===String(top.uid)))return;const i=(q?.grave||[]).lastIndexOf(id);if(i>=0){q.grave.splice(i,1);q.banishedCards ||= [];q.banishedCards.push(id);log(s,`Dominio delle Anime bandisce ${CARD_DEFS[id]?.name||id} invece di rimetterla nel Cimitero.`)}}

export function newPlayer(...args:any[]){const q=(base.newPlayer as any)(...args);for(const c of q?.champions||[])normalizeChampion(c);return q}
export function newState(...args:any[]){const s=(base.newState as any)(...args);normalize(s);return s}

export function act(state:any,p0:any,move0:any){
 const p=Number(p0),move=clone(move0||{});normalize(state);const before=snapshot(state),oldTurn=Number(state.turn||0);
 const top=move.type==='pass_priority'&&state.stack?.length?clone(state.stack[state.stack.length-1]):null;
 const topSourceId=String(top?.sourceCardId||top?.cardId||'');
 const monsterSource=!!(top&&top.kind==='effect'&&MONSTER_DEFS?.[topSourceId]);
 // actor di un trigger Mostro serve per priorità/scelte, ma il Mostro non è una "tua fonte".
 const eventActor=monsterSource?null:(top&&(top.kind==='card'||top.kind==='effect')?Number(top.actor):(p===1||p===2?p:null));
 if(move.type==='activate_champion'&&String(move.champId)==='aurelius'&&champ(state,p,'aurelius')?.superior)return activateAurelius(state,p);
 if(move.type==='activate_champion'&&String(move.champId)==='valtheris'&&champ(state,p,'valtheris')?.superior)throw new Error('Valtheris Superiore non possiede più Protettore dell’Anima.');
 let grave:null|{id:string}=null;
 if(move.type==='cast_from_grave'){grave=prepareGraveCast(state,p,move);move.type='cast'}
 let out:any;
 try{out=withGrinnCost(state,p,move0,()=>base.act(state,p,move))}catch(e){if(grave){const q=player(state,p),i=q.hand.lastIndexOf(grave.id);if(i>=0)q.hand.splice(i,1);q.grave.push(grave.id)}throw e}
 if(grave)markGraveStack(state,p,grave.id);
 if(top?.effectId==='superior_aurelius_draw'&&!state.stack?.some((x:any)=>String(x.uid)===String(top.uid)))draw(state,Number(top.actor),2,'Opulenza Assoluta');
 banishResolvedGraveCard(state,top);
 transformSurvivors(state);passives(state,before,eventActor,move);transformSurvivors(state);clearExpired(state,oldTurn);normalize(state);settleGameover(state);return out||state;
}

export function publicView(state:any,p0:any){
 normalize(state);transformSurvivors(state);const valArmor=new Map<number,number>();for(const p of [1,2]){const c=champ(state,p,'valtheris');if(c?.superior)valArmor.set(p,Number(c.armor||0))}
 const v:any=(base.publicView as any)(state,Number(p0));if(!v)return v;
 for(const [p,before] of valArmor){const c=champ(state,p,'valtheris'),gain=Number(c?.armor||0)-before;if(gain>0){c.armor+=gain;const shown=v.players?.[String(p)]?.champions?.find((x:any)=>x.id==='valtheris');if(shown)shown.armor=Number(shown.armor||0)+gain;log(state,`Egida dell’Eternità raddoppia l’Armatura ottenuta da ${c.name} (+${gain}).`)}}
 v.superiorChampionDefs=SUPERIOR_CHAMPIONS;v.championDefs ||= {};
 for(const [id,pair] of Object.entries(SUPERIOR_CHAMPIONS))v.championDefs[id]={...(v.championDefs[id]||{}),...pair.base,id,superiorVersion:pair.superior};
 for(const p of [1,2])for(const c of v.players?.[String(p)]?.champions||[])normalizeChampion(c);
 return v;
}
