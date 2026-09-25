(()=>{
 const escLobby=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function activeDeckEntry(){
  try{
   const list=window.sfDeckBuilder?.getLibrary?.()||[];
   const id=localStorage.getItem('sf_active_deck_id_v1');
   return list.find(x=>String(x.id)===String(id))||list[0]||null;
  }catch{return null}
 }
 function header(){
  return `<header class="sf-home-header"><a class="sf-home-brand" href="/" aria-label="Champion of the Souls"><img src="/favicon-192.png?v=cs2" alt=""><span><strong>CHAMPION</strong><small>of the</small><b>SOULS</b></span></a><nav aria-label="Navigazione principale"><button data-room-tab="play" class="selected">Play</button><button data-room-tab="decks">Decks</button><button data-room-tab="leaderboard">Leaderboard</button></nav></header>`;
 }
 function playerName(){
  try{return session?.state?.players?.[String(session.player)]?.name||localStorage.getItem('sf_player_name_v1')||'Giocatore'}catch{return localStorage.getItem('sf_player_name_v1')||'Giocatore'}
 }
 function renderWaitingLobby(){
  const deck=activeDeckEntry(),name=playerName(),room=String(session?.room||'').toUpperCase();
  app.innerHTML=`<div class="sf-home sf-room-lobby">${header()}<main class="sf-room-lobby-main"><section class="sf-room-lobby-card"><div id="globalError" class="error hidden" role="alert"></div><div class="sf-room-field"><label for="sfRoomName">Tuo nome</label><input id="sfRoomName" class="sf-room-name" value="${escLobby(name)}" readonly></div><span class="sf-room-section-label">Codice Stanza</span><div class="sf-room-code-row"><div class="sf-room-code" id="sfRoomCode">${escLobby(room)}</div><button class="sf-room-primary" id="sfShareRoom">Condividi<br>Stanza</button></div><label class="sf-room-join-label" for="sfJoinOther">Oppure inserisci il codice della loro stanza</label><div class="sf-room-join-row"><input id="sfJoinOther" maxlength="6" placeholder="ABC123" autocomplete="off" spellcheck="false"><button class="sf-room-primary sf-room-connect" id="sfJoinOtherBtn">Connetti</button></div><div class="sf-room-divider"></div><div class="sf-room-deck-row"><span>Mazzo attivo: <strong>${escLobby(deck?.name||'Mazzo attivo')}</strong></span><button class="sf-room-edit" id="sfEditDeck">Modifica mazzo</button></div><div class="sf-room-wait">In attesa che un altro giocatore entri nella stanza.</div></section></main></div>`;
  bindWaitingLobby(deck);
 }
 function bindWaitingLobby(deck){
  document.querySelector('[data-room-tab="play"]')?.addEventListener('click',renderWaitingLobby);
  document.querySelector('[data-room-tab="decks"]')?.addEventListener('click',()=>window.sfDeckBuilder?.library?.());
  document.querySelector('[data-room-tab="leaderboard"]')?.addEventListener('click',()=>window.sfRenderLeaderboard?.());
  document.querySelector('#sfEditDeck')?.addEventListener('click',()=>window.sfDeckBuilder?.open?.(deck?.id||null));
  document.querySelector('#sfShareRoom')?.addEventListener('click',async e=>{
   const btn=e.currentTarget,url=typeof shareUrl==='function'?shareUrl():`${location.origin}${location.pathname}?room=${session.room}`;
   try{await navigator.clipboard.writeText(url);btn.textContent='Copiato!';btn.classList.add('sf-room-copy-ok');setTimeout(()=>{if(btn.isConnected){btn.innerHTML='Condividi<br>Stanza';btn.classList.remove('sf-room-copy-ok')}},1300)}catch{prompt('Copia il link della stanza:',url)}
  });
  const join=async()=>{
   const input=document.querySelector('#sfJoinOther'),code=String(input?.value||'').trim().toUpperCase();if(!code)return;
   try{busy=true;const j=await post({action:'join',roomCode:code,name:playerName(),deck:window.sfDeckBuilder?.getDeck?.()});loadSession(j)}catch(e){showError(e?.message||'Impossibile connettersi alla stanza.')}finally{busy=false}
  };
  document.querySelector('#sfJoinOtherBtn')?.addEventListener('click',join);
  document.querySelector('#sfJoinOther')?.addEventListener('keydown',e=>{if(e.key==='Enter')join()});
 }
 function install(){
  if(typeof window.renderGame!=='function'||window.renderGame.__roomLobby103)return false;
  const previous=window.renderGame;
  const wrapped=function(){
   if(session?.state?.status==='waiting'){renderWaitingLobby();return}
   return previous.apply(this,arguments);
  };
  wrapped.__roomLobby103=true;wrapped.__previous=previous;window.renderGame=wrapped;
  if(session?.state?.status==='waiting')renderWaitingLobby();
  return true;
 }
 if(!install()){
  let tries=0;const t=setInterval(()=>{tries++;if(install()||tries>80)clearInterval(t)},100);
 }
 window.sfRenderWaitingLobby103=renderWaitingLobby;
})();