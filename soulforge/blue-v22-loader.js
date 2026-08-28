(()=>{
const parts=['/blue-v22.p01.txt','/blue-v22.p02.txt','/blue-v22.p03.txt','/blue-v22.p04.txt'];
Promise.all(parts.map(async p=>{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw new Error(p+' HTTP '+r.status);return r.text()})).then(xs=>(0,eval)(xs.join(''))).catch(e=>{console.error('blue-v22 loader',e);try{showError(e.message)}catch{}});
})();
