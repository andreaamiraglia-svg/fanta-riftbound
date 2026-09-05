import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const nativeFetch=globalThis.fetch;
globalThis.fetch=async input=>{
 const url=String(input);
 if(url.includes('raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p')){
  const name=url.split('/').pop().split('?')[0];
  return new Response(await fs.readFile(new URL(`../soulforge/${name}`,import.meta.url),'utf8'),{status:200});
 }
 return nativeFetch(input);
};

const game=await import('../soulforge/game-v60-loader.ts?unit-tests=1');

const RED_GREEN_MONSTERS=[
 'scorpione_delle_ceneri','gigante_del_cratere','cinghiale_zannaverde','gorilla_della_giungla',
 'lucertola_fuoco','segugio_infernale','fenice_cremisi','golem_magmatico','drago_delle_ceneri',
 'ragno_dei_germogli','orso_furioso','cervo_antico'
];
const BLACK_BLUE_MONSTERS=[
 'medusa_delle_maree','elementale_della_brina','marionetta_maledetta','verme_delle_tombe',
 'segugio_dei_morti','custode_sepolcrale','cavaliere_senza_volto','cerbero','re_dei_non_morti',
 'squalo_delle_maree','lupo_glaciale','grifone_della_tempesta'
];

function deck(champions,monsters){
 const colors=champions.map(id=>game.CHAMPION_DEFS[id].color);
 const cards=Object.values(game.CARD_DEFS).filter(c=>colors.includes(c.color)&&!c.tokenSupport).slice(0,18).map(c=>c.id);
 assert.equal(cards.length,18);
 return{champions,cards,monsters};
}
function fresh(){
 const state=game.newState('Alice',deck(['scarlet','torvald'],RED_GREEN_MONSTERS));
 state.players['2']=game.newPlayer('Bob',deck(['grinn','valtheris'],BLACK_BLUE_MONSTERS));
 state.status='main';state.turn=3;state.focus=1;state.priority=null;state.priorityPasses=0;state.mainPasses=0;
 state.stack=[];state.stackInitiator=null;state.combat=null;state.pendingChoice=null;state.triggerQueue=[];state.enterQueue=[];
 state.board={monsters:[]};state.log=[];
 for(const p of [1,2]){state.players[String(p)].selected=true;state.players[String(p)].hand=[];state.players[String(p)].grave=[];state.players[String(p)].monsterGrave=[]}
 champion(state,2,'valtheris')._valtherisStartArmorTurn=3;
 return state;
}
function m(id,owner=1,extra={}){return{uid:crypto.randomUUID(),cardId:id,owner,damage:0,tempPow:0,powMod:0,armor:0,...extra}}
function cardItem(cardId,actor,targets={}){return{uid:crypto.randomUUID(),kind:'card',actor,cardId,targets,paidCost:0}}
function effectItem(effectId,sourceCardId,actor,targets={},meta={}){return{uid:crypto.randomUUID(),kind:'effect',actor,sourceCardId,effectId,effectName:`Test — ${sourceCardId}`,targets,meta}}
function resolveTop(state){assert.ok(state.stack.length);assert.ok([1,2].includes(Number(state.priority)));game.act(state,Number(state.priority),{type:'pass_priority'})}
function champion(state,p,id){return state.players[String(p)].champions.find(c=>c.id===id)}

const tests=[];
function test(name,fn){tests.push([name,fn])}

test('le 10 definizioni nuove sono esportate e valide',()=>{
 for(const id of [...RED_GREEN_MONSTERS.slice(0,4),...BLACK_BLUE_MONSTERS.slice(0,4),'ariete_sacro','guardiano_del_tesoro']){
  assert.ok(game.MONSTER_DEFS[id],id);assert.ok(game.STARTER_MONSTERS.includes(id),id);
 }
});

test('Ariete Sacro previene solo il primo pacchetto di danni per Campione',()=>{
 const s=fresh();s.board.monsters=[m('ariete_sacro',1)];s.players['1'].deck=[];s.players['1'].hand=[];
 s.stack=[cardItem('galeone_fantasma',1)];s.priority=2;resolveTop(s);
 for(const c of s.players['2'].champions){assert.equal(c.wounds,1);assert.equal(c.damage,0);assert.equal(c._v60ArietePreventTurn,3)}
 assert.equal(s.log.filter(x=>x.includes('Ariete Sacro previene')).length,2);
 assert.equal(s.log.some(x=>x.includes('usa 3 Armatura')),false);
});

