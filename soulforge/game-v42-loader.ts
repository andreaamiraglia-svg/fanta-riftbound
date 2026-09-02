import * as base from './game-v41-loader.ts';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;
export const publicView=base.publicView;

const clone=(x:any)=>JSON.parse(JSON.stringify(x));
const other=(p:number)=>p===1?2:1;
const player=(s:any,p:number)=>s?.players?.[String(p)]||null;
const champ=(s:any,p:number,id:string)=>(player(s,p)?.champions||[]).find((c:any)=>String(c?.id)===String(id));
const monster=(s:any,id:string)=>(s?.board?.monsters||[]).find((m:any)=>String(m?.uid)===String(id));
const support=(s:any,p:number,id:string)=>(player(s,p)?.champions||[]).find((c:any)=>c?.supportChampion&&String(c?.id)===String(id));
const log=(s:any,msg:string)=>{if(!Array.isArray(s?.log))return;s.log.push(msg);if(s.log.length>180)s.log=s.log.slice(-180)};

function sameTarget(a:any,b:any){
 if(a?.type!==b?.type)return false;
 if(a?.type==='monster')return String(a.uid)===String(b.uid);
 return Number(a?.player)===Number(b?.player)&&String(a?.champId)===String(b?.champId);
}
function legalPugnoTarget(s:any,p:number,t:any){
 const enemy=other(p),guards:any[]=[];
 for(const m of s?.board?.monsters||[]){
  if(Number(m.owner)!==enemy)continue;
  if(m.provocazione||MONSTER_DEFS[m.cardId]?.provocazione)guards.push({type:'monster',uid:m.uid});
 }
 for(const c of player(s,enemy)?.champions||[]){
  if(!c.defeated&&c.provocazione)guards.push({type:'champion',player:enemy,champId:c.id});
 }
 if(guards.length)return guards.some(g=>sameTarget(g,t));
 if(t?.type==='monster')return !!monster(s,String(t.uid));
 if(t?.type==='champion'){
  const c=champ(s,enemy,String(t.champId));
  return Number(t.player)===enemy&&!!c&&!c.defeated;
 }
 return false;
}
function validatePugno(s:any,p:number,move:any){
 const t=move?.targets||{},c=support(s,p,String(t.supportId||''));
 if(!c||c.defeated||c.tapped)throw new Error('Pugno in Faccia richiede un tuo Supporto disponibile.');
 if(!legalPugnoTarget(s,p,t.target))throw new Error('Bersaglio di attacco non valido. Se l’avversario controlla Provocazione, devi scegliere uno di quei difensori.');
}
function beginPugnoCombat(s:any,p:number,targets:any){
 if(s.priority||s.stack?.length||s.combat)throw new Error('Non puoi iniziare questo attacco durante una Catena o un altro combattimento.');
 const c=support(s,p,String(targets?.supportId||''));
 if(!c||c.defeated||c.tapped)throw new Error('Supporto non disponibile per attaccare.');
 if(!legalPugnoTarget(s,p,targets?.target))throw new Error('Bersaglio di attacco non valido.');
 c.tapped=true;
 s.combat={initiator:p,attacker:{player:p,champId:c.id},target:clone(targets.target),cancelled:false};
 s.combatPasses=0;
 s.stackInitiator=p;
 s.priority=other(p);
 s.mainPasses=0;
 log(s,`${c.name} attacca grazie a Pugno in Faccia.`);
 // Legionario Troll mantiene il suo trigger quando è il Supporto che attacca.
 if(c.id==='legionario_troll'){
  const options=(player(s,p)?.champions||[]).filter((x:any)=>!x.defeated&&!x.supportChampion).map((x:any)=>({id:String(x.id),label:String(x.name||x.id)}));
  if(options.length){
   s.pendingChoice={type:'trigger_target',player:p,trigger:{actor:p,sourceCardId:'legionario_troll',effectId:'legionario_troll_attack',choiceType:'ownChampion',effectName:'Effetto — Legionario Troll'},options};
   s.priority=null;
  }
 }
}

export function act(state:any,p0:any,move:any){
 const p=Number(p0);
 const isPugnoCast=move?.type==='cast'&&String(move?.cardId)==='pugno_in_faccia';
 let resolving:any=null;
 if(move?.type==='pass_priority'&&(state?.stack||[]).length){
  const top=state.stack[state.stack.length-1];
  if(top?.kind==='card'&&String(top.cardId)==='pugno_in_faccia')resolving={uid:String(top.uid),actor:Number(top.actor),targets:clone(top.targets||{})};
 }
 if(isPugnoCast)validatePugno(state,p,move);

 // v41 possiede già tutta la pipeline di Catena/Focus/costi. Per Pugno neutralizziamo
 // soltanto il suo resolver interno e applichiamo il combattimento con la regola
 // corretta della Provocazione (solo permanenti dell’avversario).
 const def=CARD_DEFS.pugno_in_faccia;
 const oldEffect=def?.effect;
 if((isPugnoCast||resolving)&&def)def.effect='__pugno_safe_v42';
 try{
  const out=base.act(state,p,move);
  if(resolving&&!(state?.stack||[]).some((x:any)=>String(x?.uid)===resolving.uid))beginPugnoCombat(state,resolving.actor,resolving.targets);
  return out;
 }finally{
  if(def)def.effect=oldEffect;
 }
}
