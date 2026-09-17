import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function classes(){const s=new Set();return {add(...xs){xs.forEach(x=>s.add(x))},remove(...xs){xs.forEach(x=>s.delete(x))},contains:x=>s.has(x)}}
const cards=Array.from({length:6},(_,i)=>({
  dataset:{handCard:'card-'+i},offsetWidth:122,classList:classes(),
  style:{transform:`translate(${(i-2.5)*55}px,0px) rotate(0deg)`,zIndex:String(10+i),setProperty(k,v){this[k]=v},removeProperty(k){delete this[k]}}
}));
const listeners={};
const fan={dataset:{},classList:classes(),querySelectorAll:()=>cards,
  getBoundingClientRect:()=>({left:0,width:800,bottom:600}),addEventListener(){}};
const context={document:{querySelector:()=>fan,addEventListener(t,f){listeners[t]=f}},
  window:{addEventListener(){}},innerHeight:900,AbortController,
  session:{state:{status:'main'}},render(){},requestAnimationFrame:f=>f(),setTimeout:f=>f()};
vm.runInNewContext(fs.readFileSync(new URL('../soulforge/hand-v11.js',import.meta.url),'utf8'),context);
function focused(){return cards.findIndex(c=>c.classList.contains('sf-hand-focus'))}
function move(x,y){listeners.pointermove({clientX:x,clientY:y})}
for(const y of [550,350]){
  move(0,0);
  move(323.5,550);
  const visited=[];
  for(let x=324;x<=599;x+=2){move(x,y);const i=focused();if(visited.at(-1)!==i)visited.push(i)}
  assert.deepEqual(visited,[0,1,2,3,4,5],`No skipped cards at height ${y}`);
  const reverse=[];
  for(let x=599;x>=324;x-=2){move(x,y);const i=focused();if(reverse.at(-1)!==i)reverse.push(i)}
  assert.deepEqual(reverse,[5,4,3,2,1,0]);
}
move(461,550);
const index=focused();
for(const y of [500,400,350,400,550]){move(461,y);assert.equal(focused(),index,'Vertical inspection remains stable')}
listeners.pointerdown?.();
move(0,0);assert.equal(focused(),-1,'Leaving the hand restores the fan');
console.log('Hand hover: both directions, raised browsing, vertical stability and exit pass.');
