(()=>{
 const oldRenderMain=renderMain;
 renderMain=function(){
  const s=session.state;if(!s||s.status!=='main')return oldRenderMain();
  const me=playerState(session.player),op=playerState(otherP());
  const zone=(p,owner,own)=>'<div class="panel playerzone '+(own?'sf-player-zone':'sf-opponent-zone')+'"><div class="playerinfo"><b>'+esc(p.name)+'</b><div class="sub"></div>'+soulsHtml(p)+'</div><div class="champions">'+p.champions.map(c=>champHtml(c,owner,own)).join('')+'</div></div>';
  const backs=Array.from({length:Math.min(12,Math.max(0,Number(op.handCount)||0))},()=>'<i aria-hidden="true"></i>').join('');
  return '<div class="game-grid sf-schematic-board"><main><div class="sf-opponent-hand" aria-label="Mano avversaria: '+Number(op.handCount||0)+' carte"><span>Mano avversaria · '+Number(op.handCount||0)+'</span><div>'+backs+'</div></div>'+zone(op,otherP(),false)+'<div class="board"><h3>Mostri <span class="sub">('+s.board.monsters.length+')</span></h3><div class="monsters">'+s.board.monsters.map(monsterHtml).join('')+'</div></div>'+chainLane().replace('Pending / Catena','Pila')+zone(me,session.player,true)+'<div class="hand-title"><h3>La tua mano · '+me.handCards.length+'</h3><div class="controls">'+mainControls()+'</div></div>'+hand(me.handCards)+'</main><aside class="side"><details class="panel sf-layout-log"><summary>Log della partita</summary><div class="log">'+[...s.log].reverse().map(x=>'<div>'+esc(x)+'</div>').join('')+'</div></details></aside></div>';
 };
 if(session?.state?.status==='main')render();
})();
