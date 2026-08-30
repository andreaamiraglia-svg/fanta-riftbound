(()=>{
const COST={
 taglio_fiammante:0,sfera_incandescente:0,corazza_esplosiva:0,occhio_di_drago:0,mano_del_caos:1,nube_di_fuoco:1,tornado_bollente:1,fendente_di_fuoco:1,berserk:2,spacca_teste:1,alabardo:1,colpo_in_testa:3,
 stupido:0,riflesso:0,tutto_per_la_festa:0,taglio_ninjitsu:0,doppia_katana:1,alta_marea:1,albero_della_vita:1,sguardo_ninjitsu:1,mille_lame:12,fabbro_ninjitsu:1,
 evocatore_anime_vacue:0,anima_esplosiva:0,sacrificio:0,collasso:0,spacca_ossa:1,eclipse_fang:1,fino_alla_morte:1,mietitore:2,ammazza_morte:3,richiamo_del_branco:2,
 grandine_brillante:1,flusso_gelido:0,freddo_puro:0,in_guardia:0,ali_del_protettore:0,staffa_del_mare:1,specchio_acqua:1,muro_di_ghiaccio:2,custode_dei_deboli:3,distruzione_totale:1
};
const COLOR_LABEL={red:'Rosso',green:'Verde',black:'Nero',blue:'Blu'};
let selectedColor='all',selectedCost='all',queued=false;

function ensureStyle(){
 if(document.getElementById('sfDeckFiltersStyle'))return;
 const st=document.createElement('style');st.id='sfDeckFiltersStyle';
 st.textContent=`
 .sf-deck-filters{position:relative;z-index:20;display:flex;align-items:end;gap:12px;flex-wrap:wrap;margin:18px 0 6px;padding:14px 16px;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:rgba(10,13,20,.48)}
 .sf-deck-filter{display:flex;flex-direction:column;gap:6px;min-width:150px}.sf-deck-filter label{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#aeb7c7}
 .sf-deck-filter select{position:relative;z-index:21;pointer-events:auto!important;appearance:none;background:#121722;color:#f5f7fb;border:1px solid #3a4352;border-radius:10px;padding:9px 34px 9px 11px;font:inherit;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,#b7c0ce 50%),linear-gradient(135deg,#b7c0ce 50%,transparent 50%);background-position:calc(100% - 16px) 50%,calc(100% - 11px) 50%;background-size:5px 5px,5px 5px;background-repeat:no-repeat}
 .sf-deck-filter select:focus{outline:2px solid rgba(230,184,75,.65);outline-offset:1px}.sf-deck-filter-count{margin-left:auto;padding:9px 0;color:#aeb7c7;font-size:12px;font-weight:700}
 .deck-pick.sf-filter-hidden{display:none!important}
 @media(max-width:720px){.sf-deck-filter{min-width:calc(50% - 6px);flex:1}.sf-deck-filter-count{width:100%;margin-left:0}}
 `;
 document.head.appendChild(st);
}
function colorOf(el){for(const c of Object.keys(COLOR_LABEL))if(el.classList.contains(c))return c;return''}
function costMatches(cost){if(selectedCost==='all')return true;if(selectedCost==='4plus')return Number(cost)>=4;return Number(cost)===Number(selectedCost)}
function applyFilters(){
 const page=document.querySelector('.deck-builder-page');if(!page)return;
 let shownCards=0,totalCards=0,shownMonsters=0,totalMonsters=0;
 page.querySelectorAll('.deck-pick[data-deck-kind="cards"]').forEach(el=>{totalCards++;const id=String(el.dataset.deckId||''),color=colorOf(el),show=(selectedColor==='all'||selectedColor===color)&&costMatches(COST[id]);el.classList.toggle('sf-filter-hidden',!show);if(show)shownCards++});
 page.querySelectorAll('.deck-pick[data-deck-kind="monsters"]').forEach(el=>{totalMonsters++;const color=colorOf(el),show=selectedColor==='all'||selectedColor===color;el.classList.toggle('sf-filter-hidden',!show);if(show)shownMonsters++});
 const counter=page.querySelector('#sfDeckFilterCount');if(counter)counter.textContent=`${shownCards}/${totalCards} carte • ${shownMonsters}/${totalMonsters} Mostri`;
}
function availableColors(page){
 const colors=[];page.querySelectorAll('.deck-pick[data-deck-kind="cards"],.deck-pick[data-deck-kind="monsters"]').forEach(el=>{const c=colorOf(el);if(c&&!colors.includes(c))colors.push(c)});
 return colors;
}
function buildColorOptions(colors){
 if(selectedColor!=='all'&&!colors.includes(selectedColor))selectedColor='all';
 return `<option value="all">Tutti i colori</option>`+colors.map(c=>`<option value="${c}"${selectedColor===c?' selected':''}>${COLOR_LABEL[c]}</option>`).join('');
}
function install(){
 ensureStyle();const page=document.querySelector('.deck-builder-page');if(!page)return;
 const cardSection=[...page.querySelectorAll('.deck-section')].find(s=>s.querySelector('.deck-pick[data-deck-kind="cards"]'));
 if(!cardSection)return;
 let bar=page.querySelector('#sfDeckFilters');
 if(bar){applyFilters();return;}
 const colors=availableColors(page);
 bar=document.createElement('div');bar.id='sfDeckFilters';bar.className='sf-deck-filters';
 bar.innerHTML=`<div class="sf-deck-filter"><label for="sfDeckColorFilter">Colore</label><select id="sfDeckColorFilter">${buildColorOptions(colors)}</select></div><div class="sf-deck-filter"><label for="sfDeckCostFilter">Costo in Anime</label><select id="sfDeckCostFilter"><option value="all"${selectedCost==='all'?' selected':''}>Tutti i costi</option><option value="0"${selectedCost==='0'?' selected':''}>0 Anime</option><option value="1"${selectedCost==='1'?' selected':''}>1 Anima</option><option value="2"${selectedCost==='2'?' selected':''}>2 Anime</option><option value="3"${selectedCost==='3'?' selected':''}>3 Anime</option><option value="4plus"${selectedCost==='4plus'?' selected':''}>4+ Anime</option></select></div><div class="sf-deck-filter-count" id="sfDeckFilterCount"></div>`;
 cardSection.parentNode.insertBefore(bar,cardSection);
 const color=bar.querySelector('#sfDeckColorFilter'),cost=bar.querySelector('#sfDeckCostFilter');
 color.addEventListener('change',()=>{selectedColor=color.value;applyFilters()});
 cost.addEventListener('change',()=>{selectedCost=cost.value;applyFilters()});
 applyFilters();
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;install()})}
ensureStyle();schedule();
const app=document.getElementById('app');
if(app)new MutationObserver(()=>schedule()).observe(app,{childList:true});
})();