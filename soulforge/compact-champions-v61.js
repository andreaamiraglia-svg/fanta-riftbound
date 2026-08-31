(()=>{
const STYLE_ID='sfCompactChampionsV61';
if(document.getElementById(STYLE_ID))return;
const s=document.createElement('style');
s.id=STYLE_ID;
s.textContent=`
/* Champion/Support lane v61 — card-only layout. Rules/targeting are untouched. */
body.sf-fantasy-game .champions,
body.sf-fantasy-game .champions.sf-support-lane{
  display:flex!important;
  flex-direction:row!important;
  flex-wrap:nowrap!important;
  align-items:center!important;
  justify-content:center!important;
  gap:40px!important;
  grid-template-columns:none!important;
  grid-auto-flow:unset!important;
  grid-auto-columns:unset!important;
  min-width:0!important;
  overflow-x:auto!important;
  overflow-y:visible!important;
  padding:8px 22px!important;
  scrollbar-width:thin;
}

body.sf-fantasy-game .champions>.champ,
body.sf-fantasy-game .champions.sf-support-lane>.champ{
  position:relative!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  flex:0 0 142px!important;
  width:142px!important;
  min-width:142px!important;
  max-width:142px!important;
  height:194px!important;
  min-height:194px!important;
  padding:6px!important;
  margin:0!important;
  grid-template-columns:none!important;
  grid-template-rows:none!important;
  border:0!important;
  border-radius:8px!important;
  background:transparent!important;
  box-shadow:none!important;
  overflow:visible!important;
}

/* The printed card already contains its name. Remove duplicate external labels/status. */
body.sf-fantasy-game .champions>.champ>h3,
body.sf-fantasy-game .champions>.champ>.tap,
body.sf-fantasy-game .champions>.champ .tap{
  display:none!important;
  visibility:hidden!important;
}

/* Keep the actual card as the only visual object in the slot. */
body.sf-fantasy-game .champions>.champ .sf-champ-shell{
  position:relative!important;
  flex:0 0 auto!important;
  width:122px!important;
  height:179px!important;
  margin:auto!important;
  transform-origin:50% 50%!important;
  transition:transform .34s cubic-bezier(.2,.8,.2,1),filter .2s ease!important;
  overflow:visible!important;
}

/* TAP is communicated only by rotation. Extra horizontal gap above prevents overlap. */
body.sf-fantasy-game .champions>.champ.sf-tapped .sf-champ-shell,
body.sf-fantasy-game .champions>.champ.sf-support-champ.sf-tapped .sf-champ-shell{
  transform:rotate(90deg) scale(.76)!important;
  filter:none!important;
}
body.sf-fantasy-game .champions>.champ.sf-tap-anim .sf-champ-shell,
body.sf-fantasy-game .champions>.champ.sf-support-champ.sf-tap-anim .sf-champ-shell{
  animation:sfCompactTap61 .34s cubic-bezier(.2,.8,.2,1) both!important;
}
body.sf-fantasy-game .champions>.champ.sf-untap-anim .sf-champ-shell,
body.sf-fantasy-game .champions>.champ.sf-support-champ.sf-untap-anim .sf-champ-shell{
  animation:sfCompactUntap61 .34s cubic-bezier(.2,.8,.2,1) both!important;
}
@keyframes sfCompactTap61{
  from{transform:rotate(0deg) scale(1)}
  to{transform:rotate(90deg) scale(.76)}
}
@keyframes sfCompactUntap61{
  from{transform:rotate(90deg) scale(.76)}
  to{transform:rotate(0deg) scale(1)}
}

/* Remove the old large coloured panel appearance, but preserve targeting outlines. */
body.sf-fantasy-game .champions>.champ.red,
body.sf-fantasy-game .champions>.champ.green,
body.sf-fantasy-game .champions>.champ.blue,
body.sf-fantasy-game .champions>.champ.black,
body.sf-fantasy-game .champions>.champ.orange{
  background:transparent!important;
  box-shadow:none!important;
}
body.sf-fantasy-game .champions>.champ.targetable,
body.sf-fantasy-game .champions>.champ.sf-targetable,
body.sf-fantasy-game .champions>.champ:hover{
  border:0!important;
}

@media(max-width:1450px){
  body.sf-fantasy-game .champions,
  body.sf-fantasy-game .champions.sf-support-lane{gap:34px!important;padding-left:16px!important;padding-right:16px!important}
  body.sf-fantasy-game .champions>.champ,
  body.sf-fantasy-game .champions.sf-support-lane>.champ{flex-basis:126px!important;width:126px!important;min-width:126px!important;max-width:126px!important;height:172px!important;min-height:172px!important}
  body.sf-fantasy-game .champions>.champ .sf-champ-shell{width:104px!important;height:153px!important}
}
@media(max-width:1099px){
  body.sf-fantasy-game .champions,
  body.sf-fantasy-game .champions.sf-support-lane{justify-content:flex-start!important;gap:30px!important}
  body.sf-fantasy-game .champions>.champ,
  body.sf-fantasy-game .champions.sf-support-lane>.champ{flex-basis:118px!important;width:118px!important;min-width:118px!important;max-width:118px!important;height:162px!important;min-height:162px!important}
  body.sf-fantasy-game .champions>.champ .sf-champ-shell{width:96px!important;height:142px!important}
}
@media(prefers-reduced-motion:reduce){
  body.sf-fantasy-game .champions>.champ .sf-champ-shell{transition:none!important;animation:none!important}
}
`;
document.head.appendChild(s);
})();
