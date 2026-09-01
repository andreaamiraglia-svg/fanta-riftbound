(()=>{
const STYLE_ID='sfGameInteractionLockV66';
function installStyle(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');
 s.id=STYLE_ID;
 s.textContent=`
 body.sf-fantasy-game .game-grid,
 body.sf-fantasy-game .game-grid *,
 body.sf-fantasy-game .hand-wrap,
 body.sf-fantasy-game .hand-wrap *{
   -webkit-user-select:none!important;
   user-select:none!important;
 }
 body.sf-fantasy-game input,
 body.sf-fantasy-game textarea,
 body.sf-fantasy-game [contenteditable="true"],
 body.sf-fantasy-game .modalbox input,
 body.sf-fantasy-game .modalbox textarea{
   -webkit-user-select:text!important;
   user-select:text!important;
 }
 body.sf-fantasy-game .hand-card img,
 body.sf-fantasy-game .champ img,
 body.sf-fantasy-game .monster img,
 body.sf-fantasy-game .stack-card img,
 body.sf-fantasy-game .select-card img{
   -webkit-user-drag:none!important;
   user-drag:none!important;
   pointer-events:none!important;
 }
 `;
 document.head.appendChild(s);
}

function hardenImages(root=document){
 root.querySelectorAll?.('.hand-card img,.champ img,.monster img,.stack-card img,.select-card img').forEach(img=>{
   img.draggable=false;
   img.setAttribute('draggable','false');
 });
}

function protectedGameArea(el){
 return el?.closest?.('.game-grid,.hand-wrap,.chain-lane,.board,.playerzone');
}
function editable(el){
 return el?.closest?.('input,textarea,[contenteditable="true"]');
}

/* Prevent the browser from entering text-selection mode while a card interaction
   is starting. This removes the native selection caret/blue-selection path from
   the battlefield without affecting text fields. */
document.addEventListener('selectstart',e=>{
 if(protectedGameArea(e.target)&&!editable(e.target))e.preventDefault();
},true);

installStyle();
hardenImages();

let queued=false;
const root=document.getElementById('app')||document.body;
if(root)new MutationObserver(()=>{
 if(queued)return;
 queued=true;
 requestAnimationFrame(()=>{queued=false;installStyle();hardenImages(root)});
}).observe(root,{childList:true,subtree:true});

window.addEventListener('sf-blue-ready',()=>requestAnimationFrame(()=>hardenImages()));
})();
