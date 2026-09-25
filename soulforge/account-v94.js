import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const SUPABASE_URL='https://gmunayvayjzzyrigaesx.supabase.co';
const SUPABASE_KEY='sb_publishable_fxZLiURzemtWXCWH2u3UKg_HHEniiMT';
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY,{
 auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
});

const STYLE=`
.sf-home-header{position:relative}
.sf-account-slot{display:flex;align-items:center;margin-left:auto;padding-left:18px}
.sf-account-button{display:flex;align-items:center;gap:9px;min-height:40px;padding:8px 13px;border:1px solid #423638;border-radius:8px;background:#1b1b1c;color:#f7f7f8;font:750 14px/1 system-ui,sans-serif;cursor:pointer;white-space:nowrap}
.sf-account-button:hover{background:#292224;border-color:#87444a}
.sf-account-button.signed-in{border-color:#6f3a3f;background:#251b1d}
.sf-account-avatar{display:grid;place-items:center;width:25px;height:25px;border-radius:50%;background:#a83d45;color:#fff;font-size:12px;font-weight:900;text-transform:uppercase}
.sf-auth-overlay{position:fixed;inset:0;z-index:30000;display:grid;place-items:center;padding:18px;background:#000c;backdrop-filter:blur(5px)}
.sf-auth-dialog{position:relative;width:min(460px,100%);border:1px solid #393a40;border-radius:16px;background:#17181b;color:#f4f4f6;box-shadow:0 28px 90px #000b;padding:28px;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.sf-auth-close{position:absolute;right:15px;top:13px;width:34px;height:34px;border:0;border-radius:50%;background:transparent;color:#aaa;font-size:27px;line-height:1;cursor:pointer}
.sf-auth-close:hover{background:#2b2c30;color:#fff}
.sf-auth-brand{color:#dfe967;font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
.sf-auth-dialog h2{margin:8px 0 5px;font-size:30px;letter-spacing:-.03em}
.sf-auth-subtitle{margin:0 0 22px;color:#9da0a8;font-size:14px;line-height:1.45}
.sf-auth-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:5px;border-radius:10px;background:#101114;margin-bottom:20px}
.sf-auth-tab{border:0;border-radius:7px;background:transparent;color:#91949b;padding:10px;font-weight:800;cursor:pointer}
.sf-auth-tab.active{background:#292a2f;color:#fff}
.sf-auth-form{display:grid;gap:13px}
.sf-auth-field{display:grid;gap:7px;color:#dfe1e5;font-size:13px;font-weight:750}
.sf-auth-field input{width:100%;min-height:46px;border:1px solid #3a3c43;border-radius:8px;background:#202126;color:#fff;padding:10px 12px;font:inherit;outline:0}
.sf-auth-field input:focus{border-color:#b84b54;box-shadow:0 0 0 3px #b84b5425}
.sf-auth-submit{min-height:47px;border:1px solid #c9525b;border-radius:9px;background:#a93e46;color:white;font-weight:900;cursor:pointer;margin-top:5px}
.sf-auth-submit:hover{background:#c04852}.sf-auth-submit:disabled{opacity:.55;cursor:wait}
.sf-auth-message{display:none;margin:0 0 15px;padding:11px 12px;border:1px solid #844148;border-radius:8px;background:#361d20;color:#ffd7da;font-size:13px;line-height:1.4}
.sf-auth-message.show{display:block}.sf-auth-message.ok{border-color:#397657;background:#162d23;color:#c9f5de}
.sf-auth-account{display:grid;gap:14px}.sf-auth-account-card{display:flex;align-items:center;gap:13px;padding:16px;border:1px solid #35373d;border-radius:10px;background:#202126}
.sf-auth-account-card .sf-account-avatar{width:42px;height:42px;font-size:18px}.sf-auth-account-card strong,.sf-auth-account-card small{display:block}.sf-auth-account-card small{color:#9a9da5;margin-top:5px}
.sf-auth-secondary{min-height:44px;border:1px solid #3d3f46;border-radius:8px;background:#25262b;color:#eee;font-weight:800;cursor:pointer}
.sf-auth-secondary:hover{background:#303137}
.sf-account-locked{padding-right:34px!important;background-image:linear-gradient(45deg,transparent 50%,#777 50%)!important}
@media(max-width:720px){.sf-home-header{gap:16px!important;padding-left:12px!important;padding-right:12px!important}.sf-account-slot{padding-left:0}.sf-account-button{padding:8px 10px}.sf-account-button .sf-account-label{display:none}.sf-auth-dialog{padding:24px 18px}.sf-home-header nav{gap:18px!important}}
`;

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const friendlyError=error=>{
 const value=String(error?.message||error||'Errore sconosciuto.');
 if(/invalid login credentials/i.test(value))return 'Email o password non corretti.';
 if(/email not confirmed/i.test(value))return 'Conferma prima il tuo indirizzo email.';
 if(/user already registered/i.test(value))return 'Esiste già un account con questa email.';
 if(/password/i.test(value)&&/least/i.test(value))return 'La password deve contenere almeno 8 caratteri.';
 if(/rate limit/i.test(value))return 'Hai effettuato troppi tentativi. Riprova tra poco.';
 return value;
};

