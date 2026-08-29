const urls=['https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p01.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p02.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p03.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p04.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p05.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p06.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p07.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p08.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p09.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p10.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p11.txt','https://raw.githubusercontent.com/andreaamiraglia-svg/fanta-riftbound/main/soulforge/game-v22.p12.txt'];
const chunks=await Promise.all(urls.map(async u=>{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error('Game chunk HTTP '+r.status);return r.text()}));
let source=chunks.join('');
const patch=(pattern:RegExp|string,replacement:string,label:string)=>{const next=source.replace(pattern as any,replacement);if(next===source)throw new Error('Game patch missing: '+label);source=next};

patch(
 "const q = pl(s, p); if (!q || !COLORS.includes(color))\n    return; const before = q.souls[color] || 0;",
 "const q = pl(s, p); if (!q || !COLORS.includes(color))\n    return; const allowedColors = Array.isArray(q.deckColors) && q.deckColors.length ? q.deckColors : (q.champions || []).map(c => c?.color).filter(Boolean); if (!allowedColors.includes(color))\n    return; const before = q.souls[color] || 0;",
 'soul colors'
);

patch(
 "function recordLyrandel(s, p, uid0, n, allow = true) { if (!allow || n !== 1 || (p !== 1 && p !== 2))",
 "function recordLyrandel(s, p, uid0, n, allow = true) { if (!allow || n <= 0 || (p !== 1 && p !== 2))",
 'Lyrandel damage trigger'
);

patch(
 "cervo_antico: { id: 'cervo_antico', name: 'Cervo Antico', color: 'green', pow: 3, text: 'Quando un Mostro subisce 1 danno, ottiene +1 POW per questo turno.' },",
 "cervo_antico: { id: 'cervo_antico', name: 'Cervo Antico', color: 'green', pow: 3, text: 'Quando questo Mostro subisce danni, ottiene +1 POW per questo turno.' },",
 'Cervo Antico text'
);

patch(
 /function applyMonsterDamage\(s, m, n\) \{[\s\S]*?\}\nexport function damageMonster\(s, p, uid0, n, source = '', allowLyrandel = true\) \{[\s\S]*?\}\nfunction reduceChampionPow/,
 `function applyMonsterDamage(s, m, n) { if (!m || n <= 0)
    return false; m.damage += n; log(s, \`${'${MONSTER_DEFS[m.cardId]?.name || m.cardId}'} subisce ${'${n}'} dann${'${n === 1 ? \'o\' : \'i\'}'} (${'${m.damage}'}/${'${currentMonsterPow(s, m)}'}).\`); return m.damage >= currentMonsterPow(s, m); }
export function damageMonster(s, p, uid0, n, source = '', allowLyrandel = true) { const m = monster(s, uid0); if (!m || n <= 0)
    return { died: false }; n = absorbArmor(s, m, n, MONSTER_DEFS[m.cardId]?.name || m.cardId); if (n <= 0)
    return { died: false }; recordLyrandel(s, p, uid0, n, allowLyrandel); const cervoTriggered = m.cardId === 'cervo_antico'; if (applyMonsterDamage(s, m, n)) {
    killMonster(s, p, m, source, true);
    return { died: true };
} if (cervoTriggered && monster(s, uid0)) {
    s.triggerQueue.push({ actor: m.owner, sourceCardId: 'cervo_antico', effectId: 'cervo_antico_pow', effectName: 'Effetto — Cervo Antico', meta: { sourceUid: uid0 } });
    log(s, 'Cervo Antico attiva il suo effetto: entra in Catena.');
} return { died: false }; }
function reduceChampionPow`,
 'Cervo Antico damage trigger'
);

patch(
 /function queueMonsterTrigger\(s, m, effectId, effectName, meta = \{\}\) \{[\s\S]*?\}\nfunction processMonsterEnter/,
 `function queueMonsterTrigger(s, m, effectId, effectName, meta = {}, choiceType = null) { const tr = { actor: m.owner, sourceCardId: m.cardId, effectId, effectName, meta }; if (choiceType) tr.choiceType = choiceType; s.triggerQueue.push(tr); log(s, \`${'${MONSTER_DEFS[m.cardId].name}'} attiva il suo effetto: entra in Catena.\`); }\nfunction processMonsterEnter`,
 'queue monster trigger'
);

