module.exports = async function handler(req,res){
  const api='https://gmunayvayjzzyrigaesx.supabase.co/functions/v1/soulforge';
  try{
    const get=await fetch(api,{cache:'no-store'}); const html=await get.text();
    if(!get.ok) return res.status(get.status).json({ok:false,stage:'get',body:html.slice(0,300)});
    const deck={
      champions:['kael','valtheris'],
      cards:['taglio_fiammante','sfera_incandescente','corazza_esplosiva','occhio_di_drago','mano_del_caos','nube_di_fuoco','tornado_bollente','fendente_di_fuoco','berserk','flusso_gelido','freddo_puro','in_guardia','ali_del_protettore','staffa_del_mare','specchio_acqua','muro_di_ghiaccio','custode_dei_deboli','distruzione_totale'],
      monsters:['lucertola_fuoco','segugio_infernale','fenice_cremisi','golem_magmatico','drago_delle_ceneri','salamandra_vulcanica','squalo_delle_maree','lupo_glaciale','grifone_della_tempesta','yeti','leviatano','vecchio_delle_nevi']
    };
    const create=await fetch(api,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'create',name:'V22 Health Check',deck}),cache:'no-store'});
    const body=await create.text(); let data; try{data=JSON.parse(body)}catch{data={raw:body.slice(0,500)}}
    if(!create.ok) return res.status(create.status).json({ok:false,stage:'create',get:get.status,data});
    res.status(200).json({ok:true,get:get.status,create:create.status,roomCode:data.roomCode,player:data.player,blueSouls:data.state?.players?.['1']?.souls?.blue,blueCardDef:!!data.state?.cardDefs?.flusso_gelido,valtheris:!!data.state?.championDefs?.valtheris,blueMonster:!!data.state?.monsterDefs?.yeti});
  }catch(e){res.status(500).json({ok:false,error:e&&e.message?e.message:String(e)});}
};
