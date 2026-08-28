module.exports = async function handler(req,res){
  try{
    const urls=Array.from({length:12},(_,i)=>`https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p${String(i+1).padStart(2,'0')}.txt`);
    const chunks=await Promise.all(urls.map(async u=>{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`chunk ${u} HTTP ${r.status}`);return r.text()}));
    let js=chunks.join('');
    js=js.replace('s.combat = = {','s.combat = {');
    res.setHeader('Content-Type','application/javascript; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    res.status(200).send(js);
  }catch(e){
    res.status(500).send(`throw new Error(${JSON.stringify('V22 bundle error: '+(e&&e.message?e.message:String(e)))})`);
  }
};
