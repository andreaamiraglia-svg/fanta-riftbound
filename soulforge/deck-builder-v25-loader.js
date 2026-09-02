(()=>{
/* Deck builder v25: usa il builder v24 ma rimuove esclusivamente il vecchio
   remapping delle artwork Blu. I file nel branch soulforge-playtest hanno
   già nomi canonici e devono essere associati direttamente alla carta.
   Il selettore Campioni viene inoltre ordinato per colore:
   Rosso -> Verde -> Nero -> Blu -> Arancione. */
fetch('/deck-builder-v24-loader.js?v=1',{cache:'no-store'})
 .then(r=>{if(!r.ok)throw new Error('deck-builder-v24-loader.js HTTP '+r.status);return r.text()})
 .then(src=>{
   src=src.replace(
     "for(const [from,to] of ART_FIXES)js=js.replace(from,to);",
     "/* v25: legacy blue ART_FIXES disabilitati; usa i filename canonici */"
   );
   src=src.replace(
     "CHAMPIONS.map(x=>pickCardHtml(x,'champions')).join('')",
     "[...CHAMPIONS].sort((a,b)=>({red:0,green:1,black:2,blue:3,orange:4}[a.color]??99)-({red:0,green:1,black:2,blue:3,orange:4}[b.color]??99)).map(x=>pickCardHtml(x,'champions')).join('')"
   );
   (0,eval)(src);
 })
 .catch(e=>{console.error('deck-builder-v25 loader',e);try{showError(e.message)}catch{}});
})();
