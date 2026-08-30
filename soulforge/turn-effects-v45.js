(()=>{
const OLD_BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/soulforge-playtest/champion-of-the-souls-carte-ottimizzate/cards/';
const V18_BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/cards-v18/';
const OLD_ART={kael:'kael.webp',lyrandel:'lyrandel.webp',lucertola_fuoco:'lucertola-di-fuoco.webp',segugio_infernale:'segugio-infernale.webp',fenice_cremisi:'fenice-cremisi.webp',golem_magmatico:'golem-magmatico.webp',drago_delle_ceneri:'drago-delle-ceneri.webp',salamandra_vulcanica:'salamandra-vulcanica.webp',ragno_dei_germogli:'ragno-dei-germogli.webp',serpente_della_giungla:'serpente-della-giungla.webp',lupo_delle_radici:'lupo-delle-radici.webp',cervo_antico:'cervo-antico.webp',guardiano_della_foresta:'guardiano-della-foresta.webp',orso_furioso:'orso-furioso.webp',taglio_fiammante:'taglio_fiammante.webp',sfera_incandescente:'sfera_incandescente.webp',corazza_esplosiva:'corazza_esplosiva.webp',occhio_di_drago:'occhio_di_drago.webp',mano_del_caos:'mano_del_caos.webp',nube_di_fuoco:'nube_di_fuoco.webp',tornado_bollente:'tornado_bollente.webp',fendente_di_fuoco:'fendente_di_fuoco.webp',berserk:'berserk.webp',taglio_ninjitsu:'taglio_ninjitsu.webp',stupido:'stupido.webp',riflesso:'riflesso.webp',tutto_per_la_festa:'tutto_per_la_festa.webp',alta_marea:'alta_marea.webp',doppia_katana:'doppia_katana.webp',albero_della_vita:'albero_della_vita.webp',sguardo_ninjitsu:'sguardo_ninjitsu.webp',mille_lame:'mille_lame.webp'};
const V18_ART={divoratore_campione:'il-divoratore-di-anime.webp',segugio_dei_morti:'segugio-dei-morti.webp',custode_sepolcrale:'custode-sepolcrale.webp',cavaliere_senza_volto:'cavaliere-senza-volto.webp',cerbero:'cerbero.webp',re_dei_non_morti:'re-dei-non-morti.webp',divoratore_di_anime_mostro:'divoratore-di-anime-mostro.webp',evocatore_anime_vacue:'evocatore-di-anime-vacue.webp',anima_esplosiva:'anima-esplosiva.webp',sacrificio:'sacrificio.webp',collasso:'collasso.webp',spacca_ossa:'spacca-ossa.webp',eclipse_fang:'eclipse-fang.webp',fino_alla_morte:'fino-alla-morte.webp',mietitore:'mietitore.webp',ammazza_morte:'ammazza-morte.webp'};
const BLUE_ART={valtheris:'vecchio-delle-nevi.webp',squalo_delle_maree:'lupo-glaciale.webp',lupo_glaciale:'grifone-della-tempesta.webp',grifone_della_tempesta:'yeti.webp',yeti:'leviatano.webp',leviatano:'valtheris-spirito-eterno.webp',vecchio_delle_nevi:'squalo-delle-maree.webp',flusso_gelido:'flusso-gelido.webp',freddo_puro:'freddo-puro.webp',in_guardia:'in-guardia.webp',ali_del_protettore:'ali-del-protettore.webp',staffa_del_mare:'staffa-del-mare.webp',specchio_acqua:'specchio-d-acqua.webp',muro_di_ghiaccio:'muro-di-ghiaccio.webp',custode_dei_deboli:'custode-dei-deboli.webp',distruzione_totale:'distruzione-totale.webp'};

function artUrl(id){try{const u=window.sfArtUrl21?.(id);if(u)return u}catch{}return V18_ART[id]?V18_BASE+V18_ART[id]:(BLUE_ART[id]?OLD_BASE+BLUE_ART[id]:(OLD_ART[id]?OLD_BASE+OLD_ART[id]:''))}
function escHtml(v){return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function nameOf(id){const s=session?.state||{};return s.cardDefs?.[id]?.name||s.monsterDefs?.[id]?.name||s.championDefs?.[id]?.name||id}

function injectStyle(){
 if(document.getElementById('sfTurnEffectsStyle45'))return;
 const st=document.createElement('style');st.id='sfTurnEffectsStyle45';st.textContent=`
 #sfTurnEffectsPanel{margin-top:14px;border-top:1px solid rgba(255,255,255,.12);padding-top:12px}
 #sfTurnEffectsPanel .sf-te-title{font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#e7d39e;margin-bottom:8px}
 #sfTurnEffectsPanel .sf-te-row{display:flex;gap:9px;overflow-x:auto;padding:2px 2px 8px;scrollbar-width:thin}
 #sfTurnEffectsPanel .sf-te-card{flex:0 0 82px;border:1px solid rgba(255,255,255,.16);border-radius:9px;padding:6px;background:rgba(8,11,16,.92);box-shadow:0 4px 14px rgba(0,0,0,.32)}
 #sfTurnEffectsPanel .sf-te-card.buff{border-color:rgba(65,214,111,.55)}
 #sfTurnEffectsPanel .sf-te-card.debuff{border-color:rgba(255,88,88,.6)}
 #sfTurnEffectsPanel .sf-te-card.mixed{border-color:rgba(255,196,75,.65)}
 #sfTurnEffectsPanel .sf-te-art{display:block;width:68px;height:94px;object-fit:cover;border-radius:6px;background:#12151c;margin:0 auto 6px}
 #sfTurnEffectsPanel .sf-te-name{font-size:9px;line-height:1.15;font-weight:900;color:#fff;text-align:center;min-height:21px}
 #sfTurnEffectsPanel .sf-te-effect{margin-top:4px;border-radius:999px;padding:3px 5px;font-size:8px;line-height:1.05;font-weight:900;text-align:center;background:#252a34;color:#fff}
 #sfTurnEffectsPanel .sf-te-effect.buff{background:rgba(18,92,48,.9);color:#a9ffbf}
 #sfTurnEffectsPanel .sf-te-effect.debuff{background:rgba(104,26,31,.92);color:#ffb0b0}
 #sfTurnEffectsPanel .sf-te-effect.status{background:rgba(40,67,103,.92);color:#b9ddff}
 #sfTurnEffectsPanel .sf-te-effect.passive{box-shadow:inset 0 0 0 1px rgba(255,213,111,.45)}
 `;document.head.appendChild(st);
}

function rootFromTarget(t){return t instanceof Element?t.closest('[data-monster-uid],[data-champ-id]'):null}
function runtimeFromRoot(root){
 if(!root)return null;
 const uid=root.dataset.monsterUid;
 if(uid){const m=session?.state?.board?.monsters?.find(x=>String(x.uid)===String(uid));return m?{kind:'monster',runtime:m}:null}
 const id=root.dataset.champId,owner=Number(root.dataset.owner);
 if(id){const c=session?.state?.players?.[String(owner)]?.champions?.find(x=>String(x.id)===String(id));return c?{kind:'champion',runtime:c,owner}:null}
 return null;
}

function passiveEffects(ref){
 const s=session?.state;if(!s||ref?.kind!=='monster')return[];
 const m=ref.runtime,board=s.board?.monsters||[],out=[];
 for(const x of board){
  if(String(x.uid)===String(m.uid))continue;
  if(x.cardId==='lupo_delle_radici')out.push({sourceCardId:'lupo_delle_radici',kind:'buff',label:'POW +1',passive:true});
  if(x.cardId==='lupo_glaciale')out.push({sourceCardId:'lupo_glaciale',kind:'debuff',label:'POW -1',passive:true});
 }
 const ice=board.filter(x=>x.cardId==='lupo_glaciale'&&String(x.uid)!==String(m.uid)).length;
 if(ice>0){
  for(const x of board.filter(x=>x.cardId==='grifone_della_tempesta'))out.push({sourceCardId:'grifone_della_tempesta',kind:'debuff',label:`POW -${ice} aggiuntivo`,passive:true});
 }
 return out;
}

function allEffects(ref){
 const turn=Number(session?.state?.turn||0);
 const tracked=(Array.isArray(ref?.runtime?.turnEffects)?ref.runtime.turnEffects:[]).filter(x=>Number(x?.turn)===turn).map(x=>({...x,passive:false}));
 return [...tracked,...passiveEffects(ref)];
}

function grouped(effects){
 const map=new Map();
 for(const e of effects){
  const id=String(e.sourceCardId||'');if(!id)continue;
  let g=map.get(id);if(!g){g={id,items:[]};map.set(id,g)}
  const key=`${e.kind}|${e.label}|${e.passive?'p':'t'}`;
  let it=g.items.find(x=>x.key===key);
  if(!it){it={key,kind:e.kind||'status',label:String(e.label||''),passive:!!e.passive,count:0};g.items.push(it)}
  it.count++;
 }
 return [...map.values()];
}

function decorate(root){
 injectStyle();
 const ref=runtimeFromRoot(root);if(!ref)return;
 const box=document.getElementById('sfRightPreview');if(!box?.classList.contains('show'))return;
 const ptext=box.querySelector('.ptext');if(!ptext)return;
 ptext.querySelector('#sfTurnEffectsPanel')?.remove();
 const groups=grouped(allEffects(ref));if(!groups.length)return;
 const panel=document.createElement('div');panel.id='sfTurnEffectsPanel';
 panel.innerHTML=`<div class="sf-te-title">Buff / Debuff del turno</div><div class="sf-te-row">${groups.map(g=>{
  const kinds=new Set(g.items.map(x=>x.kind));const cls=kinds.size>1?'mixed':(kinds.has('debuff')?'debuff':'buff');const src=artUrl(g.id);
  return `<div class="sf-te-card ${cls}">${src?`<img class="sf-te-art" src="${src}" alt="${escHtml(nameOf(g.id))}">`:''}<div class="sf-te-name">${escHtml(nameOf(g.id))}</div>${g.items.map(it=>`<div class="sf-te-effect ${escHtml(it.kind)}${it.passive?' passive':''}">${escHtml(it.label)}${it.count>1?` ×${it.count}`:''}${it.passive?' • continuo':''}</div>`).join('')}</div>`;
 }).join('')}</div>`;
 const help=ptext.querySelector('.sf-preview-help');if(help)ptext.insertBefore(panel,help);else ptext.appendChild(panel);
}

let hoverRoot=null,hoverTimer=null;
document.addEventListener('mouseover',e=>{
 const root=rootFromTarget(e.target);if(!root||root===hoverRoot)return;
 hoverRoot=root;if(hoverTimer)clearTimeout(hoverTimer);
 hoverTimer=setTimeout(()=>{hoverTimer=null;if(root===hoverRoot&&root.isConnected)decorate(root)},1080);
},true);
document.addEventListener('mouseout',e=>{
 const root=rootFromTarget(e.target);if(!root||root!==hoverRoot)return;
 if(e.relatedTarget instanceof Node&&root.contains(e.relatedTarget))return;
 hoverRoot=null;if(hoverTimer){clearTimeout(hoverTimer);hoverTimer=null}
},true);
document.addEventListener('contextmenu',e=>{const root=rootFromTarget(e.target);if(root)setTimeout(()=>decorate(root),40)},true);
})();
