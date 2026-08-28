(()=>{
const SOUL_COLORS=['red','green','black','blue'];
const SOUL_LABELS={red:'Rosse',green:'Verdi',black:'Nere',blue:'Blu'};

// Un giocatore può possedere e vedere soltanto le Anime dei colori del proprio mazzo.
soulsHtml=function(p){
 const allowed=(Array.isArray(p?.deckColors)&&p.deckColors.length?p.deckColors:SOUL_COLORS.filter(c=>(p?.souls?.[c]||0)>0));
 return `<div class="souls">${allowed.map(c=>`<div class="soul ${c}" title="Anime ${SOUL_LABELS[c]}">${p?.souls?.[c]??0}</div>`).join('')}</div>`;
};

// Durante un combattimento la priorità deve essere sempre manuale.
// In particolare, quando il difensore passa, l'attaccante riceve la priorità
// e può giocare una Risposta/Istantanea invece di auto-passare.
const previousRenderV23=render;
render=function(){
 const s=session?.state;
 if(s){
  if(s.combat&&s.priority===session.player)s.combatSpellPriority=session.player;
  else delete s.combatSpellPriority;
 }
 previousRenderV23();
};

if(session?.state)render();
})();
