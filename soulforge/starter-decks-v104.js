(()=>{
const LIB_KEY='sf_deck_library_v1';
const ACTIVE_KEY='sf_active_deck_id_v1';
const LEGACY_KEY='sf_deck_v18';
const MIGRATION_KEY='sf_starter_decks_v104';
const now=()=>Date.now();
const STARTERS=[
 {id:'starter_tempo_kael_hilda',name:'Tempo Kael Hilda',champions:['hilda','kael'],cards:['ali_del_protettore','erosione_polare','flusso_gelido','sangue_bollente','munizioni_d_emergenza','tempesta_di_ghiaccio','in_guardia','vincolo_di_brina','freddo_puro','esercito_tormenta_neve','distruttore_dell_oscurita','specchio_acqua','protettore_del_villaggio','distruzione_totale','sfera_incandescente','staffa_del_mare','respiro_dell_inverno','fendente_di_fuoco'],monsters:['vecchio_delle_nevi','medusa_delle_maree','grifone_della_tempesta','lupo_glaciale','balena_della_tempesta','leviatano','serpente_glaciale','squalo_delle_maree','yeti','tritone_del_gelo','granchio_degli_abissi','elementale_della_brina']},
 {id:'starter_aggro_scarlet_torvald',name:'Aggro Scarlet Torvald',champions:['torvald','scarlet'],cards:['occhio_di_drago','sangue_bollente','sfera_incandescente','furia_della_natura','munizioni_d_emergenza','corazza_esplosiva','richiamo_del_branco_verde','stupido','colpo_al_cuore','spacca_corazze','arrivano_i_pirati','taglio_fiammante','albero_della_vita','taglio_ninjitsu','fendente_di_fuoco','doppia_katana','tutto_per_la_festa','bang'],monsters:['demone_della_fornace','minotauro_infernale','gigante_del_cratere','viverna','pappagallo_pirata','golem_magmatico','idra_della_palude','serpente_della_giungla','orso_furioso','salamandra_vulcanica','cinghiale_zannaverde','lupo_delle_radici']},
 {id:'starter_control_valtheris_divoratore',name:'Control Valtheris Divoratore di Anime',champions:['divoratore_campione','valtheris'],cards:['ali_del_protettore','freddo_puro','flusso_gelido','evocatore_anime_vacue','erosione_polare','circo_infestato','in_guardia','lascito_profanato','offerta_maligna','tempesta_di_ghiaccio','staffa_del_mare','specchio_acqua','custode_dei_deboli','mietitore','sacrificio','protettore_del_villaggio','spacca_ossa','eclipse_fang'],monsters:['marionetta_maledetta','ghoul_affamato','medusa_delle_maree','custode_sepolcrale','segugio_dei_morti','vecchio_delle_nevi','re_dei_non_morti','yeti','divoratore_di_anime_mostro','leviatano','cerbero','tritone_del_gelo']},
 {id:'starter_swarm_aurelius_divoratore',name:'Swarm Aurelius Il Divoratore',champions:['divoratore_campione','aurelius'],cards:['carica_degli_impavidi','dono_ai_poveri','frecce_divine','loda_il_sole','offerta_maligna','evocatore_anime_vacue','egida_d_acciaio','pugno_in_faccia','eclipse_fang','fino_alla_morte','perfezione','servo_del_sovrano','stendardi_della_legione_dorata','alabardo','araldo_dell_opulenza','lascito_profanato','spacca_ossa','circo_infestato'],monsters:['scarabeo_dorato','segugio_dei_morti','custode_sepolcrale','sciamano_del_sole','cerbero','cavaliere_senza_volto','ariete_sacro','grifone_imperiale','sfinge_dell_alba','cobra_reale','drago_aureo','falco_dell_alba']}
];
const clone=d=>({id:d.id,name:d.name,champions:[...d.champions],cards:[...d.cards],monsters:[...d.monsters],createdAt:now(),updatedAt:now()});
const strip=d=>({champions:[...d.champions],cards:[...d.cards],monsters:[...d.monsters]});
function validStarter(d){
 const b=window.sfDeckBuilder;if(!b)return false;
 const c=new Set((b.champions||[]).map(x=>x.id)),k=new Set((b.cards||[]).map(x=>x.id)),m=new Set((b.monsters||[]).map(x=>x.id));
 return d.champions.length===2&&d.cards.length===18&&d.monsters.length===12&&d.champions.every(x=>c.has(x))&&d.cards.every(x=>k.has(x))&&d.monsters.every(x=>m.has(x));
}
function install(){
 if(!window.sfDeckBuilder)return false;
 const invalid=STARTERS.filter(x=>!validStarter(x));
 if(invalid.length){console.warn('Starter decks v104: carte mancanti',invalid.map(x=>x.name));return true}
 let list=[];try{const x=JSON.parse(localStorage.getItem(LIB_KEY)||'[]');if(Array.isArray(x))list=x}catch{}
 const oldAuto=list.length===1&&Array.isArray(list[0]?.champions)&&list[0].champions.length===2&&list[0].champions.includes('kael')&&list[0].champions.includes('lyrandel')&&String(list[0]?.name||'').toLowerCase().includes('kael')&&String(list[0]?.name||'').toLowerCase().includes('lyrandel');
 if(oldAuto)list=[];
 const byId=new Map(list.map(x=>[x.id,x]));
 for(const s of STARTERS){
  const prev=byId.get(s.id);const fresh=clone(s);
  if(prev)Object.assign(prev,fresh,{createdAt:Number(prev.createdAt||fresh.createdAt)});else list.push(fresh);
 }
 localStorage.setItem(LIB_KEY,JSON.stringify(list));
 if(oldAuto||!list.some(x=>x.id===localStorage.getItem(ACTIVE_KEY))){localStorage.setItem(ACTIVE_KEY,STARTERS[0].id);localStorage.setItem(LEGACY_KEY,JSON.stringify(strip(STARTERS[0])))}
 localStorage.setItem(MIGRATION_KEY,'1');
 try{window.sfDeckBuilder.library?.()}catch{}
 return true;
}
let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>80)clearInterval(timer)},100);
})();