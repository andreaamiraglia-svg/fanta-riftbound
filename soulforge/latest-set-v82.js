(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={
 arrivano_i_pirati:'arrivano-i-pirati.webp',colpo_di_cannone:'colpo-di-cannone.webp',galeone_fantasma:'galeone-fantasma.webp',
 furia_della_natura:'furia-della-natura.webp',shuriken:'shuriken.webp',zampata_amichevole:'zampata-amichevole.webp',
 offerta_maligna:'offerta-maligna.webp',scambio_di_anime:'scambio-di-anime.webp',visione_distorta:'visione-distorta.webp',
 protettore_del_villaggio:'protettore-del-villaggio.webp',valanga:'valanga.webp',esercito_tormenta_neve:'esercito-della-tormenta-di-neve.webp',
 cavaliere_pioggia_frecce:'cavaliere-della-pioggia-di-frecce.webp',forgia_nanica:'forgia-nanica.webp',
 legionario_troll:'legionario-troll.webp',guardia_reale:'guardia-reale.webp'
};
const IDS=new Set(Object.keys(ART));let pendingOpen=false;
const other=p=>Number(p)===1?2:1;
function me(){try{return typeof playerState==='function'?playerState(session.player):session?.state?.players?.[String(session.player)]}catch{return null}}
function card(id){return me()?.handCards?.find(c=>String(c.id)===String(id))||null}
function defs(){return session?.state?.monsterDefs||{}}
function monsters(){return session?.state?.board?.monsters||[]}
function champions(p){return(session?.state?.players?.[String(p)]?.champions||[]).filter(c=>!c.defeated)}
function champRef(p,c){return{type:'champion',player:Number(p),champId:String(c.id)}}
function monsterRef(m){return{type:'monster',uid:String(m.uid)}}
function labelMonster(m){return defs()?.[m.cardId]?.name||m.name||m.cardId||'Mostro'}
function pow(c){return Number(c.pow??c.basePow??0)+Number(c.tempPow||0)}
function showErr(x){try{showError(String(x))}catch{console.error(x)}}
async function choose(title,items){if(!items.length){showErr('Nessun bersaglio valido.');return null}return await pick(title,items)}
function champOptions(rows){return rows.map(({p,c})=>({label:c.name,desc:`${c.supportChampion?'Supporto':'Campione'} • POW ${pow(c)}`,value:champRef(p,c)}))}
function monsterOptions(rows=monsters()){return rows.map(m=>({label:labelMonster(m),desc:`Mostro • POW ${Number(m.pow||defs()?.[m.cardId]?.pow||0)}`,value:monsterRef(m)}))}
function ownChampOptions(supportOnly=false){return champOptions(champions(session.player).filter(c=>!supportOnly||c.supportChampion).map(c=>({p:session.player,c})))}
function allChampOptions(){return champOptions([1,2].flatMap(p=>champions(p).map(c=>({p,c}))))}
function enemyOptions(){return[...champOptions(champions(other(session.player)).map(c=>({p:other(session.player),c}))),...monsterOptions()]}
async function chooseCard(id){
 const c=card(id);if(!c||!IDS.has(id))return false;
 try{
  if(typeof canCast==='function'&&!canCast(c)){showErr('Non puoi giocare questa carta in questo momento.');return true}
  let targets={};
  switch(id){
   case'arrivano_i_pirati':{
    const discards=(me()?.handCards||[]).filter(x=>String(x.id)!==id).map(x=>({label:x.name,desc:'Scarta come costo aggiuntivo',value:String(x.id)}));
    const discardId=await choose('Arrivano i Pirati — scegli la carta da scartare',discards);if(!discardId)return true;
    const m=await choose('Arrivano i Pirati — scegli il Mostro',monsterOptions());if(!m)return true;targets={discardId,monsterUid:m.uid};break;
   }
   case'colpo_di_cannone':{const enemy=await choose('Colpo di Cannone — scegli un nemico',enemyOptions());if(!enemy)return true;targets={enemy};break}
   case'galeone_fantasma':case'visione_distorta':case'valanga':case'esercito_tormenta_neve':case'forgia_nanica':break;
   case'furia_della_natura':case'zampata_amichevole':{const x=await choose(`${c.name} — scegli un tuo Campione`,ownChampOptions());if(!x)return true;targets={ownChamp:x.champId};break}
   case'shuriken':{
    const mine=await choose('Shuriken — scegli un tuo Campione',ownChampOptions());if(!mine)return true;
    const foe=await choose('Shuriken — scegli un Campione nemico',champOptions(champions(other(session.player)).map(x=>({p:other(session.player),c:x}))));if(!foe)return true;
    const m=await choose('Shuriken — scegli un Mostro',monsterOptions());if(!m)return true;targets={ownChamp:mine.champId,enemyChampion:foe,monsterUid:m.uid};break;
   }
   case'offerta_maligna':{const m=await choose('Offerta Maligna — scegli il primo Mostro',monsterOptions());if(!m)return true;targets={monsterUid:m.uid};break}
   case'scambio_di_anime':{
    const a=await choose('Scambio di Anime — scegli il primo Campione',allChampOptions());if(!a)return true;
    const rows=[1,2].flatMap(p=>champions(p).filter(c=>!(Number(p)===Number(a.player)&&String(c.id)===String(a.champId))).map(c=>({p,c})));
    const b=await choose('Scambio di Anime — scegli il secondo Campione',champOptions(rows));if(!b)return true;targets={championA:a,championB:b};break;
   }
   case'protettore_del_villaggio':{
    const character=await choose('Protettore del villaggio — scegli un Personaggio',[...allChampOptions(),...monsterOptions()]);if(!character)return true;targets={character};break;
   }
   case'cavaliere_pioggia_frecce':{const x=await choose('Cavaliere della pioggia di frecce — scegli un tuo Supporto',ownChampOptions(true));if(!x)return true;targets={supportId:x.champId};break}
  }
  await move({type:'cast',cardId:id,targets});return true;
 }catch(e){showErr(e?.message||e);return true}
}
function installChooser(){
 const cur=window.chooseForCard;if(typeof cur!=='function'||cur.__sfLatestSet82)return;
 const wrapped=function(id){id=String(id||'');if(IDS.has(id))return chooseCard(id);return cur(id)};
 wrapped.__sfLatestSet82=true;wrapped.__previous=cur;window.chooseForCard=wrapped;try{chooseForCard=wrapped}catch{}
}
function installArt(){const cur=window.sfArtUrl21;if(cur?.__sfLatestSet82)return;const fn=id=>ART[String(id)]?BASE+ART[String(id)]:(typeof cur==='function'?cur(id):'');fn.__sfLatestSet82=true;fn.__previous=cur;window.sfArtUrl21=fn}
function elementId(el){return el?.dataset?.handCard||el?.dataset?.previewCard||el?.dataset?.selectCard||el?.dataset?.cardId||el?.dataset?.card||el?.dataset?.deckId||''}
function repair(root=document){
 root.querySelectorAll?.('[data-hand-card],[data-preview-card],[data-select-card],[data-card-id],[data-card],[data-deck-id]').forEach(el=>{
  const id=String(elementId(el));if(!ART[id])return;const src=BASE+ART[id];let imgs=el.matches?.('img')?[el]:[...el.querySelectorAll('img')];
  if(!imgs.length&&!el.matches?.('img')){const img=document.createElement('img');img.alt=card(id)?.name||id;img.loading='lazy';el.prepend(img);imgs=[img]}
  const img=imgs[0];if(img?.getAttribute('src')!==src)img?.setAttribute('src',src);for(const extra of imgs.slice(1))extra.remove();
 });
}
async function resolveOfferta(){
 if(pendingOpen)return;const pc=session?.state?.pendingChoice;if(pc?.type!=='v59_offerta_second'||Number(pc.player)!==Number(session.player))return;
 pendingOpen=true;try{const choice=await choose('Offerta Maligna — scegli il secondo Mostro',(pc.options||[]).map(x=>({label:x.label||x.id,desc:'L’uccisione e l’Anima di questo Mostro saranno attribuite a te',value:String(x.id)})));if(choice)await move({type:'resolve_choice',monsterUid:String(choice)})}catch(e){showErr(e?.message||e)}finally{pendingOpen=false}
}
function boot(){installArt();installChooser();repair();resolveOfferta()}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;boot()})}
boot();setTimeout(boot,250);setTimeout(boot,1000);window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));
for(const root of [document.getElementById('app'),document.getElementById('modal')].filter(Boolean))new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
})();
