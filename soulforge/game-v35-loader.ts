const V32_URL='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v32-loader.ts';
const r=await fetch(V32_URL,{cache:'no-store'});
if(!r.ok)throw new Error('game-v32 loader HTTP '+r.status);
let loader=await r.text();

const marker="const patch=(pattern:RegExp|string,replacement:string,label:string)=>{const next=source.replace(pattern as any,replacement);if(next===source)throw new Error('Game patch missing: '+label);source=next};";
if(!loader.includes(marker))throw new Error('game-v35: patch marker non trovato');
const extra=`
patch("v += 3; return Math.max(0, v); }","v += 3; return v; }",'negative champion POW');
patch("v -= iceWolves * (1 + griffins(s)); return Math.max(0, v); }","v -= iceWolves * (1 + griffins(s)); return v; }",'negative monster POW');
patch("if (c.damage >= currentPow(s, p, c)) {","if (c.damage >= Math.max(1, currentPow(s, p, c))) {",'minimum champion damage threshold');
`;
loader=loader.replace(marker,marker+extra);

const oldMonsterThreshold="return m.damage >= currentMonsterPow(s, m);";
if(!loader.includes(oldMonsterThreshold))throw new Error('game-v35: monster threshold non trovato');
loader=loader.replace(oldMonsterThreshold,"return m.damage >= Math.max(1, currentMonsterPow(s, m));");
loader=loader.replace("+ currentMonsterPow(s, m) + ').'); return m.damage", "+ Math.max(1, currentMonsterPow(s, m)) + ').'); return m.damage");

const base=await import('data:text/javascript;charset=utf-8,'+encodeURIComponent(loader));

export const CARD_DEFS=base.CARD_DEFS;
export const MONSTER_DEFS=base.MONSTER_DEFS;
export const CHAMPION_DEFS=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;

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
export function publicView(state:any,p:any){
 const v=base.publicView(state,p);
 for(const k of ['1','2'])if(v?.players?.[k])delete v.players[k]._rematchDeck;
 return v;
}

function printedCounterTarget(state:any,uid:any){
 const target=(state?.stack||[]).find((x:any)=>String(x?.uid)===String(uid));
 if(!target||target.kind!=='card')return null;
 const def=CARD_DEFS?.[target.cardId];
 if(!def||def.type!=='Magia'||Number(def.cost)>1)return null;
 return target;
}
function specchioTargetForMove(state:any,move:any){
 if(move?.type==='cast'&&move?.cardId==='specchio_acqua')return printedCounterTarget(state,move?.targets?.stackUid);
 if(move?.type==='pass_priority'){
  const top=(state?.stack||[])[(state?.stack||[]).length-1];
  if(top?.kind==='card'&&top?.cardId==='specchio_acqua')return printedCounterTarget(state,top?.targets?.stackUid);
 }
 return null;
}

export function act(state:any,p:any,move:any){
 let restoreTaglio:null|(()=>void)=null;
 let restoreCounter:null|(()=>void)=null;
 if(move?.type==='cast'&&move?.cardId==='taglio_fiammante'&&state?.combat&&(state?.stack||[]).length){
  const def=CARD_DEFS?.taglio_fiammante;
  if(def){const old=def.speed;def.speed='instant';restoreTaglio=()=>{def.speed=old;};}
 }
 const counterTarget=specchioTargetForMove(state,move);
 if(counterTarget){
  const had=Object.prototype.hasOwnProperty.call(counterTarget,'paidCost');
  const old=counterTarget.paidCost;
  counterTarget.paidCost=Number(CARD_DEFS[counterTarget.cardId]?.cost??old??99);
  restoreCounter=()=>{if(had)counterTarget.paidCost=old;else delete counterTarget.paidCost;};
 }
 try{return base.act(state,p,move);}
 finally{try{restoreCounter?.();}catch{}try{restoreTaglio?.();}catch{}}
}