let currentUser=null;
let currentMode='login';
let authBusy=false;

function displayName(user=currentUser){
 return String(user?.user_metadata?.display_name||user?.user_metadata?.name||user?.email?.split('@')[0]||'Giocatore').trim().slice(0,24);
}

function injectStyle(){
 if(document.getElementById('sfAccount94Style'))return;
 const style=document.createElement('style');style.id='sfAccount94Style';style.textContent=STYLE;document.head.append(style);
}

function renderAccountButton(){
 const header=document.querySelector('.sf-home-header');
 if(!header)return;
 let slot=header.querySelector('.sf-account-slot');
 if(!slot){slot=document.createElement('div');slot.className='sf-account-slot';header.append(slot)}
 const name=displayName();
 const key=currentUser?'user:'+String(currentUser.id)+':'+name:'guest';
 if(slot.dataset.authKey===key)return;
 slot.dataset.authKey=key;
 slot.innerHTML=currentUser
  ?`<button class="sf-account-button signed-in" type="button" data-sf-account><span class="sf-account-avatar">${esc(name.charAt(0)||'G')}</span><span class="sf-account-label">${esc(name)}</span></button>`
  :'<button class="sf-account-button" type="button" data-sf-account><span class="sf-account-avatar">+</span><span class="sf-account-label">Login / Sign up</span></button>';
 slot.querySelector('[data-sf-account]')?.addEventListener('click',()=>openAuth(currentUser?'account':'login'));
}

function applyPlayerIdentity(){
 for(const input of document.querySelectorAll('#createName,#joinName')){
  if(currentUser){
   const name=displayName();if(input.value!==name)input.value=name;
   input.readOnly=true;input.classList.add('sf-account-locked');input.title='Nome collegato al tuo account';
  }else if(input.classList.contains('sf-account-locked')){
   input.readOnly=false;input.classList.remove('sf-account-locked');input.removeAttribute('title');
  }
 }
}

function maintainUi(){renderAccountButton();applyPlayerIdentity()}

function message(text='',ok=false){
 const box=document.querySelector('.sf-auth-message');if(!box)return;
 box.textContent=text;box.classList.toggle('show',!!text);box.classList.toggle('ok',!!ok);
}

function authContent(mode){
 if(mode==='account'&&currentUser){const name=displayName();return `
  <div class="sf-auth-brand">Champion of the Souls</div><h2>Il tuo account</h2><p class="sf-auth-subtitle">Il nome dell’account viene usato automaticamente nelle partite.</p>
  <div class="sf-auth-account"><div class="sf-auth-account-card"><span class="sf-account-avatar">${esc(name.charAt(0)||'G')}</span><div><strong>${esc(name)}</strong><small>${esc(currentUser.email||'')}</small></div></div><button class="sf-auth-secondary" type="button" data-sf-logout>Esci dall’account</button></div>`}
 const signup=mode==='signup';return `
  <div class="sf-auth-brand">Champion of the Souls</div><h2>${signup?'Crea il tuo account':'Bentornato'}</h2><p class="sf-auth-subtitle">${signup?'Salva la tua identità di gioco e accedi da qualsiasi dispositivo.':'Accedi per usare il tuo nome giocatore.'}</p>
  <div class="sf-auth-tabs"><button class="sf-auth-tab ${signup?'':'active'}" type="button" data-sf-mode="login">Login</button><button class="sf-auth-tab ${signup?'active':''}" type="button" data-sf-mode="signup">Sign up</button></div>
  <div class="sf-auth-message" role="status"></div>
  <form class="sf-auth-form" data-sf-auth-form>
   ${signup?'<label class="sf-auth-field">Nome giocatore<input name="displayName" minlength="3" maxlength="24" autocomplete="nickname" required></label>':''}
   <label class="sf-auth-field">Email<input name="email" type="email" autocomplete="email" required></label>
   <label class="sf-auth-field">Password<input name="password" type="password" minlength="8" autocomplete="${signup?'new-password':'current-password'}" required></label>
   ${signup?'<label class="sf-auth-field">Conferma password<input name="confirmPassword" type="password" minlength="8" autocomplete="new-password" required></label>':''}
   <button class="sf-auth-submit" type="submit">${signup?'Crea account':'Accedi'}</button>
  </form>`;
}

