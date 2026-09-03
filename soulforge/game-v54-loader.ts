import * as base from './game-v53-loader.ts?rev=bang-champion-monster-v2';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;
export const act=base.act;

const pl=(s:any,p:number)=>s?.players?.[String(p)]||null;
const champName=(s:any,p:any,id:any)=>pl(s,Number(p))?.champions?.find((c:any)=>String(c?.id)===String(id))?.name||'Campione';
const monsterName=(s:any,uid:any)=>{const m=(s?.board?.monsters||[]).find((x:any)=>String(x?.uid)===String(uid));return m?(MONSTER_DEFS?.[m.cardId]?.name||m.name||'Mostro'):'Mostro';};
function targetName(s:any,t:any):string{
 if(!t)return '';
 if(t.type==='champion')return champName(s,t.player,t.champId);
 if(t.type==='monster')return monsterName(s,t.uid);
 return '';
}
function targetSummary(s:any,item:any):string{
 const t=item?.targets||{};
 const out:string[]=[];
 const add=(prefix:string,value:string)=>{if(value)out.push(prefix+value)};
 add('Bersaglio: ',targetName(s,t.enemy||t.target));
 if(t.ownChamp)add('Campione: ',champName(s,item.actor,t.ownChamp));
 if(t.monsterUid)add('Mostro: ',monsterName(s,t.monsterUid));
 if(Array.isArray(t.monsterUids)&&t.monsterUids.length)add('Mostri: ',t.monsterUids.map((id:any)=>monsterName(s,id)).join(', '));
 if(t.championA)add('Campione (2 danni): ',targetName(s,t.championA));
 if(t.championB)add('Campione (1 danno): ',targetName(s,t.championB));
 if(t.champId)add('Campione: ',champName(s,t.player??item.actor,t.champId));
 return out.join(' • ');
}
export function publicView(state:any,p:any){
 const v:any=(base.publicView as any)(state,p);
 const raw=state?.stack||[];
 for(let i=0;i<(v?.stack||[]).length;i++){
   const shown=v.stack[i];
   const item=raw.find((x:any)=>String(x?.uid)===String(shown?.uid))||raw[i];
   const summary=targetSummary(state,item);
   if(summary)shown.targetSummary=summary;
 }
 return v;
}
