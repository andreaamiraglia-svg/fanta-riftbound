import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { newState, newPlayer, act, publicView, CARD_DEFS } from "https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v34-loader.ts";

if(CARD_DEFS?.sguardo_ninjitsu) CARD_DEFS.sguardo_ninjitsu.text='Uccidi un Mostro danneggiato.';

const APP_URL="https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/base-app.html";
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'GET, POST, OPTIONS'};
const json=(data:any,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const err=(message:string,status=400)=>json({error:message},status);
const cleanName=(v:any)=>String(v||'Giocatore').trim().slice(0,24)||'Giocatore';
const cleanRoom=(v:any)=>String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
const roomCode=()=>{const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';const a=new Uint32Array(6);crypto.getRandomValues(a);for(const n of a)s+=chars[n%chars.length];return s;};
const token=()=>crypto.randomUUID()+crypto.randomUUID().replaceAll('-','');
const tossCoin=()=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return (a[0]&1)===0?'testa':'croce';};
const otherPlayer=(p:number)=>p===1?2:1;
const desiredFocus=(state:any)=>{const starter=Number(state?.startingPlayer)===2?2:1;return Number(state?.turn||1)%2===1?starter:otherPlayer(starter);};
const alignFocusWithCoin=(state:any,beforeStatus:string,beforeTurn:number)=>{
 if(!state||![1,2].includes(Number(state.startingPlayer)))return state;
 const target=desiredFocus(state);
 const enteredMain=beforeStatus==='select'&&state.status==='main';
 const advancedTurn=beforeTurn!==Number(state.turn)&&state.status==='select';
 if(enteredMain||advancedTurn)state.focus=target;
 if(enteredMain&&Array.isArray(state.log)){
  for(let i=state.log.length-1;i>=0;i--){
   if(String(state.log[i]||'').startsWith('Inizia il turno ')){
    state.log[i]=`Inizia il turno ${state.turn}. Il Focus è di ${state.players?.[String(target)]?.name||`Giocatore ${target}`}.`;
    break;
   }
  }
 }
 return state;
};
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method==='GET'){try{const r=await fetch(APP_URL+'?v='+Date.now());if(!r.ok)throw new Error('Frontend HTTP '+r.status);const html=await r.text();return new Response(html,{status:200,headers:{...cors,'content-type':'text/html; charset=utf-8','content-disposition':'inline','cache-control':'no-store, no-cache, must-revalidate','x-content-type-options':'nosniff'}})}catch(e){return new Response('Errore caricamento frontend: '+(e instanceof Error?e.message:String(e)),{status:500,headers:{...cors,'content-type':'text/plain; charset=utf-8'}})}}
 if(req.method!=='POST')return err('Metodo non supportato.',405);
 const supabase=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});let body:any={};try{body=await req.json()}catch{return err('Richiesta non valida.')}const action=body.action;
 if(action==='create'){
  const name=cleanName(body.name);let code='';for(let i=0;i<8;i++){code=roomCode();const {data}=await supabase.from('soulforge_games').select('id').eq('room_code',code).maybeSingle();if(!data)break}
  const p1Token=token();let state:any;try{state=newState(name,body.deck)}catch(e){return err(e instanceof Error?e.message:String(e))}
  const {error}=await supabase.from('soulforge_games').insert({room_code:code,p1_name:name,p1_token:p1Token,state,version:1});if(error)return err('Impossibile creare la stanza: '+error.message,500);return json({roomCode:code,token:p1Token,player:1,state:publicView(state,1),version:1})
 }
 const code=cleanRoom(body.roomCode);if(code.length!==6)return err('Codice stanza non valido.');const {data:game,error:fetchErr}=await supabase.from('soulforge_games').select('*').eq('room_code',code).maybeSingle();if(fetchErr||!game)return err('Stanza non trovata.',404);
 if(action==='join'){
  if(game.p2_token)return err('La stanza è già piena.',409);
  const name=cleanName(body.name),p2Token=token(),state=game.state;
  try{state.players['2']=newPlayer(name,body.deck)}catch(e){return err(e instanceof Error?e.message:String(e))}
  const result=tossCoin();
  const startingPlayer=result==='testa'?1:2;
  state.startingPlayer=startingPlayer;
  state.coinToss={id:crypto.randomUUID(),result,winner:startingPlayer};
  state.status='select';
  state.focus=startingPlayer;
  const winnerName=state.players?.[String(startingPlayer)]?.name||`Giocatore ${startingPlayer}`;
  state.log.push(`Lancio della moneta: ${result==='testa'?'TESTA':'CROCE'}. ${winnerName} inizierà per primo.`);
  state.log.push(`${name} entra nella partita. Scegliete le carte.`);
  const {data:updated,error}=await supabase.from('soulforge_games').update({p2_name:name,p2_token:p2Token,state,version:game.version+1,updated_at:new Date().toISOString()}).eq('id',game.id).eq('version',game.version).select('version').maybeSingle();if(error||!updated)return err('La stanza è stata aggiornata. Riprova.',409);return json({roomCode:code,token:p2Token,player:2,state:publicView(state,2),version:updated.version})
 }
 const supplied=String(body.token||'');let p=0;if(supplied&&supplied===game.p1_token)p=1;else if(supplied&&supplied===game.p2_token)p=2;else return err('Token giocatore non valido.',403);
 if(action==='get')return json({roomCode:code,player:p,state:publicView(game.state,p),version:game.version});
 if(action==='move'){
  if(Number(body.version)!==Number(game.version))return err('STATE_CONFLICT',409);
  let state=game.state;
  const beforeStatus=String(state?.status||'');
  const beforeTurn=Number(state?.turn||0);
  if(body.move?.type==='cast'&&body.move?.cardId==='sguardo_ninjitsu'){
   const uid=String(body.move?.targets?.monsterUid||'');
   const target=state?.board?.monsters?.find((m:any)=>String(m.uid)===uid);
   if(!target||Number(target.damage||0)<=0)return err('Tecnica dello Sguardo Ninjitsu richiede un Mostro danneggiato.');
  }
  try{state=act(state,p,body.move||{})}catch(e){return err(e instanceof Error?e.message:String(e))}
  state=alignFocusWithCoin(state,beforeStatus,beforeTurn);
  const {data:updated,error}=await supabase.from('soulforge_games').update({state,version:game.version+1,updated_at:new Date().toISOString()}).eq('id',game.id).eq('version',game.version).select('version').maybeSingle();if(error||!updated)return err('STATE_CONFLICT',409);return json({roomCode:code,player:p,state:publicView(state,p),version:updated.version})
 }
 return err('Azione sconosciuta.');
});
