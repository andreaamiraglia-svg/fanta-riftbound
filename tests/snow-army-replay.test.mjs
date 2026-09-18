import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
globalThis.fetch=async input=>new Response(await fs.readFile(new URL('../soulforge/'+String(input).split('/').pop().split('?')[0],import.meta.url),'utf8'));
const game=await import('../soulforge/game-v67-loader.ts');
const {engine61:E}=await import('../soulforge/game-v32-loader.ts?rev=souls-uncapped-v3');
const {cards}=await import('../soulforge/batch3-catalog.js');
const cp=(p,id)=>({type:'champion',player:p,champId:id}),mr=m=>({type:'monster',uid:m.uid});
function fresh(){
 const deck={champions:['scarlet','torvald'],cards:Object.values(game.CARD_DEFS).filter(x=>['red','green'].includes(x.color)&&!x.tokenSupport).slice(0,18).map(x=>x.id),monsters:Object.values(game.MONSTER_DEFS).filter(x=>['red','green'].includes(x.color)).slice(0,12).map(x=>x.id)};
 const s=game.newState('A',deck);s.players[2]=game.newPlayer('B',deck);
 Object.assign(s,{status:'main',turn:3,focus:1,priority:null,stack:[],stackInitiator:null,combat:null,pendingChoice:null,triggerQueue:[],enterQueue:[],log:[],board:{monsters:[]}});
 for(const p of [1,2]){Object.assign(s.players[p],{hand:[],grave:[],monsterGrave:[],selected:true,deckColors:['red','green','black','blue','orange'],souls:{red:100,green:100,black:100,blue:100,orange:100}});for(const c of s.players[p].champions)Object.assign(c,{basePow:8,hp:10,damage:0,wounds:0,armor:0,tempPow:0,tapped:false})}return s;
}
const champ=(s,p=1)=>s.players[p].champions[0];
function mon(s,id='lucertola_fuoco',owner=1){const m={uid:crypto.randomUUID(),cardId:id,owner,damage:0,tempPow:0,powMod:0,armor:0};s.board.monsters.push(m);return m}
const pass=s=>game.act(s,Number(s.priority),{type:'pass_priority'});
function drain(s){let n=0;while((s.stack.length||s.combat)&&!s.pendingChoice){assert.ok(n++<100,'trigger loop');pass(s)}}
function cast(s,id,targets={}){s.focus=1;s.players[1].hand.push(id);game.act(s,1,{type:'cast',cardId:id,targets})}
function spell(s,id,targets={}){cast(s,id,targets);drain(s)}
function end(s){game.act(s,s.focus,{type:'pass'});game.act(s,s.focus,{type:'pass'})}

const s=fresh();
spell(s,'esercito_tormenta_neve');
assert.equal(champ(s).armor,3);
for(const amount of [2,1]){
 end(s);
 assert.equal(s.status,'select');
 assert.equal(s.stack.length,0);
 for(const p of [1,2])game.act(s,p,{type:'select_cards',cardIds:s.players[p].deck.slice(0,6)});
 assert.equal(s.status,'main');
 const replay=s.stack.filter(x=>x.cardId==='esercito_tormenta_neve');
 assert.equal(replay.length,1);
 assert.equal(replay[0].meta.armor,amount);
 for(const p of [1,2])assert.equal(game.publicView(s,p).stack.filter(x=>x.cardId==='esercito_tormenta_neve').length,1);
 drain(s);
 assert.equal(champ(s).armor,amount);
 assert.equal(s.stack.length,0);
}
assert.deepEqual(s._v59Snow,[]);
console.log('Snow Army replays once after real turn selection with 2 then 1 armor and expires.');
