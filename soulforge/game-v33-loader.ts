import * as base from './game-v32-loader.ts?rev=souls-uncapped-v3';

// Regola globale: tutti i Mostri in campo sono considerati Nemici,
// indipendentemente da chi li ha evocati. I Campioni sono nemici solo
// per il giocatore avversario. game-v32-loader applica già questa regola,
// quindi v33 resta un passthrough senza filtrare i Mostri per owner.
export const CARD_DEFS=base.CARD_DEFS;
export const MONSTER_DEFS=base.MONSTER_DEFS;
export const CHAMPION_DEFS=base.CHAMPION_DEFS;
export const DECK_RULES=base.DECK_RULES;
export const STARTER_DECK=base.STARTER_DECK;
export const STARTER_MONSTERS=base.STARTER_MONSTERS;
export const newState=base.newState;
export const newPlayer=base.newPlayer;
export const publicView=base.publicView;
export const act=base.act;
