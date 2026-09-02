(()=>{
const OLD_BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const BLACK_BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/cards-v18/';
const FALLBACK={
 lucertola_fuoco:OLD_BASE+'lucertola-di-fuoco.webp',
 segugio_infernale:OLD_BASE+'segugio-infernale.webp',
 fenice_cremisi:OLD_BASE+'fenice-cremisi.webp',
 golem_magmatico:OLD_BASE+'golem-magmatico.webp',
 drago_delle_ceneri:OLD_BASE+'drago-delle-ceneri.webp',
 salamandra_vulcanica:OLD_BASE+'salamandra-vulcanica.webp',
 ragno_dei_germogli:OLD_BASE+'ragno-dei-germogli.webp',
 serpente_della_giungla:OLD_BASE+'serpente-della-giungla.webp',
 lupo_delle_radici:OLD_BASE+'lupo-delle-radici.webp',
 cervo_antico:OLD_BASE+'cervo-antico.webp',
 guardiano_della_foresta:OLD_BASE+'guardiano-della-foresta.webp',
 orso_furioso:OLD_BASE+'orso-furioso.webp',
 segugio_dei_morti:BLACK_BASE+'segugio-dei-morti.webp',
 custode_sepolcrale:BLACK_BASE+'custode-sepolcrale.webp',
 cavaliere_senza_volto:BLACK_BASE+'cavaliere-senza-volto.webp',
 cerbero:BLACK_BASE+'cerbero.webp',
 re_dei_non_morti:BLACK_BASE+'re-dei-non-morti.webp',
 divoratore_di_anime_mostro:BLACK_BASE+'divoratore-di-anime-mostro.webp',
 squalo_delle_maree:OLD_BASE+'lupo-glaciale.webp',
 lupo_glaciale:OLD_BASE+'grifone-della-tempesta.webp',
 grifone_della_tempesta:OLD_BASE+'yeti.webp',
 yeti:OLD_BASE+'leviatano.webp',
 leviatano:OLD_BASE+'valtheris-spirito-eterno.webp',
 vecchio_delle_nevi:OLD_BASE+'squalo-delle-maree.webp'
};
function artUrl(id){
 try{const u=window.sfArtUrl21?.(id);if(u)return u}catch{}
 return FALLBACK[id]||'';
}
function ensureStyle(){
 if(document.getElementById('sfFesta42Style'))return;
 const s=document.createElement('style');
 s.id='sfFesta42Style';
 s.textContent=`
 .sf-festa42-modal{width:min(1080px,96vw)!important;max-height:92vh!important}
 .sf-festa42-grid{display:grid;grid-template-columns:repeat(3,minmax(220px,1fr));gap:14px;align-items:start}
 .sf-festa42-card{position:relative;border:1px solid #3c4658;border-radius:14px;background:#10151e;padding:12px;min-height:430px;box-shadow:0 10px 28px rgba(0,0,0,.28)}
 .sf-festa42-card.is-discarded{border-color:#e64d55;background:linear-gradient(180deg,rgba(91,22,27,.36),#10151e);opacity:.78}
 .sf-festa42-index{text-align:center;font-family:Georgia,serif;font-size:28px;font-weight:900;color:#ffe49a;margin-bottom:8px}
 .sf-festa42-art{width:min(100%,230px);aspect-ratio:5/7;display:block;object-fit:contain;margin:0 auto 8px;border-radius:6px;filter:drop-shadow(0 6px 10px rgba(0,0,0,.4))}
 .sf-festa42-noart{width:min(100%,230px);aspect-ratio:5/7;margin:0 auto 8px;border:1px dashed #596377;border-radius:8px;display:grid;place-items:center;color:#9ca5b5;text-align:center;padding:12px}
 .sf-festa42-name{font-family:Georgia,serif;font-weight:900;font-size:18px;color:#f5ead2;margin:5px 0 2px}
 .sf-festa42-meta{font-size:12px;color:#aab3c4;margin-bottom:10px}
 .sf-festa42-controls{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:auto;padding-top:10px}
 .sf-festa42-controls .btn{min-width:46px}
 .sf-festa42-discard{background:#ef3f46!important;color:white!important;border-color:#ef3f46!important}
 .sf-festa42-card.is-discarded .sf-festa42-discard{background:#244c36!important;border-color:#3fa96d!important}
 .sf-festa42-discarded{margin-top:18px;border-top:1px solid #313947;padding-top:12px}
 .sf-festa42-discarded-grid{display:flex;gap:10px;flex-wrap:wrap;min-height:42px}
 .sf-festa42-discarded-item{display:flex;align-items:center;gap:8px;padding:7px 9px;border:1px solid #563138;background:#211419;border-radius:9px}
 .sf-festa42-discarded-item img{width:38px;height:54px;object-fit:contain;border-radius:3px}
 .sf-festa42-footer{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}
 @media(max-width:800px){.sf-festa42-grid{grid-template-columns:1fr}.sf-festa42-card{min-height:auto}.sf-festa42-art,.sf-festa42-noart{width:180px}}
 `;
 document.head.appendChild(s);
}
function esc42(v){
 try{return typeof esc==='function'?esc(v):String(v??'')}catch{return String(v??'')}
}
function install(){
 ensureStyle();
 window.showFestaChoice=function(top){
  let order=[...(top||[])];
  const discard=new Set();
  const defs=session?.state?.monsterDefs||{};
  function draw(){
   const cards=order.map((id,i)=>{
    const d=defs[id]||{};
    const u=artUrl(id);
    const art=u?`<img class="sf-festa42-art" src="${u}" alt="${esc42(d.name||id)}" loading="eager">`:`<div class="sf-festa42-noart">Immagine non disponibile<br>${esc42(d.name||id)}</div>`;
    return `<div class="sf-festa42-card${discard.has(id)?' is-discarded':''}" data-preview-card="${esc42(id)}">
      <div class="sf-festa42-index">${i+1}</div>
      ${art}
      <div class="sf-festa42-name">${esc42(d.name||id)}</div>
      <div class="sf-festa42-meta">POW ${esc42(d.pow??'—')}</div>
      <div class="sf-festa42-controls">
        <button class="btn ghost sf-festa42-left" data-i="${i}" ${i===0?'disabled':''}>←</button>
        <button class="btn sf-festa42-discard" data-id="${esc42(id)}">${discard.has(id)?'Recupera':'Scarta'}</button>
        <button class="btn ghost sf-festa42-right" data-i="${i}" ${i===order.length-1?'disabled':''}>→</button>
      </div>
    </div>`;
   }).join('');
   const discarded=[...discard].map(id=>{const d=defs[id]||{},u=artUrl(id);return `<div class="sf-festa42-discarded-item">${u?`<img src="${u}" alt="">`:''}<span>${esc42(d.name||id)}</span></div>`}).join('')||'<div class="tiny">Nessuna carta scartata.</div>';
   modal.innerHTML=`<div class="modal"><div class="modalbox sf-festa42-modal"><h3>Tutto per la Festa</h3><div class="sf-festa42-grid">${cards}</div><div class="sf-festa42-discarded"><h3>Scartate</h3><div class="sf-festa42-discarded-grid">${discarded}</div></div><div class="sf-festa42-footer"><button class="btn primary" id="finishFesta">Conferma ordine e scarti</button><button class="btn ghost" id="cancelFesta42">Annulla</button></div></div></div>`;
   document.querySelectorAll('.sf-festa42-discard').forEach(b=>b.onclick=()=>{const id=b.dataset.id;discard.has(id)?discard.delete(id):discard.add(id);draw()});
   document.querySelectorAll('.sf-festa42-left').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);if(i>0){[order[i-1],order[i]]=[order[i],order[i-1]];draw()}});
   document.querySelectorAll('.sf-festa42-right').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);if(i<order.length-1){[order[i+1],order[i]]=[order[i],order[i+1]];draw()}});
   document.getElementById('finishFesta').onclick=()=>{const remain=order.filter(id=>!discard.has(id));closeModal();move({type:'resolve_choice',discard:[...discard],order:remain})};
   document.getElementById('cancelFesta42').onclick=()=>closeModal();
  }
  draw();
 };
}
install();
window.addEventListener('sf-blue-ready',install);
})();