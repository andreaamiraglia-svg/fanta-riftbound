(()=>{
const parts=['/deck-builder-v22.p01.txt','/deck-builder-v22.p02.txt','/deck-builder-v22.p03.txt'];
Promise.all(parts.map(async p=>{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw new Error(p+' HTTP '+r.status);return r.text()})).then(xs=>(0,eval)(xs.join(''))).catch(e=>{console.error('deck-builder-v22 loader',e);try{showError(e.message)}catch{}});
})();
