(()=>{
const OLD_BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const NEW_BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/cards-v18/';
const OLD_ART={kael:'kael.webp',lyrandel:'lyrandel.webp',lucertola_fuoco:'lucertola-di-fuoco.webp',segugio_infernale:'segugio-infernale.webp',fenice_cremisi:'fenice-cremisi.webp',golem_magmatico:'golem-magmatico.webp',drago_delle_ceneri:'drago-delle-ceneri.webp',salamandra_vulcanica:'salamandra-vulcanica.webp',ragno_dei_germogli:'ragno-dei-germogli.webp',serpente_della_giungla:'serpente-della-giungla.webp',lupo_delle_radici:'lupo-delle-radici.webp',cervo_antico:'cervo-antico.webp',guardiano_della_foresta:'guardiano-della-foresta.webp',orso_furioso:'orso-furioso.webp',taglio_fiammante:'taglio_fiammante.webp',sfera_incandescente:'sfera_incandescente.webp',corazza_esplosiva:'corazza_esplosiva.webp',occhio_di_drago:'occhio_di_drago.webp',mano_del_caos:'mano_del_caos.webp',nube_di_fuoco:'nube_di_fuoco.webp',tornado_bollente:'tornado_bollente.webp',fendente_di_fuoco:'fendente_di_fuoco.webp',berserk:'berserk.webp',taglio_ninjitsu:'taglio_ninjitsu.webp',stupido:'stupido.webp',riflesso:'riflesso.webp',tutto_per_la_festa:'tutto_per_la_festa.webp',alta_marea:'alta_marea.webp',doppia_katana:'doppia_katana.webp',albero_della_vita:'albero_della_vita.webp',sguardo_ninjitsu:'sguardo_ninjitsu.webp',mille_lame:'mille_lame.webp'};
const NEW_ART={divoratore_campione:'il-divoratore-di-anime.webp',segugio_dei_morti:'segugio-dei-morti.webp',custode_sepolcrale:'custode-sepolcrale.webp',cavaliere_senza_volto:'cavaliere-senza-volto.webp',cerbero:'cerbero.webp',re_dei_non_morti:'re-dei-non-morti.webp',divoratore_di_anime_mostro:'divoratore-di-anime-mostro.webp',evocatore_anime_vacue:'evocatore-di-anime-vacue.webp',anima_esplosiva:'anima-esplosiva.webp',sacrificio:'sacrificio.webp',collasso:'collasso.webp',spacca_ossa:'spacca-ossa.webp',eclipse_fang:'eclipse-fang.webp',fino_alla_morte:'fino-alla-morte.webp',mietitore:'mietitore.webp',ammazza_morte:'ammazza-morte.webp'};
const art=id=>NEW_ART[id]?NEW_BASE+NEW_ART[id]:(OLD_ART[id]?OLD_BASE+OLD_ART[id]:'');
const COLORS={red:'Rosso',green:'Verde',black:'Nero'};
const CHAMPIONS=[
 {id:'kael',name:'Kael Infuocato',color:'red',text:'Campione Rosso.'},
 {id:'lyrandel',name:'Lyrandel Spirito della Natura',color:'green',text:'Campione Verde.'},
 {id:'divoratore_campione',name:'Il Divoratore di Anime',color:'black',text:'Campione Nero.'}
];
const CARDS=[
 ['taglio_fiammante','Taglio Fiammante','red','Magia','Risposta'],['sfera_incandescente','Sfera Incandescente','red','Magia','Base'],['corazza_esplosiva','Corazza Esplosiva','red','Magia','Istantanea'],['occhio_di_drago','Occhio di Drago','red','Magia','Risposta'],['mano_del_caos','Mano del Caos','red','Magia','Base'],['nube_di_fuoco','Nube di Fuoco','red','Magia','Base'],['tornado_bollente','Tornado Bollente','red','Magia','Base'],['fendente_di_fuoco','Fendente di Fuoco','red','Magia','Base'],['berserk','Berserk','red','Magia','Istantanea'],
 ['stupido','Stupido','green','Magia','Istantanea'],['riflesso','Riflesso','green','Magia','Istantanea'],['tutto_per_la_festa','Tutto per la Festa','green','Magia','Base'],['taglio_ninjitsu','Tecnica del Taglio Ninjitsu','green','Magia','Base'],['doppia_katana','Doppia Katana','green','Magia','Base'],['alta_marea','Alta Marea','green','Magia','Istantanea'],['albero_della_vita','Albero della Vita','green','Supporto','Istantanea'],['sguardo_ninjitsu','Tecnica dello Sguardo Ninjitsu','green','Magia','Istantanea'],['mille_lame','Tecnica delle Mille Lame Ninjitsu','green','Magia','Istantanea'],
 ['evocatore_anime_vacue','Evocatore di Anime Vacue','black','Magia','Base'],['anima_esplosiva','Anima Esplosiva','black','Magia','Base'],['sacrificio','Sacrificio','black','Magia','Istantanea'],['collasso','Collasso','black','Magia','Risposta'],['spacca_ossa','Spacca Ossa','black','Magia','Risposta'],['eclipse_fang','Eclipse Fang','black','Magia','Base'],['fino_alla_morte','Fino alla Morte','black','Magia','Istantanea'],['mietitore','Mietitore','black','Supporto','Base'],['ammazza_morte','Ammazza Morte','black','Magia','Risposta']
].map(([id,name,color,type,speed])=>({id,name,color,type,speed}));
const MONSTERS=[
 ['lucertola_fuoco','Lucertola di fuoco','red',3],['segugio_infernale','Segugio Infernale','red',3],['fenice_cremisi','Fenice Cremisi','red',3],['golem_magmatico','Golem Magmatico','red',3],['drago_delle_ceneri','Drago delle Ceneri','red',4],['salamandra_vulcanica','Salamandra Vulcanica','red',5],
 ['ragno_dei_germogli','Ragno dei Germogli','green',2],['serpente_della_giungla','Serpente della Giungla','green',3],['lupo_delle_radici','Lupo delle Radici','green',3],['cervo_antico','Cervo Antico','green',3],['guardiano_della_foresta','Guardiano della Foresta','green',4],['orso_furioso','Orso Furioso','green',2],
 ['segugio_dei_morti','Segugio dei Morti','black',2],['custode_sepolcrale','Custode Sepolcrale','black',2],['cavaliere_senza_volto','Cavaliere Senza Volto','black',3],['cerbero','Cerbero','black',3],['re_dei_non_morti','Re dei non morti','black',4],['divoratore_di_anime_mostro','Divoratore di Anime','black',5]
].map(([id,name,color,pow])=>({id,name,color,pow}));
const RULES={champions:2,cards:18,monsters:12,maxColors:2};
const byId=(arr,id)=>arr.find(x=>x.id===id);
const esc2=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
const defaultDeck=()=>({champions:['kael','lyrandel'],cards:CARDS.filter(x=>['red','green'].includes(x.color)).map(x=>x.id),monsters:MONSTERS.filter(x=>['red','green'].includes(x.color)).map(x=>x.id)});
function deckColors(d){return [...new Set((d.champions||[]).map(id=>byId(CHAMPIONS,id)?.color).filter(Boolean))]}
function validate(d){
 if(!d||new Set(d.champions||[]).size!==2||new Set(d.cards||[]).size!==18||new Set(d.monsters||[]).size!==12)return false;
 if((d.champions||[]).some(id=>!byId(CHAMPIONS,id))||(d.cards||[]).some(id=>!byId(CARDS,id))||(d.monsters||[]).some(id=>!byId(MONSTERS,id)))return false;
 const cc=deckColors(d);if(cc.length>2)return false;
 if((d.cards||[]).some(id=>!cc.includes(byId(CARDS,id).color))||(d.monsters||[]).some(id=>!cc.includes(byId(MONSTERS,id).color)))return false;
 return true;
}
function getDeck(){try{const d=JSON.parse(localStorage.getItem('sf_deck_v18')||'null');if(validate(d))return d}catch{}const d=defaultDeck();localStorage.setItem('sf_deck_v18',JSON.stringify(d));return d}
function saveDeck(d){localStorage.setItem('sf_deck_v18',JSON.stringify(d))}
function deckName(d){return d.champions.map(id=>byId(CHAMPIONS,id)?.name||id).join(' + ')}

const baseLanding=renderLanding;
renderLanding=function(){
 const d=getDeck(),room=roomFromUrl();
 app.innerHTML=`<div class="wrap"><div class="landing panel"><div class="brand">Champion of the Souls</div><h1>Online Playtest</h1><div class="sub">Deck personalizzati • massimo 2 colori • 2 giocatori</div><div id="globalError" class="error hidden"></div><div class="landing-grid"><div><h3>Crea partita</h3><div class="field"><label>Nome</label><input id="createName" maxlength="24" placeholder="Il tuo nome"></div><button class="btn primary" id="createBtn">Crea stanza</button></div><div><h3>Entra in una stanza</h3><div class="field"><label>Nome</label><input id="joinName" maxlength="24" placeholder="Il tuo nome"></div><div class="field"><label>Codice</label><input id="joinRoom" maxlength="6" value="${esc2(room)}" placeholder="ABC123"></div><button class="btn green" id="joinBtn">Entra</button></div></div><div class="deckbar"><div class="deck-summary"><strong>Mazzo:</strong> ${esc2(deckName(d))}<br><span class="sub">2 Campioni • 18 carte base • 12 Mostri</span></div><button class="btn black" id="openDeckBuilder">Deck Builder</button></div></div></div>`;
 document.querySelector('#openDeckBuilder').onclick=()=>openBuilder();
 document.querySelector('#createBtn').onclick=async()=>{try{busy=true;loadSession(await post({action:'create',name:document.querySelector('#createName').value,deck:getDeck()}))}catch(e){showError(e.message)}finally{busy=false}};
 document.querySelector('#joinBtn').onclick=async()=>{try{busy=true;loadSession(await post({action:'join',roomCode:document.querySelector('#joinRoom').value,name:document.querySelector('#joinName').value,deck:getDeck()}))}catch(e){showError(e.message)}finally{busy=false}};
};

let draft=null,hoverTimer=null;
function colorsAllowed(){return deckColors(draft)}
function pickCardHtml(x,kind){const selected=(draft[kind]||[]).includes(x.id),allowed=kind==='champions'||colorsAllowed().includes(x.color);return `<div class="deck-pick ${x.color}${selected?' selected':''}${allowed?'':' unavailable'}" data-deck-kind="${kind}" data-deck-id="${x.id}" data-preview-id="${x.id}"><img src="${art(x.id)}" alt="${esc2(x.name)}"><div class="deck-check">✓</div><div class="deck-name">${esc2(x.name)}</div></div>`}
function openBuilder(){draft=JSON.parse(JSON.stringify(getDeck()));renderBuilder()}
function renderBuilder(message=''){
 const colors=colorsAllowed(),valid=validate(draft);
 app.innerHTML=`<div class="deck-builder-page"><div class="deck-builder-top"><div class="deck-builder-head"><div><div class="brand">Deck Builder</div><div class="sub">Scegli 2 Campioni diversi. Il mazzo può usare solo i loro colori.</div></div><div class="deck-builder-counts"><span class="deck-count ${draft.champions.length===2?'ok':'bad'}">Campioni ${draft.champions.length}/2</span><span class="deck-count ${draft.cards.length===18?'ok':'bad'}">Carte ${draft.cards.length}/18</span><span class="deck-count ${draft.monsters.length===12?'ok':'bad'}">Mostri ${draft.monsters.length}/12</span><span class="deck-count ${colors.length<=2?'ok':'bad'}">Colori ${colors.length}/2</span></div><div class="deck-builder-actions"><button class="btn ghost" id="deckBack">Indietro</button><button class="btn ghost" id="deckAuto">Auto-completa</button><button class="btn primary" id="deckSave" ${valid?'':'disabled'}>Salva mazzo</button></div></div>${message?`<div class="deck-builder-error">${esc2(message)}</div>`:''}</div><section class="deck-section"><h2>Campioni</h2><div class="sub">Esattamente 2, tutti diversi.</div><div class="deck-grid">${CHAMPIONS.map(x=>pickCardHtml(x,'champions')).join('')}</div></section><section class="deck-section"><h2>Carte base</h2><div class="sub">18 carte tutte diverse. Solo i colori dei Campioni scelti.</div><div class="deck-grid">${CARDS.map(x=>pickCardHtml(x,'cards')).join('')}</div></section><section class="deck-section"><h2>Monster Deck</h2><div class="sub">12 Mostri tutti diversi. Solo i colori dei Campioni scelti.</div><div class="deck-grid">${MONSTERS.map(x=>pickCardHtml(x,'monsters')).join('')}</div></section></div><div id="deckPreview" class="deck-preview"></div>`;
 bindBuilder();
}
function toggle(kind,id){
 const arr=draft[kind],obj=kind==='champions'?byId(CHAMPIONS,id):kind==='cards'?byId(CARDS,id):byId(MONSTERS,id);if(!obj)return;
 const i=arr.indexOf(id);if(i>=0){arr.splice(i,1);if(kind==='champions'){const allowed=deckColors(draft);draft.cards=draft.cards.filter(x=>allowed.includes(byId(CARDS,x)?.color));draft.monsters=draft.monsters.filter(x=>allowed.includes(byId(MONSTERS,x)?.color));}renderBuilder();return}
 if(kind==='champions'){if(arr.length>=2)return renderBuilder('Puoi scegliere esattamente 2 Campioni.');arr.push(id);const allowed=deckColors(draft);draft.cards=draft.cards.filter(x=>allowed.includes(byId(CARDS,x)?.color));draft.monsters=draft.monsters.filter(x=>allowed.includes(byId(MONSTERS,x)?.color));renderBuilder();return}
 if(!colorsAllowed().includes(obj.color))return renderBuilder('Prima scegli un Campione di quel colore.');
 const max=kind==='cards'?18:12;if(arr.length>=max)return renderBuilder(`Hai già scelto ${max} ${kind==='cards'?'carte':'Mostri'}.`);arr.push(id);renderBuilder();
}
function autoFill(){const colors=colorsAllowed();draft.cards=CARDS.filter(x=>colors.includes(x.color)).slice(0,18).map(x=>x.id);draft.monsters=MONSTERS.filter(x=>colors.includes(x.color)).slice(0,12).map(x=>x.id);renderBuilder()}
function previewData(id){return byId(CHAMPIONS,id)||byId(CARDS,id)||byId(MONSTERS,id)}
function showPreview(id){const x=previewData(id),u=art(id),box=document.querySelector('#deckPreview');if(!x||!u||!box)return;const meta=x.pow!=null?`Mostro • POW ${x.pow}`:CHAMPIONS.some(c=>c.id===id)?`Campione • ${COLORS[x.color]}`:`${x.type} • ${x.speed}`;box.innerHTML=`<div class="deck-preview-inner"><img src="${u}"><div><h3>${esc2(x.name)}</h3><div class="tag">${esc2(meta)}</div><p>${esc2(x.text||'')}</p><div class="sub">Click o ESC per chiudere</div></div></div>`;box.classList.add('show')}
function bindBuilder(){
 document.querySelector('#deckBack').onclick=()=>renderLanding();document.querySelector('#deckAuto').onclick=autoFill;document.querySelector('#deckSave').onclick=()=>{if(!validate(draft))return renderBuilder('Il mazzo non rispetta ancora tutte le regole.');saveDeck(draft);renderLanding()};
 document.querySelectorAll('[data-deck-kind]').forEach(el=>{el.onclick=()=>toggle(el.dataset.deckKind,el.dataset.deckId);el.onmouseenter=()=>{clearTimeout(hoverTimer);hoverTimer=setTimeout(()=>showPreview(el.dataset.previewId),1000)};el.onmouseleave=()=>clearTimeout(hoverTimer);el.oncontextmenu=e=>{e.preventDefault();showPreview(el.dataset.previewId)}});
 document.querySelector('#deckPreview')?.addEventListener('click',e=>{if(e.target.id==='deckPreview'||e.target.closest('.deck-preview-inner'))document.querySelector('#deckPreview').classList.remove('show')});
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelector('#deckPreview')?.classList.remove('show')});

window.sfDeckBuilder={open:openBuilder,getDeck};
if(!session.state)renderLanding();
})();
