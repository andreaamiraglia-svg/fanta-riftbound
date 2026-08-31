(()=>{
let tgt=null,mouse={x:null,y:null},queued=false;
const IDS=new Set(['spacca_teste','parry','su_gli_scudi']);

function css(v){return CSS.escape(String(v))}
function me(){return typeof playerState==='function'?playerState(session.player):session?.state?.players?.[String(session.player)]}
function visible(el){if(!el||!el.isConnected)return false;const r=el.getBoundingClientRect(),st=getComputedStyle(el);return r.width>0&&r.height>0&&st.display!=='none'&&st.visibility!=='hidden'}
function champEl(id){return document.querySelector(`.champ[data-owner="${session.player}"][data-champ-id="${css(id)}"]`)}
function sourceEl(){return document.querySelector(`[data-hand-card="${css(tgt?.cardId||'')}"]`)||document.querySelector(`[data-card="${css(tgt?.cardId||'')}"]`)}
function center(el){if(!visible(el))return null;const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
function liveOwnChampions(){return (me()?.champions||[]).filter(c=>!c.defeated)}

function candidates(cardId){
 if(cardId==='spacca_teste')return liveOwnChampions().map(c=>({el:champEl(c.id),id:String(c.id)})).filter(x=>visible(x.el));
 const combat=session?.state?.combat;
 if(!combat||combat.target?.type!=='champion'||Number(combat.target.player)!==Number(session.player))return[];
 const c=liveOwnChampions().find(x=>String(x.id)===String(combat.target.champId));
 if(!c)return[];
 const el=champEl(c.id);return visible(el)?[{el,id:String(c.id)}]:[];
}
function label(cardId){
 if(cardId==='spacca_teste')return 'Spacca Teste: scegli un tuo Campione o Supporto';
 if(cardId==='parry')return 'Parry: scegli il tuo Campione o Supporto in difesa';
 return 'Su gli Scudi: scegli il tuo Campione o Supporto in difesa';
}
function clear(){document.querySelectorAll('.sf-v63-valid').forEach(el=>el.classList.remove('sf-v63-valid'));document.getElementById('sfV63Hint')?.remove();document.getElementById('sfV63Arrow')?.remove();tgt=null}
function ensureUI(){
 let st=document.getElementById('sfV63Style');if(!st){st=document.createElement('style');st.id='sfV63Style';st.textContent='.sf-v63-valid{outline:3px solid #ffd166!important;outline-offset:4px!important;cursor:crosshair!important;filter:brightness(1.12)!important;box-shadow:0 0 30px rgba(255,209,102,.32)!important}#sfV63Hint{position:fixed;left:50%;top:48px;transform:translateX(-50%);z-index:10160;padding:10px 18px;border:1px solid #ffd166;border-radius:999px;background:#171b23;color:#fff4cf;font-size:12px;font-weight:900;box-shadow:0 8px 30px #0009;pointer-events:none}#sfV63Arrow{position:fixed;inset:0;width:100vw;height:100vh;z-index:10150;pointer-events:none;overflow:visible}';document.head.appendChild(st)}
 let hint=document.getElementById('sfV63Hint');if(!hint){hint=document.createElement('div');hint.id='sfV63Hint';document.body.appendChild(hint)}
 let svg=document.getElementById('sfV63Arrow');if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='sfV63Arrow';document.body.appendChild(svg)}
 return{hint,svg};
}
function draw(){if(!tgt)return;const{svg}=ensureUI(),a=center(sourceEl());if(!a||mouse.x==null){svg.innerHTML='';return}svg.innerHTML=`<defs><marker id="sfV63Head" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ffd166"/></marker></defs><line x1="${a.x}" y1="${a.y}" x2="${mouse.x}" y2="${mouse.y}" stroke="#ffd166" stroke-width="4" stroke-linecap="round" marker-end="url(#sfV63Head)"/>`}
function refresh(){if(!tgt)return;document.querySelectorAll('.sf-v63-valid').forEach(el=>el.classList.remove('sf-v63-valid'));const list=candidates(tgt.cardId);tgt.valid=list;list.forEach(x=>x.el.classList.add('sf-v63-valid'));const{hint}=ensureUI();hint.textContent=list.length?label(tgt.cardId):label(tgt.cardId)+' — nessun bersaglio valido';draw()}
function start(id){clear();const list=candidates(id);if(!list.length){try{showError(id==='spacca_teste'?'Non hai Campioni o Supporti validi.':'Questa carta richiede un tuo Campione o Supporto in difesa.')}catch{}return}tgt={cardId:String(id),valid:[]};refresh()}
function install(){
 const current=window.chooseForCard;if(typeof current!=='function'||current.__sfChampionTargetV63)return;
 const previous=current;
 const wrapped=function(id){const card=me()?.handCards?.find(c=>String(c.id)===String(id));if(card&&IDS.has(String(card.id)))return start(String(card.id));return previous(id)};
 wrapped.__sfChampionTargetV63=true;wrapped.__previous=previous;window.chooseForCard=wrapped;try{chooseForCard=wrapped}catch{}
}
function schedule(){if(!tgt||queued)return;queued=true;requestAnimationFrame(()=>{queued=false;if(tgt)refresh()})}

document.addEventListener('mousemove',e=>{mouse={x:e.clientX,y:e.clientY};if(tgt)draw()},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&tgt){e.preventDefault();e.stopPropagation();clear()}},true);
document.addEventListener('click',e=>{
 if(!tgt)return;const el=e.target.closest?.('.champ[data-owner][data-champ-id]');const hit=tgt.valid?.find(x=>x.el===el);if(!hit)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const cardId=tgt.cardId,ownChamp=hit.id;clear();Promise.resolve(move({type:'cast',cardId,targets:{ownChamp}})).catch(err=>{try{showError(err?.message||String(err))}catch{}})
},true);

install();window.addEventListener('sf-blue-ready',()=>setTimeout(install,0));const app=document.getElementById('app');if(app)new MutationObserver(schedule).observe(app,{subtree:true,childList:true});setTimeout(install,120);setTimeout(install,700);setTimeout(install,1800);
})();
