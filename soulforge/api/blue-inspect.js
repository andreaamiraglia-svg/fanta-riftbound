export default async function handler(req,res){
  const names=new Set(['squalo-delle-maree.webp','lupo-glaciale.webp','grifone-della-tempesta.webp','yeti.webp','leviatano.webp','valtheris-spirito-eterno.webp','vecchio-delle-nevi.webp']);
  const file=String(req.query.file||'');
  const old=String(req.query.old||'')==='1';
  if(!names.has(file))return res.status(400).send('bad file');
  const ref=old?'fefcef7c59cebcf33ece3a31b57942a1501f3ce5':'soulforge-playtest';
  const url=`https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/${ref}/champion-of-the-souls-carte-ottimizzate/cards/${file}`;
  const r=await fetch(url,{cache:'no-store'});
  if(!r.ok)return res.status(r.status).send('upstream '+r.status);
  const buf=Buffer.from(await r.arrayBuffer());
  res.setHeader('Content-Type','image/webp');
  res.setHeader('Cache-Control','no-store');
  return res.status(200).send(buf);
}
