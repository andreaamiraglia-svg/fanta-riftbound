import {cards,monsters} from './september-catalog.js';
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
 if(ref?.type==='stack')return [...document.querySelectorAll('.chainitem')].find(e=>e.dataset.stackUid===String(ref.uid));
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
  const hand=state()?.players[String(me())]?.handCards?.find(x=>x.id===id);if(!hand)return;
  if(typeof canCast==='function'&&!canCast(hand))return showError('Non puoi giocare questa carta ora.');
  let targets={};
  if(c.target==='reflection'){
   const champion=await pickField(c.name+' — scegli un tuo Campione',options('own'));if(!champion)return;
   const enemy=await pickField(c.name+' — scegli un nemico',options('enemy'));if(!enemy)return;targets={champion,enemy};
  }else if(c.target==='monsters'){
   const selected=await pickField(c.name+' — scegli fino a 3 Mostri',options('monster'),true,3);if(!selected)return;targets={monsterUids:selected.map(x=>x.uid)};
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
 if(!window.sfArtUrl21?.sf61){const previous=window.sfArtUrl21,fn=id=>definitions[id]?BASE+definitions[id].art:previous?.(id)||'';Object.assign(fn,previous);fn.sf61=true;window.sfArtUrl21=fn}
}
function arrows(){
 const s=state();if(!s)return;const stack=[...s.stack].reverse();[...document.querySelectorAll('.chainitem')].forEach((e,i)=>{if(stack[i])e.dataset.stackUid=stack[i].uid});
 let svg=document.getElementById('sf61-arrows');if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='sf61-arrows';document.body.append(svg)}svg.replaceChildren();
 const center=e=>{const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}};
 for(const item of stack){const source=fieldElement({type:'stack',uid:item.uid});if(!source)continue;for(const ref of item.targetRefs||[]){const target=fieldElement(ref);if(!target)continue;
  const a=center(source),b=center(target),mid={x:(a.x+b.x)/2,y:Math.min(a.y,b.y)-35},color=Number(item.actor)===me()?'#58d6ff':'#ff986b';
  const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',`M${a.x},${a.y} Q${mid.x},${mid.y} ${b.x},${b.y}`);p.setAttribute('stroke',color);p.setAttribute('stroke-width','3');p.setAttribute('fill','none');svg.append(p);
  const angle=Math.atan2(b.y-mid.y,b.x-mid.x),h=document.createElementNS(svg.namespaceURI,'path');h.setAttribute('d',`M${b.x},${b.y} L${b.x-13*Math.cos(angle-.45)},${b.y-13*Math.sin(angle-.45)} L${b.x-13*Math.cos(angle+.45)},${b.y-13*Math.sin(angle+.45)}Z`);h.setAttribute('fill',color);svg.append(h);
 }}
}
const style=document.createElement('style');style.textContent='.sf61-valid{outline:3px solid #f7d874!important;cursor:crosshair!important}.sf61-selected{outline:4px solid #51eab6!important}#sf61-choice{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);z-index:10020;background:#161923;color:white;border:1px solid #c6a66b;padding:12px;display:flex;align-items:center;gap:12px;max-width:95vw;overflow:auto}#sf61-choice img{height:100px;display:block}#sf61-choice button{padding:8px;cursor:pointer}#sf61-arrows{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:10000}';document.head.append(style);
install();setInterval(()=>{install();arrows();if(choice&&!document.querySelector('.sf61-valid,.sf61-selected'))paint()},300);window.addEventListener('resize',arrows);document.addEventListener('scroll',arrows,true);
window.sf61={pickField,options,play,arrows,fieldElement};
