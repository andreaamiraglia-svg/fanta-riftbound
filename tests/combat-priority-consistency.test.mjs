import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
globalThis.fetch=async u=>new Response(await fs.readFile(new URL('../soulforge/'+String(u).split('/').pop().split('?')[0],import.meta.url),'utf8'));
const g=await import('../soulforge/game-v67-loader.ts');
const deck={champions:['kael','lyrandel'],cards:Object.values(g.CARD_DEFS).filter(x=>['red','green'].includes(x.color)&&!x.tokenSupport).slice(0,18).map(x=>x.id),monsters:Object.values(g.MONSTER_DEFS).filter(x=>['red','green'].includes(x.color)).slice(0,12).map(x=>x.id)};
for(const attacker of [1,2]){
 const s=g.newState('A',deck);s.players[2]=g.newPlayer('B',deck);
 Object.assign(s,{status:'main',turn:3,focus:attacker,priority:null,stack:[],combat:null,pendingChoice:null,triggerQueue:[],enterQueue:[],board:{monsters:[]}});
 for(const p of [1,2])s.players[p].selected=true;
 g.act(s,attacker,{type:'attack',champId:'kael',target:{type:'champion',player:3-attacker,champId:'kael'}});
 assert.equal(s.priority,3-attacker);
 for(const viewer of [1,2]){assert.equal(g.publicView(s,viewer).priority,3-attacker);assert.equal(s.priority,3-attacker);}
 g.act(s,3-attacker,{type:'pass_priority'});assert.equal(s.priority,attacker);assert.equal(s.combatPasses,1);
 for(let i=0;i<3;i++)for(const viewer of [1,2]){assert.equal(g.publicView(s,viewer).priority,attacker);assert.equal(s.priority,attacker);assert.equal(s.combatPasses,1);}
 assert.throws(()=>g.act(structuredClone(s),3-attacker,{type:'pass_priority'}),/priorità/);
 g.act(s,attacker,{type:'pass_priority'});assert.equal(s.combat,null);
}
console.log('Both combat windows preserve authoritative priority for both viewers and accept the correct player.');
