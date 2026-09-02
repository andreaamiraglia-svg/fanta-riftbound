(()=>{
// v43 disattivato: il wrapping di render poteva entrare in conflitto con i wrapper
// asincroni dell'interfaccia Blu e bloccare il main thread durante il combattimento.
document.getElementById('sfCombatPriorityHint43')?.remove();
})();
