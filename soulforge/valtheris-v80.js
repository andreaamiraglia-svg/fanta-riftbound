(()=>{
 const legal=c=>{const s=session?.state;return !!(c&&c.id==='valtheris'&&!c.defeated&&!c.tapped&&s?.status==='main'&&s.focus===session.player&&!s.priority&&!s.stack?.length&&!s.combat&&!s.pendingChoice)};
 const previousChampHtml=champHtml;
 champHtml=function(c,owner,isOwn){
  let html=previousChampHtml(c,owner,isOwn);
  if(legal(c)&&isOwn&&html.endsWith('</div>'))html=html.slice(0,-6)+'<div class="card-actions"><button class="btn sf-valtheris-ability" data-champ="valtheris">Protettore dell’Anima</button></div></div>';
  return html;
 };
 const previousBind=bind;
 bind=function(){
  previousBind();
  document.querySelectorAll('.sf-valtheris-ability').forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();move({type:'activate_champion',champId:'valtheris'});});
 };
 const priorValtherisHtml=champHtml;
 champHtml=function(c,owner,isOwn){
  let html=priorValtherisHtml(c,owner,isOwn);
  if(c?.id==='valtheris'&&html.endsWith('</div>')){
   const status=[];if(Number(c.armor||0)>0)status.push('Armatura '+Number(c.armor));if(c.provocazione)status.push('Provocazione');
   if(status.length)html=html.slice(0,-6)+'<div class="sub sf-valtheris-status">'+status.join(' • ')+'</div></div>';
  }
  return html;
 };
 window.sfValtherisAbilityUI=true;
 if(session?.state)render();
})();
