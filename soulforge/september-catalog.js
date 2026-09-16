export const cards = [
 ['pelle_di_quercia_antica','Pelle di Quercia Antica','green',3,'instant','own','Un tuo Campione non può subire danni per questo turno.'],
 ['ira_del_sottobosco','Ira del Sottobosco','green',2,'base','monsters','Infliggi 3 danni a fino a 3 Mostri diversi.'],
 ['patto_della_foresta','Patto della Foresta','green',2,'base','ownMonster','Un Mostro proveniente dal tuo Monster Deck diventa un tuo Supporto attivo con 1 HP. Mantiene POW, effetti, bonus, malus e danni.'],
 ['colpo_al_cuore','Colpo al Cuore','red',2,'base','enemyChampion','Scegli un Campione nemico. La prima volta che subisce una Ferita in questo turno ne subisce un’altra.'],
 ['linfa_vitale','Linfa vitale','green',0,'instant','own','Cura 2 danni a un tuo Campione.'],
 ['furia_della_selva','Furia della Selva','green',1,'base','enemyChampion','Evoca il Mostro in cima al tuo Monster Deck: attacca il Campione nemico scelto.'],
 ['furia_del_ferito','Furia del Ferito','red',3,'response','own','Per questo turno, ogni volta che il tuo Campione scelto subisce danni e sopravvive, si attiva.'],
 ['sigillo_dell_oblio','Sigillo dell’Oblio','black',0,'base','monster','Infliggi 1 danno a un Mostro. Se muore durante questo turno non fornisce anime.'],
 ['scaglie_di_gelo','Scaglie di Gelo','blue',0,'base','monster','Fornisci 3 Armatura a un Mostro per questo turno.'],
 ['fortezza_di_cristallo','Fortezza di Cristallo','blue',1,'base','character','Raddoppia l’Armatura di un Personaggio per questo turno.'],
 ['respiro_dell_inverno','Respiro dell’Inverno','blue',1,'base','zeroChampion','Infliggi 1 Ferita a un Campione con 0 POW o meno.'],
 ['riflesso_polare','Riflesso Polare','blue',1,'base','reflection','Scegli un tuo Campione. Infliggi a un nemico danni pari alla sua Armatura.'],
 ['stasi_del_leviatano','Stasi del Leviatano','blue',2,'instant','own','Imposta a 0 il POW di un tuo Campione e forniscigli 10 Armatura per questo turno.'],
 ['morsa_dell_inverno','Morsa dell’Inverno','blue',2,'instant','enemy','Imposta a 2 il POW di un nemico per questo turno.'],
 ['distruttore_dell_oscurita','Distruttore dell’Oscurità','blue',3,'instant','spell','Annulla l’effetto di una Magia.'],
 ['egida_d_acciaio','Egida D’acciaio','orange',0,'base','character','Fornisci 2 Armatura a un Personaggio per questo turno.'],
 ['stendardi_della_legione_dorata','Stendardi della Legione Dorata','orange',0,'base','own','Fornisci Contrattacco a un tuo Campione per questo turno.'],
 ['carica_degli_impavidi','Carica degli Impavidi','orange',0,'base','none','Fornisci Carica 1 a tutti i tuoi Supporti per questo turno.']
].map(([id,name,color,cost,speed,target,text])=>({id,name,color,cost,speed,target,text,type:'Magia',effect:'september_'+id,art:id.replaceAll('_','-')+'.webp'}));
export const monsters=[
 {id:'vampiro',name:'Vampiro',color:'black',pow:3,text:'Quando entra in gioco uccide il Mostro alla sua destra.',art:'vampiro.webp'},
 {id:'abominio_ricucito',name:'Abominio Ricucito',color:'black',pow:3,text:'Quando un altro Mostro muore, fornisce +1 POW a tutti gli altri Mostri per questo turno.',art:'abominio-ricucito.webp'}
];
