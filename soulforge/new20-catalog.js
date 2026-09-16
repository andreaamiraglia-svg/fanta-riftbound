export const cards = [
 ['tesoro_del_sovrano','Tesoro del Sovrano','orange',1,'response','none','Pesca 3 carte dal tuo mazzo.','Magia'],
 ['araldo_dell_opulenza','Araldo dell’Opulenza','orange',1,'base','none','Ogni volta che peschi una carta, ottiene +1 POW fino alla fine del turno.','Supporto',0],
 ['angelo','Angelo','orange',2,'base','none','Quando entra in gioco, scegli e gioca una carta di costo 0 dal tuo mazzo, scegliendone i bersagli.','Supporto',2],
 ['furia_del_ferito_supporto','Furia del Ferito','orange',2,'base','none','Ogni volta che subisce danni e sopravvive, ottiene +2 POW fino alla fine del turno.','Supporto',2],
 ['guerriero_di_bronzo','Guerriero di Bronzo','orange',3,'base','none','Quando entra in gioco, evoca dalla tua mano un Supporto di costo 2 e uno di costo 1.','Supporto',1],
 ['viaggiatore_smarrito','Viaggiatore Smarrito','orange',4,'base','none','Costa 1 anima in meno per ogni carta che hai in più in mano rispetto all’avversario.','Supporto',2],
 ['munizioni_d_emergenza','Munizioni d’Emergenza','red',0,'base','monsterDiscard','Come costo aggiuntivo, scarta 1 carta dalla tua mano. Infliggi 3 danni a un Mostro.','Magia']
].map(([id,name,color,cost,speed,target,text,type,basePow])=>({id,name,color,cost,speed,target,text,type,basePow,hp:type==='Supporto'?1:undefined,effect:'new20_'+id,art:id.replaceAll('_','-')+'.webp'}));
export const monsters = [
 ['demone_della_fornace','Demone della Fornace','red',2,'I Campioni hanno Carica 1.'],
 ['pappagallo_pirata','Pappagallo Pirata','red',3,'Quando entra in gioco, infligge 1 danno a se stesso.'],
 ['viverna','Viverna','red',3,'All’apertura di ogni combattimento, mette in pila un effetto che infligge 1 danno all’attaccante e al difensore.'],
 ['mantide_della_giungla','Mantide della Giungla','green',2,'Non può essere scelta come bersaglio dalle Magie.'],
 ['tartaruga_delle_radici','Tartaruga delle Radici','green',3,'Quando entra in gioco, fornisce +2 POW fino alla fine del turno a tutti i Mostri con 2 POW o meno.'],
 ['idra_della_palude','Idra della Palude','green',3,'Quando un Campione ottiene armatura tramite una Magia, infligge 1 danno a quel Campione.'],
 ['ragno_dei_cadaveri','Ragno dei Cadaveri','black',3,'Quando entra in gioco, ogni giocatore sceglie una carta dal proprio Cimitero e la riprende in mano.'],
 ['tritone_del_gelo','Tritone del Gelo','blue',3,'Quando un Campione ottiene armatura tramite una Magia, ottiene 1 Armatura aggiuntiva.'],
 ['serpente_glaciale','Serpente Glaciale','blue',3,'Quando entra in gioco, riduce di 1 il POW dei Mostri adiacenti fino alla fine del turno.'],
 ['granchio_degli_abissi','Granchio degli abissi','blue',3,'Tutti i Mostri con armatura hanno Provocazione.'],
 ['cobra_reale','Cobra Reale','orange',3,'I Campioni del giocatore con più carte in mano non possono subire danni.'],
 ['sfinge_dell_alba','Sfinge dell’Alba','orange',4,'Quando entra in gioco, ogni giocatore pesca 1 carta.'],
 ['serafino_guardiano','Serafino Guardiano','orange',4,'Quando entra in gioco, fornisce Provocazione al Mostro alla sua sinistra fino alla fine del turno.']
].map(([id,name,color,pow,text])=>({id,name,color,pow,text,art:id.replaceAll('_','-')+'.webp'}));
