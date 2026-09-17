(()=>{
 let polling=false;
 let renderedRoom=null,renderedVersion=null;
 const key=()=>session.room+'|'+session.token+'|'+session.player;
 function apply(j,room,token){
  if(session.room!==room||session.token!==token)return false;
  const incoming=Number(j.version),current=Number(session.version);
  if(session.version!=null&&Number.isFinite(incoming)&&Number.isFinite(current)&&incoming<current)return false;
  session.player=j.player;session.version=j.version;session.state=j.state;
  return true;
 }
 function redraw(){
  if(renderedRoom!==key()||renderedVersion!==session.version){
   render();
   renderedRoom=key();renderedVersion=session.version;
  }
 }
 refresh=async function(){
  if(!session.room||!session.token||busy||polling)return;
  polling=true;
  const room=session.room,token=session.token;
  try{
   const j=await post({action:'get',roomCode:room,token});
   if(apply(j,room,token))redraw();
  }catch(e){
   if(session.room!==room||session.token!==token)return;
   if(String(e.message).includes('Token')){
    localStorage.removeItem('sf_'+room);
    session={room:null,token:null,player:null,version:null,state:null};
    stopPolling();renderLanding();
   }else console.error('[soulforge-sync]',e);
  }finally{polling=false}
 };
 move=async function(m){
  if(busy)return;
  busy=true;
  const room=session.room,token=session.token;
  let recover=false;
  try{
   const j=await post({action:'move',roomCode:room,token,version:session.version,move:m});
   if(apply(j,room,token))redraw();
  }catch(e){
   if(e.message==='STATE_CONFLICT')recover=true;
   else{console.error('[soulforge-sync]',e);showError(e.message);recover=true}
  }finally{busy=false}
  if(recover)await refresh();
 };
})();
