(()=>{
 function install(){
  if(renderMain.__sfBattle86)return;
  const previous=renderMain;
  const next=function(){
   const html=previous();if(session?.state?.status!=='main')return html;
   const template=document.createElement('template');template.innerHTML=html;
   const grid=template.content.querySelector('.game-grid'),main=grid?.querySelector('main');
   if(!main)return html;
   grid.classList.add('sf-schematic-board');
   const chain=grid.querySelector(':scope>.chain-lane'),board=main.querySelector(':scope>.board');
   if(chain&&board){board.after(chain);const title=chain.querySelector('h3');if(title)title.textContent='Pila';}
   const op=playerState(otherP()),count=Math.max(0,Number(op.handCount)||0);
   const strip=document.createElement('div');strip.className='sf-opponent-hand';strip.setAttribute('aria-label','Mano avversaria: '+count+' carte');
   strip.innerHTML='<span>Mano avversaria · '+count+'</span><div>'+Array.from({length:Math.min(12,count)},()=>'<i aria-hidden="true"></i>').join('')+'</div>';
   main.prepend(strip);
   const controls=main.querySelector('.hand-title>.controls');if(controls){controls.classList.add('sf-battle-controls');main.append(controls);}
   const panel=grid.querySelector(':scope>.side>.panel');
   if(panel){const details=document.createElement('details');details.className='panel sf-layout-log';const summary=document.createElement('summary');summary.textContent='Log della partita';details.append(summary);for(const child of [...panel.children])if(child.tagName!=='H3')details.append(child);panel.replaceWith(details);}
   return template.innerHTML;
  };
  next.__sfBattle86=true;next.__previous=previous;renderMain=next;
 }
 install();
 window.addEventListener('sf-blue-ready',()=>{install();if(session?.state?.status==='main')render();});
 if(session?.state?.status==='main')render();
})();
