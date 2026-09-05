(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={
 scorpione_delle_ceneri:'scorpione-delle-ceneri.webp',
 gigante_del_cratere:'gigante-del-cratere.webp',
 cinghiale_zannaverde:'cinghiale-zannaverde.webp',
 gorilla_della_giungla:'gorilla-della-giungla.webp',
 medusa_delle_maree:'medusa-delle-maree.webp',
 elementale_della_brina:'elementale-della-brina.webp',
 ariete_sacro:'ariete-sacro.webp',
 guardiano_del_tesoro:'guardiano-del-tesoro.webp',
 marionetta_maledetta:'marionetta-maledetta.webp',
 verme_delle_tombe:'verme-delle-tombe.webp'
};
const IDS=new Set(Object.keys(ART));
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const art=id=>ART[String(id)]?BASE+ART[String(id)]:(typeof window.sfArtUrl21==='function'?window.sfArtUrl21(String(id)):'');
const state=()=>{try{return session?.state||null}catch{return null}};

function installResolver(){
 const current=window.sfArtUrl21;
 if(current?.__sfWave15)return;
 const previous=current;
 const resolver=id=>ART[String(id)]?BASE+ART[String(id)]:(typeof previous==='function'?previous(id):'');
 resolver.__sfWave15=true;resolver.__previous=previous;window.sfArtUrl21=resolver;
}
function idOf(el){
 return String(el?.dataset?.handCard||el?.dataset?.previewCard||el?.dataset?.selectCard||el?.dataset?.cardId||el?.dataset?.card||el?.dataset?.deckId||el?.dataset?.sidebarPreview||el?.dataset?.previewId||'');
}
function directImages(el){
 const rows=[];
 if(el.matches?.('img'))rows.push(el);
 el.querySelectorAll?.(':scope > img').forEach(img=>rows.push(img));
 el.querySelectorAll?.(':scope > .sf-card-shell > img').forEach(img=>rows.push(img));
 return[...new Set(rows)];
}
function ensureArt(el){
 if(!(el instanceof Element))return;
 const id=idOf(el);if(!IDS.has(id))return;
 const src=BASE+ART[id],images=directImages(el);let img=images[0]||null;
 if(!img&&!el.matches('img')){
  img=document.createElement('img');img.alt=state()?.monsterDefs?.[id]?.name||id;img.loading='lazy';
  const shell=el.querySelector(':scope > .sf-card-shell');(shell||el).prepend(img);
 }
 if(img&&img.getAttribute('src')!==src)img.setAttribute('src',src);
 images.slice(1).forEach(extra=>extra.remove());
}
const SELECTOR='[data-hand-card],[data-preview-card],[data-select-card],[data-card-id],[data-card],[data-deck-id],[data-sidebar-preview],[data-preview-id]';
function repairArts(root=document){
 if(root instanceof Element&&root.matches(SELECTOR))ensureArt(root);
 root.querySelectorAll?.(SELECTOR).forEach(ensureArt);
}

let multiSignature='',multiBusy=false,selected=new Set();
function ownMulti(){
 const pc=state()?.pendingChoice;
 return pc?.type==='v60_multi_target'&&!pc.hidden&&Number(pc.player)===Number(session?.player)?pc:null;
}
function closeMulti(){document.getElementById('sfWave15Multi')?.remove();multiSignature='';selected=new Set()}
function renderMulti(){
 const pc=ownMulti();if(!pc){closeMulti();return}
 const signature=[pc.player,pc.trigger?.effectId,...(pc.options||[]).map(o=>o.id)].join('|');
 if(signature!==multiSignature){multiSignature=signature;selected=new Set()}
 let overlay=document.getElementById('sfWave15Multi');
 if(!overlay){overlay=document.createElement('div');overlay.id='sfWave15Multi';document.body.appendChild(overlay)}
 const max=Number(pc.max||3),options=pc.options||[];
 overlay.innerHTML=`<div class="sfw15-box" role="dialog" aria-modal="true" aria-labelledby="sfw15Title"><h2 id="sfw15Title">Verme delle Tombe</h2><p>Scegli fino a ${max} Mostri con 2 POW o meno dal tuo Cimitero. Puoi anche non sceglierne nessuno.</p><div class="sfw15-count">${selected.size}/${max} scelti</div><div class="sfw15-grid">${options.map(o=>{
  const picked=selected.has(String(o.id)),src=art(o.cardId);
  return`<button type="button" class="sfw15-card${picked?' selected':''}" data-sfw15-choice="${esc(o.id)}" aria-pressed="${picked}">${src?`<img src="${esc(src)}" alt="${esc(o.label)}">`:''}<strong>${esc(o.label)}</strong><span>POW ${Number(o.pow||0)}</span><i>✓</i></button>`;
 }).join('')}</div><div class="sfw15-actions"><button type="button" class="btn ghost" id="sfw15None">Nessun Mostro</button><button type="button" class="btn primary" id="sfw15Confirm">Conferma (${selected.size}/${max})</button></div></div>`;
 overlay.querySelectorAll('[data-sfw15-choice]').forEach(button=>button.addEventListener('click',()=>{
  if(multiBusy)return;const id=String(button.dataset.sfw15Choice||'');
  if(selected.has(id))selected.delete(id);else if(selected.size<max)selected.add(id);renderMulti();
 }));
 overlay.querySelector('#sfw15None')?.addEventListener('click',()=>{if(!multiBusy){selected.clear();submitMulti()}});
 overlay.querySelector('#sfw15Confirm')?.addEventListener('click',submitMulti);
}
function submitMulti(){
 if(multiBusy)return;multiBusy=true;
 document.querySelectorAll('#sfWave15Multi button').forEach(button=>button.disabled=true);
 Promise.resolve(move({type:'resolve_choice',choices:[...selected]})).finally(()=>{multiBusy=false;multiSignature='';renderMulti()});
}

function targetCards(item){return Array.isArray(item?.targetCards)?item.targetCards.filter(x=>x?.cardId||x?.id):[]}
function decorateStack(){
 const stack=state()?.stack||[],cards=[...document.querySelectorAll('.stack-card')];
 cards.forEach((el,index)=>{
  el.querySelector(':scope > .sfw15-stack-targets')?.remove();
  const targets=targetCards(stack[index]);if(!targets.length)return;
  const box=document.createElement('div');box.className='sfw15-stack-targets';box.setAttribute('aria-label','Bersagli scelti');
  box.innerHTML=targets.map(t=>`<span title="${esc(t.name||t.cardId||t.id)}"><img src="${esc(art(t.cardId||t.id))}" alt="${esc(t.name||t.cardId||t.id)}"></span>`).join('');el.appendChild(box);
 });
 const chain=[...document.querySelectorAll('.chainitem')],reverse=[...stack].reverse();
 chain.forEach((el,index)=>{
  el.querySelector(':scope > .sfw15-chain-targets')?.remove();const targets=targetCards(reverse[index]);if(!targets.length)return;
  const box=document.createElement('div');box.className='sfw15-chain-targets';box.innerHTML=targets.map(t=>`<img src="${esc(art(t.cardId||t.id))}" alt="${esc(t.name||t.cardId||t.id)}" title="${esc(t.name||t.cardId||t.id)}">`).join('');el.appendChild(box);
 });
}
function style(){
 if(document.getElementById('sfWave15Style'))return;
 const node=document.createElement('style');node.id='sfWave15Style';node.textContent=`
 #sfWave15Multi{position:fixed;inset:0;z-index:10180;display:flex;align-items:center;justify-content:center;padding:20px;background:#030609eb}
 #sfWave15Multi .sfw15-box{width:min(1050px,96vw);max-height:92vh;overflow:auto;padding:20px;border:1px solid #9a72c8;border-radius:18px;background:linear-gradient(155deg,#171421,#0c0d12);box-shadow:0 28px 100px #000e}
 #sfWave15Multi h2{margin:0 0 6px;color:#ead8ff;font-family:Georgia,serif}#sfWave15Multi p{margin:0 0 10px;color:#d7d1df}
 #sfWave15Multi .sfw15-count{margin-bottom:12px;color:#c59be9;font-weight:900}.sfw15-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px}
 .sfw15-card{position:relative;display:flex;min-width:0;flex-direction:column;gap:5px;padding:7px;border:2px solid #4d5260;border-radius:12px;background:#090c12;color:#fff;text-align:left}
 .sfw15-card:hover{border-color:#c59be9;transform:translateY(-2px)}.sfw15-card.selected{border-color:#65e6b8;box-shadow:0 0 0 2px #65e6b844}
 .sfw15-card img{display:block;width:100%;aspect-ratio:762/1024;object-fit:cover;border-radius:8px;background:#05070a}.sfw15-card strong{font-size:12px;line-height:1.2}.sfw15-card span{font-size:11px;color:#adb4c2}
 .sfw15-card i{display:none;position:absolute;top:10px;right:10px;width:27px;height:27px;border-radius:50%;place-items:center;background:#65e6b8;color:#06120e;font-style:normal;font-weight:1000}.sfw15-card.selected i{display:grid}
 .sfw15-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:17px;position:sticky;bottom:-20px;padding:13px 0 2px;background:linear-gradient(transparent,#0c0d12 34%)}
 .stack-card{position:relative}.sfw15-stack-targets{position:absolute;right:5px;bottom:28px;z-index:40;display:flex;gap:3px;padding:4px;border-radius:8px;background:#05070bdd;border:1px solid #d8b4fe}
 .sfw15-stack-targets span{display:block}.sfw15-stack-targets img{display:block!important;width:38px!important;height:51px!important;object-fit:cover!important;border-radius:4px!important;transform:none!important}
 .sfw15-chain-targets{display:flex;gap:5px;margin-top:7px}.sfw15-chain-targets img{width:38px;height:51px;object-fit:cover;border:1px solid #d8b4fe;border-radius:4px}
 @media(max-width:600px){.sfw15-grid{grid-template-columns:repeat(2,minmax(110px,1fr))}#sfWave15Multi{padding:9px}#sfWave15Multi .sfw15-box{padding:14px}}
 `;document.head.appendChild(node);
}

let scheduled=false;
function boot(){installResolver();repairArts();renderMulti();decorateStack()}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;try{boot()}catch(error){console.error('[wave15-v84]',error)}})}
style();boot();setTimeout(boot,250);setTimeout(boot,1000);
for(const root of [document.getElementById('app'),document.getElementById('modal')].filter(Boolean))new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
window.addEventListener('sf-blue-ready',schedule);setInterval(()=>{renderMulti();decorateStack()},500);
window.sfWave15={ART,repairArts,renderMulti};
})();
