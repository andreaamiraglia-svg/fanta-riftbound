(()=>{
function enemyGuards(){
 const s=session?.state;if(!s)return[];
 const enemy=otherP();
 const monsters=(s.board?.monsters||[]).filter(m=>Number(m.owner)===Number(enemy)&&s.monsterDefs?.[m.cardId]?.provocazione).map(m=>({type:'monster',uid:String(m.uid)}));
 const champions=(playerState(enemy)?.champions||[]).filter(c=>!c.defeated&&c.provocazione).map(c=>({type:'champion',player:Number(enemy),champId:String(c.id)}));
 return [...monsters,...champions];
}
function isAllowedMonster(m){
 const guards=enemyGuards();
 if(!guards.length)return true;
 return guards.some(g=>g.type==='monster'&&String(g.uid)===String(m.uid));
}
function patchMonsterHtml(){
 if(typeof monsterHtml!=='function'||monsterHtml.__sfProv24)return;
 const previous=monsterHtml;
 const wrapped=function(m){
  let html=previous(m);
  const own=Number(m?.owner)===Number(session?.player);
  const hasProv=!!session?.state?.monsterDefs?.[m?.cardId]?.provocazione;
  const allowed=isAllowedMonster(m);
  html=html.replace(/class="monster ([^"]*)"/,(_,cls)=>{
   let list=String(cls).split(/\s+/).filter(Boolean).filter(x=>x!=='attack-target');
   if(allowed)list.push('attack-target');
   if(own&&hasProv)list=list.filter(x=>x!=='provocazione');
   return `class="monster ${[...new Set(list)].join(' ')}"`;
  });
  if(own&&hasProv)html=html.replace(' • Provocazione','');
  return html;
 };
 wrapped.__sfProv24=true;
 monsterHtml=wrapped;
}
function patchChampHtml(){
 if(typeof champHtml!=='function'||champHtml.__sfProv24)return;
 const previous=champHtml;
 const wrapped=function(c,owner,isOwn){
  let html=previous(c,owner,isOwn);
  if(isOwn)return html;
  const guards=enemyGuards();
  const allowed=!guards.length||guards.some(g=>g.type==='champion'&&Number(g.player)===Number(owner)&&String(g.champId)===String(c.id));
  html=html.replace(/class="champ ([^"]*)"/,(_,cls)=>{
   let list=String(cls).split(/\s+/).filter(Boolean).filter(x=>x!=='attack-target');
   if(allowed&&!c.defeated)list.push('attack-target');
   return `class="champ ${[...new Set(list)].join(' ')}"`;
  });
  return html;
 };
 wrapped.__sfProv24=true;
 champHtml=wrapped;
}
function install(){patchMonsterHtml();patchChampHtml()}
install();
const previousRender=render;
render=function(){install();previousRender()};
if(session?.state)render();
})();