test('Gorilla della Giungla impedisce danni a un Campione con 1 HP rimasto',()=>{
 const s=fresh(),target=champion(s,2,'grinn');target.wounds=target.hp-1;target.armor=2;
 s.board.monsters=[m('gorilla_della_giungla',1)];s.stack=[cardItem('fendente_di_fuoco',1,{enemy:{type:'champion',player:2,champId:'grinn'}})];s.priority=2;resolveTop(s);
 assert.equal(target.wounds,target.hp-1);assert.equal(target.damage,0);assert.equal(target.armor,2);
 assert.ok(s.log.some(x=>x.includes('Gorilla della Giungla previene')));
});

test('Gorilla protegge subito un Campione sceso a 1 HP tra due salve',()=>{
 const s=fresh(),target=champion(s,2,'grinn');target.wounds=target.hp-2;
 s.board.monsters=[m('gorilla_della_giungla',1)];s.players['1'].deck=[];s.players['1'].hand=[];
 s.stack=[cardItem('galeone_fantasma',1)];s.priority=2;resolveTop(s);
 assert.equal(target.wounds,target.hp-1);assert.equal(target.defeated,false);
 assert.ok(s.log.some(x=>x.includes(`Gorilla della Giungla previene 3 danni a ${target.name}`)));
});

test('Medusa delle Maree sostituisce la riduzione di POW con danni',()=>{
 const s=fresh();s.board.monsters=[m('medusa_delle_maree',2)];
 s.stack=[cardItem('valanga',1)];s.priority=2;resolveTop(s);
 for(const c of s.players['2'].champions){assert.equal(c.tempPow,0);assert.equal(c.damage,2)}
 assert.ok(s.log.some(x=>x.includes('Medusa delle Maree converte la riduzione')));
});

test('Gigante del Cratere crea un effetto in Catena dopo aver subito danni',()=>{
 const s=fresh(),giant=m('gigante_del_cratere',2);s.board.monsters=[giant];
 s.stack=[cardItem('taglio_ninjitsu',1,{monsterUid:giant.uid})];s.priority=2;resolveTop(s);
 assert.equal(giant.damage,2);assert.equal(s.stack.at(-1)?.effectId,'v60_gigante_hit');
 resolveTop(s);for(const c of s.players['2'].champions)assert.equal(c.damage,1);
});

test('Scorpione delle Ceneri mostra e scarta la carta scelta dal killer',()=>{
 const s=fresh(),scorpion=m('scorpione_delle_ceneri',2);s.board.monsters=[scorpion];
 s.players['1'].hand=['stupido'];champion(s,1,'scarlet').defeated=true;
 s.stack=[cardItem('taglio_ninjitsu',1,{monsterUid:scorpion.uid})];s.priority=2;resolveTop(s);
 assert.equal(s.pendingChoice?.type,'trigger_target');assert.equal(s.pendingChoice?.options?.[0]?.cardId,'stupido');
 game.act(s,1,{type:'resolve_choice',choice:'stupido'});resolveTop(s);
 assert.equal(s.players['1'].hand.includes('stupido'),false);assert.ok(s.players['1'].grave.includes('stupido'));
});

test('Marionetta Maledetta bandisce la carta scelta dal Cimitero avversario',()=>{
 const s=fresh(),puppet=m('marionetta_maledetta',2,{damage:3});s.board.monsters=[puppet];s.players['2'].grave=['flusso_gelido'];
 s.stack=[cardItem('taglio_ninjitsu',1,{monsterUid:puppet.uid})];s.priority=2;resolveTop(s);
 assert.equal(s.pendingChoice?.options?.[0]?.cardId,'flusso_gelido');
 game.act(s,1,{type:'resolve_choice',choice:'flusso_gelido'});resolveTop(s);
 assert.equal(s.players['2'].grave.includes('flusso_gelido'),false);assert.ok(s.players['2'].banishedCards.includes('flusso_gelido'));
});

