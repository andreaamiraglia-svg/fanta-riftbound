(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/champion-of-the-souls-carte-ottimizzate/cards/';
const DATA={
 kael:{base:['Kael Infuocato',3,3,'Ammazza Draghi — La prima volta in ogni turno che la tua mano diventa vuota, Kael ottiene +2 POW fino alla fine del turno.','Kael Infuocato (Campione)(Rosso).webp'],superior:['Kael Infuocato Superiore',3,3,'Apocalisse Draconica — La prima volta in ogni turno che la tua mano diventa vuota, attiva Kael. Kael ottiene +4 POW fino alla fine del turno.','Kael Infuocato (Campione)(Rosso) (2).webp']},
 scarlet:{base:['Scarlet, Fiamma dei Mari',3,3,'Fuoco e Fiamme — La prima volta in ogni turno che scarti una carta dalla tua mano, pesca 1 carta dal tuo Mazzo.','Kael Infuocato (Campione)(Rosso) (3).webp'],superior:['Scarlet, Fiamma dei Mari Superiore',3,3,'Marea Cremisi — Ogni volta che scarti una o più carte, pesca 1 carta e infliggi 1 danno a ciascun Campione nemico.','Kael Infuocato (Campione)(Rosso) (4).webp']},
 kroth:{base:['Kroth il Fulminatore',3,3,'Scudo di Guerra — Ogni volta che Kroth difende, ottiene +1 POW fino alla fine del turno.','Kroth il Fulminatore (Campione)(Arancione).webp'],superior:['Kroth il Fulminatore Superiore',4,3,'Baluardo del Fulmine — Ogni volta che Kroth difende, ottiene +1 POW fino alla fine del turno. Ogni volta che attacca, ottiene Protettore fino alla fine del turno.','Kroth il Fulminatore (Campione)(Arancione) (2).webp']},
 aurelius:{base:["Aurelius, Re dell'Opulenza",1,5,'Ricchezza Ostentata — Finché hai più carte in mano del tuo avversario, i tuoi Supporti ottengono +1 POW.','Kroth il Fulminatore (Campione)(Arancione) (3).webp'],superior:["Aurelius, Re dell'Opulenza Superiore",1,5,'Opulenza Assoluta — Finché hai più carte in mano del tuo avversario, i tuoi Supporti ottengono +1 POW. Tappa: pesca 2 carte. Ascensione — Pesca 1 carta.','Kroth il Fulminatore (Campione)(Arancione) (4).webp']},
 lyrandel:{base:['Lyrandel Spirito della Natura',3,3,'Tecnica Ninjitsu — La prima volta in ogni turno che uno o più Mostri subiscono danni da una tua fonte, scegline uno: subisce 1 danno aggiuntivo.','Lyrandel Spirito della Natura (Campione)(Verde).webp'],superior:['Lyrandel Spirito della Natura Superiore',3,3,'Tempesta Primordiale — La prima volta in ogni turno che uno o più Mostri subiscono danni da una tua fonte, infliggi 2 danni a tutti i Mostri.','Lyrandel Spirito della Natura (Campione)(Verde) (2).webp']},
 torvald:{base:['Torvald, Spezzatronchi',4,2,'Ascia Furiosa — Ogni volta che Torvald subisce una Ferita, attivalo.','Lyrandel Spirito della Natura (Campione)(Verde) (3).webp'],superior:['Torvald, Spezzatronchi Superiore',4,3,'Furia Inarrestabile — Ogni volta che Torvald subisce una Ferita, attivalo. Ascensione — Attiva Torvald.','Lyrandel Spirito della Natura (Campione)(Verde) (4).webp']},
 valtheris:{base:['Valtheris Spirito Eterno',3,3,'Protettore dell’Anima — All’inizio di ogni turno, Valtheris ottiene 1 Armatura. Tappa: Valtheris ottiene 1 Armatura e Provocazione fino alla fine del turno.','Valtheris Spirito Eterno (Campione)(Blu).webp'],superior:['Valtheris Spirito Eterno Superiore',3,3,'Egida dell’Eternità — All’inizio di ogni turno, Valtheris ottiene 1 Armatura. Se Valtheris sta per ottenere Armatura da un effetto, ne ottiene invece il doppio.','Valtheris Spirito Eterno (Campione)(Blu) (2).webp']},
 hilda:{base:["Hilda, Ira d'Inverno",2,4,'Furia del Valhalla — Ogni volta che una tua fonte riduce a 0 o meno il POW di un nemico, Hilda lo attacca.','Valtheris Spirito Eterno (Campione)(Blu) (3).webp'],superior:["Hilda, Ira d'Inverno Superiore",3,4,'Condanna Glaciale — Ogni volta che una tua fonte riduce a 0 o meno il POW di un nemico, quel nemico subisce 1 Ferita. Ascensione — Ogni nemico con 0 POW subisce 1 Ferita.','Valtheris Spirito Eterno (Campione)(Blu) (4).webp']},
 divoratore_campione:{base:['Il Divoratore di Anime',2,4,'Ritorno delle Anime — Tappa, solo se hai ucciso un Mostro in questo turno: scegli una carta nel tuo Cimitero e aggiungila alla tua mano.','Il Divoratore di Anime (Campione)(Nero).webp'],superior:['Il Divoratore di Anime Superiore',2,4,'Dominio delle Anime — Una volta per turno, puoi giocare una carta dal tuo Cimitero. Se una carta giocata in questo modo sta per essere rimessa nel tuo Cimitero, bandiscila invece.','Il Divoratore di Anime (Campione)(Nero) (2).webp']},
 grinn:{base:['Grinn, il Folle',3,3,'Risata Omicida — La prima volta in ogni turno che muore un Campione o un Mostro con 4 o più POW, le tue Magie di costo base 3 o superiore costano 1 Anima in meno fino alla fine del turno.','Il Divoratore di Anime (Campione)(Nero) (3).webp'],superior:['Grinn, il Folle Superiore',3,3,'Follia Arcana — Le tue Magie di costo base 3 o superiore costano 1 Anima in meno. Ascensione — La prossima Magia che giochi in questo turno costa 1 Anima in meno.','Il Divoratore di Anime (Campione)(Nero) (4).webp']}
};
const url=file=>BASE+file.split('/').map(encodeURIComponent).join('/');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const runtime=(id,owner)=>{try{return session?.state?.players?.[String(owner)]?.champions?.find(c=>String(c.id)===id)||null}catch{return null}};
const idFrom=el=>String(el?.dataset?.champId||el?.dataset?.previewId||el?.dataset?.deckId||el?.dataset?.previewCard||'');
function liveFor(el,id){const owner=Number(el?.dataset?.owner);return owner===1||owner===2?runtime(id,owner):null}
function artFor(id,live){const d=DATA[id];return d?url(d[live?.superior?'superior':'base'][4]):''}

function patchCard(el){
 if(!(el instanceof Element))return;const id=idFrom(el),d=DATA[id];if(!d)return;const src=artFor(id,liveFor(el,id));let img=el.matches('img')?el:el.querySelector(':scope > img,.sf-card-shell > img,img');if(!img)return;if(img.src!==src)img.src=src;img.dataset.sfChampion105=id;
}
function patch(root=document){const sel='[data-champ-id],[data-preview-id],[data-deck-id],[data-preview-card]';if(root instanceof Element&&root.matches(sel))patchCard(root);root.querySelectorAll?.(sel).forEach(patchCard)}
function installResolver(){const prev=window.sfArtUrl21;if(prev?.__sfChampion105)return;const fn=id=>DATA[String(id)]?url(DATA[String(id)].base[4]):(typeof prev==='function'?prev(id):'');fn.__sfChampion105=true;fn.__previous=prev;window.sfArtUrl21=fn}

function ensureModal(){let el=document.getElementById('sfChampion105');if(el)return el;el=document.createElement('div');el.id='sfChampion105';el.className='sf105-overlay';el.innerHTML='<div class="sf105-dialog" role="dialog" aria-modal="true"><button class="sf105-close" aria-label="Chiudi">×</button><div class="sf105-main"></div><aside class="sf105-versions"></aside></div>';document.body.appendChild(el);el.querySelector('.sf105-close').onclick=close;el.addEventListener('click',e=>{if(e.target===el)close()});return el}
let current=null;
function stats(version,live,isCurrent){const pow=isCurrent&&live?Number(live.pow??live.basePow):version[1],hp=version[2],w=isCurrent&&live?Number(live.wounds||0):0,damage=isCurrent&&live?Number(live.damage||0):0,armor=isCurrent&&live?Number(live.armor||0):0;return `<div class="sf105-stats"><span>POW <b>${pow}</b></span><span>HP <b>${Math.max(0,hp-w)}/${hp}</b></span><span>Ferite <b>${w}</b></span><span>Danni <b>${damage}</b></span>${armor?`<span>Armatura <b>${armor}</b></span>`:''}</div>`}
function render(which){
 const {id,live}=current,d=DATA[id],version=d[which],isCurrent=!!live&&((which==='superior')===!!live.superior),modal=ensureModal();
 modal.querySelector('.sf105-main').innerHTML=`<img src="${url(version[4])}" alt="${esc(version[0])}"><div class="sf105-copy"><div class="sf105-kicker">${which==='superior'?'Versione Superiore':'Versione base'}${isCurrent?' • Stato attuale':''}</div><h2>${esc(version[0])}</h2>${stats(version,live,isCurrent)}<p>${esc(version[3])}</p></div>`;
 modal.querySelector('.sf105-versions').innerHTML=['base','superior'].map(key=>{const v=d[key];return `<button class="sf105-version ${key===which?'active':''}" data-sf105-version="${key}"><img src="${url(v[4])}" alt=""><span>${key==='superior'?'Superiore':'Base'}</span></button>`}).join('');
 modal.querySelectorAll('[data-sf105-version]').forEach(b=>b.onclick=()=>render(b.dataset.sf105Version));
}
function open(id,live){current={id,live};const modal=ensureModal();modal.classList.add('show');document.body.classList.add('sf105-open');render(live?.superior?'superior':'base')}
function close(){document.getElementById('sfChampion105')?.classList.remove('show');document.body.classList.remove('sf105-open');current=null}

document.addEventListener('contextmenu',e=>{const el=e.target instanceof Element?e.target.closest('[data-champ-id],[data-preview-id],[data-deck-id],[data-preview-card]'):null,id=idFrom(el);if(!DATA[id])return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open(id,liveFor(el,id))},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()},true);

