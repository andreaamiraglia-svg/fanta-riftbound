import * as base from './game-v37-loader.ts';

export const CARD_DEFS=base.CARD_DEFS;
export const MONSTER_DEFS=base.MONSTER_DEFS;
export const CHAMPION_DEFS=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;
export const publicView=base.publicView;

// Albero della Vita è una Magia Istantanea, non un Supporto.
if(CARD_DEFS?.albero_della_vita) CARD_DEFS.albero_della_vita.type='Magia';

// Specchio d'Acqua annulla solo Magie dal costo stampato di 0 o 1 Anima.
if(CARD_DEFS?.specchio_acqua){
 CARD_DEFS.specchio_acqua.text='Annulla l’effetto di una Magia che costa 1 Anima o meno.';
}

export const act=base.act;