patch(
 /function processMonsterEnter\(s, m\) \{[\s\S]*?\}\nfunction processEnterQueue/,
 `function processMonsterEnter(s, m) { if (!m || !monster(s, m.uid)) return;
if (m.cardId === 'segugio_infernale') {
    const i = s.board.monsters.findIndex((x) => x.uid === m.uid);
    const uids = [s.board.monsters[i - 1]?.uid, s.board.monsters[i + 1]?.uid].filter(Boolean);
    queueMonsterTrigger(s, m, 'enter_segugio_infernale', 'Effetto — Segugio Infernale', { uids });
}
else if (m.cardId === 'drago_delle_ceneri')
    queueMonsterTrigger(s, m, 'enter_drago_ceneri', 'Effetto — Drago delle Ceneri', { sourceUid: m.uid });
else if (m.cardId === 'golem_magmatico')
    queueMonsterTrigger(s, m, 'enter_golem_magmatico', 'Effetto — Golem Magmatico');
else if (m.cardId === 'cerbero')
    queueMonsterTrigger(s, m, 'enter_cerbero', 'Effetto — Cerbero', {}, 'graveMonsterPow2');
else if (m.cardId === 'divoratore_di_anime_mostro') {
    const i = s.board.monsters.findIndex((x) => x.uid === m.uid);
    const uids = [s.board.monsters[i - 1]?.uid, s.board.monsters[i + 1]?.uid].filter(Boolean);
    queueMonsterTrigger(s, m, 'enter_divoratore_anime', 'Effetto — Divoratore di Anime', { sourceUid: m.uid, uids });
}
else if (m.cardId === 'squalo_delle_maree')
    queueMonsterTrigger(s, m, 'squalo_armor', 'Effetto — Squalo delle Maree');
else if (m.cardId === 'yeti')
    queueMonsterTrigger(s, m, 'yeti_freeze', 'Effetto — Yeti'); }
function processEnterQueue`,
 'monster enter effects'
);

patch(
 /function effectChoices\(s, tr\) \{[\s\S]*?\}\nfunction pushEffect/,
 `function effectChoices(s, tr) { if (tr.choiceType === 'enemyChampion')
    return pl(s, other(tr.actor)).champions.filter((c) => !c.defeated).map((c) => ({ id: c.id, label: c.name })); if (tr.choiceType === 'enemySoul') {
    const o = pl(s, other(tr.actor));
    return COLORS.filter(c => (o.souls[c] || 0) > 0).map(c => ({ id: c, label: \`Anima ${'${colorLabel(c)}'}\` }));
} if (tr.choiceType === 'monsterUids')
    return (tr.meta?.uids || []).filter((u) => !!monster(s, u)).map((u) => ({ id: u, label: MONSTER_DEFS[monster(s, u).cardId]?.name || u }));
if (tr.choiceType === 'graveMonsterPow2')
    return [...new Set(pl(s, tr.actor).monsterGrave.filter((id) => MONSTER_DEFS[id]?.pow === 2))].map((id) => ({ id, label: MONSTER_DEFS[id]?.name || id }));
return []; }
function pushEffect`,
 'trigger choices'
);

patch(
 /function pushEffect\(s, tr, choice\) \{[\s\S]*?\}\nfunction prepareTriggers/,
 `function pushEffect(s, tr, choice) { const targets = {}; if (tr.choiceType === 'enemyChampion')
    targets.champion = { player: other(tr.actor), champId: choice }; if (tr.choiceType === 'enemySoul')
    targets.color = choice; if (tr.choiceType === 'monsterUids')
    targets.monsterUid = choice; if (tr.choiceType === 'graveMonsterPow2')
    targets.graveMonsterId = choice; s.stack.push({ uid: uid(), kind: 'effect', actor: tr.actor, sourceCardId: tr.sourceCardId, effectId: tr.effectId, effectName: tr.effectName || 'Effetto', targets, meta: tr.meta || {} }); }
function prepareTriggers`,
 'push trigger effect'
);

patch(
 "const id = String(a.choice || a.monsterUid || a.champId || a.color || '');",
 "const id = String(a.choice || a.monsterUid || a.champId || a.color || a.graveMonsterId || '');",
 'trigger choice payload'
);

