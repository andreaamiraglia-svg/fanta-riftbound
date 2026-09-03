(()=>{
 function canUse(c,isOwn){const s=session?.state;return !!(isOwn&&c?.id==='valtheris'&&!c.defeated&&!c.tapped&&s?.status==='main'&&s.focus===session.player&&!s.priority&&!s.stack?.length&&!s.combat&&!s.pendingChoice);}
 function install(){
  if(typeof champHtml!=='function'||typeof bind!=='function')return;
  if(champHtml.__sfValtherisV81)return;
  const previousChampHtml=champHtml;
  const wrapped=function(c,owner,isOwn){
   let html=previousChampHtml(c,owner,isOwn);
   if(c?.id!=='valtheris'||!html.endsWith('</div>'))return html;
   const info=[];if(Number(c.armor||0)>0)info.push('Armatura '+Number(c.armor));if(c.provocazione)info.push('Provocazione');
   let extra='';
   if(canUse(c,isOwn))extra+='<div class="card-actions"><button class="btn sf-valtheris-ability" data-champ="valtheris">Protettore dell’Anima</button></div>';
   if(info.length)extra+='<div class="sub sf-valtheris-status">'+info.join(' • ')+'</div>';
   return html.slice(0,-6)+extra+'</div>';
  };
  wrapped.__sfValtherisV81=true;
  champHtml=wrapped;
  const previousBind=bind;
  bind=function(){
   previousBind();
   document.querySelectorAll('.sf-valtheris-ability').forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();move({type:'activate_champion',champId:'valtheris'});});
  };
  if(session?.state)render();
 }
 window.sfValtherisAbilityUI=true;
 window.addEventListener('sf-blue-ready',()=>setTimeout(install,0));
 setTimeout(install,100);setTimeout(install,500);setTimeout(install,1500);
})();
