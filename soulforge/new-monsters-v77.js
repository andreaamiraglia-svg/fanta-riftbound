(()=>{
const TYPE='v52_minotauro_discard';
function pc(){return session?.state?.pendingChoice}
function mine(){const x=pc();return x&&x.type===TYPE&&Number(x.player)===Number(session?.player)&&!x.hidden?x:null}
function esc77(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
let lastChoiceSignature='',resolving=false;
function close77(){document.getElementById('sf77Minotauro')?.remove();lastChoiceSignature=''}
function renderChoice(){
 const x=mine();if(!x){close77();return}
 const cards=(playerState(session.player)?.handCards||[]).filter(c=>(x.cardIds||[]).includes(String(c.id)));
 const signature=[x.type,x.player,...(x.cardIds||[])].join('|');
 let ov=document.getElementById('sf77Minotauro');
 if(ov&&lastChoiceSignature===signature)return;
 if(!ov){ov=document.createElement('div');ov.id='sf77Minotauro';document.body.appendChild(ov)}
 lastChoiceSignature=signature;
 ov.innerHTML=`<div class="sf77-box"><h2>Minotauro Infernale</h2><p>Scegli 1 carta dalla tua mano da scartare.</p><div class="sf77-grid">${cards.map(c=>`<button type="button" class="sf77-card" data-id="${esc77(c.id)}"><img src="${esc77(window.sfArtUrl21?.(c.id)||'')}" alt=""><strong>${esc77(c.name||c.id)}</strong></button>`).join('')}</div></div>`;

}
function style(){if(document.getElementById('sf77Style'))return;const s=document.createElement('style');s.id='sf77Style';s.textContent=`#sf77Minotauro{position:fixed;inset:0;z-index:10140;background:#05080de8;display:flex;align-items:center;justify-content:center;padding:20px}#sf77Minotauro .sf77-box{width:min(900px,94vw);max-height:90vh;overflow:auto;background:#111722;border:1px solid #b84b3f;border-radius:18px;padding:20px;box-shadow:0 24px 90px #000d}#sf77Minotauro h2{margin:0 0 6px;color:#ffd4cb;font-family:Georgia,serif}#sf77Minotauro p{margin:0 0 14px;color:#d9dde6}#sf77Minotauro .sf77-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(125px,1fr));gap:12px}#sf77Minotauro .sf77-card{background:#090d13;border:2px solid #4f5968;border-radius:12px;padding:7px;color:#fff;cursor:pointer}#sf77Minotauro .sf77-card:hover{border-color:#ff806d;transform:translateY(-2px)}#sf77Minotauro .sf77-card img{display:block;width:100%;aspect-ratio:.744;object-fit:cover;border-radius:8px;background:#05070a}#sf77Minotauro .sf77-card strong{display:block;margin-top:7px;font-size:12px}`;document.head.appendChild(s)}
document.addEventListener('click',e=>{
 const b=e.target instanceof Element?e.target.closest('#sf77Minotauro .sf77-card'):null;
 if(!b||resolving)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 const id=String(b.dataset.id||'');if(!id)return;
 resolving=true;
 document.querySelectorAll('#sf77Minotauro .sf77-card').forEach(x=>x.disabled=true);
 Promise.resolve(move({type:'resolve_choice',cardId:id,choice:id})).finally(()=>{resolving=false;lastChoiceSignature='';renderChoice()});
},true);
style();renderChoice();
const app=document.getElementById('app');if(app)new MutationObserver(()=>setTimeout(renderChoice,0)).observe(app,{childList:true,subtree:true});
setInterval(renderChoice,450);
window.sfNewMonsters77={renderChoice};
})();
