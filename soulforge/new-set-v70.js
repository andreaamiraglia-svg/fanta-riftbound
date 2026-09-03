(()=>{
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const ART={
 scarlet:'scarlet-fiamma-dei-mari.webp',torvald:'torvald-spezzatronchi.webp',grinn:'grinn-il-folle.webp',hilda:'hilda-ira-d-inverno.webp',aurelius:'aurelius-re-dell-opulenza.webp',
 bang:'bang.webp',barile_esplosivo:'barile-esplosivo.webp',spacca_corazze:'spacca-corazze.webp',tiro_rotante:'tiro-rotante.webp',circo_infestato:'circo-infestato.webp',scatola_incantata:'scatola-incantata.webp',cacciatrice_della_tempesta:'cacciatrice-della-tempesta.webp',tempesta_di_ghiaccio:'tempesta-di-ghiaccio.webp',servo_del_sovrano:'servo-del-sovrano.webp',dono_ai_poveri:'dono-ai-poveri.webp',yeti:'yeti.webp'
};
const IDS=new Set(['bang','barile_esplosivo','spacca_corazze','tiro_rotante','circo_infestato','scatola_incantata','cacciatrice_della_tempesta','tempesta_di_ghiaccio','servo_del_sovrano','dono_ai_poveri']);
let mode=null,dragCardId=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function me(){try{return typeof playerState==='function'?playerState(session.player):session?.state?.players?.[String(session.player)]}catch{return null}}
function handCard(id){return me()?.handCards?.find(c=>String(c?.id)===String(id))||null}
function art(id){return ART[id]?BASE+ART[id]:''}
function installArt(){const cur=window.sfArtUrl21;if(cur?.__sfNewSet70)return;const prev=cur;const fn=id=>art(String(id))||(typeof prev==='function'?prev(id):'');fn.__sfNewSet70=true;fn.__previous=prev;window.sfArtUrl21=fn}
function patchImages(root=document){root.querySelectorAll?.('[data-hand-card],[data-preview-card],[data-select-card],[data-card-id],[data-card]').forEach(el=>{const id=el.dataset.handCard||el.dataset.previewCard||el.dataset.selectCard||el.dataset.cardId||el.dataset.card,u=art(id);if(!u)return;const img=el.matches('img')?el:el.querySelector('img');if(img&&img.src!==u)img.src=u})}
function showErr(s){try{showError(s)}catch{console.warn(s)}}
function legal(card){try{return typeof canCast==='function'?!!canCast(card):true}catch{return false}}
function clear(){document.querySelectorAll('.sf70-valid,.sf70-picked').forEach(x=>x.classList.remove('sf70-valid','sf70-picked'));document.getElementById('sf70Hint')?.remove();document.getElementById('sf70Modal')?.remove();mode=null}
function hint(text){let h=document.getElementById('sf70Hint');if(!h){h=document.createElement('div');h.id='sf70Hint';document.body.appendChild(h)}h.textContent=text}
function monsterEls(filter=()=>true){return(session.state?.board?.monsters||[]).filter(filter).map(m=>document.querySelector(`[data-monster-uid="${CSS.escape(String(m.uid))}"]`)).filter(Boolean)}
function champEls(filter=()=>true){return[...document.querySelectorAll('.champ[data-owner][data-champ-id]')].filter(el=>!el.classList.contains('defeated')&&filter(el))}
function ownChampEls(){return champEls(el=>Number(el.dataset.owner)===Number(session.player))}
function enemyEls(){const op=session.player===1?2:1;return[...champEls(el=>Number(el.dataset.owner)===op),...monsterEls()]}
function targetFrom(el){if(el?.dataset?.monsterUid)return{type:'monster',uid:String(el.dataset.monsterUid)};if(el?.dataset?.champId)return{type:'champion',player:Number(el.dataset.owner),champId:String(el.dataset.champId)};return null}
function paintEls(els,text){document.querySelectorAll('.sf70-valid').forEach(x=>x.classList.remove('sf70-valid'));els.forEach(x=>x.classList.add('sf70-valid'));hint(els.length?text:text.replace(/ •.*/, '')+' • nessun bersaglio valido')}
function paint(){
 if(!mode)return;
 if(mode.type==='monster')paintEls(monsterEls(),`${mode.label}: scegli un Mostro • ESC per annullare`);
 else if(mode.type==='ownMonster')paintEls(monsterEls(m=>Number(m.owner)===Number(session.player)),`${mode.label}: scegli un Mostro che controlli • ESC per annullare`);
 else if(mode.type==='enemy')paintEls(enemyEls(),`${mode.label}: scegli un nemico • ESC per annullare`);
 else if(mode.type==='ownChamp')paintEls(ownChampEls(),`${mode.label}: scegli un tuo Campione • ESC per annullare`);
 else if(mode.type==='bangA')paintEls(champEls(),`BANG!!!: scegli il Campione che subirà 2 danni • ESC per annullare`);
 else if(mode.type==='bangMonster')paintEls(monsterEls(),`BANG!!!: scegli il Mostro che subirà 1 danno • ESC per annullare`);
 else if(mode.type==='tiro'){
  const els=monsterEls();document.querySelectorAll('.sf70-valid,.sf70-picked').forEach(x=>x.classList.remove('sf70-valid','sf70-picked'));els.forEach(el=>{const u=String(el.dataset.monsterUid);el.classList.add(mode.picked.has(u)?'sf70-picked':'sf70-valid')});hint(`Tiro Rotante: scegli 3 Mostri (${mode.picked.size}/3) • ESC per annullare`);
 }
}
function cast(cardId,targets={}){clear();try{return move({type:'cast',cardId,targets})}catch(e){showErr(e?.message||String(e))}}
function modal(title,items,selected,max,onConfirm){
 clear();const ov=document.createElement('div');ov.id='sf70Modal';
 ov.innerHTML=`<div class="sf70-box"><h2>${esc(title)}</h2><div class="sf70-grid">${items.map(x=>`<button type="button" class="sf70-card" data-id="${esc(x.id)}"><img src="${esc(x.img||window.sfArtUrl21?.(x.id)||'')}" alt=""><strong>${esc(x.name||x.id)}</strong><span class="sf70-check">✓</span></button>`).join('')}</div><div class="sf70-actions"><button type="button" class="btn ghost" data-cancel>Annulla</button><button type="button" class="btn primary" data-confirm disabled>Conferma (0/${max})</button></div></div>`;
 document.body.appendChild(ov);const picked=selected||new Set(),confirm=ov.querySelector('[data-confirm]');
 const sync=()=>{ov.querySelectorAll('.sf70-card').forEach(b=>b.classList.toggle('selected',picked.has(String(b.dataset.id))));confirm.disabled=picked.size!==max;confirm.textContent=`Conferma (${picked.size}/${max})`};
 ov.addEventListener('click',e=>{const b=e.target.closest?.('.sf70-card');if(b){const id=String(b.dataset.id);if(picked.has(id))picked.delete(id);else if(picked.size<max)picked.add(id);sync();return}if(e.target.closest?.('[data-cancel]')){clear();return}if(e.target.closest?.('[data-confirm]')&&picked.size===max){ov.remove();onConfirm([...picked])}});sync();
 return picked;
}
function startBang(id){
 const cards=(me()?.handCards||[]).filter(c=>String(c.id)!==id);if(cards.length<2){showErr('BANG!!! richiede almeno 2 altre carte nella tua mano.');return}
 modal('BANG!!! — Scarta 2 carte',cards.map(c=>({id:String(c.id),name:c.name,img:window.sfArtUrl21?.(c.id)})),null,2,ids=>{mode={type:'bangA',cardId:id,discardIds:ids};paint()});
}
function startScatola(id){
 const deck=me()?.monsterDeck||[],defs=session.state?.monsterDefs||{};const unique=[...new Set(deck.map(String))];if(unique.length<2){showErr('Scatola Incantata richiede almeno 2 Mostri nel tuo Mazzo dei Mostri.');return}
 modal('Scatola Incantata — Scegli 2 Mostri',unique.map(mid=>({id:mid,name:defs[mid]?.name||mid,img:window.sfArtUrl21?.(mid)})),null,2,ids=>cast(id,{monsterIds:ids}));
}
function start(id){
 id=String(id||'');const card=handCard(id);if(!card||!IDS.has(id))return false;if(!legal(card)){showErr('Non puoi giocare questa carta in questo momento.');return true}
 clear();
 if(id==='servo_del_sovrano'){cast(id,{});return true}
 if(id==='bang'){startBang(id);return true}
 if(id==='scatola_incantata'){startScatola(id);return true}
 if(id==='barile_esplosivo'||id==='dono_ai_poveri'){mode={type:'monster',cardId:id,label:card.name};paint();return true}
 if(id==='circo_infestato'){mode={type:'ownMonster',cardId:id,label:card.name};paint();return true}
 if(id==='spacca_corazze'){mode={type:'enemy',cardId:id,label:card.name};paint();return true}
 if(id==='cacciatrice_della_tempesta'||id==='tempesta_di_ghiaccio'){mode={type:'enemy',cardId:id,label:card.name,next:'ownChamp'};paint();return true}
 if(id==='tiro_rotante'){if((session.state?.board?.monsters||[]).length<3){showErr('Tiro Rotante richiede 3 Mostri diversi.');return true}mode={type:'tiro',cardId:id,picked:new Set()};paint();return true}
 return false;
}
window.__sfStartNewSet70=start;

document.addEventListener('dblclick',e=>{const el=e.target instanceof Element?e.target.closest('.hand-card[data-hand-card]'):null;if(!el)return;const id=String(el.dataset.handCard||'');if(!IDS.has(id))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();start(id)},true);
document.addEventListener('dragstart',e=>{const el=e.target instanceof Element?e.target.closest('.hand-card[data-hand-card]'):null;if(!el)return;const id=String(el.dataset.handCard||'');if(IDS.has(id))dragCardId=id},true);
document.addEventListener('drop',e=>{const zone=e.target instanceof Element?e.target.closest('#playDropZone'):null;if(!zone||!dragCardId)return;const id=dragCardId;dragCardId=null;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();start(id)},true);
document.addEventListener('dragend',()=>{dragCardId=null},true);

document.addEventListener('click',e=>{
 if(!mode)return;const el=e.target instanceof Element?e.target.closest('.sf70-valid,.sf70-picked'):null;if(!el)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 if(mode.type==='tiro'){
  const u=String(el.dataset.monsterUid||'');if(!u)return;if(mode.picked.has(u))mode.picked.delete(u);else if(mode.picked.size<3)mode.picked.add(u);
  if(mode.picked.size===3){const id=mode.cardId,arr=[...mode.picked];cast(id,{monsterUids:arr})}else paint();return;
 }
 if(mode.type==='bangA'){const t=targetFrom(el);if(!t||t.type!=='champion')return;mode={...mode,type:'bangMonster',a:t};paint();return}
 if(mode.type==='bangMonster'){const m=mode,u=String(el.dataset.monsterUid||'');if(!u)return;cast(m.cardId,{discardIds:m.discardIds,championA:m.a,monsterUid:u});return}
 if(mode.type==='enemy'&&mode.next==='ownChamp'){const enemy=targetFrom(el),m=mode;if(!enemy)return;mode={type:'ownChamp',cardId:m.cardId,label:m.label,enemy};paint();return}
 if(mode.type==='ownChamp'){const m=mode;cast(m.cardId,{enemy:m.enemy,ownChamp:String(el.dataset.champId)});return}
 if(mode.type==='monster'){const m=mode;cast(m.cardId,{monsterUid:String(el.dataset.monsterUid)});return}
 if(mode.type==='ownMonster'){const m=mode;cast(m.cardId,{monsterUid:String(el.dataset.monsterUid)});return}
 if(mode.type==='enemy'){const m=mode;cast(m.cardId,{enemy:targetFrom(el)});return}
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(mode||document.getElementById('sf70Modal'))){e.preventDefault();clear()}},true);

function injectStyle(){if(document.getElementById('sfNewSet70Style'))return;const s=document.createElement('style');s.id='sfNewSet70Style';s.textContent=`
.sf70-valid{outline:3px solid #ffe08a!important;outline-offset:3px!important;cursor:crosshair!important;filter:brightness(1.12)!important}.sf70-picked{outline:4px solid #63e6be!important;outline-offset:3px!important;filter:brightness(1.18)!important}#sf70Hint{position:fixed;top:54px;left:50%;transform:translateX(-50%);z-index:10080;background:#10151ddd;border:1px solid #d9ac50;border-radius:999px;color:#fff1c4;padding:9px 16px;font-weight:900;box-shadow:0 8px 30px #000a;pointer-events:none}#sf70Modal{position:fixed;inset:0;z-index:10090;background:#05080ddd;display:flex;align-items:center;justify-content:center;padding:20px}#sf70Modal .sf70-box{width:min(1000px,94vw);max-height:90vh;overflow:auto;background:#111722;border:1px solid #d9ac50;border-radius:18px;padding:20px;box-shadow:0 24px 90px #000d}#sf70Modal h2{margin:0 0 14px;color:#f7e4b2;font-family:Georgia,serif}#sf70Modal .sf70-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px}#sf70Modal .sf70-card{position:relative;background:#090d13;border:2px solid #414b5a;border-radius:12px;padding:7px;color:#fff;cursor:pointer}#sf70Modal .sf70-card.selected{border-color:#63e6be;box-shadow:0 0 0 2px #63e6be55}#sf70Modal .sf70-card img{display:block;width:100%;aspect-ratio:.744;object-fit:cover;border-radius:8px;background:#05070a}#sf70Modal .sf70-card strong{display:block;margin-top:6px;font-size:12px}#sf70Modal .sf70-check{display:none;position:absolute;right:9px;top:9px;background:#63e6be;color:#06120e;border-radius:999px;width:26px;height:26px;place-items:center;font-weight:1000}#sf70Modal .sf70-card.selected .sf70-check{display:grid}#sf70Modal .sf70-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:16px}
`;document.head.appendChild(s)}
function boot(){injectStyle();installArt();patchImages();paint()}boot();window.addEventListener('sf-blue-ready',()=>setTimeout(boot,0));setTimeout(boot,300);setTimeout(boot,1200);const app=document.getElementById('app');if(app){let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;patchImages(app);paint()})}).observe(app,{childList:true,subtree:true})}
})();
