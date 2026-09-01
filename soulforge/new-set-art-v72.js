(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={
 scarlet:'scarlet-fiamma-dei-mari.webp',
 torvald:'torvald-spezzatronchi.webp',
 grinn:'grinn-il-folle.webp',
 hilda:'hilda-ira-d-inverno.webp',
 aurelius:'aurelius-re-dell-opulenza.webp',
 bang:'bang.webp',
 barile_esplosivo:'barile-esplosivo.webp',
 spacca_corazze:'spacca-corazze.webp',
 tiro_rotante:'tiro-rotante.webp',
 circo_infestato:'circo-infestato.webp',
 scatola_incantata:'scatola-incantata.webp',
 cacciatrice_della_tempesta:'cacciatrice-della-tempesta.webp',
 tempesta_di_ghiaccio:'tempesta-di-ghiaccio.webp',
 servo_del_sovrano:'servo-del-sovrano.webp',
 dono_ai_poveri:'dono-ai-poveri.webp'
};
const url=id=>ART[id]?BASE+ART[id]:'';
function idOf(el){return String(el?.dataset?.handCard||el?.dataset?.selectCard||el?.dataset?.previewCard||el?.dataset?.cardId||el?.dataset?.card||el?.dataset?.champId||'')}
function classFor(el){
 if(el.classList?.contains('champ'))return'champ-art';
 if(el.classList?.contains('monster'))return'monster-art';
 return'';
}
function ensureImg(el){
 const id=idOf(el),src=url(id);if(!src)return;
 let img=el.matches?.('img')?el:el.querySelector?.(':scope > img');
 if(!img){img=document.createElement('img');const cl=classFor(el);if(cl)img.className=cl;img.alt=id;img.loading='lazy';el.insertBefore(img,el.firstChild||null)}
 if(img.getAttribute('src')!==src)img.setAttribute('src',src);
}
function patch(root=document){
 if(root?.matches?.('[data-hand-card],[data-select-card],[data-preview-card],[data-card-id],[data-card],.champ[data-champ-id]'))ensureImg(root);
 root?.querySelectorAll?.('[data-hand-card],[data-select-card],[data-preview-card],[data-card-id],[data-card],.champ[data-champ-id]').forEach(ensureImg);
}
function installResolver(){
 const cur=window.sfArtUrl21;if(cur?.__sfNewSetArt72)return;
 const prev=cur;const fn=id=>url(String(id))||(typeof prev==='function'?prev(id):'');
 fn.__sfNewSetArt72=true;fn.__previous=prev;window.sfArtUrl21=fn;
}
let queued=false;
function schedule(root=document){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;installResolver();patch(root)})}
installResolver();patch();
const app=document.getElementById('app');
if(app)new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n instanceof Element)patch(n);schedule(app)}).observe(app,{childList:true,subtree:true});
document.addEventListener('mouseover',e=>{const el=e.target instanceof Element?e.target.closest('[data-preview-card],[data-hand-card],[data-select-card],.champ[data-champ-id]'):null;if(el)ensureImg(el)},true);
setTimeout(()=>patch(),100);setTimeout(()=>patch(),500);setTimeout(()=>patch(),1500);
window.sfNewSetArt72={patch,ART};
})();
