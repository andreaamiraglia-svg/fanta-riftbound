(()=>{
const style=document.createElement('style');
style.id='sfDeckBuilderStats93Style';
style.textContent=`
.deck-builder-sidebar{overflow:auto;padding-right:3px}.sf-builder-stats{position:static!important;flex:none;margin-bottom:12px}.sf-builder-stats .sf-deck-stat{padding:13px 8px}.sf-builder-stats .sf-deck-stat strong{font-size:24px}.sf-builder-stats .sf-deck-stat-box{padding:11px}.sf-builder-stats .sf-deck-curve{height:90px}.deck-builder-sidebar>.deck-side-panel{height:auto;min-height:520px}
@media(max-width:1180px){.deck-builder-sidebar>.deck-side-panel{min-height:0}}
`;
document.head.appendChild(style);
let queued=false;
function selected(kind){return [...document.querySelectorAll(`.deck-pick.selected[data-deck-kind="${kind}"]`)].map(x=>x.dataset.deckId).filter(Boolean)}
function mount(){
 queued=false;
 const side=document.querySelector('.deck-builder-page .deck-builder-sidebar');
 if(!side||side.querySelector('.sf-builder-stats')||typeof window.sfDeckStatsHtml!=='function')return;
 const box=document.createElement('div');
 box.innerHTML=window.sfDeckStatsHtml({champions:selected('champions'),cards:selected('cards'),monsters:selected('monsters')});
 const stats=box.firstElementChild;if(!stats)return;
 stats.classList.add('sf-builder-stats');side.prepend(stats);
}
function schedule(){if(queued)return;queued=true;queueMicrotask(mount)}
new MutationObserver(schedule).observe(document.querySelector('#app')||document.body,{childList:true,subtree:true});
schedule();
})();