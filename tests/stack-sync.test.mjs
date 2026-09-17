import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const source=await fs.readFile(new URL('../soulforge/stability-v10.js',import.meta.url),'utf8');
const tests=[];
const test=(name,fn)=>tests.push([name,fn]);
function client(player=1){
 let rendered=[],fail=false,requests=[],errors=[];
 const c=vm.createContext({session:{room:'QA',token:'token'+player,player,version:1,state:{stack:[]}},busy:false,
 render:()=>{if(fail){fail=false;throw Error('render failed')}rendered.push(c.session.state.stack.map(x=>x.cardId))},
 post:async p=>{requests.push(p);return {player,version:2,state:{stack:[{cardId:'vincolo_di_brina'}]}}},
 stopPolling:()=>{},renderLanding:()=>{},localStorage:{removeItem:()=>{}},showError:e=>errors.push(e),console:{error:()=>{}}});
 vm.runInContext(source,c);
 return {c,rendered,requests,errors,fail:()=>{fail=true}};
}
test('Old and new cards appear for caster and opponent through move and polling',async()=>{
 for(const id of ['berserk','vincolo_di_brina','scambio_di_anime']){
  const a=client(1),b=client(2);
  for(const x of [a,b])x.c.post=async()=>({player:x.c.session.player,version:2,state:{stack:[{cardId:id}]}});
  await a.c.move({type:'cast',cardId:id});await b.c.refresh();
  assert.deepEqual(a.rendered,[[id]]);assert.deepEqual(b.rendered,[[id]]);
  await b.c.refresh();assert.equal(b.rendered.length,1);
 }
});
test('Failed render retries at the same server version instead of freezing the chain',async()=>{
 const x=client();x.fail();await x.c.refresh();assert.equal(x.rendered.length,0);
 await x.c.refresh();assert.deepEqual(x.rendered,[['vincolo_di_brina']]);
});
test('Late poll cannot roll back a completed cast',async()=>{
 const x=client();let resolve;
 x.c.post=async p=>p.action==='get'?new Promise(r=>resolve=r):({player:1,version:3,state:{stack:[{cardId:'berserk'}]}});
 const poll=x.c.refresh();await x.c.move({type:'cast',cardId:'berserk'});
 resolve({player:1,version:2,state:{stack:[]}});await poll;
 assert.equal(x.c.session.version,3);assert.deepEqual(x.rendered,[['berserk']]);
});
test('STATE_CONFLICT resynchronizes after releasing busy',async()=>{
 const x=client();x.c.post=async p=>{x.requests.push(p);if(p.action==='move')throw Error('STATE_CONFLICT');return {player:1,version:2,state:{stack:[{cardId:'berserk'}]}}};
 await x.c.move({type:'cast',cardId:'berserk'});
 assert.deepEqual(x.requests.map(x=>x.action),['move','get']);assert.equal(x.c.busy,false);assert.deepEqual(x.rendered,[['berserk']]);
});
test('Polling is serialized and ignores responses from a previous room',async()=>{
 const x=client();let resolve,n=0;x.c.post=()=>{n++;return new Promise(r=>resolve=r)};
 const p=x.c.refresh();await x.c.refresh();assert.equal(n,1);
 x.c.session.room='OTHER';resolve({player:1,version:2,state:{stack:[{cardId:'berserk'}]}});await p;assert.equal(x.c.session.version,1);assert.equal(x.rendered.length,0);
});
for(const [name,fn]of tests){await fn();console.log('✓ '+name)}
console.log(tests.length+' synchronization tests passed');
