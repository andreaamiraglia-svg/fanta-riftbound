import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),realFetch=globalThis.fetch;
globalThis.fetch=async input=>String(input).includes('/game-v22.p')?new Response(await fs.readFile(path.join(root,'soulforge',String(input).split('/').pop().split('?')[0]),'utf8')):realFetch(input);
const game=await import('../soulforge/game-v61-loader.ts');
const {cards}=await import('../soulforge/september-catalog.js');
const deck={champions:['scarlet','torvald'],cards:Object.values(game.CARD_DEFS).filter(c=>['red','green'].includes(c.color)&&!c.tokenSupport).slice(0,18).map(c=>c.id),monsters:Object.values(game.MONSTER_DEFS).filter(c=>['red','green'].includes(c.color)).slice(0,12).map(c=>c.id)};
let s,version=1;
function reset(){
 s=game.newState('QA Alice',deck);s.players[2]=game.newPlayer('QA Bob',deck);Object.assign(s,{status:'main',turn:3,focus:1,stack:[],priority:null,pendingChoice:null,board:{monsters:[]},enterQueue:[],triggerQueue:[]});
 for(const p of [1,2]){const q=s.players[p];q.deckColors=['red','green','blue','black','orange'];q.souls={red:100,green:100,blue:100,black:100,orange:100};q.selected=true;q.hand=cards.map(c=>c.id);for(const c of q.champions){c.hp=10;c.basePow=4;c.damage=1}}
 for(const [cardId,owner] of [['lucertola_fuoco',1],['custode_sepolcrale',1],['marionetta_maledetta',2]])s.board.monsters.push({uid:crypto.randomUUID(),cardId,owner,damage:0,powMod:0,tempPow:0,armor:0});
}
reset();
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://127.0.0.1');
 if(url.pathname==='/api'&&req.method==='POST'){
  let raw='';for await(const chunk of req)raw+=chunk;const body=JSON.parse(raw),p=body.token==='qa2'?2:1;
  if(body.action==='reset')reset();
  if(body.action==='move'){game.act(s,p,body.move);version++}
  res.setHeader('content-type','application/json');res.end(JSON.stringify({roomCode:'QATEST',player:p,token:p===1?'qa1':'qa2',state:game.publicView(s,p),version}));return;
 }
 let file=url.pathname==='/'?'soulforge/index.html':url.pathname==='/api'?'soulforge/base-app.html':url.pathname.startsWith('/champion-of-the-souls-carte-ottimizzate/')?url.pathname.slice(1):'soulforge/'+url.pathname.slice(1);
 const full=path.resolve(root,file);if(!full.startsWith(root+path.sep))throw Error('Invalid path');
 let data=await fs.readFile(full);if(file==='soulforge/index.html')data=Buffer.from(data.toString().replace('https://gmunayvayjzzyrigaesx.supabase.co/functions/v1/soulforge','http://127.0.0.1:8765/api'));
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.txt':'text/plain'}[path.extname(file)]||'application/octet-stream';res.setHeader('content-type',mime);res.end(data);
 }catch(e){res.statusCode=400;res.setHeader('content-type','application/json');res.end(JSON.stringify({error:e.message}))}});
server.listen(8765,'127.0.0.1',()=>console.log('QA server http://127.0.0.1:8765'));
