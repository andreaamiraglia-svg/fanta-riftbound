import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';
const source=await fs.readFile(new URL('../soulforge/combat-priority-v44.js',import.meta.url),'utf8');
function setup(move){
 let click;const button={disabled:false,textContent:'Passa priorità',isConnected:true};
 const context={session:{player:1,state:{status:'main',priority:1,stack:[{}]}},busy:false,move,window:{},showError:()=>{},document:{body:{classList:{remove(){}}},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,addEventListener:(_,fn)=>click=fn}};
 vm.runInNewContext(source,context);
 return {button,context,click:()=>click({target:{closest:()=>button},preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}})};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
test('priority with a card in stack sends one move even on repeated clicks',async()=>{
 let calls=0,finish;const fixture=setup(()=>{calls++;return new Promise(r=>finish=r)});
 fixture.click();fixture.click();assert.equal(calls,1);assert.equal(fixture.button.disabled,true);
 finish();await settle();assert.equal(fixture.button.disabled,false);
});
test('failed pass restores the button so it can be retried',async()=>{
 let calls=0;const fixture=setup(()=>{calls++;return Promise.reject(new Error('network'))});
 fixture.click();await settle();assert.equal(fixture.button.disabled,false);assert.equal(fixture.button.textContent,'Passa priorità');
 fixture.click();await settle();assert.equal(calls,2);
});
test('busy requests and pending choices do not send a pass',()=>{
 let calls=0;const fixture=setup(()=>{calls++});fixture.context.busy=true;fixture.click();fixture.context.busy=false;
 fixture.context.session.state.pendingChoice={};fixture.click();assert.equal(calls,0);
});
test('the main toolbar never flashes the recycling control, available in the grave modal',async()=>{
 for(const file of ['ui-v2.js','set1-v17.js']){
  const text=await fs.readFile(new URL('../soulforge/'+file,import.meta.url),'utf8');
  const start=text.indexOf('mainControls=function()');const end=text.indexOf('\nrenderMain=',start);
  const context={session:{player:1,state:{priority:null,focus:1,stack:[]}},playerState:()=>({graveCards:[{}],monsterGrave:[],souls:{red:0,green:0,black:0}}),canRevivePhoenix:()=>false};
  vm.runInNewContext(text.slice(start,end),context);assert.ok(!context.mainControls().includes('Ricicla'));assert.ok(context.mainControls().includes('Passa'));
  context.session.state.priority=1;assert.ok(context.mainControls().includes('Passa priorità'));
 }
});
