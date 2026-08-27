(()=>{
  // Il server viene interrogato spesso per il multiplayer, ma non ridisegniamo
  // tutta la pagina se la versione della partita non è cambiata.
  // Il vecchio refresh() faceva render() ogni ~900 ms e causava il flash del board.
  refresh = async function(){
    if(!session.room || !session.token || busy) return;
    try{
      const previousVersion = session.version;
      const j = await post({action:'get',roomCode:session.room,token:session.token});
      session.player = j.player;
      session.version = j.version;
      session.state = j.state;

      if(j.version !== previousVersion){
        render();
      }
    }catch(e){
      if(e.message.includes('Token')){
        localStorage.removeItem('sf_'+session.room);
        session={room:null,token:null,player:null,version:null,state:null};
        stopPolling();
        renderLanding();
      }
    }
  };
})();
