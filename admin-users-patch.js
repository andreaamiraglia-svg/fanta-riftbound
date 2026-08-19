async function adminUsersRpc(fn,args={}){
  const r=await fetch(U+'/rest/v1/rpc/'+fn,{method:'POST',headers:{'content-type':'application/json','apikey':K},body:JSON.stringify({...args,p_token:localStorage.fr_session||null})});
  const x=await r.json();
  if(!r.ok) throw Error(x.message||'Errore di rete');
  if(+x.status>=400) throw Error(x.data?.error||'Errore');
  return x.data;
}

async function loadAdminUsers(){
  if(D?.user?.role!=='admin') return [];
  try{return (await adminUsersRpc('admin_list_users')).users||[]}catch(x){console.error(x);return []}
}

async function grantAdminUser(id,username){
  if(!confirm(`Rendere ${username} amministratore?`)) return;
  try{
    await adminUsersRpc('admin_grant_admin',{p_target_user_id:id});
    alert(`${username} ora è admin.`);
    await load();
    admin();
  }catch(x){alert(x.message)}
}

(()=>{
  const baseAdmin=admin;
  admin=async function(){
    await baseAdmin();
    if(D?.user?.role!=='admin') return;
    const users=await loadAdminUsers();
    const grid=document.querySelector('.adminGrid');
    if(!grid||document.querySelector('#adminUsersPanel')) return;
    const section=document.createElement('section');
    section.className='panel full';
    section.id='adminUsersPanel';
    section.innerHTML=`<h2>Amministratori</h2><p class="muted" style="margin-top:-6px">Gli admin possono promuovere altri utenti ad admin.</p><div class="table"><table><thead><tr><th>Utente</th><th>Ruolo</th><th>Azione</th></tr></thead><tbody>${users.map(u=>`<tr><td><b>${e(u.username)}</b></td><td>${u.role==='admin'?'<span class="pts">ADMIN</span>':'Utente'}</td><td>${u.role==='admin'?'<span class="muted">Già admin</span>':`<button class="btn alt" onclick="grantAdminUser('${u.id}','${String(u.username).replace(/\\/g,'\\\\').replace(/'/g,"\\'")}')">Rendi admin</button>`}</td></tr>`).join('')}</tbody></table></div>`;
    grid.appendChild(section);
  };
})();
