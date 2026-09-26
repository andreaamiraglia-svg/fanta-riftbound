import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

globalThis.fetch=async input=>{
 const name=String(input).split('/').pop().split('?')[0];
 return new Response(await fs.readFile(new URL(`../soulforge/${name}`,import.meta.url),'utf8'));
};
const game=await import('../soulforge/game-v68-loader.ts?champion-superior-tests=1');

const ids=Object.keys(game.SUPERIOR_CHAMPIONS);
assert.deepEqual(ids.sort(),['aurelius','divoratore_campione','grinn','hilda','kael','kroth','lyrandel','scarlet','torvald','valtheris']);
for(const id of ids){
 const pair=game.SUPERIOR_CHAMPIONS[id];
 assert.ok(pair.base.art.endsWith('.webp'),`${id} base art`);
 assert.ok(pair.superior.art.endsWith('.webp'),`${id} superior art`);
 assert.ok(pair.base.text.length>20,`${id} base text`);
 assert.ok(pair.superior.text.length>20,`${id} superior text`);
 assert.equal(game.CHAMPION_DEFS[id].art,pair.base.art);
 assert.equal(game.CHAMPION_DEFS[id].superiorVersion.art,pair.superior.art);
}
assert.match(game.CHAMPION_DEFS.scarlet.text,/scarti una carta.*pesca 1 carta dal tuo Mazzo/i);
assert.doesNotMatch(game.CHAMPION_DEFS.scarlet.text,/Rossa|costa 1/i);
assert.match(game.CHAMPION_DEFS.torvald.text,/subisce una Ferita, attivalo/i);
assert.doesNotMatch(game.CHAMPION_DEFS.torvald.text,/muore alla fine|rimettilo in gioco/i);

const colorCards=(colors)=>Object.values(game.CARD_DEFS).filter(c=>colors.includes(c.color)&&!c.tokenSupport).slice(0,18).map(c=>c.id);
const colorMonsters=(colors)=>Object.values(game.MONSTER_DEFS).filter(c=>colors.includes(c.color)).slice(0,12).map(c=>c.id);
const deck={champions:['kael','lyrandel'],cards:colorCards(['red','green']),monsters:colorMonsters(['red','green'])};
assert.equal(deck.cards.length,18);assert.equal(deck.monsters.length,12);
const state=game.newState('Alice',deck);state.players['2']=game.newPlayer('Bob',deck);
Object.assign(state,{status:'main',turn:4,focus:1,priority:null,stack:[],combat:null,pendingChoice:null,mainPasses:0});
for(const p of [1,2])state.players[String(p)].selected=true;
const kael=state.players['1'].champions.find(c=>c.id==='kael');
const lyrandel=state.players['1'].champions.find(c=>c.id==='lyrandel');
Object.assign(kael,{wounds:1,damage:2,tempPow:3,armor:4,tapped:true,provocazione:true,customDebuff:{turn:4,amount:2}});
Object.assign(lyrandel,{defeated:true,tapped:true,wounds:lyrandel.hp});
game.act(state,1,{type:'pass'});
assert.equal(kael.superior,true);
assert.equal(kael.wounds,1,'le Ferite devono restare');
assert.equal(kael.damage,2,'i danni devono restare');
assert.equal(kael.tempPow,3,'i buff/debuff POW devono restare');
assert.equal(kael.armor,4,'l’Armatura deve restare');
assert.equal(kael.tapped,true,'lo stato tappato deve restare');
assert.equal(kael.provocazione,true,'gli stati devono restare');
assert.deepEqual(kael.customDebuff,{turn:4,amount:2},'i debuff personalizzati devono restare');
assert.match(kael.text,/Apocalisse Draconica/);
assert.ok(state.log.some(x=>x.includes('diventa Superiore')));
const view=game.publicView(state,1),shown=view.players['1'].champions.find(c=>c.id==='kael');
assert.equal(shown.superior,true);assert.equal(shown.art,game.SUPERIOR_CHAMPIONS.kael.superior.art);
assert.equal(view.superiorChampionDefs.kael.superior.basePow,3);

console.log('✓ 10 coppie, testi aggiornati e trasformazione con stato preservato');

function fresh(champions){
 const colors=champions.map(id=>game.CHAMPION_DEFS[id].color),cfg={champions,cards:colorCards(colors),monsters:colorMonsters(colors)};
 const s=game.newState('Alice',cfg);s.players['2']=game.newPlayer('Bob',cfg);Object.assign(s,{status:'main',turn:7,focus:1,priority:null,priorityPasses:0,mainPasses:0,stack:[],combat:null,pendingChoice:null,board:{monsters:[]},log:[]});
 for(const p of [1,2]){const q=s.players[String(p)];q.selected=true;q.hand=[];q.grave=[];q.deck=[];for(const color of ['red','green','black','blue','orange'])q.souls[color]=20}
 return s;
}
const c=(s,p,id)=>s.players[String(p)].champions.find(x=>x.id===id);
const superior=(s,p,id)=>{const x=c(s,p,id);x.superior=true;game.publicView(s,p);return x};
const resolveTop=s=>game.act(s,Number(s.priority),{type:'pass_priority'});

