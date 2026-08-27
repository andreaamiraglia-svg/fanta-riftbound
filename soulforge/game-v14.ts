import {
  CARD_DEFS,
  MONSTER_DEFS,
  newState,
  newPlayer,
  act as baseAct,
  publicView as basePublicView,
  damageChampion,
  killMonster,
  currentMonsterPow,
} from "https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game.ts";

// Regole aggiornate dalle nuove carte stampate.
CARD_DEFS.berserk.text = 'Attiva un tuo Campione danneggiato e forniscigli +2 POW.';
// Riutilizziamo internamente l\'effetto Albero (+2 POW); l\'attivazione viene completata nel wrapper.
CARD_DEFS.berserk.effect = 'albero';
CARD_DEFS.fendente_di_fuoco.text = 'Infliggi 2 danni ad un Nemico.';
CARD_DEFS.occhio_di_drago.text = 'Metti 5 carte dal tuo mazzo nel Cimitero. Un tuo Campione ottiene +1 POW fino alla fine del turno.';
CARD_DEFS.riflesso.speed = 'instant';
CARD_DEFS.riflesso.text = 'Scegli un tuo Campione. Infliggi a un Mostro danni pari ai danni attualmente subiti da quel Campione.';

MONSTER_DEFS.golem_magmatico.text = 'Quando entra in gioco infligge 1 danno a tutti i Campioni.';
MONSTER_DEFS.serpente_della_giungla.text = 'Quando questo Mostro va nel Cimitero, ogni giocatore perde 1 Anima.';
MONSTER_DEFS.salamandra_vulcanica.text = 'Ogni volta che un Campione attacca, questa perde 1 POW fino alla fine del turno.';

export { newState, newPlayer };

const pl = (s:any,p:number) => s?.players?.[String(p)];
const champ = (s:any,p:number,id:string) => pl(s,p)?.champions?.find((c:any)=>c.id===id);
const countInGrave = (s:any,p:number,id:string) => (pl(s,p)?.grave || []).filter((x:string)=>x===id).length;

function patchPublicCard(card:any){
  if(!card) return card;
  if(card.id==='berserk') card.effect='berserk';
  return card;
}

export function publicView(state:any,p:number){
  const v = JSON.parse(JSON.stringify(basePublicView(state,p)));
  if(v.cardDefs?.berserk) v.cardDefs.berserk.effect='berserk';
  for(const q of [1,2]){
    const x=v.players?.[String(q)];
    if(!x) continue;
    for(const key of ['handCards','deckCards','graveCards']){
      if(Array.isArray(x[key])) x[key].forEach(patchPublicCard);
    }
  }
  return v;
}

function applyGolemEnters(s:any, amount:number){
  for(let i=0;i<amount;i++){
    for(const q of [1,2]){
      const p=pl(s,q); if(!p) continue;
      for(const c of p.champions || []){
        if(!c.defeated) damageChampion(s,q,c.id,1,'Golem Magmatico');
      }
    }
    s.log.push('Golem Magmatico entra in gioco e infligge 1 danno a tutti i Campioni.');
  }
}

function handleSalamandraAfterAttack(s:any, uids:string[]){
  for(const uid of uids){
    const m=s.board?.monsters?.find((x:any)=>x.uid===uid);
    if(!m) continue;
    m.tempPow=(m.tempPow||0)-1;
    s.log.push('Salamandra Vulcanica perde 1 POW fino alla fine del turno.');
    if(m.damage>=currentMonsterPow(s,m)) killMonster(s,null,m,'effetto della Salamandra Vulcanica');
  }
}

