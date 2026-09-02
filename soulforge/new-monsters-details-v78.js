(()=>{
const DATA={
 minotauro_infernale:{pow:4,color:'red',label:'ROSSO',text:'Quando questo Mostro entra in gioco, tutti i giocatori scartano 1 carta dalla loro mano.'},
 treant_millenario:{pow:3,color:'green',label:'VERDE',text:'Quando subisce danni ottiene 2 Armatura.'},
 ghoul_affamato:{pow:1,color:'black',label:'NERO',text:'Quando muore un altro Mostro, le Magie di costo 3 o superiore costano 1 Anima in meno per questo turno.'},
 balena_della_tempesta:{pow:4,color:'blue',label:'BLU',text:'Quando entra in gioco riduce di 1 il POW a tutti i Campioni.'},
 scarabeo_dorato:{pow:2,color:'orange',label:'ARANCIONE',text:'Lascito — Pesca 1 carta.'}
};
let last='';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function remember(e){const el=e.target instanceof Element?e.target.closest('[data-preview-id],[data-sidebar-preview]'):null;if(!el)return;const id=String(el.dataset.previewId||el.dataset.sidebarPreview||'');if(DATA[id]){last=id;setTimeout(patch,0);setTimeout(patch,35)}}
function patch(){
 if(!last||!DATA[last])return;
 const overlay=document.getElementById('deckPreview');if(!overlay?.classList.contains('show'))return;
 const info=overlay.querySelector('.sf76-info')||overlay.querySelector('.deck-preview-inner')?.children?.[1];if(!(info instanceof Element))return;
 const d=DATA[last],title=info.querySelector('h3')?.textContent?.trim()||last;
 info.className=`sf76-info ${d.color}`;info.dataset.sfPreview76=last;info.dataset.sfMonster78=last;
 const kws=d.text.includes('Lascito')?'<div class="sf76-keywords"><span>Lascito</span></div>':'';
 info.innerHTML=`<div class="sf76-title"><div><h3>${esc(title)}</h3><div class="sf76-sub">MOSTRO • ${d.label}</div></div></div><div class="sf76-stats"><div class="sf76-stat"><span>POW</span><strong>${d.pow}</strong><small>base</small></div></div>${kws}<div class="sf76-effect"><div class="sf76-label">EFFETTO</div><p>${esc(d.text)}</p></div><p class="sf76-close">Click fuori dalla carta o ESC per chiudere</p>`;
}
document.addEventListener('pointerdown',remember,true);document.addEventListener('click',remember,true);document.addEventListener('mouseover',remember,true);
const app=document.getElementById('app');if(app)new MutationObserver(()=>requestAnimationFrame(patch)).observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
})();
