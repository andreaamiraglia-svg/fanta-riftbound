import * as base from './game-v43-loader.ts?rev=souls-uncapped-v3';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;

const other=(p:number)=>p===1?2:1;
const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const champ=(s:any,p:number,id:any)=>(player(s,p)?.champions||[]).find((c:any)=>String(c?.id)===String(id));
const supports=(s:any,p:number)=>(player(s,p)?.champions||[]).filter((c:any)=>c?.supportChampion&&!c?.defeated);
const liveChampions=(s:any,p:number)=>(player(s,p)?.champions||[]).filter((c:any)=>!c?.defeated);
const log=(s:any,msg:string)=>{if(Array.isArray(s?.log)){s.log.push(msg);if(s.log.length>180)s.log=s.log.slice(-180)}};

/**
 * Regola strutturale:
 * - una carta che dice "Campione" vede sia i Campioni iniziali sia i Supporti;
 * - una carta che dice "Supporto" vede soltanto i Supporti;
 * - la sconfitta considera esclusivamente i Campioni iniziali.
 */
function enforceStarterLoss(s:any){
 if(s?.status==='gameover')return;
 for(const p of [1,2]){
  const starters=(player(s,p)?.champions||[]).filter((c:any)=>!c?.supportChampion);
  if(starters.length&&starters.every((c:any)=>c?.defeated)){
   s.status='gameover';
   s.winner=other(p);
   log(s,`${player(s,other(p))?.name||`Giocatore ${other(p)}`} vince la partita!`);
   return;
  }
 }
}

function replaceChoiceOptions(pc:any,list:any[]){
 pc.options=list.map((c:any)=>({id:String(c.id),label:String(c.name||c.id)}));
}
function normalizePendingChampionChoices(s:any){
 const pc=s?.pendingChoice;
 if(!pc||pc.type!=='trigger_target')return;
 const effect=String(pc?.trigger?.effectId||'');
 const actor=Number(pc?.trigger?.actor||pc?.player||0);
 if(!actor)return;

 // "un tuo Campione" = Campione iniziale O Supporto.
 if(effect==='legionario_troll_attack'){
  replaceChoiceOptions(pc,liveChampions(s,actor));
  return;
 }
 // "un altro tuo Campione": anche i Supporti sono validi, tranne Alabardo stessa.
 if(effect==='alabardo_provocazione'){
  replaceChoiceOptions(pc,liveChampions(s,actor).filter((c:any)=>String(c.id)!=='alabardo'));
  return;
 }
 // I Lasciti che dicono Campione nemico possono scegliere anche un Supporto nemico.
 if(effect==='lascito_segugio'||effect==='lascito_cavaliere'){
  replaceChoiceOptions(pc,liveChampions(s,other(actor)));
 }
}

function applyAura(obj:any,key:string,desired:number){
 let old=Math.max(0,Number(obj?.[key]||0));
 let pow=Number(obj?.tempPow||0);
 // Se il reset di turno ha già azzerato tempPow, non sottrarre un marker vecchio.
 if(pow<old&&old>0)old=0;
 obj.tempPow=pow-old+Math.max(0,desired);
 obj[key]=Math.max(0,desired);
}
function removeBaseAuraMarkersFromSupports(s:any){
 for(const p of [1,2])for(const c of supports(s,p)){
  for(const key of ['_grifoneAura','_soldatoAura']){
   const old=Math.max(0,Number(c?.[key]||0));
   if(old&&Number(c.tempPow||0)>=old)c.tempPow=Number(c.tempPow||0)-old;
   c[key]=0;
  }
 }
}
function syncSupportChampionAuras(s:any){
 const griffins=(s?.board?.monsters||[]).filter((m:any)=>m?.cardId==='grifone_imperiale').length;
 for(const p of [1,2]){
  const soldati=supports(s,p).filter((c:any)=>c?.id==='soldato_corrotto').length;
  for(const c of supports(s,p)){
   const prov=!!c.provocazione;
   // Grifone Imperiale e Soldato Corrotto dicono "Campioni": quindi includono i Supporti.
   applyAura(c,'_championLikeGrifoneAura',prov?griffins:0);
   applyAura(c,'_championLikeSoldatoAura',prov?2*soldati:0);
  }
 }
}

function maskAsChampion(c:any,masked:any[]){
 if(!c||!c.supportChampion||masked.some(x=>x.c===c))return;
 masked.push({c,value:c.supportChampion});
 c.supportChampion=false;
}
function restoreMasks(masked:any[]){
 for(let i=masked.length-1;i>=0;i--)masked[i].c.supportChampion=masked[i].value;
}
function prepareChampionSemanticMasks(s:any,p:number,move:any){
 const masked:any[]=[];
 const cardId=String(move?.cardId||'');

 // Validazione al lancio: queste carte dicono "Campione", quindi un Supporto è valido.
 if(move?.type==='cast'&&['spacca_teste','parry','su_gli_scudi'].includes(cardId)){
  maskAsChampion(champ(s,p,move?.targets?.ownChamp),masked);
 }

 if(move?.type==='pass_priority'&&(s?.stack||[]).length){
  const top=s.stack[s.stack.length-1];
  if(top?.kind==='card'){
   const id=String(top.cardId||'');
   if(id==='parry'||id==='su_gli_scudi')maskAsChampion(champ(s,Number(top.actor),top?.targets?.ownChamp),masked);
   // Perfezione dice "tutti i tuoi Campioni": include tutti i Supporti del controllore.
   if(id==='perfezione')for(const c of supports(s,Number(top.actor)))maskAsChampion(c,masked);
  }
  if(top?.kind==='effect'){
   const effect=String(top.effectId||'');
   // Legionario Troll dice "un tuo Campione": il bersaglio può essere un Supporto.
   if(effect==='legionario_troll_attack')maskAsChampion(champ(s,Number(top.actor),top?.targets?.ownChamp),masked);
   // Falco dell'Alba dice "tutti i Campioni": comprende Supporti di entrambi i giocatori.
   if(effect==='falco_alba_enter')for(const z of [1,2])for(const c of supports(s,z))maskAsChampion(c,masked);
  }
 }
 return masked;
}

function normalizeState(s:any){
 normalizePendingChampionChoices(s);
 removeBaseAuraMarkersFromSupports(s);
 syncSupportChampionAuras(s);
 enforceStarterLoss(s);
 return s;
}

export function publicView(state:any,p:any){
 normalizeState(state);
 return base.publicView(state,p);
}

export function act(state:any,p0:any,move:any){
 const p=Number(p0);
 // Serve anche per stati creati prima di questa patch.
 normalizePendingChampionChoices(state);
 removeBaseAuraMarkersFromSupports(state);
 syncSupportChampionAuras(state);

 const masked=prepareChampionSemanticMasks(state,p,move);
 try{
  const out=base.act(state,p,move);
  restoreMasks(masked);
  normalizeState(state);
  return out;
 }catch(e){
  restoreMasks(masked);
  throw e;
 }
}
