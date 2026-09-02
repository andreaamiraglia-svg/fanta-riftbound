(()=>{
const COST={
 taglio_fiammante:0,sfera_incandescente:0,corazza_esplosiva:0,occhio_di_drago:0,mano_del_caos:1,nube_di_fuoco:1,tornado_bollente:1,fendente_di_fuoco:1,berserk:2,colpo_in_testa:3,bang:1,barile_esplosivo:0,
 stupido:0,riflesso:0,tutto_per_la_festa:0,taglio_ninjitsu:0,doppia_katana:1,alta_marea:1,albero_della_vita:1,sguardo_ninjitsu:1,mille_lame:12,fabbro_ninjitsu:1,spacca_corazze:1,tiro_rotante:0,
 evocatore_anime_vacue:0,anima_esplosiva:0,sacrificio:0,collasso:0,spacca_ossa:1,eclipse_fang:1,fino_alla_morte:1,mietitore:2,ammazza_morte:3,richiamo_del_branco:2,circo_infestato:0,scatola_incantata:3,
 grandine_brillante:1,cacciatrice_della_tempesta:2,tempesta_di_ghiaccio:0,flusso_gelido:0,freddo_puro:0,in_guardia:0,ali_del_protettore:0,staffa_del_mare:1,specchio_acqua:1,muro_di_ghiaccio:2,custode_dei_deboli:3,distruzione_totale:1,
 frecce_divine:0,loda_il_sole:0,parry:2,perfezione:1,pugno_in_faccia:0,spacca_teste:1,su_gli_scudi:1,alabardo:1,soldato_corrotto:2,legionario_troll:3,servo_del_sovrano:1,dono_ai_poveri:0
};
const SPEED={
 taglio_fiammante:'Risposta',sfera_incandescente:'Base',corazza_esplosiva:'Istantanea',occhio_di_drago:'Risposta',mano_del_caos:'Base',nube_di_fuoco:'Base',tornado_bollente:'Base',fendente_di_fuoco:'Base',berserk:'Istantanea',colpo_in_testa:'Base',bang:'Base',barile_esplosivo:'Istantanea',
 stupido:'Istantanea',riflesso:'Istantanea',tutto_per_la_festa:'Base',taglio_ninjitsu:'Base',doppia_katana:'Base',alta_marea:'Istantanea',albero_della_vita:'Istantanea',sguardo_ninjitsu:'Istantanea',mille_lame:'Istantanea',fabbro_ninjitsu:'Base',spacca_corazze:'Risposta',tiro_rotante:'Base',
 evocatore_anime_vacue:'Base',anima_esplosiva:'Base',sacrificio:'Istantanea',collasso:'Risposta',spacca_ossa:'Risposta',eclipse_fang:'Base',fino_alla_morte:'Istantanea',mietitore:'Base',ammazza_morte:'Risposta',richiamo_del_branco:'Base',circo_infestato:'Istantanea',scatola_incantata:'Base',
 grandine_brillante:'Base',cacciatrice_della_tempesta:'Istantanea',tempesta_di_ghiaccio:'Istantanea',flusso_gelido:'Istantanea',freddo_puro:'Risposta',in_guardia:'Istantanea',ali_del_protettore:'Istantanea',staffa_del_mare:'Istantanea',specchio_acqua:'Istantanea',muro_di_ghiaccio:'Istantanea',custode_dei_deboli:'Istantanea',distruzione_totale:'Base',
 frecce_divine:'Base',loda_il_sole:'Base',parry:'Risposta',perfezione:'Istantanea',pugno_in_faccia:'Base',spacca_teste:'Risposta',su_gli_scudi:'Risposta',alabardo:'Base',soldato_corrotto:'Base',legionario_troll:'Base',servo_del_sovrano:'Base',dono_ai_poveri:'Base'
};
const SUPPORT=new Set(['mietitore','custode_dei_deboli','loda_il_sole','alabardo','soldato_corrotto','legionario_troll','servo_del_sovrano']);
const CHAMP={
 kael:[3,3],lyrandel:[3,3],divoratore_campione:[2,4],valtheris:[3,3],scarlet:[3,3],torvald:[4,2],grinn:[3,3],hilda:[2,4],kroth:[3,3],aurelius:[1,5]
};
const SUPPORT_STATS={loda_il_sole:[0,1],alabardo:[1,1],soldato_corrotto:[2,1],legionario_troll:[3,1],servo_del_sovrano:[1,1]};
const MONSTER={
 lucertola_fuoco:3,segugio_infernale:3,fenice_cremisi:3,golem_magmatico:3,drago_delle_ceneri:4,salamandra_vulcanica:5,
 ragno_dei_germogli:2,serpente_della_giungla:3,lupo_delle_radici:3,cervo_antico:3,guardiano_della_foresta:4,orso_furioso:2,
 segugio_dei_morti:2,custode_sepolcrale:2,cavaliere_senza_volto:3,cerbero:3,re_dei_non_morti:3,divoratore_di_anime_mostro:5,
 squalo_delle_maree:3,lupo_glaciale:3,grifone_della_tempesta:3,yeti:4,leviatano:4,vecchio_delle_nevi:2,
 falco_dell_alba:3,golem_d_ambra:2,grifone_imperiale:3,leone_solare:3,sciamano_del_sole:1,drago_aureo:3
};
const EFFECT={
 kael:'Finché non hai carte in mano, Kael ottiene +2 POW.',
 lyrandel:'La prima volta in ogni turno che una tua Magia infligge danni a un Mostro, scegli uno dei Mostri danneggiati: ottiene +1 POW per questo turno.',
 divoratore_campione:'Dopo che hai ucciso un Mostro in questo turno, puoi tappare questo Campione per riprendere una carta dal tuo Cimitero.',
 valtheris:'All’inizio del turno, Valtheris ottiene 1 Armatura.',
 scarlet:'Se hai scartato una carta dalla tua mano in questo turno, pesca una carta Rossa dal tuo Mazzo e riduci di 1 Anima Rossa il suo costo.',
 torvald:'La prima volta che Torvald muore, ritorna in vita con 1 HP. Alla fine del turno, muore.',
 grinn:'La prima volta in ogni turno che muore un Campione o un Mostro con 4 o più POW, le Magie di costo 3 o superiore costano 1 Anima in meno per questo turno.',
 hilda:'Quando riduci un nemico a 0 POW o meno, Hilda lo attacca.',
 kroth:'Quando Kroth difende, ottiene +1 POW per questo turno.',
 aurelius:'Finché hai più carte in mano del tuo avversario, i tuoi Supporti hanno +1 POW.',

 taglio_fiammante:'Durante un combattimento, infliggi 1 danno al Campione attaccante.',
 sfera_incandescente:'Infliggi 1 danno a un nemico e 1 danno a un tuo Campione.',
 corazza_esplosiva:'Infliggi 1 danno a un tuo Campione. Poi ottiene +1 POW fino alla fine del turno.',
 occhio_di_drago:'Metti 5 carte dal tuo Mazzo nel Cimitero. Un tuo Campione ottiene +1 POW fino alla fine del turno.',
 mano_del_caos:'Scarta la tua mano. Un tuo Campione ottiene +1 POW per ogni carta scartata fino alla fine del turno.',
 nube_di_fuoco:'Fino alla fine del turno, le tue Magie infliggono 1 danno aggiuntivo.',
 tornado_bollente:'Infliggi 1 danno a ogni Campione e a ogni Mostro.',
 fendente_di_fuoco:'Infliggi 2 danni a un nemico.',
 berserk:'Attiva un tuo Campione danneggiato e forniscigli +2 POW.',
 colpo_in_testa:'Infliggi 5 danni a un nemico. Se è un Campione e perde 1 HP, i danni in eccesso continuano dopo la pulizia dei danni.',
 bang:'Come costo aggiuntivo, scarta 2 carte dalla tua mano. Infliggi 2 danni a un Campione e 1 danno a un altro Campione.',
 barile_esplosivo:'Scegli un Mostro. Quel Mostro subisce il doppio dei danni dalle Magie.',

 stupido:'Infliggi 1 danno a un Mostro.',
 riflesso:'Scegli un tuo Campione. Infliggi a un Mostro danni pari ai danni attualmente subiti da quel Campione.',
 tutto_per_la_festa:'Guarda le prime 3 carte del tuo Monster Deck. Puoi scartarne quante ne vuoi. Rimetti le altre in cima nell’ordine che preferisci.',
 taglio_ninjitsu:'Infliggi 2 danni a un Mostro.',
 doppia_katana:'Attiva un tuo Campione.',
 alta_marea:'Scegli un tuo Campione in combattimento. Annulla il combattimento che lo coinvolge.',
 albero_della_vita:'Un tuo Campione ottiene +2 POW fino alla fine del turno.',
 sguardo_ninjitsu:'Uccidi un Mostro danneggiato.',
 mille_lame:'Costa 1 Anima Verde in meno per ogni Mostro nel tuo Cimitero. Un tuo Campione ottiene +4 POW fino alla fine del turno.',
 fabbro_ninjitsu:'Un tuo Campione ottiene +2 POW fino alla fine del turno. Cerca una carta Ninjitsu nel tuo Mazzo e aggiungila alla tua mano.',
 spacca_corazze:'Scegli un nemico. Rimuovi tutta la sua Armatura.',
 tiro_rotante:'Infliggi 1 danno a 3 Mostri.',

 evocatore_anime_vacue:'Scegli un Mostro con 2 POW o meno nel tuo Cimitero e mettilo in gioco sotto il tuo controllo.',
 anima_esplosiva:'Scegli un Mostro. Alla fine del turno, uccidi quel Mostro.',
 sacrificio:'Uccidi un Mostro sotto il tuo controllo. Non ottieni Anime per la sua morte.',
 collasso:'Consuma tutte le tue Anime. Scegli un tuo Campione: ottiene +1 POW per ogni Anima consumata fino alla fine del turno.',
 spacca_ossa:'Uccidi un Mostro. Poi mettilo in gioco sotto il tuo controllo.',
 eclipse_fang:'Infliggi 1 danno a un nemico. Se questo danno gli infligge una Ferita o lo uccide, ottieni 2 Anime Nere.',
 fino_alla_morte:'Scegli un tuo Campione. Bandisci tutti i Mostri dal tuo Cimitero. Quel Campione ottiene +1 Armatura per ogni Mostro bandito in questo modo.',
 mietitore:'Uccidi tutti i Mostri con 2 POW o meno.',
 ammazza_morte:'Infliggi 1 Ferita a un Campione.',
 richiamo_del_branco:'Fino alla fine del turno, tutti i Mostri in campo ottengono: Lascito — Infliggi 1 danno a un Campione nemico.',
 circo_infestato:'Metti un Mostro che controlli in cima al tuo Mazzo dei Mostri.',
 scatola_incantata:'Evoca i primi 2 Mostri dalla cima del tuo Mazzo dei Mostri. Poi crea un effetto che li uccide.',

 grandine_brillante:'Riduci di 1 il POW di tutti i nemici.',
 cacciatrice_della_tempesta:'Riduci di 2 il POW di un nemico e aumenta di 2 il POW di un tuo Campione per questo turno.',
 tempesta_di_ghiaccio:'Riduci di 1 il POW di un nemico e di un tuo Campione per questo turno.',
 flusso_gelido:'Riduci di 2 il POW di un Mostro per questo turno.',
 freddo_puro:'Uccidi un Mostro con 2 POW o meno.',
 in_guardia:'Fornisci 1 Armatura a un Personaggio.',
 ali_del_protettore:'Fornisci 2 Armatura a un Mostro.',
 staffa_del_mare:'Riduci di 2 il POW di un nemico per questo turno.',
 specchio_acqua:'Annulla l’effetto di una Magia che costa 1 Anima o meno.',
 muro_di_ghiaccio:'Fornisci 2 Armatura a tutti i Mostri e ai tuoi Campioni.',
 custode_dei_deboli:'Riduci di 7 il POW di un nemico per questo turno.',
 distruzione_totale:'Scegli un Campione. Non può attaccare per questo turno.',

 frecce_divine:'Infliggi 1 danno a un Mostro per ogni Supporto che controlli.',
 loda_il_sole:'Muore alla fine del turno.',
 parry:'Scegli un tuo Campione in difesa. Quel Campione diventa l’attaccante.',
 perfezione:'Tutti i tuoi Campioni ottengono +1 POW per questo turno.',
 pugno_in_faccia:'Un tuo Supporto attacca.',
 spacca_teste:'Un tuo Campione ottiene Contrattacco fino alla fine del turno.',
 su_gli_scudi:'Un tuo Campione in difesa ottiene +4 Armatura fino alla fine del combattimento.',
 alabardo:'Quando entra in gioco, fornisce Provocazione a un altro tuo Campione per questo turno.',
 soldato_corrotto:'I tuoi Campioni e Mostri con Provocazione ottengono +2 POW.',
 legionario_troll:'Quando attacca, fornisce +2 POW e Provocazione a un tuo Campione per questo turno.',
 servo_del_sovrano:'Pesca 1 carta dal tuo Mazzo.',
 dono_ai_poveri:'Infliggi 1 danno a un Mostro per ogni carta che hai in più rispetto al tuo avversario.',

 lucertola_fuoco:'Nessun effetto.',
 segugio_infernale:'Quando entra in gioco, infligge 1 danno a ogni Mostro adiacente.',
 fenice_cremisi:'Puoi pagare 1 Anima per giocare questo Mostro dal tuo Cimitero.',
 golem_magmatico:'Quando entra in gioco, infligge 1 danno a tutti i Campioni.',
 drago_delle_ceneri:'Quando entra in gioco, infligge 1 danno a tutti gli altri Mostri.',
 salamandra_vulcanica:'Ogni volta che un Campione attacca, perde 1 POW fino alla fine del turno.',
 ragno_dei_germogli:'Finché è in gioco, le Magie costano 1 Anima in più.',
 serpente_della_giungla:'Lascito — L’avversario perde 1 Anima a tua scelta.',
 lupo_delle_radici:'Tutti gli altri Mostri ottengono +1 POW.',
 cervo_antico:'Quando un altro Mostro subisce danni, quel Mostro ottiene +1 POW per questo turno.',
 guardiano_della_foresta:'Provocazione.',
 orso_furioso:'Quando muore un altro Mostro, ottiene +2 POW per questo turno.',
 segugio_dei_morti:'Lascito — Infliggi 1 danno a un Campione nemico.',
 custode_sepolcrale:'Lascito — I tuoi Campioni ottengono +1 POW per questo turno.',
 cavaliere_senza_volto:'Lascito — Infliggi 2 danni a un Campione nemico.',
 cerbero:'Quando entra in gioco, evoca un Mostro con 2 POW dal tuo Cimitero.',
 re_dei_non_morti:'Gli effetti Lascito si attivano una volta aggiuntiva.',
 divoratore_di_anime_mostro:'Quando entra in gioco, uccide i Mostri adiacenti. Lascito — Ottieni le Anime dei Mostri divorati.',
 squalo_delle_maree:'Quando entra in gioco, fornisce 1 Armatura a tutti i Campioni.',
 lupo_glaciale:'Tutti gli altri Mostri hanno -1 POW.',
 grifone_della_tempesta:'Quando un effetto riduce il POW, lo riduce di 1 aggiuntivo.',
 yeti:'Quando entra in gioco, riduce a 0 il POW di tutti i Mostri. Poi ciascuno ottiene Armatura pari al POW perso.',
 leviatano:'Provocazione.',
 vecchio_delle_nevi:'Quando un Campione attacca, riduci di 1 il suo POW per questo turno.',
 falco_dell_alba:'Quando entra in gioco, tutti i Campioni ottengono +1 POW per questo turno.',
 golem_d_ambra:'Quando entra in gioco, ottiene 3 Armatura.',
 grifone_imperiale:'Tutti i Mostri e i Campioni con Provocazione ottengono +1 POW.',
 leone_solare:'Contrattacco — Infligge danni in combattimento anche quando è il difensore.',
 sciamano_del_sole:'Lascito — Evoca Sciamano del Sole sotto il tuo controllo come Supporto con 1 POW.',
 drago_aureo:'Tutti i Supporti hanno Provocazione.'
};
const COLOR_LABEL={red:'Rosso',green:'Verde',black:'Nero',blue:'Blu',orange:'Arancione'};
let lastId='',lastColor='';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function colorFrom(el){for(const c of Object.keys(COLOR_LABEL))if(el?.classList?.contains(c))return c;return''}
function remember(e){const el=e.target instanceof Element?e.target.closest('[data-preview-id],[data-sidebar-preview]'):null;if(!el)return;lastId=String(el.dataset.previewId||el.dataset.sidebarPreview||'');lastColor=colorFrom(el)||colorFrom(el.closest('.deck-pick'))||lastColor;setTimeout(enrich,0)}
function kind(id){if(CHAMP[id])return'Campione';if(MONSTER[id]!=null)return'Mostro';if(SUPPORT.has(id))return'Supporto';return COST[id]!=null?'Magia':'Carta'}
function keywords(text){const out=[];for(const k of ['Lascito','Provocazione','Contrattacco'])if(String(text).includes(k))out.push(k);return out}
function statCard(label,value,sub=''){return`<div class="sf76-stat"><span>${esc(label)}</span><strong>${esc(value)}</strong>${sub?`<small>${esc(sub)}</small>`:''}</div>`}
function enrich(){
 const overlay=document.getElementById('deckPreview');if(!overlay?.classList.contains('show')||!lastId)return;
 const inner=overlay.querySelector('.deck-preview-inner');if(!inner)return;
 const oldInfo=inner.children?.[1];if(!oldInfo)return;
 const existing=oldInfo.dataset?.sfPreview76;if(existing===lastId)return;
 const name=oldInfo.querySelector('h3')?.textContent?.trim()||lastId;
 const oldTag=oldInfo.querySelector('.tag')?.textContent||'';
 const oldText=oldInfo.querySelector('p:not(.tiny)')?.textContent?.trim()||'';
 const id=lastId,k=kind(id),effect=EFFECT[id]||oldText||'Nessun effetto.';
 let color=lastColor;
 if(!color){const low=oldTag.toLowerCase();color=Object.keys(COLOR_LABEL).find(c=>low.includes(COLOR_LABEL[c].toLowerCase()))||''}
 const stats=[];
 if(CHAMP[id]){stats.push(statCard('POW',CHAMP[id][0],'base'));stats.push(statCard('HP',CHAMP[id][1],'base'))}
 else if(MONSTER[id]!=null){stats.push(statCard('POW',MONSTER[id],'base'))}
 else{
  if(COST[id]!=null)stats.push(statCard('COSTO',COST[id],COST[id]===1?'Anima':'Anime'));
  if(SPEED[id])stats.push(statCard('VELOCITÀ',SPEED[id]));
  if(SUPPORT_STATS[id]){stats.push(statCard('POW',SUPPORT_STATS[id][0],'base'));stats.push(statCard('HP',SUPPORT_STATS[id][1],'base'))}
 }
 const ks=keywords(effect);
 oldInfo.className=`sf76-info ${color||''}`;oldInfo.dataset.sfPreview76=id;
 oldInfo.innerHTML=`<div class="sf76-title"><div><h3>${esc(name)}</h3><div class="sf76-sub">${esc(k.toUpperCase())}${color?` • ${esc(COLOR_LABEL[color].toUpperCase())}`:''}</div></div></div><div class="sf76-stats">${stats.join('')}</div>${ks.length?`<div class="sf76-keywords">${ks.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:''}<div class="sf76-effect"><div class="sf76-label">EFFETTO</div><p>${esc(effect)}</p></div><p class="sf76-close">Click fuori dalla carta o ESC per chiudere</p>`;
}
function style(){if(document.getElementById('sfDeckPreview76Style'))return;const s=document.createElement('style');s.id='sfDeckPreview76Style';s.textContent=`
.deck-preview-inner{grid-template-columns:minmax(300px,430px) minmax(330px,470px)!important;max-width:980px!important;width:min(95vw,980px)!important;align-items:start!important;gap:22px!important}
.deck-preview-inner>img{width:100%!important;max-height:min(76vh,690px)!important;object-fit:contain!important}
.sf76-info{min-width:0;padding:6px 4px 4px;color:#eef3fa}.sf76-info h3{font-size:24px!important;line-height:1.15;margin:0 0 7px!important;color:#fff}.sf76-sub{font-size:11px;font-weight:900;letter-spacing:.11em;color:#9ba7b8}.sf76-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:20px 0 14px}.sf76-stat{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.045);border-radius:12px;padding:12px 13px;display:flex;flex-direction:column;min-height:62px}.sf76-stat span{font-size:10px;letter-spacing:.12em;font-weight:900;color:#8f9bad}.sf76-stat strong{font-size:24px;line-height:1.05;margin-top:4px}.sf76-stat small{font-size:10px;color:#8f9bad;margin-top:2px}.sf76-keywords{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 14px}.sf76-keywords span{border:1px solid rgba(230,184,75,.45);background:rgba(230,184,75,.09);color:#efd891;border-radius:999px;padding:5px 9px;font-size:11px;font-weight:850}.sf76-effect{border:1px solid rgba(255,255,255,.12);background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.02));border-radius:14px;padding:16px 17px;margin-top:8px}.sf76-effect .sf76-label{font-size:10px;font-weight:950;letter-spacing:.14em;color:#9ba7b8;margin-bottom:9px}.sf76-effect p{font-size:15px!important;line-height:1.55!important;margin:0!important;color:#eef3fa!important;white-space:normal}.sf76-close{font-size:11px!important;color:#778396!important;margin:15px 0 0!important}.sf76-info.red .sf76-stat strong{color:#ff7777}.sf76-info.green .sf76-stat strong{color:#76e6a2}.sf76-info.black .sf76-stat strong{color:#d7c6ee}.sf76-info.blue .sf76-stat strong{color:#7dccff}.sf76-info.orange .sf76-stat strong{color:#ffc46a}
@media(max-width:760px){.deck-preview-inner{grid-template-columns:1fr!important;max-height:94vh!important;overflow:auto!important}.deck-preview-inner>img{max-height:58vh!important}.sf76-stats{grid-template-columns:repeat(2,1fr)}}
`;document.head.appendChild(s)}
style();
document.addEventListener('pointerdown',remember,true);document.addEventListener('click',remember,true);document.addEventListener('mouseover',remember,true);
const app=document.getElementById('app');if(app){let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;enrich()})}).observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:['class']})}
})();