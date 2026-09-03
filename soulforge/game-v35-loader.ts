import * as base from './game-v34-loader.ts?rev=souls-uncapped-v3';

export const CARD_DEFS=base.CARD_DEFS;
export const MONSTER_DEFS=base.MONSTER_DEFS;
export const CHAMPION_DEFS=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const act=base.act;

function copyDeckConfig(cfg:any){
 if(!cfg||typeof cfg!=='object')return null;
 return {champions:[...(cfg.champions||[])].map(String),cards:[...(cfg.cards||[])].map(String),monsters:[...(cfg.monsters||[])].map(String)};
}
function attachDeck(q:any,cfg:any){
 if(!q)return q;
 const clean=copyDeckConfig(cfg)||{
  champions:(q.champions||[]).map((c:any)=>String(c.id)),
  cards:[...(q.deck||[])].map(String),
  monsters:[...(q.monsterDeck||[])].map(String)
 };
 q._rematchDeck=clean;
 return q;
}
export function newPlayer(name:any,deckConfig:any){return attachDeck(base.newPlayer(name,deckConfig),deckConfig);}
export function newState(name:any,deckConfig:any){const s=base.newState(name,deckConfig);attachDeck(s?.players?.['1'],deckConfig);return s;}

function rawChampionPow(state:any,p:number,c:any){
 let v=Number(c?.basePow||0)+Number(c?.tempPow||0);
 if(c?.id==='kael'&&(state?.players?.[String(p)]?.hand?.length||0)===0&&state?.status==='main')v+=3;
 return v;
}
function rawMonsterPow(state:any,m:any){
 const d=MONSTER_DEFS?.[m?.cardId];if(!d)return 0;
 const monsters=state?.board?.monsters||[];
 const griffins=monsters.filter((x:any)=>x.cardId==='grifone_della_tempesta').length;
 let v=Number(d.pow||0)+Number(m?.powMod||0)+Number(m?.tempPow||0);
 v+=monsters.filter((x:any)=>x.cardId==='lupo_delle_radici'&&x.uid!==m.uid).length;
 const iceWolves=monsters.filter((x:any)=>x.cardId==='lupo_glaciale'&&x.uid!==m.uid).length;
 v-=iceWolves*(1+griffins);
 return v;
}
export function publicView(state:any,p:any){
 const v=base.publicView(state,p);
 for(const pn of [1,2]){
  const src=state?.players?.[String(pn)],out=v?.players?.[String(pn)];
  if(src&&out){
   out.champions=(out.champions||[]).map((c:any)=>{const raw=src.champions?.find((x:any)=>String(x.id)===String(c.id));return {...c,pow:rawChampionPow(state,pn,raw||c)};});
   delete out._rematchDeck;
  }
 }
 v.board.monsters=(v?.board?.monsters||[]).map((m:any)=>{const raw=state?.board?.monsters?.find((x:any)=>String(x.uid)===String(m.uid));return {...m,pow:rawMonsterPow(state,raw||m)};});
 return v;
}
