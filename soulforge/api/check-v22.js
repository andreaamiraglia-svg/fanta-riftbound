module.exports = async function handler(req,res){
  try{
    const r=await fetch('https://gmunayvayjzzyrigaesx.supabase.co/functions/v1/soulforge-v22-import-test2',{cache:'no-store'});
    const text=await r.text();
    res.status(r.status).setHeader('content-type',r.headers.get('content-type')||'text/plain').send(text);
  }catch(e){res.status(500).json({ok:false,error:e&&e.message?e.message:String(e)});}
};
