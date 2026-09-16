(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const V18='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/cards-v18/';

/* Only true filename exceptions are listed here. Everything else also gets the
   generic id-with-hyphens fallback, so future cards do not need another patch. */
const FILE={
 kael:'kael.webp',lyrandel:'lyrandel.webp',divoratore_campione:'il-divoratore-di-anime.webp',
 lucertola_fuoco:'lucertola-di-fuoco.webp',segugio_infernale:'segugio-infernale.webp',fenice_cremisi:'fenice-cremisi.webp',golem_magmatico:'golem-magmatico.webp',drago_delle_ceneri:'drago-delle-ceneri.webp',salamandra_vulcanica:'salamandra-vulcanica.webp',
 ragno_dei_germogli:'ragno-dei-germogli.webp',serpente_della_giungla:'serpente-della-giungla.webp',lupo_delle_radici:'lupo-delle-radici.webp',cervo_antico:'cervo-antico.webp',guardiano_della_foresta:'guardiano-della-foresta.webp',orso_furioso:'orso-furioso.webp',
 segugio_dei_morti:'segugio-dei-morti.webp',custode_sepolcrale:'custode-sepolcrale.webp',cavaliere_senza_volto:'cavaliere-senza-volto.webp',re_dei_non_morti:'re-dei-non-morti.webp',divoratore_di_anime_mostro:'divoratore-di-anime-mostro.webp',
 taglio_fiammante:'taglio_fiammante.webp',sfera_incandescente:'sfera_incandescente.webp',corazza_esplosiva:'corazza_esplosiva.webp',occhio_di_drago:'occhio_di_drago.webp',mano_del_caos:'mano_del_caos.webp',nube_di_fuoco:'nube_di_fuoco.webp',tornado_bollente:'tornado_bollente.webp',fendente_di_fuoco:'fendente_di_fuoco.webp',
 taglio_ninjitsu:'taglio_ninjitsu.webp',sguardo_ninjitsu:'sguardo_ninjitsu.webp',tutto_per_la_festa:'tutto_per_la_festa.webp',alta_marea:'alta_marea.webp',doppia_katana:'doppia_katana.webp',albero_della_vita:'albero_della_vita.webp',mille_lame:'mille_lame.webp',
 evocatore_anime_vacue:'evocatore-di-anime-vacue.webp',anima_esplosiva:'anima-esplosiva.webp',spacca_ossa:'spacca-ossa.webp',eclipse_fang:'eclipse-fang.webp',fino_alla_morte:'fino-alla-morte.webp',ammazza_morte:'ammazza-morte.webp',
 flusso_gelido:'flusso-gelido.webp',freddo_puro:'freddo-puro.webp',in_guardia:'in-guardia.webp',ali_del_protettore:'ali-del-protettore.webp',staffa_del_mare:'staffa-del-mare.webp',specchio_acqua:'specchio-d-acqua.webp',muro_di_ghiaccio:'muro-di-ghiaccio.webp',custode_dei_deboli:'custode-dei-deboli.webp',distruzione_totale:'distruzione-totale.webp',
 colpo_in_testa:'colpo-in-testa.webp',fabbro_ninjitsu:'fabbro-ninjitsu.webp',richiamo_del_branco:'richiamo-del-branco.webp',grandine_brillante:'grandine-brillante.webp',
 kroth:'kroth-il-fulminatore.webp',alabardo:'alabardo.webp',drago_aureo:'drago-aureo.webp',falco_dell_alba:'falco-dell-alba.webp',frecce_divine:'frecce-divine.webp',golem_d_ambra:'golem-d-ambra.webp',grifone_imperiale:'grifone-imperiale.webp',legionario_troll:'legionario-troll.webp',leone_solare:'leone-solare.webp',loda_il_sole:'loda-il-sole.webp',parry:'parry.webp',perfezione:'perfezione.webp',pugno_in_faccia:'pugno-in-faccia.webp',sciamano_del_sole:'sciamano-del-sole.webp',sciamano_del_sole_support:'sciamano-del-sole.webp',soldato_corrotto:'soldato-corrotto.webp',spacca_teste:'spacca-teste-orange.webp',su_gli_scudi:'su-gli-scudi.webp'
};

const fallbackState=new WeakMap();
function unique(xs){return [...new Set(xs.filter(Boolean).map(String))]}
function defs(){return [session?.state?.cardDefs||{},session?.state?.monsterDefs||{}]}
function idFromName(name){
 const wanted=String(name||'').trim().toLowerCase();
 if(!wanted)return'';
 for(const group of defs())for(const [id,d] of Object.entries(group||{}))if(String(d?.name||'').trim().toLowerCase()===wanted)return String(id);
 return'';
}
function cardId(el){
 const direct=String(el?.dataset?.previewCard||el?.dataset?.cardId||'').trim();
 if(direct&&direct!=='undefined'&&direct!=='null')return direct;
 const alt=String(el?.querySelector?.('img')?.alt||'').trim();
 if(alt&&alt!=='undefined'&&alt!=='null')return alt;
 return idFromName(el?.querySelector?.('.sf-grave-name')?.textContent||'');
}
function candidates(id){
 const out=[];
 try{const u=window.sfArtUrl21?.(id);if(u)out.push(String(u))}catch{}
 const file=FILE[id];
 const slug=String(id).replaceAll('_','-');
 if(file){out.push(BASE+file,V18+file)}
 out.push(BASE+slug+'.webp',BASE+String(id)+'.webp',V18+slug+'.webp',V18+String(id)+'.webp');
 return unique(out);
}
function advance(img){
 const st=fallbackState.get(img);if(!st)return;
 st.i+=1;
 if(st.i>=st.urls.length){
  img.dataset.sfGraveArtFailed='1';
  img.removeAttribute('src');
  return;
 }
 img.src=st.urls[st.i];
}
function prepareImage(img,id,urls){
 if(!urls.length)return;
 let start=Math.max(0,urls.indexOf(img.getAttribute('src')||img.src));
 if(start<0)start=0;
 fallbackState.set(img,{urls,i:start});
 img.dataset.sfGraveArt='67b';
 img.alt=id;
 img.loading='lazy';
 img.draggable=false;
 img.setAttribute('draggable','false');
 img.style.display='block';
 if(!img.dataset.sfGraveFallbackBound){
  img.dataset.sfGraveFallbackBound='1';
  img.addEventListener('error',()=>advance(img));
 }
 if(!img.getAttribute('src')||!urls.includes(img.getAttribute('src')))img.src=urls[0];
 if(img.complete&&img.naturalWidth===0)requestAnimationFrame(()=>advance(img));
}
function patchTile(el){
 if(!el)return;
 const id=cardId(el);if(!id)return;
 if(el.dataset.previewCard!==id)el.dataset.previewCard=id;
 const urls=candidates(id);if(!urls.length)return;
 let img=el.querySelector(':scope > img');
 if(!img){img=document.createElement('img');el.prepend(img)}
 prepareImage(img,id,urls);
}
function patch(root=document){root.querySelectorAll?.('.sf-grave-card').forEach(patchTile)}

if(!document.getElementById('sfGraveArt67bStyle')){
 const s=document.createElement('style');s.id='sfGraveArt67bStyle';s.textContent=`
 .sf-grave-card>img[data-sf-grave-art]{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;aspect-ratio:3/4!important;object-fit:contain!important;border-radius:8px!important;background:#080b10!important}
 `;document.head.appendChild(s);
}

const modal=document.getElementById('modal');
if(modal){
 let queued=false;
 new MutationObserver(()=>{
  if(queued)return;queued=true;
  requestAnimationFrame(()=>{queued=false;patch(modal)});
 }).observe(modal,{childList:true,subtree:true});
}
document.addEventListener('click',e=>{
 if(e.target instanceof Element&&e.target.closest('.sf-grave-btn')){
  requestAnimationFrame(()=>patch(modal||document));
  setTimeout(()=>patch(modal||document),40);
  setTimeout(()=>patch(modal||document),180);
 }
},true);

window.addEventListener('sf-blue-ready',()=>setTimeout(()=>patch(),0));
patch();
setTimeout(()=>patch(),200);
setTimeout(()=>patch(),900);
})();