test('Verme delle Tombe consente fino a 3 scelte illustrate e attiva gli effetti di entrata',()=>{
 const s=fresh();s.status='select';s.players['2'].selected=false;s.players['1'].monsterDeck=['verme_delle_tombe','gigante_del_cratere'];s.players['2'].monsterDeck=[];
 s.players['1'].monsterGrave=['cinghiale_zannaverde','scorpione_delle_ceneri','ghoul_affamato','gigante_del_cratere'];
 game.act(s,2,{type:'select_cards',cardIds:s.players['2'].deck.slice(0,6)});
 const view=game.publicView(s,1);assert.equal(s.pendingChoice.type,'v60_multi_target');assert.equal(view.pendingChoice.options.length,3);
 assert.ok(view.pendingChoice.options.every(o=>o.cardId));
 game.act(s,1,{type:'resolve_choice',choices:view.pendingChoice.options.map(o=>o.id)});resolveTop(s);
 assert.ok(s.board.monsters.some(x=>x.cardId==='cinghiale_zannaverde'));
 assert.ok(s.board.monsters.some(x=>x.cardId==='scorpione_delle_ceneri'));
 assert.ok(s.board.monsters.some(x=>x.cardId==='ghoul_affamato'));
 assert.equal(s.board.monsters.filter(x=>x.cardId==='gigante_del_cratere').length,1);
 assert.ok(s.players['1'].monsterGrave.includes('gigante_del_cratere'));
 assert.equal(s.stack.at(-1)?.effectId,'v60_cinghiale_enter');resolveTop(s);
 assert.equal(s.board.monsters.find(x=>x.cardId==='cinghiale_zannaverde').tempPow,2);
});

test('Elementale della Brina ottiene 2 Armatura tramite il proprio trigger',()=>{
 const s=fresh(),ice=m('elementale_della_brina',2);s.board.monsters=[ice];s.stack=[effectItem('v60_elementale_enter','elementale_della_brina',2,{}, {uid:ice.uid})];s.priority=1;resolveTop(s);
 assert.equal(ice.armor,2);
});

test('Guardiano del Tesoro aggiunge una sola pesca al suo proprietario',()=>{
 const s=fresh(),beetle=m('scarabeo_dorato',1,{damage:1});s.board.monsters=[m('guardiano_del_tesoro',1),beetle];
 s.players['1'].deck=['taglio_fiammante','sfera_incandescente'];s.players['1'].hand=[];
 s.stack=[cardItem('taglio_ninjitsu',1,{monsterUid:beetle.uid})];s.priority=2;resolveTop(s);
 assert.equal(s.players['1'].deck.length,0);assert.equal(s.players['1'].hand.length,2);
 assert.equal(s.log.filter(x=>x.includes('Guardiano del Tesoro: Alice pesca')).length,1);
});

test('Guardiano del Tesoro non aggiunge carte alle pescate avversarie',()=>{
 const s=fresh(),beetle=m('scarabeo_dorato',2,{damage:1});s.board.monsters=[m('guardiano_del_tesoro',1),beetle];
 s.players['2'].deck=['flusso_gelido','scudo_di_gelo'];s.players['2'].hand=[];
 s.stack=[cardItem('taglio_ninjitsu',1,{monsterUid:beetle.uid})];s.priority=2;resolveTop(s);
 assert.equal(s.players['2'].hand.length,1);assert.equal(s.players['2'].deck.length,1);
 assert.equal(s.log.some(x=>x.includes('Guardiano del Tesoro: Bob pesca')),false);
});

test('i bersagli scelti restano illustrati per entrambi i giocatori',()=>{
 const s=fresh();s.players['1'].hand=['stupido'];
 s.stack=[effectItem('v60_scorpione_lascito','scorpione_delle_ceneri',1,{cardId:'stupido'})];s.priority=2;
 for(const p of [1,2]){
  const shown=game.publicView(s,p).stack[0];
  assert.equal(shown.targetCards?.[0]?.cardId,'stupido');
  assert.match(shown.targetSummary,/Stupido/i);
 }
});

let passed=0;
for(const [name,fn] of tests){
 try{await fn();passed++;console.log(`✓ ${name}`)}catch(error){console.error(`✗ ${name}`);throw error}
}
console.log(`\n${passed}/${tests.length} test superati.`);
