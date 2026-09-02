(()=>{
const TYPE='v52_minotauro_discard';
function pc(){return session?.state?.pendingChoice}
function mine(){const x=pc();return x&&x.type===TYPE&&Number(x.player)===Number(session?.player)&&!x.hidden?x:null}
function esc77(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function close77(){document.getElementById('sf77Minotauro')?.remove()}
function renderChoice(){
 const x=mine();if(!x){close77();return}
 const cards=(playerState(session.player)?.handCards||[]).filter(c=>(x.cardIds||[]).includes(String(c.id)));
 let ov=document.getElementById('sf77Minotauro');if(!ov){ov=document.createElement('div');ov.id='sf77Minotauro';document.body.appendChild(ov)}
 ov.innerHTML=`<div class="sf77-box"><h2>Minotauro Infernale</h2><p>Scegli 1 carta dalla tua mano da scartare.</p><div class="sf77-grid">${cards.map(c=>`<button type="button" class="sf77-card" data-id="${esc77(c.id)}"><img src="${esc77(window.sfArtUrl21?.(c.id)||'')}" alt=""><strong>${esc77(c.name||c.id)}</strong></button>`).join('')}</div></div>`;
 ov.querySelectorAll('.sf77-card').forEach(b=>b.addEventListener('click',()=>{const id=String(b.dataset.id||'');close77();move({type:'resolve_choice',cardId:id})}));
}
function style(){if(document.getElementById('sf77Style'))return;const s=document.createElement('style');s.id='sf77Style';s.textContent=`#sf77Minotauro{position:fixed;inset:0;z-index:10140;background:#05080de8;display:flex;align-items:center;justify-content:center;padding:20px}#sf77Minotauro .sf77-box{width:min(900px,94vw);max-height:90vh;overflow:auto;background:#111722;border:1px solid #b84b3f;border-radius:18px;padding:20px;box-shadow:0 24px 90px #000d}#sf77Minotauro h2{margin:0 0 6px;color:#ffd4cb;font-family:Georgia,serif}#sf77Minotauro p{margin:0 0 14px;color:#d9dde6}#sf77Minotauro .sf77-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(125px,1fr));gap:12px}#sf77Minotauro .sf77-card{background:#090d13;border:2px solid #4f5968;border-radius:12px;padding:7px;color:#fff;cursor:pointer}#sf77Minotauro .sf77-card:hover{border-color:#ff806d;transform:translateY(-2px)}#sf77Minotauro .sf77-card img{display:block;width:100%;aspect-ratio:.744;object-fit:cover;border-radius:8px;background:#05070a}#sf77Minotauro .sf77-card strong{display:block;margin-top:7px;font-size:12px}`;document.head.appendChild(s)}
style();renderChoice();
const app=document.getElementById('app');if(app)new MutationObserver(()=>setTimeout(renderChoice,0)).observe(app,{childList:true,subtree:true});
setInterval(renderChoice,450);
window.sfNewMonsters77={renderChoice};
})();
