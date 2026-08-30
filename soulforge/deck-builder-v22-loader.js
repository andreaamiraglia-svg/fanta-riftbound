(()=>{
const parts=['/deck-builder-v22.p01.txt','/deck-builder-v22.p02.txt','/deck-builder-v22.p03.txt'];
const ART_FIXES=[
 ["valtheris:'valtheris-spirito-eterno.webp'","valtheris:'vecchio-delle-nevi.webp'"],
 ["squalo_delle_maree:'squalo-delle-maree.webp'","squalo_delle_maree:'lupo-glaciale.webp'"],
 ["lupo_glaciale:'lupo-glaciale.webp'","lupo_glaciale:'grifone-della-tempesta.webp'"],
 ["grifone_della_tempesta:'grifone-della-tempesta.webp'","grifone_della_tempesta:'yeti.webp'"],
 ["yeti:'yeti.webp'","yeti:'leviatano.webp'"],
 ["leviatano:'leviatano.webp'","leviatano:'valtheris-spirito-eterno.webp'"],
 ["vecchio_delle_nevi:'vecchio-delle-nevi.webp'","vecchio_delle_nevi:'squalo-delle-maree.webp'"]
];
const NEW_BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
Promise.all(parts.map(async p=>{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw new Error(p+' HTTP '+r.status);return r.text()})).then(xs=>{
 let js=xs.join('');
 for(const [from,to] of ART_FIXES)js=js.replace(from,to);
 // Albero della Vita è una Magia Istantanea.
 js=js.replace("['albero_della_vita','Albero della Vita','green','Supporto','Istantanea']","['albero_della_vita','Albero della Vita','green','Magia','Istantanea']");
 js=js.replace("const V21_BASE=OLD_BASE;",`const V21_BASE=OLD_BASE;\nconst V46_BASE='${NEW_BASE}';\nconst V46_ART={colpo_in_testa:'colpo-in-testa.webp',fabbro_ninjitsu:'fabbro-ninjitsu.webp',fino_alla_morte:'fino-alla-morte.webp',richiamo_del_branco:'richiamo-del-branco.webp',grandine_brillante:'grandine-brillante.webp'};\nconst V54_ART={alabardo:(window.sfAlabardoArt54||'')};`);
 js=js.replace("const art=id=>V21_ART[id]?V21_BASE+V21_ART[id]:(V18_ART[id]?V18_BASE+V18_ART[id]:(OLD_ART[id]?OLD_BASE+OLD_ART[id]:''));","const art=id=>V54_ART[id]|| (V46_ART[id]?V46_BASE+V46_ART[id]:(V21_ART[id]?V21_BASE+V21_ART[id]:(V18_ART[id]?V18_BASE+V18_ART[id]:(OLD_ART[id]?OLD_BASE+OLD_ART[id]:''))));" );
 js=js.replace("['berserk','Berserk','red','Magia','Istantanea'],","['berserk','Berserk','red','Magia','Istantanea'],['spacca_teste','Spacca Teste','red','Magia','Risposta'],['alabardo','Alabardo','red','Campione','Supporto'],['colpo_in_testa','Colpo in Testa','red','Magia','Base'],");
 js=js.replace("['mille_lame','Tecnica delle Mille Lame Ninjitsu','green','Magia','Istantanea'],","['mille_lame','Tecnica delle Mille Lame Ninjitsu','green','Magia','Istantanea'],['fabbro_ninjitsu','Fabbro Ninjitsu','green','Magia','Base'],");
 js=js.replace("['fino_alla_morte','Fino alla Morte','black','Magia','Istantanea'],","['fino_alla_morte','Fino alla Morte','black','Magia','Istantanea'],['richiamo_del_branco','Richiamo del Branco','black','Magia','Base'],");
 js=js.replace("['flusso_gelido','Flusso Gelido','blue','Magia','Istantanea'],","['grandine_brillante','Grandine Brillante','blue','Magia','Base'],['flusso_gelido','Flusso Gelido','blue','Magia','Istantanea'],");
 // Keep the historical red/green starter at exactly 18 cards now that the pool is larger.
 js=js.replace("cards:CARDS.filter(x=>['red','green'].includes(x.color)).map(x=>x.id),","cards:CARDS.filter(x=>['red','green'].includes(x.color)&&!['colpo_in_testa','fabbro_ninjitsu','spacca_teste','alabardo'].includes(x.id)).map(x=>x.id),");
 (0,eval)(js);
}).catch(e=>{console.error('deck-builder-v22 loader',e);try{showError(e.message)}catch{}});
})();
