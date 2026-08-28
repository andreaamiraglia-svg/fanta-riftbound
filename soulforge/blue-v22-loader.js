(()=>{
const parts=['/blue-v22.p01.txt','/blue-v22.p02.txt','/blue-v22.p03.txt','/blue-v22.p04.txt'];
const ART_FIXES=[
 ["valtheris:'valtheris-spirito-eterno.webp'","valtheris:'vecchio-delle-nevi.webp'"],
 ["squalo_delle_maree:'squalo-delle-maree.webp'","squalo_delle_maree:'lupo-glaciale.webp'"],
 ["lupo_glaciale:'lupo-glaciale.webp'","lupo_glaciale:'grifone-della-tempesta.webp'"],
 ["grifone_della_tempesta:'grifone-della-tempesta.webp'","grifone_della_tempesta:'yeti.webp'"],
 ["yeti:'yeti.webp'","yeti:'leviatano.webp'"],
 ["leviatano:'leviatano.webp'","leviatano:'valtheris-spirito-eterno.webp'"],
 ["vecchio_delle_nevi:'vecchio-delle-nevi.webp'","vecchio_delle_nevi:'squalo-delle-maree.webp'"]
];
Promise.all(parts.map(async p=>{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw new Error(p+' HTTP '+r.status);return r.text()})).then(xs=>{
 let js=xs.join('');
 for(const [from,to] of ART_FIXES)js=js.replace(from,to);
 (0,eval)(js);
 const colors=['red','green','black','blue'];
 const labels={red:'Rosse',green:'Verdi',black:'Nere',blue:'Blu'};
 soulsHtml=function(p){
  const allowed=Array.isArray(p?.deckColors)&&p.deckColors.length?p.deckColors:(p?.champions||[]).map(c=>c?.color).filter(Boolean);
  return `<div class="souls">${colors.filter(c=>allowed.includes(c)).map(c=>`<div class="soul ${c}" title="Anime ${labels[c]}">${p?.souls?.[c]??0}</div>`).join('')}</div>`;
 };
 if(session?.state)render();
 window.dispatchEvent(new Event('sf-blue-ready'));
}).catch(e=>{console.error('blue-v22 loader',e);try{showError(e.message)}catch{}});
})();
