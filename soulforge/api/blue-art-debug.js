export default async function handler(req,res){
  const allowed=new Set(['squalo-delle-maree.webp','lupo-glaciale.webp','grifone-della-tempesta.webp','yeti.webp','leviatano.webp','vecchio-delle-nevi.webp','valtheris-spirito-eterno.webp']);
  const file=String(req.query.file||'');
  if(!allowed.has(file))return res.status(400).json({error:'bad file'});
  const url='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/'+file;
  const r=await fetch(url,{cache:'no-store'});
  if(!r.ok)return res.status(r.status).json({error:'upstream '+r.status});
  const b=Buffer.from(await r.arrayBuffer());
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({file,type:r.headers.get('content-type')||'image/webp',base64:b.toString('base64')});
}