{
 const s=fresh(['kael','scarlet']),k=superior(s,1,'kael');k.tapped=true;s.players['1'].hand=['nube_di_fuoco'];
 game.act(s,1,{type:'cast',cardId:'nube_di_fuoco',targets:{}});assert.equal(k.tempPow,4);assert.equal(k.tapped,false);assert.equal(s.players['1']._kaelEmptyTurn,7);
}
{
 const s=fresh(['kael','scarlet']),sc=superior(s,1,'scarlet'),enemy=c(s,2,'kael');s.players['1'].hand=['bang','nube_di_fuoco','mano_del_caos'];s.players['1'].deck=['fendente_di_fuoco'];const uid=crypto.randomUUID();s.board.monsters=[{uid,cardId:'salamandra_vulcanica',owner:2,damage:0,tempPow:0,powMod:0,armor:0}];
 game.act(s,1,{type:'cast',cardId:'bang',targets:{discardIds:['nube_di_fuoco','mano_del_caos'],championA:{player:2,champId:'kael'},monsterUid:uid}});assert.equal(sc.superior,true);assert.equal(s.players['1'].hand.includes('fendente_di_fuoco'),true);assert.equal(enemy.damage,1);
}
{
 const s=fresh(['kroth','aurelius']),k=superior(s,1,'kroth');game.act(s,1,{type:'attack',champId:'kroth',target:{type:'champion',player:2,champId:'kroth'}});assert.equal(k.protettore,true);assert.equal(k.provocazione,true);
}
{
 const s=fresh(['kroth','aurelius']),a=superior(s,1,'aurelius');s.players['1'].deck=['parry','perfezione'];game.act(s,1,{type:'activate_champion',champId:'aurelius'});resolveTop(s);assert.equal(a.tapped,true);assert.equal(s.players['1'].hand.length,2);
}
{
 const s=fresh(['lyrandel','torvald']),l=superior(s,1,'lyrandel'),u1=crypto.randomUUID(),u2=crypto.randomUUID();s.board.monsters=[{uid:u1,cardId:'salamandra_vulcanica',owner:2,damage:0,tempPow:0,powMod:0,armor:0},{uid:u2,cardId:'salamandra_vulcanica',owner:2,damage:0,tempPow:0,powMod:0,armor:0}];s.stack=[{uid:crypto.randomUUID(),kind:'card',actor:1,cardId:'taglio_ninjitsu',targets:{monsterUid:u1},paidCost:0}];s.priority=2;resolveTop(s);assert.equal(l.superior,true);assert.equal(s.board.monsters.find(x=>x.uid===u1).damage,4);assert.equal(s.board.monsters.find(x=>x.uid===u2).damage,2);
}
{
 const s=fresh(['lyrandel','torvald']),t=superior(s,1,'torvald');t.tapped=true;s.stack=[{uid:crypto.randomUUID(),kind:'card',actor:2,cardId:'ammazza_morte',targets:{champion:{player:1,champId:'torvald'}},paidCost:3}];s.priority=1;resolveTop(s);assert.equal(t.wounds,1);assert.equal(t.tapped,false);
}
{
 const s=fresh(['valtheris','hilda']),v=superior(s,1,'valtheris');assert.equal(v.armor,2);s.stack=[{uid:crypto.randomUUID(),kind:'card',actor:1,cardId:'in_guardia',targets:{character:{type:'champion',player:1,champId:'valtheris'}},paidCost:0}];s.priority=2;resolveTop(s);assert.equal(v.armor,4);
}
{
 const s=fresh(['valtheris','hilda']);superior(s,1,'hilda');const victim=c(s,2,'hilda');victim.tempPow=-3;s.stack=[{uid:crypto.randomUUID(),kind:'card',actor:1,cardId:'grandine_brillante',targets:{},paidCost:1}];s.priority=2;resolveTop(s);assert.equal(victim.wounds,1);
}
{
 const s=fresh(['divoratore_campione','grinn']);superior(s,1,'divoratore_campione');s.players['1'].grave=['fino_alla_morte'];game.act(s,1,{type:'cast_from_grave',cardId:'fino_alla_morte',targets:{ownChamp:'grinn'}});resolveTop(s);assert.equal(s.players['1'].grave.includes('fino_alla_morte'),false);assert.equal(s.players['1'].banishedCards.includes('fino_alla_morte'),true);
}
{
 const s=fresh(['divoratore_campione','grinn']);superior(s,1,'grinn');s.players['1'].hand=['ammazza_morte'];s.players['1'].souls.black=2;game.act(s,1,{type:'cast',cardId:'ammazza_morte',targets:{champion:{player:2,champId:'grinn'}}});assert.equal(s.stack.at(-1).paidCost,2);
}
console.log('✓ effetti base/superiori coperti per tutti i 10 Campioni');
