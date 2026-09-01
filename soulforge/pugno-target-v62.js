(()=>{
let tgt=null,mouse={x:null,y:null},queued=false;
const STYLE_ID='sfPugnoTargetV62Style';

function injectStyle(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
 .sf-pugno-valid{outline:3px solid #ffd166!important;outline-offset:4px!important;cursor:crosshair!important;filter:brightness(1.12)!important;box-shadow:0 0 30px rgba(255,209,102,.32)!important}
 .sf-pugno-invalid{opacity:.42!important}
 #sfPugnoHint{position:fixed;left:50%;top:48px;transform:translateX(-50%);z-index:10120;padding:10px 18px;border:1px solid #ffd166;border-radius:999px;background:#171b23;color:#fff4cf;font-size:12px;font-weight:900;box-shadow:0 8px 30px #0009;pointer-events:none}
 #sfPugnoArrow{position:fixed;inset:0;width:100vw;height:100vh;z-index:10110;pointer-events:none;overflow:visible}
 `;document.head.appendChild(s);
}
function css(v){return CSS.escape(String(v))}
function me(){return typeof playerState==='function'?playerState(session.player):session?.state?.players?.[String(session.player)]}
function enemyId(){return typeof otherP==='function'?otherP():(Number(session.player)===1?2:1)}
function enemy(){return typeof playerState==='function'?playerState(enemyId()):session?.state?.players?.[String(enemyId())]}
function visible(el){if(!el||!el.isConnected)return false;const r=el.getBoundingClientRect(),st=getComputedStyle(el);return r.width>0&&r.height>0&&st.display!=='none'&&st.visibility!=='hidden'}
function center(el){if(!visible(el))return null;const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
function cardSource(){return document.querySelector(`[data-hand-card="${css(tgt?.cardId||'')}"]`)||document.querySelector(`[data-card="${css(tgt?.cardId||'')}"]`)}
function supportEl(id){return document.querySelector(`.champ[data-owner="${session.player}"][data-champ-id="${css(id)}"]`)}
function monsterEl(uid){return document.querySelector(`[data-monster-uid="${css(uid)}"]`)}
function champEl(owner,id){return document.querySelector(`.champ[data-owner="${owner}"][data-champ-id="${css(id)}"]`)}

/* Supporti e Campioni condividono la stessa zona/lista. Non affidarti soltanto
   al flag runtime supportChampion, perché alcuni wrapper lo mascherano
   temporaneamente per gli effetti che dicono "Campione". */
function isSupportLike(c){
 if(!c)return false;
 const id=String(c.sourceCardId||c.id||'');
 const defs=session?.state?.cardDefs||{};
 const d=defs[id]||defs[String(c.id||'')]||null;
 return !!(
  c.supportChampion||
  d?.supportChampion||
  d?.type==='Supporto'||
  d?.subtype==='Supporto'||
  c.tokenSupport||
  String(c.id||'')==='sciamano_del_sole_support'
 );
}
function ownSupportEls(){
 const q=me();
 return (q?.champions||[])
  .filter(c=>!c.defeated&&isSupportLike(c))
  .map(c=>supportEl(c.id))
  .filter(visible);
}
function targetEntries(){
 const s=session?.state,opp=enemyId(),out=[];
 if(!s)return out;
 const guards=[];
 for(const m of s.board?.monsters||[]){
  if(Number(m.owner)!==Number(opp))continue;
  const prov=!!(m.provocazione||s.monsterDefs?.[m.cardId]?.provocazione);
  if(prov){const el=monsterEl(m.uid);if(visible(el))guards.push({el,value:{type:'monster',uid:m.uid}})}
 }
 for(const c of enemy()?.champions||[]){
  if(c.defeated||!c.provocazione)continue;
  const el=champEl(opp,c.id);if(visible(el))guards.push({el,value:{type:'champion',player:opp,champId:c.id}});
 }
 if(guards.length)return guards;
 for(const c of enemy()?.champions||[]){
  if(c.defeated)continue;
  const el=champEl(opp,c.id);if(visible(el))out.push({el,value:{type:'champion',player:opp,champId:c.id}});
 }
 for(const m of s.board?.monsters||[]){const el=monsterEl(m.uid);if(visible(el))out.push({el,value:{type:'monster',uid:m.uid}})}
 return out;
}
function clearMarks(){document.querySelectorAll('.sf-pugno-valid,.sf-pugno-invalid').forEach(el=>el.classList.remove('sf-pugno-valid','sf-pugno-invalid'))}
function clearUI(){clearMarks();document.getElementById('sfPugnoHint')?.remove();document.getElementById('sfPugnoArrow')?.remove()}
function cancel(){clearUI();tgt=null}
function ensureUI(){
 injectStyle();
 let hint=document.getElementById('sfPugnoHint');if(!hint){hint=document.createElement('div');hint.id='sfPugnoHint';document.body.appendChild(hint)}
 let svg=document.getElementById('sfPugnoArrow');if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='sfPugnoArrow';document.body.appendChild(svg)}
 return{hint,svg};
}
function refresh(){
 if(!tgt)return;
 clearMarks();
 const {hint}=ensureUI();
 if(tgt.step==='support'){
  const els=ownSupportEls();tgt.valid=els.map(el=>({el,value:el.dataset.champId}));
  els.forEach(el=>el.classList.add('sf-pugno-valid'));
  hint.textContent=els.length?'Pugno in Faccia: scegli un tuo Supporto • può essere anche tappato':'Pugno in Faccia: non controlli Supporti validi';
 }else{
  const entries=targetEntries();tgt.valid=entries;
  entries.forEach(x=>x.el.classList.add('sf-pugno-valid'));
  hint.textContent=entries.length?'Pugno in Faccia: scegli chi deve essere attaccato':'Pugno in Faccia: non ci sono bersagli validi';
 }
 draw();
}
function draw(){
 if(!tgt)return;const{svg}=ensureUI();const hand=center(cardSource());const supp=tgt.supportId?center(supportEl(tgt.supportId)):null;
 let fixed='';
 if(hand&&supp)fixed=`<line x1="${hand.x}" y1="${hand.y}" x2="${supp.x}" y2="${supp.y}" stroke="#8ee8ff" stroke-width="4" stroke-linecap="round" marker-end="url(#sfPugnoFixed)"/>`;
 const from=tgt.step==='target'&&supp?supp:hand;
 const cursor=from&&mouse.x!=null?`<line x1="${from.x}" y1="${from.y}" x2="${mouse.x}" y2="${mouse.y}" stroke="#ffd166" stroke-width="4" stroke-linecap="round" marker-end="url(#sfPugnoCursor)"/>`:'';
 svg.innerHTML=`<defs><marker id="sfPugnoCursor" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ffd166"/></marker><marker id="sfPugnoFixed" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#8ee8ff"/></marker></defs>${fixed}${cursor}`;
}
function start(cardId){
 cancel();
 const supports=ownSupportEls();
 if(!supports.length){try{showError('Pugno in Faccia richiede un tuo Supporto.')}catch{}return}
 tgt={cardId:String(cardId),step:'support',supportId:null,valid:[]};refresh();
}
function installChooser(){
 const current=window.chooseForCard;if(typeof current!=='function'||current.__sfPugnoTargetV62)return;
 const previous=current;
 const wrapped=function(id){
  const card=me()?.handCards?.find(c=>String(c.id)===String(id));
  if(card?.id==='pugno_in_faccia')return start(id);
  return previous(id);
 };
 wrapped.__sfPugnoTargetV62=true;wrapped.__previous=previous;window.chooseForCard=wrapped;
 try{chooseForCard=wrapped}catch{}
}
function schedule(){if(!tgt||queued)return;queued=true;requestAnimationFrame(()=>{queued=false;if(tgt){refresh();draw()}})}

document.addEventListener('mousemove',e=>{mouse={x:e.clientX,y:e.clientY};if(tgt)draw()},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&tgt){e.preventDefault();e.stopPropagation();cancel()}},true);
document.addEventListener('click',e=>{
 if(!tgt)return;
 const hit=tgt.valid?.find(x=>x.el===e.target.closest?.('.champ[data-owner][data-champ-id],[data-monster-uid]'));
 if(!hit)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 if(tgt.step==='support'){
  tgt.supportId=String(hit.value);tgt.step='target';refresh();return;
 }
 const cardId=tgt.cardId,supportId=tgt.supportId,target=hit.value;cancel();
 Promise.resolve(move({type:'cast',cardId,targets:{supportId,target}})).catch(err=>{try{showError(err?.message||String(err))}catch{}});
},true);

injectStyle();installChooser();
window.addEventListener('sf-blue-ready',()=>setTimeout(installChooser,0));
const app=document.getElementById('app');if(app)new MutationObserver(schedule).observe(app,{subtree:true,childList:true});
setTimeout(installChooser,120);setTimeout(installChooser,700);setTimeout(installChooser,1800);
})();
