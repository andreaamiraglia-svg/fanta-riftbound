import {cards as firstCards,monsters as firstMonsters} from './september-catalog.js?v=furia-charge4-1';
import {cards as newCards,monsters as newMonsters} from './new20-catalog.js';
import {cards as batch3Cards} from './batch3-catalog.js';
const cards=[...firstCards,...newCards,...batch3Cards],monsters=[...firstMonsters,...newMonsters];
const definitions=Object.fromEntries([...cards,...monsters].map(c=>[c.id,c]));
const BASE='https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/champion-of-the-souls-carte-ottimizzate/cards/';
const state=()=>typeof session==='undefined'?null:session.state;
const me=()=>Number(session.player);
const key=v=>JSON.stringify(v);
const art=id=>definitions[id]?BASE+definitions[id].art:window.sfArtUrl21?.(id)||'';
let choice=null;
function fieldElement(ref){
 if(ref?.type==='monster')return [...document.querySelectorAll('[data-monster-uid]')].find(e=>e.dataset.monsterUid===String(ref.uid));
 if(ref?.type==='champion')return [...document.querySelectorAll('.champ[data-owner][data-champ-id]')].find(e=>Number(e.dataset.owner)===Number(ref.player)&&e.dataset.champId===String(ref.champId));
 if(ref?.type==='stack'){const rows=[...document.querySelectorAll('.stack-card')],index=(state()?.stack||[]).findIndex(x=>String(x.uid)===String(ref.uid));return rows.find(e=>e.dataset.stackUid===String(ref.uid))||rows[index]||null;}
 return null;
}
function entities(){
 const s=state();if(!s)return[];
 return [...s.board.monsters.map(m=>({value:{type:'monster',uid:m.uid},cardId:m.cardId,label:m.name||s.monsterDefs[m.cardId]?.name,owner:Number(m.owner),pow:m.pow})),...[1,2].flatMap(p=>(s.players[String(p)]?.champions||[]).filter(c=>!c.defeated).map(c=>({value:{type:'champion',player:p,champId:c.id},cardId:c.sourceCardId||c.id,label:c.name,owner:p,pow:c.pow})))];
}
function options(kind){
 if(kind==='spell')return(state()?.stack||[]).filter(x=>x.kind==='card'&&state().cardDefs[x.cardId]?.type==='Magia').map(x=>({value:{type:'stack',uid:x.uid},cardId:x.cardId,label:state().cardDefs[x.cardId].name}));
 return entities().filter(x=>kind==='monster'||kind==='ownMonster'?x.value.type==='monster'&&(kind!=='ownMonster'||x.owner===me()):kind==='own'?x.value.type==='champion'&&x.owner===me():kind==='enemyChampion'?x.value.type==='champion'&&x.owner!==me():kind==='enemy'?x.value.type==='monster'||x.owner!==me():kind==='zeroChampion'?x.value.type==='champion'&&Number(x.pow)<=0:true);
}
function clear(){document.querySelectorAll('.sf61-valid,.sf61-selected').forEach(e=>e.classList.remove('sf61-valid','sf61-selected'));document.getElementById('sf61-choice')?.remove()}
function finish(value){const old=choice;choice=null;clear();old?.resolve(value)}
function select(value){if(!choice)return;if(!choice.multi)return finish(value);const i=choice.selected.findIndex(x=>key(x)===key(value));if(i>=0)choice.selected.splice(i,1);else if(choice.selected.length<choice.max)choice.selected.push(value);paint()}
function paint(){
 if(!choice)return;clear();const dock=document.createElement('div');dock.id='sf61-choice';const title=document.createElement('strong');title.textContent=choice.title;dock.append(title);
 for(const item of choice.items){const el=fieldElement(item.ref||item.value);if(el)el.classList.add(choice.selected.some(x=>key(x)===key(item.value))?'sf61-selected':'sf61-valid');else{
  const b=document.createElement('button');b.type='button';const src=art(item.cardId);if(src){const img=document.createElement('img');img.src=src;img.alt=item.label||'';b.append(img)}b.append(document.createTextNode(item.label||''));b.onclick=()=>select(item.value);dock.append(b);
 }}
 if(choice.multi){const b=document.createElement('button');b.textContent=`Conferma (${choice.selected.length}/${choice.max})`;b.onclick=()=>finish([...choice.selected]);dock.append(b)}
 const b=document.createElement('button');b.textContent='Annulla';b.onclick=()=>finish(null);dock.append(b);document.body.append(dock);
}
function pickField(title,items,multi=false,max=1){
 if(choice)finish(null);if(!items.length&&!multi){showError('Nessun bersaglio valido.');return Promise.resolve(null)}
 return new Promise(resolve=>{choice={title,items,multi,max,selected:[],resolve};paint()});
}
document.addEventListener('click',e=>{if(!choice||e.target.closest('#sf61-choice'))return;const item=choice.items.find(x=>fieldElement(x.ref||x.value)?.contains(e.target));if(item){e.preventDefault();e.stopImmediatePropagation();select(item.value)}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&choice)finish(null)});
async function play(id){
 const c=definitions[id];try{
  const hand=playerState(me())?.handCards?.find(x=>x.id===id);if(!hand)return;
  if(typeof canCast==='function'&&!canCast(hand))return showError('Non puoi giocare questa carta ora.');
  let targets={};
  if(c.target==='tapEnemy'||c.target==='damageHeal'){
   const champion=await pickField(c.name+' — scegli un tuo Campione'+(c.target==='tapEnemy'?' attivo da tappare':''),options('own').filter(x=>c.target!=='tapEnemy'||!state().players[String(me())].champions.find(y=>y.id===x.value.champId)?.tapped));if(!champion)return;
   const enemy=await pickField(c.name+' — scegli un nemico',options('enemy'));if(!enemy)return;targets={champion,enemy};
  }else if(c.target==='graveMonster'){
   const graveMonsterId=await pickField(c.name+' — scegli un Mostro dal tuo Cimitero',[...new Set(state().players[String(me())].monsterGrave)].map(id=>({value:id,cardId:id,label:state().monsterDefs[id]?.name||id})));if(!graveMonsterId)return;targets={graveMonsterId};
  }else if(c.target==='enemySoul'){
   const color=await pickField(c.name+' — scegli il colore dell’anima',['red','green','black','blue','orange'].filter(color=>state().players[String(3-me())].souls[color]>0).map(color=>({value:color,label:{red:'Rossa',green:'Verde',black:'Nera',blue:'Blu',orange:'Arancione'}[color]})));if(!color)return;targets={color};
  }else if(c.target==='twoEnemies'){
   const first=await pickField(c.name+' — scegli il primo nemico',options('enemy'));if(!first)return;
   const second=await pickField(c.name+' — scegli un altro nemico',options('enemy').filter(x=>key(x.value)!==key(first)));if(!second)return;targets={enemies:[first,second]};
  }else if(c.target==='chargeDiscard'){
   const discardId=await pickField(c.name+' — scegli una carta da scartare',playerState(me()).handCards.filter(x=>x.id!==id).map(x=>({value:x.id,cardId:x.id,label:x.name})));if(!discardId)return;
   const target=await pickField(c.name+' — scegli un tuo Campione',options('own'));if(!target)return;targets={discardId,target};
  }else if(c.target==='lascitoMonster'){
   const target=await pickField(c.name+' — scegli un Mostro con Lascito e massimo 2 POW',options('monster').filter(x=>{const m=state().board.monsters.find(y=>y.uid===x.value.uid);return x.pow<=2&&(state().monsterDefs[x.cardId]?.lascito||['scorpione_delle_ceneri','marionetta_maledetta'].includes(x.cardId)||m?.richiamoBrancoTurn===state().turn||m?.rinascita63)}));if(!target)return;targets={target};
  }else if(c.target==='reflection'){
   const champion=await pickField(c.name+' — scegli un tuo Campione',options('own'));if(!champion)return;
   const enemy=await pickField(c.name+' — scegli un nemico',options('enemy'));if(!enemy)return;targets={champion,enemy};
  }else if(c.target==='monsters'){
   const selected=await pickField(c.name+' — scegli fino a 3 Mostri',options('monster'),true,3);if(!selected)return;targets={monsterUids:selected.map(x=>x.uid)};
  }else if(c.target==='monsterDiscard'){
   const discard=await pickField(c.name+' — scegli una carta da scartare',state().players[String(me())].handCards.filter(x=>x.id!==id).map(x=>({value:x.id,cardId:x.id,label:x.name})));if(!discard)return;
   const target=await pickField(c.name+' — scegli un Mostro',options('monster'));if(!target)return;targets={discardId:discard,target};
  }else if(c.target!=='none'){
   const target=await pickField(c.name+' — scegli il bersaglio',options(c.target));if(!target)return;targets=c.target==='spell'?{stackUid:target.uid}:{target};
  }
  await move({type:'cast',cardId:id,targets});
 }catch(e){showError(e.message||String(e))}
}
function install(){
 if(typeof chooseForCard==='function'&&!chooseForCard.sf61){const previous=chooseForCard,fn=id=>cards.some(c=>c.id===id)?play(id):previous(id);Object.assign(fn,previous);fn.sf61=true;window.chooseForCard=fn;chooseForCard=fn}
 if(typeof pick==='function'&&!pick.sf61){
  const fn=(title,items)=>pickField(title,items.map(x=>{let ref=x.value;if(typeof ref!=='object')ref=entities().find(e=>e.value.uid===String(x.value)||e.value.champId===String(x.value)||e.label===x.label)?.value;return{...x,ref,cardId:x.cardId||entities().find(e=>key(e.value)===key(ref))?.cardId||String(x.value)}}));
  fn.sf61=true;window.pick=fn;pick=fn;
 }
 if(!window.sfArtUrl21?.sf61){const previous=window.sfArtUrl21,fn=id=>definitions[id]?BASE+definitions[id].art:previous?.(id)||'';Object.assign(fn,previous);fn.sf61=true;window.sfArtUrl21=fn;if(state()&&typeof render==='function')render()}
}
function arrows(){
 const stack=state()?.stack||[];
 [...document.querySelectorAll('.stack-card')].forEach((e,i)=>{if(stack[i]&&e.dataset.stackUid!==String(stack[i].uid))e.dataset.stackUid=String(stack[i].uid)});
 document.getElementById('sf61-arrows')?.remove();
}
const style=document.createElement('style');style.textContent='.sf61-valid{outline:3px solid #f7d874!important;cursor:crosshair!important}.sf61-selected{outline:4px solid #51eab6!important}#sf61-choice{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);z-index:10020;background:#161923;color:white;border:1px solid #c6a66b;padding:12px;display:flex;align-items:center;gap:12px;max-width:95vw;overflow:auto}#sf61-choice img{height:100px;display:block}#sf61-choice button{padding:8px;cursor:pointer}#sf61-arrows{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:10000}';document.head.append(style);
install();setInterval(()=>{install();arrows();if(choice&&!document.querySelector('.sf61-valid,.sf61-selected'))paint()},300);window.addEventListener('resize',arrows);document.addEventListener('scroll',arrows,true);
window.sf61={pickField,options,play,arrows,fieldElement};
let pending62Busy=false;
async function pending62(){
 const pc=state()?.pendingChoice;if(pending62Busy||!pc?.type?.startsWith('new20_')||Number(pc.player)!==me())return;
 pending62Busy=true;
 try{
  const s=state(),items=pc.cardIds.map(id=>({value:id,cardId:id,label:s.cardDefs[id]?.name||id}));
  if(pc.type==='new20_bronzo'){
   const picked=await pickField('Guerriero di Bronzo — un Supporto di costo 1 e uno di costo 2',items,true,2);if(picked)await move({type:'resolve_choice',cardIds:picked});
  }else{
   const list=pc.type==='new20_alabardo'?items.map(x=>({...x,ref:{type:'champion',player:me(),champId:x.value}})):items;
   const id=await pickField(pc.type==='new20_angelo'?'Angelo — scegli una carta di costo 0 dal mazzo':pc.type==='new20_ragno'?'Ragno dei Cadaveri — scegli una carta del tuo Cimitero':'Alabardo — scegli un tuo Campione',list);if(!id)return;
   if(pc.type!=='new20_angelo')await move({type:'resolve_choice',cardId:id});
   else{
    // Reuse every existing card-specific target chooser; only its final command
    // becomes the deck-play choice. The virtual card exists solely in this client.
    const previousPlayerState=playerState,previousMove=move,previousCanCast=canCast,original=s.pendingChoice;
    const def=s.cardDefs[id];
    playerState=function(p){const z=previousPlayerState(p);return Number(p)===me()?{...z,handCards:[...z.handCards.filter(x=>x.id!==id),def]}:z};
    move=async function(a){return previousMove(a.type==='cast'&&a.cardId===id?{type:'resolve_choice',cardId:id,targets:a.targets||{}}:a)};
    canCast=function(card){return card?.id===id||previousCanCast(card)};
    Object.assign(canCast,previousCanCast);
    s.pendingChoice=null;
    try{await chooseForCard(id)}finally{playerState=previousPlayerState;move=previousMove;canCast=previousCanCast;if(state()===s)s.pendingChoice=original;}
   }
  }
 }catch(e){showError(e.message||String(e))}finally{pending62Busy=false}
}
setInterval(pending62,600);
let pending63Busy=false;
async function pending63(){
 const pc=state()?.pendingChoice;if(pending63Busy||pc?.type!=='batch3_discard'||Number(pc.player)!==me())return;pending63Busy=true;
 try{
  const accept=await pickField('Ritorsione Cremisi scartata — vuoi giocarla pagando il costo?',[{value:true,cardId:pc.cardId,label:'Gioca Ritorsione Cremisi'},{value:false,label:'Passa'}]);
  if(!accept){await move({type:'resolve_choice',decline:true});return}
  const target=await pickField('Ritorsione Cremisi — scegli un Mostro',options('monster'));if(target)await move({type:'resolve_choice',targets:{target}});else await move({type:'resolve_choice',decline:true});
 }catch(e){showError(e.message||String(e))}finally{pending63Busy=false}
}
setInterval(pending63,600);
