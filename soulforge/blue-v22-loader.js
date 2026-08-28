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

 const patchGraveImages=()=>{
  document.querySelectorAll('.sf-grave-card[data-preview-card]').forEach(el=>{
   if(el.querySelector('img'))return;
   const id=el.dataset.previewCard,u=window.sfArtUrl21?.(id);
   if(!u)return;
   const img=document.createElement('img');img.src=u;img.alt=id;img.loading='lazy';el.prepend(img);
  });
 };
 const modalEl=document.getElementById('modal');
 if(modalEl)new MutationObserver(()=>setTimeout(patchGraveImages,0)).observe(modalEl,{childList:true,subtree:true});
 document.addEventListener('click',e=>{if(e.target.closest?.('.sf-grave-btn'))setTimeout(patchGraveImages,0)},true);

 const installSguardoRule=()=>{
  const mt=window.monsterTargets;
  if(typeof mt==='function'&&!mt.__sfSguardoDamagedOnly){
   const base=mt;
   const filtered=function(...args){const list=base.apply(this,args)||[];return window.__sfSguardoTargeting?list.filter(m=>Number(m?.damage||0)>0):list};
   filtered.__sfSguardoDamagedOnly=true;window.monsterTargets=filtered;
  }
  const current=window.chooseForCard;
  if(typeof current!=='function'||current.__sfSguardoDamagedOnly)return;
  const previous=current;
  const wrapped=function(id){
   const card=playerState(session.player)?.handCards?.find(c=>c.id===id),isSguardo=card?.effect==='sguardo';
   window.__sfSguardoTargeting=!!isSguardo;
   const out=previous(id);
   if(isSguardo){
    setTimeout(()=>{const h=document.getElementById('sfTargetV8Hint');if(h)h.textContent='Tecnica dello Sguardo Ninjitsu: scegli un Mostro danneggiato'+(document.querySelectorAll('.sf-v8-valid').length?'':' — nessun bersaglio valido')+'  •  ESC per annullare'},0);
    const timer=setInterval(()=>{if(!document.getElementById('sfTargetV8Hint')){window.__sfSguardoTargeting=false;clearInterval(timer)}},60);
   }
   return out;
  };
  wrapped.__sfSguardoDamagedOnly=true;wrapped.__sfTargetV8=true;window.chooseForCard=wrapped;
 };

 if(session?.state)render();
 window.dispatchEvent(new Event('sf-blue-ready'));
 setTimeout(installSguardoRule,25);setTimeout(installSguardoRule,250);setTimeout(installSguardoRule,900);setTimeout(installSguardoRule,2700);
}).catch(e=>{console.error('blue-v22 loader',e);try{showError(e.message)}catch{}});
})();
