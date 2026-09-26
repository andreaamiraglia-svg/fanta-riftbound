import * as base from './game-v71-loader.ts';
import {engine61 as E} from './game-v32-loader.ts?rev=souls-uncapped-v3';

export const CARD_DEFS:any=base.CARD_DEFS;
export const MONSTER_DEFS:any=base.MONSTER_DEFS;
export const CHAMPION_DEFS:any=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const SUPERIOR_CHAMPIONS:any=(base as any).SUPERIOR_CHAMPIONS;

const player=(s:any,p:number)=>s?.players?.[String(p)]||null;

/*
 A champion changing to its Superior form changes only its PRINTED version.
 Existing runtime state must survive the transformation: wounds, damage,
 temp/persistent POW modifiers, armor, charge, tap state and other statuses.
*/
function syncChampionPrintedVersion(c:any){
 const pair=SUPERIOR_CHAMPIONS?.[String(c?.id||'')];
 if(!pair)return;
 const printed=c.superior?pair.superior:pair.base;
 c.name=printed.name;
 c.basePow=Number(printed.basePow||0);
 c.hp=Number(printed.hp||0);
 c.text=printed.text;
 c.art=printed.art;
 // Deliberately DO NOT reset wounds/damage/tempPow/powMod/armor/charge/statuses.
}
function syncState(state:any){
 for(const p of [1,2])for(const c of player(state,p)?.champions||[])syncChampionPrintedVersion(c);
 return state;
}

export function newPlayer(...args:any[]){
 const q=(base.newPlayer as any)(...args);
 for(const c of q?.champions||[])syncChampionPrintedVersion(c);
 return q;
}
export function newState(...args:any[]){
 const s=(base.newState as any)(...args);
 return syncState(s);
}

export function act(state:any,p0:any,move:any){
 // Important for games already open before this fix: repair the authoritative
 // printed stats before the next rule evaluation, not only in the UI.
 syncState(state);
 const out=(base.act as any)(state,Number(p0),move)||state;
 syncState(out);
 return out;
}

export function publicView(state:any,p0:any){
 syncState(state);
 const v:any=(base.publicView as any)(state,Number(p0));
 if(!v)return v;
 // Force the client-facing POW/HP to the authoritative post-Ascension values.
 // basePow changes with the form; tempPow/powMod remain untouched and are
 // included by the engine's POW calculation.
 for(const p of [1,2]){
  const raw=player(state,p);
  for(const shown of v.players?.[String(p)]?.champions||[]){
   const src=(raw?.champions||[]).find((c:any)=>String(c?.id)===String(shown?.id));
   if(!src)continue;
   syncChampionPrintedVersion(src);
   const pair=SUPERIOR_CHAMPIONS?.[String(src.id)];
   const printed=pair?.[src.superior?'superior':'base'];
   shown.superior=!!src.superior;
   shown.name=src.name;
   shown.basePow=Number(src.basePow||0);
   shown.pow=Number(E.pow(state,p,src)||0);
   shown.hp=Number(src.hp||0);
   shown.wounds=Math.max(0,Number(src.wounds||0));
   shown.damage=Math.max(0,Number(src.damage||0));
   shown.armor=Math.max(0,Number(src.armor||0));
   shown.charge=Math.max(0,Number(src.charge||0));
   shown.text=src.text;
   shown.art=src.art;
   if(printed){
    shown.printedPow=Number(printed.basePow||0);
    shown.printedHp=Number(printed.hp||0);
   }
  }
 }
 return v;
}