function openAuth(mode='login'){
 currentMode=mode;
 document.querySelector('.sf-auth-overlay')?.remove();
 const overlay=document.createElement('div');overlay.className='sf-auth-overlay';
 overlay.innerHTML=`<section class="sf-auth-dialog" role="dialog" aria-modal="true" aria-label="Account"><button class="sf-auth-close" type="button" aria-label="Chiudi">×</button>${authContent(mode)}</section>`;
 document.body.append(overlay);document.body.style.overflow='hidden';
 overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('.sf-auth-close'))closeAuth()});
 overlay.querySelectorAll('[data-sf-mode]').forEach(button=>button.addEventListener('click',()=>openAuth(button.dataset.sfMode)));
 overlay.querySelector('[data-sf-auth-form]')?.addEventListener('submit',submitAuth);
 overlay.querySelector('[data-sf-logout]')?.addEventListener('click',logout);
 setTimeout(()=>overlay.querySelector('input')?.focus(),0);
}

function closeAuth(){document.querySelector('.sf-auth-overlay')?.remove();document.body.style.overflow=''}

async function submitAuth(event){
 event.preventDefault();if(authBusy)return;
 const form=event.currentTarget,data=new FormData(form),email=String(data.get('email')||'').trim(),password=String(data.get('password')||''),button=form.querySelector('button[type="submit"]');
 if(currentMode==='signup'){
  const name=String(data.get('displayName')||'').trim(),confirm=String(data.get('confirmPassword')||'');
  if(name.length<3)return message('Il nome giocatore deve contenere almeno 3 caratteri.');
  if(password!==confirm)return message('Le due password non coincidono.');
 }
 authBusy=true;button.disabled=true;button.textContent=currentMode==='signup'?'Creazione…':'Accesso…';message('');
 try{
  if(currentMode==='signup'){
   const name=String(data.get('displayName')||'').trim().slice(0,24);
   const {data:result,error}=await supabase.auth.signUp({email,password,options:{data:{display_name:name},emailRedirectTo:location.origin+location.pathname}});
   if(error)throw error;
   if(result.session){currentUser=result.user;closeAuth();maintainUi()}
   else{form.hidden=true;message('Account creato. Controlla la tua email e apri il link di conferma, poi potrai effettuare il login.',true)}
  }else{
   const {data:result,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;
   currentUser=result.user;closeAuth();maintainUi();
  }
 }catch(error){message(friendlyError(error))}
 finally{authBusy=false;if(button?.isConnected){button.disabled=false;button.textContent=currentMode==='signup'?'Crea account':'Accedi'}}
}

async function logout(){
 if(authBusy)return;authBusy=true;
 try{const {error}=await supabase.auth.signOut();if(error)throw error;currentUser=null;closeAuth();maintainUi()}
 catch(error){message(friendlyError(error))}
 finally{authBusy=false}
}

document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.querySelector('.sf-auth-overlay'))closeAuth()});
const observer=new MutationObserver(()=>maintainUi());

async function init(){
 injectStyle();observer.observe(document.body,{childList:true,subtree:true});
 const {data}=await supabase.auth.getSession();currentUser=data.session?.user||null;maintainUi();
 supabase.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;queueMicrotask(maintainUi)});
}

window.sfAccount={open:openAuth,close:closeAuth,getUser:()=>currentUser,getDisplayName:()=>currentUser?displayName():null};
init().catch(error=>console.error('Account setup:',error));
