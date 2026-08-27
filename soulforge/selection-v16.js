(()=>{
  if(typeof renderSelect!=='function') return;
  const previousRenderSelect=renderSelect;

  renderSelect=function(){
    const me=playerState(session.player);
    if(me?.selected){
      return '<div class="panel"><h2>Selezione confermata</h2><p>Attendo l’altro giocatore.</p></div>';
    }

    const cards=me?.deckCards||[];
    const target=Math.min(6,cards.length);

    if(target>=6) return previousRenderSelect();

    // Se restano meno di 6 carte, devono essere giocate tutte e non sono deselezionabili.
    selected.clear();
    cards.forEach(c=>selected.add(c.id));

    let html=previousRenderSelect();
    html=html.replace('Scegli 6 carte', target===0?'Nessuna carta disponibile':`Giochi tutte le ${target} carte disponibili`);
    html=html.replace(`${target}/6`,`${target}/${target}`);
    html=html.replace('Conferma 6 carte',target===0?'Conferma turno senza carte':`Conferma ${target} ${target===1?'carta':'carte'}`);
    html=html.replace(/(<button id="confirmSelect"[^>]*?)\sdisabled(=""|="disabled")?/,'$1');
    html=html.replace(/\sdata-select-card="[^"]+"/g,'');
    return html;
  };
})();