export function act(s:any,p:number,a:any){
  // Validazioni nuove.
  if(a?.type==='cast' && a.cardId==='berserk'){
    const c=champ(s,p,String(a?.targets?.ownChamp||''));
    if(!c || c.defeated || Number(c.damage||0)<=0) throw new Error('Berserk richiede un tuo Campione danneggiato.');
  }
  if(a?.type==='cast' && a.cardId==='occhio_di_drago'){
    if((pl(s,p)?.deck?.length||0)<5) throw new Error('Occhio di Drago richiede almeno 5 carte nel mazzo.');
  }

  const beforeStatus=s?.status;
  const beforeTurn=s?.turn;
  const beforeStack=JSON.parse(JSON.stringify(s?.stack||[]));
  const beforeGraves:any={};
  for(const q of [1,2]) beforeGraves[q]={berserk:countInGrave(s,q,'berserk'),occhio:countInGrave(s,q,'occhio_di_drago')};

  // Se questa conferma avvia il turno, sappiamo già quali Golem verranno rivelati.
  let expectedGolems=0;
  if(a?.type==='select_cards' && s?.status==='select'){
    const other=p===1?2:1;
    if(pl(s,other)?.selected){
      const amount=s.turn===1?1:2;
      for(const q of [1,2]) expectedGolems += (pl(s,q)?.monsterDeck||[]).slice(0,amount).filter((id:string)=>id==='golem_magmatico').length;
    }
  }

  // Turno 1: un Mostro per giocatore. Dal turno 2 il motore base ne pesca 2 a testa.
  const limitFirstTurn = s?.status==='select' && s?.turn===1 && a?.type==='select_cards';
  const savedDecks:any={};
  if(limitFirstTurn){
    for(const q of [1,2]){
      const player=pl(s,q); if(!player) continue;
      savedDecks[q]=[...(player.monsterDeck||[])];
      player.monsterDeck=savedDecks[q].length?[savedDecks[q][0]]:[];
    }
  }

  // La Salamandra deve perdere POW, non il Campione attaccante.
  const salamandras:any[]=[];
  if(a?.type==='attack'){
    for(const m of s?.board?.monsters||[]){
      if(m.cardId==='salamandra_vulcanica'){
        salamandras.push({uid:m.uid});
        m.cardId='__salamandra_vulcanica__';
      }
    }
  }

  // Alta Marea è Istantanea, ma è ammessa come prima risposta a un combattimento.
  const specialMarea = a?.type==='cast' && a.cardId==='alta_marea' && !!s?.combat && !(s?.stack?.length);
  const oldMareaSpeed=CARD_DEFS.alta_marea.speed;
  if(specialMarea) CARD_DEFS.alta_marea.speed='response';

  let out:any;
  try{
    out=baseAct(s,p,a);
  }catch(e){
    for(const x of salamandras){const m=s?.board?.monsters?.find((z:any)=>z.uid===x.uid);if(m)m.cardId='salamandra_vulcanica';}
    if(limitFirstTurn){for(const q of [1,2]){const player=pl(s,q);if(player&&savedDecks[q])player.monsterDeck=savedDecks[q];}}
    CARD_DEFS.alta_marea.speed=oldMareaSpeed;
    throw e;
  }
  CARD_DEFS.alta_marea.speed=oldMareaSpeed;

  // Ripristina i Monster Deck dopo la limitazione del primo turno.
  if(limitFirstTurn){
    const started=beforeStatus==='select' && out?.status==='main' && beforeTurn===1;
    for(const q of [1,2]){
      const player=pl(out,q); if(!player||!savedDecks[q]) continue;
      player.monsterDeck=started?savedDecks[q].slice(1):savedDecks[q];
    }
  }

  // Ripristina la vera identità delle Salamandre e applica il trigger dopo la dichiarazione dell'attacco.
  if(a?.type==='attack'){
    for(const x of salamandras){const m=out?.board?.monsters?.find((z:any)=>z.uid===x.uid);if(m)m.cardId='salamandra_vulcanica';}
    handleSalamandraAfterAttack(out,salamandras.map(x=>x.uid));
  }

  // Il vecchio Golem aumentava il danno delle Magie: azzeriamo quel bonus.
  if(a?.type==='cast' && out?.stack?.length){
    const item=out.stack[out.stack.length-1];
    if(item?.cardId===a.cardId) item.golemBoost = a.cardId==='fendente_di_fuoco' ? -1 : 0;
  }

  // Nuovo Golem: danno globale all'ingresso.
  if(expectedGolems && beforeStatus==='select' && out?.status==='main') applyGolemEnters(out,expectedGolems);

  // Correzioni post-risoluzione delle carte modificate.
  for(const q of [1,2]){
    const berserkResolved=countInGrave(out,q,'berserk')>beforeGraves[q].berserk;
    if(berserkResolved){
      const item=[...beforeStack].reverse().find((x:any)=>x.actor===q&&x.cardId==='berserk');
      const c=item?champ(out,q,item.targets?.ownChamp):null;
      if(c&&!c.defeated){c.tapped=false;out.log.push(`${c.name} viene attivato da Berserk.`);}
    }

    const occhioResolved=countInGrave(out,q,'occhio_di_drago')>beforeGraves[q].occhio;
    if(occhioResolved){
      const item=[...beforeStack].reverse().find((x:any)=>x.actor===q&&x.cardId==='occhio_di_drago');
      const player=pl(out,q);
      if(player){
        const extra=player.deck.splice(0,Math.min(2,player.deck.length));
        player.grave.push(...extra);
      }
      const c=item?champ(out,q,item.targets?.ownChamp):null;
      if(c&&!c.defeated)c.tempPow=(c.tempPow||0)-1;
      out.log=out.log.filter((line:string)=>!line.includes('manda 3 carte nel Cimitero.'));
      if(c) out.log.push(`${player?.name||'Il giocatore'} mette 5 carte dal mazzo nel Cimitero. ${c.name} ottiene +1 POW fino alla fine del turno.`);
    }
  }

  return out;
}
