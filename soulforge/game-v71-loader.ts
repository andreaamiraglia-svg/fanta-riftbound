import * as base from './game-v70-loader.ts';
import {engine61 as E} from './game-v32-loader.ts?rev=souls-uncapped-v3';

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
const champ=(s:any,p:number,id:string)=>(player(s,p)?.champions||[]).find((c:any)=>String(c?.id)===String(id));
const log=(s:any,msg:string)=>{s.log ||= [];s.log.push(msg);if(s.log.length>220)s.log=s.log.slice(-220)};
const clone=(x:any)=>JSON.parse(JSON.stringify(x));

const ASCENSION:any={
 aurelius:{effectId:'ascension_aurelius',name:'Ascensione — Opulenza Assoluta'},
 torvald:{effectId:'ascension_torvald',name:'Ascensione — Furia Inarrestabile'},
 hilda:{effectId:'ascension_hilda',name:'Ascensione — Condanna Glaciale'},
 grinn:{effectId:'ascension_grinn',name:'Ascensione — Follia Arcana'}
};

function snapshotChampions(s:any){
 const out=new Map<string,any>();
 for(const p of [1,2])for(const c of player(s,p)?.champions||[])out.set(`${p}:${c.id}`,{superior:!!c.superior,tapped:!!c.tapped});
 return out;
}
function stripNewLog(s:any,start:number,pred:(x:string)=>boolean){
 if(!Array.isArray(s.log))return;
 for(let i=s.log.length-1;i>=start;i--)if(pred(String(s.log[i]||'')))s.log.splice(i,1);
}
function undoLegacyAscension(s:any,p:number,c:any,before:any,logStart:number){
 const id=String(c.id),q=player(s,p);
 if(id==='aurelius'){
  const prefix='Ascensione — Opulenza Assoluta:';
  const entries=(s.log||[]).slice(logStart).filter((x:any)=>String(x).startsWith(prefix));
  const entry=String(entries.at(-1)||'');
  const cardName=entry.includes(' pesca ')?entry.split(' pesca ').at(-1)?.replace(/\.$/,''):'';
  if(cardName){
   let idx=-1;
   for(let i=(q?.hand||[]).length-1;i>=0;i--){const cid=q.hand[i];if(String(CARD_DEFS?.[cid]?.name||cid)===cardName){idx=i;break}}
   if(idx>=0){const [cid]=q.hand.splice(idx,1);q.deck ||= [];q.deck.unshift(cid)}
  }
  stripNewLog(s,logStart,x=>x.startsWith(prefix));
 }else if(id==='torvald'){
  if(before)c.tapped=!!before.tapped;
  stripNewLog(s,logStart,x=>x.startsWith('Ascensione — Furia Inarrestabile:'));
 }else if(id==='grinn'){
  delete q?._superiorGrinnNextSpellTurn;
  stripNewLog(s,logStart,x=>x.startsWith('Ascensione — Follia Arcana:'));
 }
}
function queueAscension(s:any,p:number,c:any){
 const spec=ASCENSION[String(c?.id||'')];if(!spec||c?._ascensionChainQueued)return;
 c._ascensionChainQueued=true;
 s.stack ||= [];
 s.stack.push({uid:crypto.randomUUID(),kind:'effect',actor:p,cardId:String(c.id),sourceCardId:String(c.id),effectId:spec.effectId,effectName:spec.name,ascensionTrigger:true});
 if(s.stackInitiator==null)s.stackInitiator=p;
 s.priority=other(p);s.priorityPasses=0;s.mainPasses=0;
 log(s,`${spec.name} entra in Catena.`);
}
function normalizeSuperior(c:any){
 const pair=SUPERIOR_CHAMPIONS?.[String(c?.id||'')];if(!pair)return;
 const d=pair.superior;c.superior=true;c.name=d.name;c.basePow=d.basePow;c.hp=d.hp;c.text=d.text;c.art=d.art;
 c.wounds=Math.max(0,Number(c.wounds||0));c.damage=Math.max(0,Number(c.damage||0));c.tempPow=Number(c.tempPow||0);c.armor=Math.max(0,Number(c.armor||0));
 if(String(c.id)==='hilda')c._ascensionResolved=true;
}
function promoteNewSurvivors(s:any){
 for(const p of [1,2]){
  const mains=(player(s,p)?.champions||[]).filter((c:any)=>!c.supportChampion&&SUPERIOR_CHAMPIONS?.[String(c.id)]);
  if(mains.length!==2)continue;
  const dead=mains.filter((c:any)=>c.defeated),alive=mains.filter((c:any)=>!c.defeated);
  if(dead.length===1&&alive.length===1&&!alive[0].superior){
   const c=alive[0];normalizeSuperior(c);log(s,`${c.name} assorbe l’Anima del Campione alleato caduto e diventa Superiore.`);queueAscension(s,p,c);
  }
 }
}
function draw(s:any,p:number,n:number,source:string){
 const q=player(s,p);let drawn=0;
 while(drawn<n&&q?.deck?.length){const id=q.deck.shift();q.hand ||= [];q.hand.push(id);drawn++;log(s,`${source}: ${q.name} pesca ${CARD_DEFS?.[id]?.name||id}.`)}
}
function settleGameover(s:any){
 const lost=[1,2].filter(p=>{const mains=(player(s,p)?.champions||[]).filter((c:any)=>!c.supportChampion);return mains.length&&mains.every((c:any)=>c.defeated)});
 if(!lost.length)return;
 s.status='gameover';s.winner=lost.length===1?other(lost[0]):null;s.draw=lost.length===2;s.priority=null;s.stack=[];s.combat=null;s.pendingChoice=null;
}
function resolveAscension(s:any,item:any){
 const p=Number(item?.actor),id=String(item?.sourceCardId||item?.cardId||''),c=champ(s,p,id);if(!c?.superior||c.defeated)return;
 c._ascensionChainResolved=true;
 switch(String(item.effectId)){
  case'ascension_aurelius':
   draw(s,p,1,'Ascensione — Opulenza Assoluta');
   break;
  case'ascension_torvald':
   c.tapped=false;log(s,'Ascensione — Furia Inarrestabile: Torvald diventa attivo.');
   break;
  case'ascension_grinn':
   delete player(s,p)._grinnDiscountTurn;delete player(s,p)._grinnTriggeredTurn;player(s,p)._superiorGrinnNextSpellTurn=Number(s.turn);log(s,'Ascensione — Follia Arcana: la prossima Magia che giochi in questo turno costa 1 Anima in meno.');
   break;
  case'ascension_hilda':{
   c._ascensionResolved=true;
   for(const enemy of player(s,other(p))?.champions||[]){
    if(enemy.defeated||Number(E.pow(s,other(p),enemy))>0)continue;
    const beforeW=Number(enemy.wounds||0);E.wound(s,other(p),enemy,'Ascensione — Condanna Glaciale');
    if(String(enemy.id)==='torvald'&&!enemy.defeated&&Number(enemy.wounds||0)>beforeW){enemy.tapped=false;log(s,`${enemy.superior?'Furia Inarrestabile':'Ascia Furiosa'}: ${enemy.name} diventa attivo.`)}
   }
   for(const m of [...(s.board?.monsters||[])])if(Number(m.owner)!==p&&Number(E.monsterPow(s,m))<=0)E.kill(s,p,m,'Ascensione — Condanna Glaciale',true);
   log(s,'Ascensione — Condanna Glaciale si risolve.');
   break;
  }
 }
 promoteNewSurvivors(s);settleGameover(s);
}

export function act(state:any,p0:any,move0:any){
 const p=Number(p0),move=clone(move0||{}),before=snapshotChampions(state),logStart=Array.isArray(state?.log)?state.log.length:0;
 // v68 risolveva Condanna Glaciale immediatamente. Il flag la blocca finché il trigger non risolve in Catena.
 for(const owner of [1,2]){const h=champ(state,owner,'hilda');if(h&&!h.superior)h._ascensionResolved=true}
 const top=move.type==='pass_priority'&&state?.stack?.length?clone(state.stack[state.stack.length-1]):null;
 const out=(base.act as any)(state,p,move)||state;

 for(const owner of [1,2])for(const c of player(state,owner)?.champions||[]){
  const old=before.get(`${owner}:${c.id}`);
  if(old&&!old.superior&&c.superior){undoLegacyAscension(state,owner,c,old,logStart);queueAscension(state,owner,c)}
 }

 if(top?.ascensionTrigger&&!state.stack?.some((x:any)=>String(x.uid)===String(top.uid)))resolveAscension(state,top);
 return out;
}

export function publicView(state:any,p0:any){return (base.publicView as any)(state,Number(p0))}
