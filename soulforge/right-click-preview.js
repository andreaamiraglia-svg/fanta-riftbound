(()=>{
const OLD_BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const V18_BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/cards-v18/';
const OLD_ART={kael:'kael.webp',lyrandel:'lyrandel.webp',lucertola_fuoco:'lucertola-di-fuoco.webp',segugio_infernale:'segugio-infernale.webp',fenice_cremisi:'fenice-cremisi.webp',golem_magmatico:'golem-magmatico.webp',drago_delle_ceneri:'drago-delle-ceneri.webp',salamandra_vulcanica:'salamandra-vulcanica.webp',ragno_dei_germogli:'ragno-dei-germogli.webp',serpente_della_giungla:'serpente-della-giungla.webp',lupo_delle_radici:'lupo-delle-radici.webp',cervo_antico:'cervo-antico.webp',guardiano_della_foresta:'guardiano-della-foresta.webp',orso_furioso:'orso-furioso.webp',taglio_fiammante:'taglio_fiammante.webp',sfera_incandescente:'sfera_incandescente.webp',corazza_esplosiva:'corazza_esplosiva.webp',occhio_di_drago:'occhio_di_drago.webp',mano_del_caos:'mano_del_caos.webp',nube_di_fuoco:'nube_di_fuoco.webp',tornado_bollente:'tornado_bollente.webp',fendente_di_fuoco:'fendente_di_fuoco.webp',berserk:'berserk.webp',taglio_ninjitsu:'taglio_ninjitsu.webp',stupido:'stupido.webp',riflesso:'riflesso.webp',tutto_per_la_festa:'tutto_per_la_festa.webp',alta_marea:'alta_marea.webp',doppia_katana:'doppia_katana.webp',albero_della_vita:'albero_della_vita.webp',sguardo_ninjitsu:'sguardo_ninjitsu.webp',mille_lame:'mille_lame.webp'};
const V18_ART={divoratore_campione:'il-divoratore-di-anime.webp',segugio_dei_morti:'segugio-dei-morti.webp',custode_sepolcrale:'custode-sepolcrale.webp',cavaliere_senza_volto:'cavaliere-senza-volto.webp',cerbero:'cerbero.webp',re_dei_non_morti:'re-dei-non-morti.webp',divoratore_di_anime_mostro:'divoratore-di-anime-mostro.webp',evocatore_anime_vacue:'evocatore-di-anime-vacue.webp',anima_esplosiva:'anima-esplosiva.webp',sacrificio:'sacrificio.webp',collasso:'collasso.webp',spacca_ossa:'spacca-ossa.webp',eclipse_fang:'eclipse-fang.webp',fino_alla_morte:'fino-alla-morte.webp',mietitore:'mietitore.webp',ammazza_morte:'ammazza-morte.webp'};
const BLUE_ART={valtheris:'vecchio-delle-nevi.webp',squalo_delle_maree:'lupo-glaciale.webp',lupo_glaciale:'grifone-della-tempesta.webp',grifone_della_tempesta:'yeti.webp',yeti:'leviatano.webp',leviatano:'valtheris-spirito-eterno.webp',vecchio_delle_nevi:'squalo-delle-maree.webp',flusso_gelido:'flusso-gelido.webp',freddo_puro:'freddo-puro.webp',in_guardia:'in-guardia.webp',ali_del_protettore:'ali-del-protettore.webp',staffa_del_mare:'staffa-del-mare.webp',specchio_acqua:'specchio-d-acqua.webp',muro_di_ghiaccio:'muro-di-ghiaccio.webp',custode_dei_deboli:'custode-dei-deboli.webp',distruzione_totale:'distruzione-totale.webp'};
const CHAMPION_TEXT={
 kael:'Finché non hai carte in mano durante la fase principale, Kael ottiene +3 POW.',
 lyrandel:'Una volta per turno, quando un Mostro subisce 1 danno da te, Lyrandel attiva il suo effetto: scegli uno di quei Mostri e infliggigli 1 danno.',
 divoratore_campione:'Ritorno delle Anime — Se hai ucciso almeno un Mostro in questo turno, puoi tappare Il Divoratore di Anime per riprendere in mano una carta dal tuo Cimitero.',
 valtheris:'Protettore dell’Anima — All’inizio di ogni turno, Valtheris ottiene 1 Armatura.'
};
const FILE_TO_ID=Object.fromEntries([...Object.entries(OLD_ART),...Object.entries(V18_ART),...Object.entries(BLUE_ART)].map(([id,file])=>[file,id]));
let opened=false;
function artUrl(id){try{const u=window.sfArtUrl21?.(id);if(u)return u}catch{}return V18_ART[id]?V18_BASE+V18_ART[id]:(BLUE_ART[id]?OLD_BASE+BLUE_ART[id]:(OLD_ART[id]?OLD_BASE+OLD_ART[id]:''))}
function box(){let b=document.getElementById('sfRightPreview');if(!b){b=document.createElement('div');b.id='sfRightPreview';b.className='sf-preview';b.style.zIndex='10050';document.body.appendChild(b)}return b}
function safe(v){try{return typeof esc==='function'?esc(v):String(v??'')}catch{return String(v??'')}}
function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d}
function refFromTarget(t){
 if(!(t instanceof Element))return null;
 const mEl=t.closest('[data-monster-uid]');
 if(mEl?.dataset.monsterUid){try{const m=session.state?.board?.monsters?.find(x=>String(x.uid)===String(mEl.dataset.monsterUid));if(m)return{id:m.cardId,kind:'monster',runtime:m}}catch{}}
 const cEl=t.closest('[data-champ-id]');
 if(cEl?.dataset.champId){try{const owner=Number(cEl.dataset.owner),c=session.state?.players?.[String(owner)]?.champions?.find(x=>String(x.id)===String(cEl.dataset.champId));if(c)return{id:c.id,kind:'champion',runtime:c,owner}}catch{}return{id:cEl.dataset.champId,kind:'champion'}}
 const p=t.closest('[data-preview-card]');if(p?.dataset.previewCard)return{id:p.dataset.previewCard};
 const h=t.closest('[data-hand-card]');if(h?.dataset.handCard)return{id:h.dataset.handCard};
 const s=t.closest('[data-select-card]');if(s?.dataset.selectCard)return{id:s.dataset.selectCard};
 const im=t.closest('img');if(!im)return null;const file=decodeURIComponent((im.currentSrc||im.src||'').split('/').pop()?.split('?')[0]||'');return FILE_TO_ID[file]?{id:FILE_TO_ID[file]}:null;
}
function findChampion(id){try{for(const p of [1,2]){const c=session.state?.players?.[String(p)]?.champions?.find(x=>String(x.id)===String(id));if(c)return c}}catch{}return null}
function info(ref){const id=ref?.id;if(!id)return{kind:'image',id:'',name:''};try{
 if(ref.kind==='monster'){const d=session.state?.monsterDefs?.[id]||{};return{kind:'monster',...d,...(ref.runtime||{}),id,name:ref.runtime?.name||d.name||id,text:d.text||ref.runtime?.text||''}}
 if(ref.kind==='champion'){const d=session.state?.championDefs?.[id]||{};const r=ref.runtime||findChampion(id)||{};return{kind:'champion',...d,...r,id,name:r.name||d.name||id,text:CHAMPION_TEXT[id]||r.text||d.text||''}}
 const c=session.state?.cardDefs?.[id];if(c)return{kind:'card',...c};
 const m=session.state?.monsterDefs?.[id];if(m){const r=session.state?.board?.monsters?.find(x=>String(x.cardId)===String(id));return{kind:'monster',...m,...(r||{}),id,name:r?.name||m.name||id,text:m.text||''}}
 const d=session.state?.championDefs?.[id];if(d){const r=findChampion(id)||{};return{kind:'champion',...d,...r,id,name:r.name||d.name||id,text:CHAMPION_TEXT[id]||''}}
 }catch{}return{kind:'image',id,name:id}}
function stat(type,label,value){return `<div class="sf-preview-stat sf-preview-stat--${type}"><span>${safe(label)}</span><b>${safe(value)}</b></div>`}
function statBlock(c){
 if(c.kind==='champion'){
  const hp=n(c.hp),w=n(c.wounds),cur=Math.max(0,hp-w),pow=n(c.pow,c.basePow),damage=n(c.damage),armor=n(c.armor);
  let h=stat('pow','Potere',pow)+stat('hp','HP',`${cur}/${hp}`)+stat('damage','Danni',`${damage}/${Math.max(1,pow)}`);if(armor>0)h+=stat('armor','Armatura',armor);return `<div class="sf-preview-stats">${h}</div>`;
 }
 if(c.kind==='monster'){
  const pow=n(c.pow),damage=n(c.damage),armor=n(c.armor);let h=stat('pow','Potere',pow)+stat('damage','Danni',damage);if(armor>0)h+=stat('armor','Armatura',armor);return `<div class="sf-preview-stats">${h}</div>`;
 }
 return'';
}
function description(text){const t=String(text??'').trim();return `<div class="sf-preview-description"><div class="sf-preview-section-title">Descrizione</div><p>${safe(t||'Nessun effetto.')}</p></div>`}
function details(c){
 if(c.kind==='card')return `<h3>${safe(c.name)}</h3><div class="tag">${safe(c.type||'Carta')} • ${typeof speedLabel==='function'?speedLabel(c.speed||'base'):safe(c.speed||'')} • Costo ${safe(c.effectiveCost??c.cost??0)}</div>${description(c.text||'')}`;
 if(c.kind==='monster')return `<h3>${safe(c.name)}</h3><div class="tag">Mostro</div>${statBlock(c)}${description(c.text||'')}`;
 if(c.kind==='champion')return `<h3>${safe(c.name)}</h3><div class="tag">Campione${c.tapped?' • Tappato':''}${c.defeated?' • Sconfitto':''}</div>${statBlock(c)}${description(c.text||'')}`;
 return `<h3>${safe(c.name||c.id)}</h3>${description('')}`;
}
function show(ref,x,y){if(!ref?.id)return;const url=artUrl(ref.id);if(!url)return;const c=info(ref),b=box();b.innerHTML=`<img src="${url}" alt="${safe(c.name||ref.id)}"><div class="ptext">${details(c)}<div class="tiny sf-preview-help">Click sinistro o ESC per chiudere</div></div>`;const w=Math.min(820,innerWidth*.94),h=Math.min(560,innerHeight*.92);let left=x+18,top=y-100;if(left+w>innerWidth-16)left=Math.max(16,x-w-18);if(top+h>innerHeight-16)top=Math.max(16,innerHeight-h-16);if(top<16)top=16;b.style.left=left+'px';b.style.top=top+'px';b.style.setProperty('display','flex','important');b.style.pointerEvents='none';b.classList.add('show');opened=true}
function close(){const b=document.getElementById('sfRightPreview');if(!b)return;b.classList.remove('show');b.style.removeProperty('display');opened=false}
document.addEventListener('contextmenu',e=>{const ref=refFromTarget(e.target);if(!ref?.id||!artUrl(ref.id))return;e.preventDefault();e.stopPropagation();show(ref,e.clientX,e.clientY)},true);
document.addEventListener('click',()=>{if(opened)close()},true);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened)close()},true);window.addEventListener('blur',()=>{if(opened)close()});
})();