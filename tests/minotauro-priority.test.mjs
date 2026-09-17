import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
globalThis.fetch=async input=>new Response(await fs.readFile(new URL('../soulforge/'+String(input).split('/').pop().split('?')[0],import.meta.url),'utf8'));
const game=await import('../soulforge/game-v63-loader.ts');
const deck={champions:['kael','lyrandel'],cards:Object.values(game.CARD_DEFS).filter(x=>['red','green'].includes(x.color)&&!x.tokenSupport).slice(0,18).map(x=>x.id),monsters:Object.values(game.MONSTER_DEFS).filter(x=>['red','green'].includes(x.color)).slice(0,12).map(x=>x.id)};
function opening(){
 const s=game.newState('A',deck);s.players[2]=game.newPlayer('B',deck);s.status='select';s.turn=1;s.focus=1;
 s.players[1].monsterDeck=['minotauro_infernale'];s.players[2].monsterDeck=['drago_delle_ceneri'];
 for(const p of [1,2])game.act(s,p,{type:'select_cards',cardIds:s.players[p].deck.slice(0,6)});
 return s;
}
const s=opening();assert.equal(s.pendingChoice.type,'v52_minotauro_discard');
const held=s.stack.map(x=>x.uid);let n=0;
while(s.pendingChoice?.type==='v52_minotauro_discard'){assert.ok(n++<4);const pc=s.pendingChoice;game.act(s,pc.player,{type:'resolve_choice',cardId:pc.cardIds[0]});}
assert.deepEqual(s.stack.map(x=>x.uid),held);assert.ok([1,2].includes(s.priority),'priority must resume after the Minotauro discards');
assert.equal(game.publicView(s,1).priority,s.priority);assert.equal(game.publicView(s,2).priority,s.priority);
while(s.stack.length){game.act(s,s.priority,{type:'pass_priority'});}
assert.ok(s.board.monsters.find(m=>m.cardId==='minotauro_infernale').damage>=1,'the Dragon resolves');
// Recover rooms saved before this fix, whose stack was left without priority.
const old=opening();old.pendingChoice=null;delete old._v52MinotauroDiscards;delete old._v52MinotauroResume;old.priority=null;
assert.ok([1,2].includes(game.publicView(old,1).priority));game.act(old,old.priority,{type:'pass_priority'});
console.log('Minotauro discards resume Dragon priority; legacy stuck rooms recover.');
