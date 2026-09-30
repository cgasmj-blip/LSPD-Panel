import { useEffect,useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase,signInDiscord,type Staff } from './lib/supabase'
import { Dashboard } from './pages/Dashboard'

const staffFields='id,display_name,badge_number,rank,app_role,unit,duty_status'

export default function App(){
 const [session,setSession]=useState<Session|null>(null),[staff,setStaff]=useState<Staff|null>(null),[loading,setLoading]=useState(true),[authError,setAuthError]=useState('')
 useEffect(()=>{supabase.auth.getSession().then(({data})=>setSession(data.session));const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>subscription.unsubscribe()},[])
 useEffect(()=>{let cancelled=false;async function load(){if(!session){setStaff(null);setLoading(false);return}setLoading(true);setAuthError('');try{
   if(session.provider_token){
    const {data:sync,error}=await supabase.functions.invoke('sync-discord-access',{body:{provider_token:session.provider_token}})
    if(error||!sync?.authorized){if(!cancelled)setAuthError(sync?.error==='panel_role_required'?'Ton compte Discord ne possède pas le rôle d’accès au panel.':'La vérification Discord a échoué. Clique sur REVÉRIFIER AVEC DISCORD.');return}
   }else{
    const existing=await supabase.from('staff').select(staffFields).eq('auth_user_id',session.user.id).maybeSingle()
    if(existing.data){if(!cancelled)setStaff(existing.data as Staff);return}
    if(!cancelled)setAuthError('Discord doit être réautorisé pour vérifier ton rôle LSPD.');return
   }
   const result=await supabase.from('staff').select(staffFields).eq('auth_user_id',session.user.id).maybeSingle()
   if(!cancelled){setStaff(result.data as Staff|null);if(!result.data)setAuthError('Profil LSPD non créé après la vérification Discord.')}
  }finally{if(!cancelled)setLoading(false)}}void load();return()=>{cancelled=true}},[session])
 if(loading)return <div className="auth-screen"><div className="auth-card">Vérification de ton accès Discord…</div></div>
 if(!session)return <div className="auth-screen"><div className="auth-card"><b>LSPD MDT</b><h1>Mobile Data Terminal</h1><p>Accès réservé au personnel autorisé.</p><button className="quick" onClick={()=>void signInDiscord()}>SE CONNECTER AVEC DISCORD</button></div></div>
 if(!staff)return <div className="auth-screen"><div className="auth-card"><b>ACCÈS REFUSÉ</b><h1>Compte non autorisé</h1><p>{authError||"Ton compte Discord ne possède pas l'accès LSPD requis."}</p><button className="quick" onClick={async()=>{await supabase.auth.signOut();await signInDiscord()}}>REVÉRIFIER AVEC DISCORD</button></div></div>
 return <Dashboard staff={staff}/>
}
