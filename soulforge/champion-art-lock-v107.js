(()=>{
const currentChampion=(card)=>{
 try{
  if(!card)return null;
  const id=String(card.dataset.champId||'');
  let owner=Number(card.dataset.owner||0);
  if(owner!==1&&owner!==2){
   const zones=[...document.querySelectorAll('.game-grid main > .playerzone')],zone=card.closest('.playerzone'),i=zones.indexOf(zone);
   if(i===0)owner=Number(session?.player)===1?2:1;
   else if(i===zones.length-1)owner=Number(session?.player);
  }
  const live=session?.state?.players?.[String(owner)]?.champions?.find(c=>String(c?.id)===id)||null;
  return live?{id,owner,live}:null;
 }catch{return null}
};
const expectedArt=(id,live)=>{
 try{return window.sfChampionSuperior105?.artFor?.(String(id),live)||''}catch{return''}
};
function lockCard(card){
 const info=currentChampion(card);if(!info)return;
 const src=expectedArt(info.id,info.live);if(!src)return;
 let img=card.querySelector('img.champ-art,img[data-sf-champion-art],.sf-card-shell > img');
 if(!img)return;
 img.classList.add('champ-art');
 img.dataset.sfChampionArt=info.id;
 img.dataset.sfChampionForm=info.live.superior?'superior':'base';
 if(img.getAttribute('src')!==src)img.setAttribute('src',src);
}
function lockAll(root=document){
 if(root instanceof Element&&root.matches('.champ'))lockCard(root);
 root.querySelectorAll?.('.champ').forEach(lockCard);
}

// ui-v2 historically renders the base artwork every time the board is rebuilt.
// Replace that output before it reaches the DOM, so a Superior champion never
// flashes back to its base image between game-state refreshes.
try{
 if(typeof champHtml==='function'&&!champHtml.__sfSuperiorArtLocked){
  const previous=champHtml;
  const wrapped=function(c,owner,isOwn){
   const html=previous(c,owner,isOwn);
   const src=expectedArt(c?.id,c);
   if(!src||!html)return html;
   const t=document.createElement('template');t.innerHTML=html;
   const card=t.content.querySelector('.champ'),img=card?.querySelector('img.champ-art,img');
   if(img){img.setAttribute('src',src);img.classList.add('champ-art');img.dataset.sfChampionArt=String(c?.id||'');img.dataset.sfChampionForm=c?.superior?'superior':'base'}
   return t.innerHTML;
  };
  wrapped.__sfSuperiorArtLocked=true;wrapped.__previous=previous;champHtml=wrapped;
 }
}catch{}

let queued=false;
function schedule(root=document){
 if(queued)return;queued=true;
 queueMicrotask(()=>{queued=false;lockAll(root)});
}
const app=document.getElementById('app');
if(app)new MutationObserver(muts=>{
 let needs=false;
 for(const m of muts){
  if(m.type==='attributes'){
   const card=m.target instanceof Element?m.target.closest('.champ'):null;
   if(card){lockCard(card);needs=false}
  }else if(m.addedNodes?.length){needs=true}
 }
 if(needs)schedule(app);
}).observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});

// Some legacy decorators still rewrite card images on timers. This is a cheap
// final guard and does not touch the DOM when the correct source is already set.
setInterval(()=>lockAll(app||document),180);
lockAll(app||document);
window.sfChampionArtLock107={lockAll,lockCard};
})();