patch(
 "meta || {}; log(s, `Si risolve ${item.effectName || 'un effetto'}.`); switch (item.effectId) {",
 `meta || {}; log(s, \`Si risolve ${'${item.effectName || \'un effetto\'}'}.\`); switch (item.effectId) {
    case 'cervo_antico_pow': {
        const src = monster(s, m.sourceUid);
        if (src && src.cardId === 'cervo_antico') {
            src.tempPow = (src.tempPow || 0) + 1;
            log(s, 'Cervo Antico ottiene +1 POW fino alla fine del turno.');
        }
        break;
    }
    case 'enter_segugio_infernale':
        beginDamageEvent(s, null);
        for (const u of m.uids || [])
            if (monster(s, u)) damageMonster(s, null, u, 1, 'Segugio Infernale', false);
        endDamageEvent(s);
        break;
    case 'enter_drago_ceneri':
        beginDamageEvent(s, null);
        for (const u of s.board.monsters.filter((x) => x.uid !== m.sourceUid).map((x) => x.uid))
            if (monster(s, u)) damageMonster(s, null, u, 1, 'Drago delle Ceneri', false);
        endDamageEvent(s);
        break;
    case 'enter_golem_magmatico':
        for (const z of [1, 2])
            for (const c of pl(s, z)?.champions || [])
                if (!c.defeated) damageChampion(s, z, c.id, 1, 'Golem Magmatico');
        log(s, 'Golem Magmatico infligge 1 danno a tutti i Campioni.');
        break;
    case 'enter_cerbero': {
        const id = String(t.graveMonsterId || '');
        if (id && pl(s, p).monsterGrave.includes(id) && MONSTER_DEFS[id]?.pow === 2)
            reviveFromGrave(s, p, id);
        break;
    }
    case 'enter_divoratore_anime': {
        const src = monster(s, m.sourceUid);
        if (src) src.devouredColors = [];
        let killed = 0;
        for (const u of m.uids || []) {
            const victim = monster(s, u);
            if (!victim) continue;
            const color = MONSTER_DEFS[victim.cardId]?.color;
            killMonster(s, p, victim, 'Divoratore di Anime', false);
            if (src && color) src.devouredColors.push(color);
            killed++;
        }
        if (killed) log(s, \`Divoratore di Anime divora ${'${killed}'} Mostr${'${killed === 1 ? \'o\' : \'i\'}'}.\`);
        break;
    }`,
 'enter trigger resolution'
);

patch(
 /function provocationsAgainst\(s, p\) \{[\s\S]*?\}\nfunction validateAttackTarget/,
 `function provocationsAgainst(s, p) { const op = other(p); const ms = s.board.monsters.filter((m) => MONSTER_DEFS[m.cardId]?.provocazione).map((m) => ({ type: 'monster', uid: m.uid })); const cs = (pl(s, op)?.champions || []).filter((c) => !c.defeated && c.provocazione).map((c) => ({ type: 'champion', player: op, champId: c.id })); return [...ms, ...cs]; }\nfunction validateAttackTarget`,
 'global provocation monsters'
);

const mod=await import('data:text/javascript;charset=utf-8,'+encodeURIComponent(source));
const COLORS=['red','green','black','blue'];
function enforceSoulColorsOnPlayer(q:any){
 if(!q)return q;
 const allowed=new Set(Array.isArray(q.deckColors)&&q.deckColors.length?q.deckColors:(q.champions||[]).map((c:any)=>c?.color).filter(Boolean));
 q.souls ||= {};
 for(const c of COLORS){
  const n=Math.max(0,Number(q.souls[c]||0));
  q.souls[c]=allowed.has(c)?Math.min(3,n):0;
 }
 return q;
}
function enforceSoulColors(state:any){
 if(!state?.players)return state;
 enforceSoulColorsOnPlayer(state.players['1']);
 enforceSoulColorsOnPlayer(state.players['2']);
 return state;
}
export const CARD_DEFS=mod.CARD_DEFS;
export const MONSTER_DEFS=mod.MONSTER_DEFS;
export const CHAMPION_DEFS=mod.CHAMPION_DEFS;
export const DECK_RULES=mod.DECK_RULES;
export const STARTER_DECK=mod.STARTER_DECK;
export const STARTER_MONSTERS=mod.STARTER_MONSTERS;
export const newState=(name:any,deckConfig:any)=>enforceSoulColors(mod.newState(name,deckConfig));
export const newPlayer=(name:any,deckConfig:any)=>enforceSoulColorsOnPlayer(mod.newPlayer(name,deckConfig));
export const act=(state:any,p:any,move:any)=>enforceSoulColors(mod.act(enforceSoulColors(state),p,move));
export const publicView=(state:any,p:any)=>mod.publicView(enforceSoulColors(state),p);
