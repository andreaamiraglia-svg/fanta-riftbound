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
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const runtime=(id,owner)=>{try{return session?.state?.players?.[String(owner)]?.champions?.find(c=>String(c.id)===String(id))||null}catch{return null}};
const idFrom=el=>String(el?.dataset?.champId||el?.dataset?.previewId||el?.dataset?.deckId||el?.dataset?.previewCard||'');
function artFor(id,live){const d=DATA[String(id)];return d?url(d[live?.superior?'superior':'base'][4]):''}

function ownerForZone(zone){
 try{
  if(zone?.classList?.contains('sf-player-zone'))return Number(session.player);
  if(zone?.classList?.contains('sf-opponent-zone'))return Number(session.player)===1?2:1;
  const zones=[...document.querySelectorAll('.game-grid main > .playerzone')];
  const i=zones.indexOf(zone);if(i===0)return Number(session.player)===1?2:1;if(i===zones.length-1)return Number(session.player);
 }catch{}
 return 0;
}
function identifyGameChampion(el){
 const card=el?.closest?.('.champ');if(!card)return null;
 let id=String(card.dataset.champId||''),owner=Number(card.dataset.owner||0),live=id&&owner?runtime(id,owner):null;
 const zone=card.closest('.playerzone');if(owner!==1&&owner!==2)owner=ownerForZone(zone);
 const champs=owner===1||owner===2?(session?.state?.players?.[String(owner)]?.champions||[]):[];
 if(!live&&id)live=champs.find(c=>String(c.id)===id)||null;
 if(!live){
  const title=norm(card.querySelector('h3')?.textContent||'');
  live=champs.find(c=>norm(c.name)===title)||champs.find(c=>{const d=DATA[String(c.id)];return d&&(norm(d.base[0])===title||norm(d.superior[0])===title)})||null;
 }
 if(!live){
  const all=[...zone?.querySelectorAll?.('.champ')||[]],i=all.indexOf(card);if(i>=0)live=champs[i]||null;
 }
 if(!live||!DATA[String(live.id)])return null;
 id=String(live.id);card.dataset.champId=id;if(owner===1||owner===2)card.dataset.owner=String(owner);
 return{card,id,owner,live};
}
function identifyDeckChampion(el){
 const card=el?.closest?.('[data-deck-kind="champions"],[data-deck-id],[data-preview-id]');if(!card)return null;
 const id=String(card.dataset.deckId||card.dataset.previewId||card.dataset.champId||'');if(!DATA[id])return null;return{card,id,owner:0,live:null};
}
function identify(el){return identifyGameChampion(el)||identifyDeckChampion(el)}

function ensureGameImage(card,id,live){
 const src=artFor(id,live);if(!src)return;
 let img=card.querySelector('img.champ-art,img[data-sf-champion-art],.sf-card-shell > img');
 if(!img){img=document.createElement('img');img.className='champ-art';const h=card.querySelector('h3');if(h)card.insertBefore(img,h);else card.prepend(img)}
 img.classList.add('champ-art');img.dataset.sfChampionArt=id;img.dataset.sfChampion105=id;
 if(img.getAttribute('src')!==src)img.setAttribute('src',src);
 img.alt=live?.name||DATA[id][live?.superior?'superior':'base'][0];
}
function bindAndPatchGame(){
 document.querySelectorAll('.champ').forEach(card=>{const info=identifyGameChampion(card);if(info)ensureGameImage(info.card,info.id,info.live)});
}
function patchDeck(){
 document.querySelectorAll('[data-deck-kind="champions"],[data-deck-id]').forEach(card=>{const info=identifyDeckChampion(card);if(!info)return;const src=artFor(info.id,null),img=card.matches('img')?card:card.querySelector('img');if(img&&src&&img.getAttribute('src')!==src)img.setAttribute('src',src)});
}
function installResolver(){
 const prev=window.sfArtUrl21;if(prev?.__sfChampion105)return;
 const fn=id=>DATA[String(id)]?url(DATA[String(id)].base[4]):(typeof prev==='function'?prev(id):'');fn.__sfChampion105=true;fn.__previous=prev;window.sfArtUrl21=fn;
}

function ensureModal(){let el=document.getElementById('sfChampion105');if(el)return el;el=document.createElement('div');el.id='sfChampion105';el.className='sf105-overlay';el.innerHTML='<div class="sf105-dialog" role="dialog" aria-modal="true"><button class="sf105-close" aria-label="Chiudi">×</button><div class="sf105-main"></div><aside class="sf105-versions"></aside></div>';document.body.appendChild(el);el.querySelector('.sf105-close').onclick=close;el.addEventListener('click',e=>{if(e.target===el)close()});return el}
let current=null;
function stats(version,live,isCurrent){const pow=isCurrent&&live?Number(live.pow??live.basePow):version[1],hp=version[2],w=isCurrent&&live?Number(live.wounds||0):0,damage=isCurrent&&live?Number(live.damage||0):0,armor=isCurrent&&live?Number(live.armor||0):0;return `<div class="sf105-stats"><span>POW <b>${pow}</b></span><span>HP <b>${Math.max(0,hp-w)}/${hp}</b></span><span>Ferite <b>${w}</b></span><span>Danni <b>${damage}/${Math.max(0,pow)}</b></span>${armor?`<span>Armatura <b>${armor}</b></span>`:''}</div>`}
function render(which){
 if(!current)return;const {id,live}=current,d=DATA[id],version=d[which],isCurrent=!!live&&((which==='superior')===!!live.superior),modal=ensureModal();
 modal.querySelector('.sf105-main').innerHTML=`<img src="${url(version[4])}" alt="${esc(version[0])}"><div class="sf105-copy"><div class="sf105-kicker">${which==='superior'?'Versione Superiore':'Versione base'}${isCurrent?' • Stato attuale':''}</div><h2>${esc(version[0])}</h2>${stats(version,live,isCurrent)}<p>${esc(version[3])}</p></div>`;
 modal.querySelector('.sf105-versions').innerHTML=['base','superior'].map(key=>{const v=d[key];return `<button class="sf105-version ${key===which?'active':''}" data-sf105-version="${key}"><img src="${url(v[4])}" alt="${esc(v[0])}"><span>${key==='superior'?'Superiore':'Base'}</span></button>`}).join('');
 modal.querySelectorAll('[data-sf105-version]').forEach(b=>b.onclick=()=>render(b.dataset.sf105Version));
}
function open(id,live){if(!DATA[String(id)])return;current={id:String(id),live:live||null};const modal=ensureModal();modal.classList.add('show');document.body.classList.add('sf105-open');render(live?.superior?'superior':'base')}
function close(){document.getElementById('sfChampion105')?.classList.remove('show');document.body.classList.remove('sf105-open');current=null}

document.addEventListener('contextmenu',e=>{
 const info=e.target instanceof Element?identify(e.target):null;if(!info)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open(info.id,info.live);
},true);
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
function refresh(){installResolver();bindAndPatchGame();patchDeck();addAbilities()}
installResolver();refresh();
new MutationObserver(()=>queueMicrotask(refresh)).observe(document.documentElement,{childList:true,subtree:true});
setInterval(refresh,250);
setTimeout(refresh,50);setTimeout(refresh,350);setTimeout(refresh,1000);
window.sfChampionSuperior105={DATA,artFor,open,patch:refresh,refresh};
})();
