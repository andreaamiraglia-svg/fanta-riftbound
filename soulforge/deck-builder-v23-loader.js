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
 js=js.replace("['albero_della_vita','Albero della Vita','green','Supporto','Istantanea']","['albero_della_vita','Albero della Vita','green','Magia','Istantanea']");
 js=js.replace("const COLORS={red:'Rosso',green:'Verde',black:'Nero',blue:'Blu'};","const COLORS={red:'Rosso',green:'Verde',black:'Nero',blue:'Blu',orange:'Arancione'};");
 js=js.replace("{id:'valtheris',name:'Valtheris Spirito Eterno',color:'blue',text:'All’inizio del turno ottiene 1 Armatura.'}","{id:'valtheris',name:'Valtheris Spirito Eterno',color:'blue',text:'All’inizio del turno ottiene 1 Armatura.'},{id:'kroth',name:'Kroth il Fulminatore',color:'orange',text:'Scudo di Guerra — Ogni volta che difende ottiene +1 POW per questo turno.'}");
 js=js.replace("const V21_BASE=OLD_BASE;",`const V21_BASE=OLD_BASE;\nconst V46_BASE='${NEW_BASE}';\nconst V46_ART={colpo_in_testa:'colpo-in-testa.webp',fabbro_ninjitsu:'fabbro-ninjitsu.webp',fino_alla_morte:'fino-alla-morte.webp',richiamo_del_branco:'richiamo-del-branco.webp',grandine_brillante:'grandine-brillante.webp'};\nconst V55_BASE='${NEW_BASE}';\nconst V55_ART={kroth:'kroth-il-fulminatore.webp',falco_dell_alba:'falco-dell-alba.webp',frecce_divine:'frecce-divine.webp',golem_d_ambra:'golem-d-ambra.webp',grifone_imperiale:'grifone-imperiale.webp',legionario_troll:'legionario-troll.webp',leone_solare:'leone-solare.webp',loda_il_sole:'loda-il-sole.webp',parry:'parry.webp',perfezione:'perfezione.webp',pugno_in_faccia:'pugno-in-faccia.webp',sciamano_del_sole:'sciamano-del-sole.webp',soldato_corrotto:'soldato-corrotto.webp',spacca_teste:'spacca-teste-orange.webp',su_gli_scudi:'su-gli-scudi.webp',alabardo:'alabardo.webp',drago_aureo:'drago-aureo.webp'};`);
 js=js.replace("const art=id=>V21_ART[id]?V21_BASE+V21_ART[id]:(V18_ART[id]?V18_BASE+V18_ART[id]:(OLD_ART[id]?OLD_BASE+OLD_ART[id]:''));","const art=id=>V55_ART[id]?V55_BASE+V55_ART[id]:(V46_ART[id]?V46_BASE+V46_ART[id]:(V21_ART[id]?V21_BASE+V21_ART[id]:(V18_ART[id]?V18_BASE+V18_ART[id]:(OLD_ART[id]?OLD_BASE+OLD_ART[id]:''))));");
 js=js.replace("['berserk','Berserk','red','Magia','Istantanea'],","['berserk','Berserk','red','Magia','Istantanea'],['colpo_in_testa','Colpo in Testa','red','Magia','Base'],");
 js=js.replace("['stupido','Stupido','green','Magia','Istantanea'],","['frecce_divine','Frecce Divine','orange','Magia','Base'],['loda_il_sole','Loda il Sole','orange','Supporto','Base'],['parry','Parry','orange','Magia','Risposta'],['perfezione','Perfezione','orange','Magia','Istantanea'],['pugno_in_faccia','Pugno in Faccia','orange','Magia','Base'],['spacca_teste','Spacca Teste','orange','Magia','Risposta'],['su_gli_scudi','Su gli Scudi','orange','Magia','Risposta'],['alabardo','Alabardo','orange','Supporto','Base'],['soldato_corrotto','Soldato Corrotto','orange','Supporto','Base'],['legionario_troll','Legionario Troll','orange','Supporto','Base'],['stupido','Stupido','green','Magia','Istantanea'],");
 js=js.replace("['mille_lame','Tecnica delle Mille Lame Ninjitsu','green','Magia','Istantanea'],","['mille_lame','Tecnica delle Mille Lame Ninjitsu','green','Magia','Istantanea'],['fabbro_ninjitsu','Fabbro Ninjitsu','green','Magia','Base'],");
 js=js.replace("['fino_alla_morte','Fino alla Morte','black','Magia','Istantanea'],","['fino_alla_morte','Fino alla Morte','black','Magia','Istantanea'],['richiamo_del_branco','Richiamo del Branco','black','Magia','Base'],");
 js=js.replace("['flusso_gelido','Flusso Gelido','blue','Magia','Istantanea'],","['grandine_brillante','Grandine Brillante','blue','Magia','Base'],['flusso_gelido','Flusso Gelido','blue','Magia','Istantanea'],");
 js=js.replace("['segugio_dei_morti','Segugio dei Morti','black',2],","['falco_dell_alba','Falco dell’Alba','orange',3],['golem_d_ambra','Golem d’Ambra','orange',2],['grifone_imperiale','Grifone Imperiale','orange',3],['leone_solare','Leone Solare','orange',3],['sciamano_del_sole','Sciamano del Sole','orange',1],['drago_aureo','Drago Aureo','orange',3],['segugio_dei_morti','Segugio dei Morti','black',2],");
 js=js.replace("cards:CARDS.filter(x=>['red','green'].includes(x.color)).map(x=>x.id),","cards:CARDS.filter(x=>['red','green'].includes(x.color)&&!['colpo_in_testa','fabbro_ninjitsu','spacca_teste','alabardo'].includes(x.id)).map(x=>x.id),");
 (0,eval)(js);
}).catch(e=>{console.error('deck-builder-v23 loader',e);try{showError(e.message)}catch{}});
})();
