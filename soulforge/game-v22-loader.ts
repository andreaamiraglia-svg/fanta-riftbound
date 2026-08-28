const urls=['https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p01.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p02.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p03.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p04.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p05.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p06.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p07.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p08.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p09.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p10.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p11.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p12.txt'];
const chunks=await Promise.all(urls.map(async u=>{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error('Game chunk HTTP '+r.status);return r.text()}));
const mod=await import('data:text/javascript;charset=utf-8,'+encodeURIComponent(chunks.join('')));
const COLORS=['red','green','black','blue'];
function enforceSoulColorsOnPlayer(q:any){
 if(!q)return q;
 const allowed=new Set(Array.isArray(q.deckColors)&&q.deckColors.length?q.deckColors:(q.champions||[]).map((c:any)=>c?.color).filter(Boolean));
 q.souls ||= {};
 for(const c of COLORS){
  const n=Math.max(0,Number(q.souls[c]||0));
  q.souls[c]=allowed.has(c)?Math.min(3,n):0;
 }
 return q;
}
function enforceSoulColors(state:any){
 if(!state?.players)return state;
 enforceSoulColorsOnPlayer(state.players['1']);
 enforceSoulColorsOnPlayer(state.players['2']);
 return state;
}
export const CARD_DEFS=mod.CARD_DEFS;
export const MONSTER_DEFS=mod.MONSTER_DEFS;
export const CHAMPION_DEFS=mod.CHAMPION_DEFS;
export const DECK_RULES=mod.DECK_RULES;
export const STARTER_DECK=mod.STARTER_DECK;
export const STARTER_MONSTERS=mod.STARTER_MONSTERS;
export const newState=(name:any,deckConfig:any)=>enforceSoulColors(mod.newState(name,deckConfig));
export const newPlayer=(name:any,deckConfig:any)=>enforceSoulColorsOnPlayer(mod.newPlayer(name,deckConfig));
export const act=(state:any,p:any,move:any)=>enforceSoulColors(mod.act(enforceSoulColors(state),p,move));
export const publicView=(state:any,p:any)=>mod.publicView(enforceSoulColors(state),p);
