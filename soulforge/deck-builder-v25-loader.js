(()=>{
/* Deck builder v25: usa il builder v24 ma rimuove esclusivamente il vecchio
   remapping delle artwork Blu. I file nel branch soulforge-playtest hanno
   già nomi canonici e devono essere associati direttamente alla carta. */
fetch('/deck-builder-v24-loader.js?v=1',{cache:'no-store'})
 .then(r=>{if(!r.ok)throw new Error('deck-builder-v24-loader.js HTTP '+r.status);return r.text()})
 .then(src=>{
   src=src.replace(
     "for(const [from,to] of ART_FIXES)js=js.replace(from,to);",
     "/* v25: legacy blue ART_FIXES disabilitati; usa i filename canonici */"
   );
   (0,eval)(src);
 })
 .catch(e=>{console.error('deck-builder-v25 loader',e);try{showError(e.message)}catch{}});
})();