function openGraveCast(){
 const cards=session?.state?.players?.[String(session.player)]?.graveCards||[];if(!cards.length){try{showError('Il tuo Cimitero Carte è vuoto.')}catch{}return}
 showModal('Dominio delle Anime — gioca dal Cimitero',`<div class="sf105-grave-grid">${cards.map(c=>`<button class="sf105-grave-card" data-sf105-grave="${esc(c.id)}"><img src="${window.sfArtUrl21?.(c.id)||''}" alt=""><span>${esc(c.name||c.id)}</span></button>`).join('')}</div>`);
 document.querySelectorAll('[data-sf105-grave]').forEach(b=>b.onclick=()=>{const id=b.dataset.sf105Grave;closeModal();if(typeof window.sfBeginCardTargeting==='function')window.sfBeginCardTargeting(id,'cast_from_grave');else move({type:'cast_from_grave',cardId:id,targets:{}})});
}
function addAbilities(){
 try{
  const p=Number(session?.player),q=session?.state?.players?.[String(p)];
  for(const c of q?.champions||[]){
   if(!c.superior||c.defeated)continue;
   const el=document.querySelector(`.champ[data-owner="${p}"][data-champ-id="${CSS.escape(String(c.id))}"]`);if(!el)continue;
   let actions=el.querySelector('.card-actions');if(!actions){actions=document.createElement('div');actions.className='card-actions';el.appendChild(actions)}
   if(c.id==='aurelius'&&!el.querySelector('.sf105-aurelius')){const b=document.createElement('button');b.className='btn sf105-aurelius';b.textContent='Opulenza Assoluta';b.disabled=!!c.tapped;b.onclick=e=>{e.preventDefault();e.stopPropagation();move({type:'activate_champion',champId:'aurelius'})};actions.appendChild(b)}
   if(c.id==='divoratore_campione'&&!el.querySelector('.sf105-divoratore')){const b=document.createElement('button');b.className='btn sf105-divoratore';b.textContent='Dominio delle Anime';b.disabled=Number(q._superiorDivoratoreTurn)===Number(session.state.turn);b.onclick=e=>{e.preventDefault();e.stopPropagation();openGraveCast()};actions.appendChild(b)}
  }
 }catch{}
}
function refresh(root=document){installResolver();patch(root);addAbilities()}
installResolver();refresh();
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n instanceof Element)patch(n);queueMicrotask(addAbilities)}).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(refresh,100);setTimeout(refresh,600);setTimeout(refresh,1800);
window.sfChampionSuperior105={DATA,artFor,open,patch};
})();
