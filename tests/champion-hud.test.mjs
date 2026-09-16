import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
const legacy=await fs.readFile(new URL('../soulforge/fantasy-board-v31.js',import.meta.url),'utf8');
const hud=await fs.readFile(new URL('../soulforge/card-hud-v41.js',import.meta.url),'utf8');

// Minimal DOM harness for the two independent production MutationObservers.
function fixture(){
 const frames=[],intervals=[],observers=[];let mutations=0;
 function changed(){mutations++;for(const cb of observers)cb()}
 class Node{
  constructor(cls=''){this.className=cls;this.children=[];this.dataset={};this.parentNode=null;this.classList={add:()=>{},contains:c=>this.className.split(' ').includes(c)}}
  appendChild(node){node.remove();this.children.push(node);node.parentNode=this;changed();return node}
  prepend(node){node.remove();this.children.unshift(node);node.parentNode=this;changed()}
  insertBefore(node,other){node.remove();this.children.splice(this.children.indexOf(other),0,node);node.parentNode=this;changed()}
  remove(){if(!this.parentNode)return;const parent=this.parentNode;parent.children.splice(parent.children.indexOf(this),1);this.parentNode=null;changed()}
  set innerHTML(value){this.html=value;changed()}
  querySelectorAll(selector){
   const direct=selector.startsWith(':scope > '),cls=selector.replace(':scope > ','').slice(1);
   const nodes=direct?this.children:this.children.flatMap(c=>[c,...c.descendants()]);return nodes.filter(c=>c.className.split(' ').includes(cls));
  }
  descendants(){return this.children.flatMap(c=>[c,...c.descendants()])}
  querySelector(s){return this.querySelectorAll(s)[0]||null}
 }
 const app=new Node(),champion=new Node('champ'),monster=new Node('monster');champion.dataset={owner:'1',champId:'hilda'};monster.dataset={monsterUid:'wolf'};
 app.appendChild(champion);app.appendChild(monster);
 for(const [node,kind] of [[champion,'champ'],[monster,'monster']]){node.appendChild(new Node(kind+'-art'));node.appendChild(new Node('stats'))}
 const c={id:'hilda',pow:4,hp:10,tapped:true},m={uid:'wolf',pow:3};
 const context=vm.createContext({window:{addEventListener(){}},document:{body:{classList:{contains:()=>true}},getElementById:()=>app,querySelector:()=>app,createElement:()=>new Node(),querySelectorAll:s=>s.startsWith('.champ')?[champion]:s.startsWith('.monster')?[monster]:app.querySelectorAll(s)},playerState:()=>({champions:[c]}),session:{state:{board:{monsters:[m]}}},MutationObserver:class{constructor(cb){this.cb=cb}observe(){observers.push(this.cb)}},requestAnimationFrame:cb=>frames.push(cb),setInterval:cb=>intervals.push(cb)});
 return {context,champion,monster,c,intervals,get mutations(){return mutations},get pending(){return frames.length},flush(max=20){let count=0;while(frames.length&&count++<max){const batch=frames.splice(0);for(const cb of batch)cb()}return frames.length===0}};
}
test('Champion tapped by Vincolo: the HUD settles instead of recreating legacy statistics forever',()=>{
 const f=fixture();vm.runInContext(legacy,f.context);vm.runInContext(hud,f.context);
 assert.ok(f.flush(),'The independent statistics observers keep triggering each other');
 for(const node of [f.champion,f.monster]){assert.equal(node.querySelectorAll('.sf-card-shell').length,1);assert.equal(node.querySelectorAll('.sf-card-stat-stack').length,0)}
 const count=f.mutations;for(const tick of f.intervals)tick();assert.ok(f.flush());assert.equal(f.mutations,count,'Polling unchanged cards must not change their DOM');
 f.c.tapped=false;f.c.pow=2;for(const tick of f.intervals)tick();assert.ok(f.flush());assert.equal(f.champion.querySelectorAll('.sf-card-shell').length,1);
});
test('The old statistics remain available on a page without the modern HUD',()=>{const f=fixture();vm.runInContext(legacy,f.context);assert.ok(f.flush());assert.equal(f.champion.querySelectorAll('.sf-card-stat-stack').length,1)});
const provocation=await fs.readFile(new URL('../soulforge/provocation-v24.js',import.meta.url),'utf8');
test('A tapped Champion is rendered tapped immediately and stays tapped on repeated redraws',()=>{
 const code=provocation.slice(provocation.indexOf('function patchChampHtml()'),provocation.indexOf('function injectStyle()'));
 const context=vm.createContext({champHtml:c=>'<div class="champ blue"><div class="champ-art"></div></div>',addStatClasses:x=>x,enemyGuards:()=>[]});vm.runInContext(code+';patchChampHtml();',context);
 for(let i=0;i<10;i++)assert.match(context.champHtml({id:'hilda',tapped:true},1,true),/class="champ blue sf-tapped"/);
 assert.doesNotMatch(context.champHtml({id:'hilda',tapped:false},1,true),/sf-tapped/);
 assert.doesNotMatch(context.champHtml({id:'hilda',tapped:true,defeated:true},1,true),/sf-tapped/);
 assert.match(context.champHtml({id:'hilda',tapped:true},2,false),/sf-tapped/);
});
