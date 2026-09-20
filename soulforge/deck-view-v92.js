(()=>{
const STYLE=`
.sf-deck-view{width:min(1440px,calc(100% - 36px));margin:0 auto;padding:30px 0 80px}
.sf-deck-view-top{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:28px}
.sf-deck-view-title{min-width:0}.sf-deck-view-title h1{margin:5px 0 0;font-size:clamp(28px,4vw,46px);color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sf-deck-view-actions{display:flex;align-items:center;gap:10px;flex:none}
.sf-deck-view-layout{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:28px;align-items:start}.sf-deck-view-content{min-width:0}
.sf-deck-view-section{margin:0 0 34px}.sf-deck-view-section-head{display:flex;align-items:center;gap:12px;margin-bottom:12px;text-transform:uppercase;letter-spacing:.08em;color:#e7e9ed;font-weight:900;font-size:13px}
.sf-deck-view-count{color:#8e9aa8;font-size:11px}.sf-deck-view-grid{display:grid!important;grid-template-columns:repeat(auto-fill,156px)!important;gap:14px;align-items:start;justify-content:start}
.sf-deck-view-grid.champions{grid-template-columns:repeat(2,156px)!important}
.sf-deck-view-grid.main,.sf-deck-view-grid.monsters{grid-template-columns:repeat(6,156px)!important}
.sf-deck-view-card{box-sizing:border-box;width:156px!important;min-width:156px!important;max-width:156px!important;height:246px!important;position:relative;border:1px solid #343941;border-radius:8px;background:#090b0e;overflow:hidden;box-shadow:0 8px 18px #0007;transition:transform .14s ease,border-color .14s ease;cursor:zoom-in}
.sf-deck-view-card:hover{transform:translateY(-5px);border-color:#aeb8c6;z-index:2}
.sf-deck-view-card img{box-sizing:border-box;display:block;width:100%!important;height:218px!important;aspect-ratio:auto!important;object-fit:contain!important;object-position:center;background:#080a0d}
.sf-deck-view-grid:not(.champions) .sf-deck-view-card{height:246px!important}
.sf-deck-view-grid:not(.champions) .sf-deck-view-card img{height:218px!important;aspect-ratio:auto!important}
.sf-deck-view-grid.champions .sf-deck-view-card{height:246px!important}
.sf-deck-view-grid.champions .sf-deck-view-card img{height:218px!important;aspect-ratio:auto!important}
.sf-deck-view-name{box-sizing:border-box;height:28px;padding:7px 8px;color:#dfe3e8;font-size:11px;font-weight:750;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sf-deck-view-empty{padding:24px;border:1px dashed #3b424c;color:#9ea7b3}
.sf-deck-zoom{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:28px;background:#000c;backdrop-filter:blur(7px)}
.sf-deck-zoom-panel{position:relative;display:grid;grid-template-columns:minmax(260px,420px) minmax(240px,420px);gap:34px;align-items:center;width:min(920px,calc(100vw - 56px));max-height:calc(100vh - 56px);box-sizing:border-box;padding:28px;border:1px solid #343941;border-radius:14px;background:#121417;box-shadow:0 28px 90px #000}
.sf-deck-zoom-img{display:block;width:100%;max-height:calc(100vh - 112px);object-fit:contain;border-radius:10px;box-shadow:0 16px 42px #000b}
.sf-deck-zoom-info h2{margin:0 0 10px;color:#fff;font-size:clamp(25px,4vw,42px)}
.sf-deck-zoom-info p{margin:0;color:#aeb6c2;font-size:14px}.sf-deck-zoom-close{position:absolute;top:12px;right:14px;width:36px;height:36px;border:0;border-radius:50%;background:#292d33;color:#fff;font-size:24px;line-height:1;cursor:pointer}
.sf-deck-stats{position:sticky;top:20px;padding:18px;border:1px solid #2e3239;border-radius:10px;background:#17191d;box-shadow:0 12px 34px #0007;color:#e9ecf1}.sf-deck-stats-summary{display:grid;grid-template-columns:1fr 1fr;margin-bottom:14px;border:1px solid #353941;border-radius:8px;overflow:hidden}.sf-deck-stat{padding:18px 10px;text-align:center}.sf-deck-stat+.sf-deck-stat{border-left:1px solid #353941}.sf-deck-stat strong{display:block;font-size:30px;line-height:1;color:#f3f5f8}.sf-deck-stat span{display:block;margin-top:7px;color:#858d99;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
.sf-deck-stat-box{margin-top:12px;padding:14px;border:1px solid #343840;border-radius:8px;background:#202226}.sf-deck-stat-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;font-weight:850}.sf-deck-stat-head small{color:#858d99;font-size:10px}.sf-deck-curve{display:flex;align-items:flex-end;gap:8px;height:105px}.sf-deck-curve-col{display:flex;flex:1;height:100%;flex-direction:column;justify-content:flex-end;align-items:center;gap:5px;min-width:0}.sf-deck-curve-count{color:#cbd1d9;font-size:10px;font-weight:800}.sf-deck-curve-bar{width:100%;min-height:2px;border-radius:3px 3px 0 0;background:linear-gradient(#8e4dc7,#347f9d)}.sf-deck-curve-label{color:#8e96a2;font-size:10px}.sf-deck-meter{display:flex;height:10px;border-radius:99px;overflow:hidden;background:#30343b}.sf-deck-meter span{min-width:2px}.sf-deck-legend{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px}.sf-deck-chip{display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:99px;background:#292c31;color:#c8ced7;font-size:11px}.sf-deck-dot{width:8px;height:8px;border-radius:50%}.sf-stat-red{background:#dc3a31}.sf-stat-green{background:#26a65b}.sf-stat-black{background:#8150a6}.sf-stat-blue{background:#3e9fd3}.sf-stat-orange{background:#e29a30}.sf-stat-magic{background:#8552bd}.sf-stat-support{background:#df9940}.sf-stat-monster{background:#3d9bc4}.sf-stat-champion{background:#d94f55}
@media(max-width:1180px){.sf-deck-view-layout{grid-template-columns:1fr}.sf-deck-stats{position:static;grid-row:1}}
@media(max-width:620px){.sf-deck-view{width:min(100% - 20px,1440px);padding-top:20px}.sf-deck-view-top{align-items:flex-start;flex-direction:column}.sf-deck-view-actions{width:100%}.sf-deck-view-actions .btn{flex:1}.sf-deck-view-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.sf-deck-view-grid.champions{grid-template-columns:repeat(2,minmax(0,1fr))}.sf-deck-view-card,.sf-deck-view-grid:not(.champions) .sf-deck-view-card,.sf-deck-view-grid.champions .sf-deck-view-card{height:auto}.sf-deck-view-card img,.sf-deck-view-grid:not(.champions) .sf-deck-view-card img,.sf-deck-view-grid.champions .sf-deck-view-card img{height:auto!important;aspect-ratio:744/1039!important}.sf-deck-view-name{font-size:9px;padding:5px}}
.sf-deck-curve-stack{display:flex;width:100%;min-height:2px;flex-direction:column-reverse;overflow:hidden;border-radius:3px 3px 0 0}.sf-deck-curve-stack span{display:grid;place-items:center;min-height:8px;color:#fff;font-size:9px;font-style:normal;font-weight:900;text-shadow:0 1px 2px #000}
`;
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function header(){return `<header class="sf-home-header"><a class="sf-home-brand" href="/" aria-label="Champion of the Souls"><img src="/favicon-192.png?v=cs2" alt=""><span><strong>CHAMPION</strong><small>of the</small><b>SOULS</b></span></a><nav aria-label="Navigazione principale"><button data-view-nav="play">Play</button><button data-view-nav="decks" class="selected">Decks</button><button data-view-nav="leaderboard">Leaderboard</button></nav></header>`}
function catalog(){
 const api=window.sfDeckBuilder||{},all=[...(api.champions||[]),...(api.cards||[]),...(api.monsters||[])];
 return new Map(all.map(x=>[String(x.id),x]));
}
function cards(ids,kind){
 const api=window.sfDeckBuilder,map=catalog();
 if(!ids?.length)return '<div class="sf-deck-view-empty">Nessuna carta.</div>';
 return ids.map(id=>{const item=map.get(String(id))||{id,name:id},src=api.art?.(id)||'';return `<article class="sf-deck-view-card" data-preview-id="${escapeHtml(id)}" title="${escapeHtml(item.name||id)}"><img src="${escapeHtml(src)}" alt="${escapeHtml(item.name||id)}" loading="lazy" decoding="async"><div class="sf-deck-view-name">${escapeHtml(item.name||id)}</div></article>`}).join('');
}
function sortedIds(ids,kind){
 const map=catalog(),key=kind==='main'?'cost':kind==='monsters'?'pow':null;
 if(!key)return [...ids];
 return [...ids].sort((a,b)=>{const aa=map.get(String(a))||{},bb=map.get(String(b))||{};return (Number(aa[key])||0)-(Number(bb[key])||0)||String(aa.name||a).localeCompare(String(bb.name||b),'it',{sensitivity:'base'})});
}
function section(title,ids,total,kind){const ordered=sortedIds(ids,kind);return `<section class="sf-deck-view-section"><div class="sf-deck-view-section-head"><span>${title}</span><span class="sf-deck-view-count">${ids.length}/${total}</span></div><div class="sf-deck-view-grid ${kind}">${cards(ordered,kind)}</div></section>`}
function meter(rows,total){return `<div class="sf-deck-meter">${rows.filter(x=>x.count).map(x=>`<span class="${x.cls}" style="width:${(x.count/total*100).toFixed(2)}%"></span>`).join('')}</div><div class="sf-deck-legend">${rows.filter(x=>x.count).map(x=>`<span class="sf-deck-chip"><i class="sf-deck-dot ${x.cls}"></i>${escapeHtml(x.label)} ${x.count}</span>`).join('')}</div>`}
function deckStats(deck){
 const map=catalog(),main=(deck.cards||[]).map(id=>map.get(String(id))).filter(Boolean),monsters=(deck.monsters||[]).map(id=>map.get(String(id))).filter(Boolean),champions=(deck.champions||[]).map(id=>map.get(String(id))).filter(Boolean),all=[...champions,...main,...monsters],avg=main.length?main.reduce((n,x)=>n+(Number(x.cost)||0),0)/main.length:0;
 const colorDefs=[['red','Rosso'],['green','Verde'],['black','Nero'],['blue','Blu'],['orange','Arancione']],costs=[0,1,2,3,4,5].map(n=>{const list=main.filter(x=>n===5?(Number(x.cost)||0)>=5:(Number(x.cost)||0)===n);return{label:n===5?'5+':String(n),count:list.length,parts:colorDefs.map(([id,label])=>({id,label,count:list.filter(x=>x.color===id).length,cls:'sf-stat-'+id})).filter(x=>x.count)}}),peak=Math.max(1,...costs.map(x=>x.count));
 const colors=colorDefs.map(([id,label])=>({label,count:all.filter(x=>x.color===id).length,cls:'sf-stat-'+id}));
 const types=[{label:'Magie',count:main.filter(x=>x.type==='Magia').length,cls:'sf-stat-magic'},{label:'Supporti',count:main.filter(x=>x.type==='Supporto').length,cls:'sf-stat-support'},{label:'Mostri',count:monsters.length,cls:'sf-stat-monster'},{label:'Campioni',count:champions.length,cls:'sf-stat-champion'}];
 return `<aside class="sf-deck-stats"><div class="sf-deck-stats-summary"><div class="sf-deck-stat"><strong>${all.length}</strong><span>Carte</span></div><div class="sf-deck-stat"><strong>${avg.toFixed(1)}</strong><span>Costo medio</span></div></div><div class="sf-deck-stat-box"><div class="sf-deck-stat-head"><span>⚡ Curva dei costi</span><small>MEDIA ${avg.toFixed(1)}</small></div><div class="sf-deck-curve">${costs.map(x=>`<div class="sf-deck-curve-col"><span class="sf-deck-curve-count">${x.count}</span><i class="sf-deck-curve-stack" style="height:${Math.max(2,x.count/peak*72)}px">${x.parts.map(p=>`<span class="${p.cls}" style="flex:${p.count}" title="${escapeHtml(p.label)}: ${p.count}">${p.count}</span>`).join('')}</i><span class="sf-deck-curve-label">${x.label}</span></div>`).join('')}</div></div><div class="sf-deck-stat-box"><div class="sf-deck-stat-head"><span>Colori</span><small>${colors.filter(x=>x.count).length} ATTIVI</small></div>${meter(colors,all.length||1)}</div><div class="sf-deck-stat-box"><div class="sf-deck-stat-head"><span>Tipi di carta</span><small>${types.filter(x=>x.count).length} TIPI</small></div>${meter(types,all.length||1)}</div></aside>`;
}
function closeZoom(){document.querySelector('.sf-deck-zoom')?.remove();document.body.style.overflow=''}
function openZoom(id){
 const api=window.sfDeckBuilder,item=catalog().get(String(id))||{id,name:id},src=api?.art?.(id)||'';
 closeZoom();
 const zoom=document.createElement('div');zoom.className='sf-deck-zoom';
 zoom.innerHTML=`<div class="sf-deck-zoom-panel" role="dialog" aria-modal="true" aria-label="${escapeHtml(item.name||id)}"><button class="sf-deck-zoom-close" type="button" aria-label="Chiudi">×</button><img class="sf-deck-zoom-img" src="${escapeHtml(src)}" alt="${escapeHtml(item.name||id)}"><div class="sf-deck-zoom-info"><h2>${escapeHtml(item.name||id)}</h2><p>Clicca fuori dalla carta per chiudere.</p></div></div>`;
 document.body.appendChild(zoom);document.body.style.overflow='hidden';
 zoom.addEventListener('click',e=>{if(e.target===zoom||e.target.closest('.sf-deck-zoom-close'))closeZoom()});
}
function bindNav(){
 document.querySelector('[data-view-nav="play"]')?.addEventListener('click',()=>renderLanding());
 document.querySelector('[data-view-nav="decks"]')?.addEventListener('click',()=>window.sfDeckBuilder?.library?.());
 document.querySelector('[data-view-nav="leaderboard"]')?.addEventListener('click',()=>window.sfRenderLeaderboard?.());
}
function renderDeckView(id){
 const api=window.sfDeckBuilder,deck=api?.getLibrary?.().find(x=>String(x.id)===String(id));if(!deck)return;
 app.innerHTML=`<div class="sf-home">${header()}<main class="sf-deck-view"><div class="sf-deck-view-top"><div class="sf-deck-view-title"><div class="sf-home-hint">Visualizzazione mazzo</div><h1>${escapeHtml(deck.name||'Mazzo')}</h1></div><div class="sf-deck-view-actions"><button class="btn ghost" id="sfDeckViewBack">← I tuoi mazzi</button><button class="btn primary" id="sfDeckViewEdit">Modifica mazzo</button></div></div><div class="sf-deck-view-layout"><div class="sf-deck-view-content">${section('Campioni',deck.champions||[],2,'champions')}${section('Carte principali',deck.cards||[],18,'main')}${section('Monster Deck',deck.monsters||[],12,'monsters')}</div>${deckStats(deck)}</div></main></div>`;
 bindNav();
 document.querySelector('#sfDeckViewBack').onclick=()=>api.library();
 document.querySelector('#sfDeckViewEdit').onclick=()=>api.open(id);
}
const style=document.createElement('style');style.id='sfDeckView88Style';style.textContent=STYLE;document.head.appendChild(style);
document.addEventListener('click',e=>{
 const button=e.target.closest?.('[data-library-edit]');if(!button||!window.sfDeckBuilder?.getLibrary)return;
 e.preventDefault();e.stopImmediatePropagation();renderDeckView(button.dataset.libraryEdit);
},true);
document.addEventListener('click',e=>{const card=e.target.closest?.('.sf-deck-view-card[data-preview-id]');if(!card)return;e.preventDefault();e.stopImmediatePropagation();openZoom(card.dataset.previewId)},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeZoom()});
window.sfRenderDeckView=renderDeckView;
window.sfDeckStatsHtml=deckStats;
})();
