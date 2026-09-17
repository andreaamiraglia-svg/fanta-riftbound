import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const read=n=>fs.readFile(new URL('../soulforge/'+n,import.meta.url),'utf8');
let mutations=0;
class Node {
 constructor(cls=''){this.className=cls;this.dataset={};this.children=[];this.parent=null;this.html=''}
 appendChild(n){n.parent=this;this.children.push(n);mutations++;return n}
 prepend(n){n.parent=this;this.children.unshift(n);mutations++}
 remove(){if(this.parent){this.parent.children=this.parent.children.filter(x=>x!==this);mutations++;this.parent=null}}
 setAttribute(){}
 querySelector(sel){return this.querySelectorAll(sel)[0]||null}
 querySelectorAll(sel){const cls=sel.replace(':scope > ','').replace(/^\./,'');return this.children.filter(x=>x.className===cls)}
 get innerHTML(){return this.html}
 set innerHTML(x){this.html=x;mutations++}
 getBoundingClientRect(){return {left:10,top:10,width:100,height:140}}
}
const tests=[];const test=(n,fn)=>tests.push([n,fn]);
test('Board decoration reaches a stable DOM and updates only changed empty slots',async()=>{
 const code=await read('fantasy-board-v30.js'),lane=new Node();
 lane.appendChild(new Node('monster'));lane.appendChild(new Node('monster'));
 const grid={querySelector:sel=>sel==='.monsters'?lane:null};
 const c=vm.createContext({queued:false,document:{querySelector:sel=>sel==='.game-grid'?grid:null,createElement:()=>new Node()}});
 vm.runInContext(code.slice(code.indexOf('function decorateReferenceBoard'),code.indexOf('function queue')),c);
 c.decorateReferenceBoard();assert.equal(lane.querySelectorAll('.sf-empty-monster-slot').length,4);
 const before=mutations;for(let i=0;i<12;i++)c.decorateReferenceBoard();assert.equal(mutations,before);
 lane.appendChild(new Node('monster'));c.decorateReferenceBoard();assert.equal(lane.querySelectorAll('.sf-empty-monster-slot').length,3);
});
test('Stack thumbnails retain their nodes across observer callbacks',async()=>{
 const code=await read('new-monsters-wave15-v84.js'),card=new Node('stack-card');
 const s={stack:[{targetCards:[{cardId:'scarlet',name:'Scarlet'}]}]};
 const c=vm.createContext({state:()=>s,targetCards:item=>item?.targetCards||[],art:id=>id+'.webp',esc:x=>x,
 document:{querySelectorAll:sel=>sel==='.stack-card'?[card]:[],createElement:()=>new Node()}});
 vm.runInContext(code.slice(code.indexOf('function decorateStack'),code.indexOf('function style')),c);
 c.decorateStack();const node=card.children[0],before=mutations;for(let i=0;i<12;i++)c.decorateStack();
 assert.equal(mutations,before);assert.equal(card.children[0],node);
 s.stack[0].targetCards=[];c.decorateStack();assert.equal(card.children.length,0);
});
test('Corazza and nested targets have identical deduplicated arrows for both viewers',async()=>{
 const code=await read('grave-targets-v4.js');
 for(const player of [1,2]){
  const target={type:'champion',player:1,champId:'grinn'};
  const c=vm.createContext({session:{player,state:{cardDefs:{},combat:null}}});
  vm.runInContext(code.slice(code.indexOf('function uniqueTargets'),code.indexOf('function line')),c);
  assert.equal(c.uniqueTargets({actor:1,cardId:'corazza_dei_caduti',targetRefs:[target],targets:{target}}).length,1);
  const refs=c.uniqueTargets({actor:1,targets:{enemies:[target,{type:'monster',uid:'m1'}]},targetRefs:[target]});
  assert.equal(refs.length,2);
 }
});
test('Spell layer draws one Corazza arrow and no duplicate combat arrow',async()=>{
 const code=await read('grave-targets-v4.js'),source=new Node(),target=new Node(),svg=new Node();
 const s={combat:{attacker:{player:1,champId:'grinn'},target:{type:'champion',player:2,champId:'scarlet'}},stack:[{uid:'s1',actor:1,cardId:'corazza_dei_caduti',targets:{target:{type:'champion',player:1,champId:'grinn'}}}],cardDefs:{}};
 const c=vm.createContext({session:{state:s},ensureArrowLayer:()=>svg,targetEl:()=>target,
 document:{querySelectorAll:()=>[source],querySelector:()=>source}});
 vm.runInContext(code.slice(code.indexOf('function mid'),code.indexOf('function enhance()')),c);
 c.drawArrows();assert.equal((svg.innerHTML.match(/<line /g)||[]).length,1);
 s.stack=[];c.drawArrows();assert.equal((svg.innerHTML.match(/<line /g)||[]).length,0);
});
test('Hand hover stays stable near overlap edges and old listeners are removed on redraw',async()=>{
 const code=await read('hand-v11.js');
 class Events{constructor(){this.events={}}addEventListener(n,f,o={}){(this.events[n]||=[]).push({f,signal:o.signal})}fire(n,e){for(const x of this.events[n]||[])if(!x.signal?.aborted)x.f(e)}}
 const classes=()=>{const set=new Set();return{add:(...ns)=>ns.forEach(n=>set.add(n)),remove:(...ns)=>ns.forEach(n=>set.delete(n)),contains:n=>set.has(n)}};
 const cards=()=>[-82,0,82].map(x=>({dataset:{},offsetWidth:122,classList:classes(),style:{transform:'translate('+x+'px, 0px) rotate(0deg)',setProperty(n,v){this[n]=v},removeProperty(n){delete this[n]}}}));
 const fan=()=>Object.assign(new Events(),{dataset:{},classList:classes(),cards:cards(),querySelectorAll(){return this.cards},getBoundingClientRect:()=>({left:0,width:600,bottom:300})});
 let current=fan();const doc=Object.assign(new Events(),{querySelector:()=>current}),win=new Events();
 const c=vm.createContext({document:doc,window:win,AbortController,innerHeight:800,session:{state:{status:'main'}},render:()=>{},requestAnimationFrame:f=>f(),setTimeout:f=>f()});
 vm.runInContext(code,c);
 doc.fire('pointermove',{clientX:361,clientY:210});assert.ok(current.cards[1].classList.contains('sf-hand-focus'));
 assert.ok(current.cards[1].style.transform.includes('scale(1.967'));
 doc.fire('pointermove',{clientX:361,clientY:50});assert.ok(current.cards[1].classList.contains('sf-hand-focus'),'zoom stays open inside the enlarged card');
 doc.fire('pointermove',{clientX:404,clientY:210});assert.ok(current.cards[1].classList.contains('sf-hand-focus'));
 doc.fire('pointermove',{clientX:450,clientY:210});assert.ok(current.cards[1].classList.contains('sf-hand-focus'),'moving over a neighbour inside the zoom does not switch cards');
 current=fan();c.render();assert.ok(current.cards[1].classList.contains('sf-hand-focus'),'redraw retains the card identity rather than selecting the neighbour');
 for(let i=0;i<30;i++){doc.fire('pointermove',{clientX:450,clientY:299+i%3});assert.ok(current.cards[1].classList.contains('sf-hand-focus'),'the strip vacated by lifting cannot restart hover');}
 doc.fire('pointermove',{clientX:500,clientY:210});assert.ok(current.cards[2].classList.contains('sf-hand-focus'),'leaving the expanded card can select the next card');
 current.fire('pointerdown',{});
 doc.fire('pointermove',{clientX:361,clientY:210});assert.ok(current.cards[2].classList.contains('sf-hand-focus'));
 doc.fire('pointerup',{});
 doc.fire('pointermove',{clientX:0,clientY:0});assert.ok(current.cards.every(x=>!x.classList.contains('sf-hand-focus')));
 doc.fire('pointermove',{clientX:361,clientY:210});assert.ok(current.cards[1].classList.contains('sf-hand-focus'));
 current=fan();c.render();assert.ok(current.cards[1].classList.contains('sf-hand-focus'),'redraw retains the hovered card');
 assert.equal(current.cards[1].style['z-index'],'120');
 doc.fire('pointermove',{clientX:0,clientY:0});assert.ok(current.cards.every(x=>!x.classList.contains('sf-hand-focus')));
 for(let i=0;i<8;i++){current=fan();c.render()}
 assert.equal(doc.events.pointermove.filter(x=>!x.signal.aborted).length,1);
 assert.equal(win.events.blur.filter(x=>!x.signal.aborted).length,1);
});
test('Hand hover opens no details; right click explicitly opens them',async()=>{
 const code=await read('right-click-preview.js'),handlers={};let scheduled=0,shown=0;
 class Element{closest(selector){return selector.includes('hand-card')?this:null}}
 const target=new Element();
 const c=vm.createContext({Element,document:{addEventListener:(name,fn)=>handlers[name]=fn},cancelHoverTimer(){},hoverRoot:null,openedMode:null,close(){},refFromTarget:()=>({id:'card'}),artUrl:()=>'/card.webp',show:()=>shown++,previewRoot:()=>target,setTimeout:()=>scheduled++});
 vm.runInContext(code.slice(code.indexOf("document.addEventListener('contextmenu'"),code.indexOf("document.addEventListener('mousemove'")),c);
 handlers.mouseover({target});assert.equal(scheduled,0);assert.equal(shown,0);
 handlers.contextmenu({target,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}});assert.equal(shown,1);
});
test('Opponent hand decoration does not retrigger its own observer',async()=>{
 const code=await read('coin-hand-v40.js');let writes=0,count=6;
 const badge={dataset:{},set innerHTML(v){writes++}};
 const info={querySelector:()=>badge},zone={querySelector:()=>info};
 const c=vm.createContext({gameState:()=>({}),getPlayer:()=>({handCount:count}),opponentId:()=>2,document:{querySelector:()=>zone}});
 vm.runInContext(code.slice(code.indexOf('function decorateOpponentHand'),code.indexOf('function closeCoin')),c);
 for(let i=0;i<100;i++)c.decorateOpponentHand();assert.equal(writes,1);
 count=5;c.decorateOpponentHand();assert.equal(writes,2);
});
test('Artwork layers do not grow when the decorators alternate',async()=>{
 const ui=await read('ui-v2.js'),helper=ui.slice(ui.indexOf('window.sfHasLayer='),ui.indexOf('const BASE='));
 const c=vm.createContext({window:{sfArtUrl21:()=>''},BASE:'/',ART:{},ownUrl:()=>'',art:()=>''});vm.runInContext(helper,c);
 for(const [file,start,end,name] of [['new-set-art-v73.js','function installResolver','let queued','install73'],['latest-set-v82.js','function installArt','function elementId','install82'],['new-monsters-wave15-v84.js','function installResolver','function idOf','install84']]){
  const code=await read(file);vm.runInContext(code.slice(code.indexOf(start),code.indexOf(end,code.indexOf(start))).replace(start,'function '+name),c);
 }
 for(let i=0;i<100;i++){c.install73();c.install82();c.install84();}
 let depth=0;for(let fn=c.window.sfArtUrl21;fn;fn=fn.__previous)depth++;
 assert.equal(depth,4);
});
for(const [n,fn]of tests){await fn();console.log('✓ '+n)}
console.log(tests.length+' visual behavior tests passed');
