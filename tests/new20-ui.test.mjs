import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as first from '../soulforge/september-catalog.js';
import * as wave from '../soulforge/new20-catalog.js';
import * as wave63 from '../soulforge/batch3-catalog.js';
let built;
let source=await fs.readFile(new URL('../soulforge/deck-builder-v27-loader.js',import.meta.url),'utf8');
source=source.replace("await import('./september-catalog.js')",JSON.stringify(first)).replace("await import('./new20-catalog.js')",JSON.stringify(wave)).replace("await import('./batch3-catalog.js')",JSON.stringify(wave63)).replace('(0,eval)(js)','capture(js)');
const fetch=async path=>new Response(await fs.readFile(new URL('../soulforge/'+path.split('/').pop(),import.meta.url),'utf8'));
await new Function('fetch','window','capture',source)(fetch,{},s=>built=s);
for(let i=0;i<30&&!built;i++)await new Promise(r=>setTimeout(r,10));
assert.ok(built,'Deck builder compilation failed');
const prefix=built.slice(0,built.indexOf('const RULES=')).replace(/^\s*\(\(\)\s*=>\s*\{/, '');
const pools=new Function(prefix+'return {CARDS,MONSTERS,V27_ART};')();
assert.equal(new Set(pools.CARDS.map(x=>x.id)).size,pools.CARDS.length);
assert.equal(new Set(pools.MONSTERS.map(x=>x.id)).size,pools.MONSTERS.length);
for(const d of [...wave.cards,...wave63.cards]){assert.ok(pools.CARDS.some(x=>x.id===d.id&&x.cost===d.cost));assert.equal(pools.V27_ART[d.id],d.art)}
for(const d of wave.monsters){assert.ok(pools.MONSTERS.some(x=>x.id===d.id&&x.pow===d.pow));assert.equal(pools.V27_ART[d.id],d.art)}
assert.ok(pools.CARDS.every((x,i,a)=>!i||x.cost>=a[i-1].cost));
assert.ok(pools.MONSTERS.every((x,i,a)=>!i||x.pow>=a[i-1].pow));
const defaultExpression=built.match(/const defaultDeck=([^;]+);/)[1];
const deck=new Function(prefix+'return ('+defaultExpression+')();')();
assert.equal(deck.cards.length,18);
assert.equal(deck.monsters.length,12);
console.log('Deck builder: 20 new cards, unique IDs, artwork, sorted cost/POW and valid 18/12 default verified.');

const black=pools.CARDS.find(c=>c.id==='richiamo_del_branco'),green=pools.CARDS.find(c=>c.id==='richiamo_del_branco_verde');
assert.equal(black.name,'Richiamo del Branco (Nero)');assert.equal(green.name,'Richiamo del Branco (Verde)');assert.equal(black.color,'black');assert.equal(green.color,'green');assert.equal(black.cost,2);assert.equal(green.cost,0);assert.equal(pools.V27_ART[black.id],'richiamo-del-branco-nero.webp');assert.equal(pools.V27_ART[green.id],'richiamo-del-branco-verde.webp');
