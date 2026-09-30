import {useEffect,useState} from 'react'
import type {Session} from '@supabase/supabase-js'
import {supabase,signInDiscord,type Staff} from './lib/supabase'
import {Dashboard} from './pages/Dashboard'
const fields='id,display_name,badge_number,rank,app_role,divisions,active'
export default function App(){
 const [session,setSession]=useState<Session|null>(null),[staff,setStaff]=useState<Staff|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('')
 useEffect(()=>{supabase.auth.getSession().then(({data})=>setSession(data.session));const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>subscription.unsubscribe()},[])
 useEffect(()=>{let dead=false;(async()=>{if(!session){setStaff(null);setLoading(false);return}setLoading(true);setError('');try{
  if(!session.provider_token){setError('Réautorise Discord pour vérifier ton accès LSPD.');return}
  const {data:sync,error:e}=await supabase.functions.invoke('sync-discord-access',{body:{provider_token:session.provider_token}})
  if(e||!sync?.authorized){setError(sync?.error==='panel_role_required'?'Ton compte Discord ne possède pas le rôle LSPD requis.':'La vérification Discord a échoué.');return}
  const r=await supabase.from('staff').select(fields).eq('auth_user_id',session.user.id).maybeSingle()
  if(!dead)setStaff(r.data as Staff|null)
 }finally{if(!dead)setLoading(false)}})();return()=>{dead=true}},[session])
 if(loading)return <div className="auth-screen"><div className="auth-card">Vérification Discord…</div></div>
 if(!session)return <div className="auth-screen"><div className="auth-card"><b>LSPD MDT</b><h1>Portail interne</h1><p>Accès réservé au personnel autorisé.</p><button className="quick" onClick={()=>void signInDiscord()}>SE CONNECTER AVEC DISCORD</button></div></div>
 if(!staff)return <div className="auth-screen"><div className="auth-card"><b>ACCÈS REFUSÉ</b><h1>Compte non autorisé</h1><p>{error}</p><button className="quick" onClick={async()=>{await supabase.auth.signOut({scope:'local'});await signInDiscord()}}>REVÉRIFIER AVEC DISCORD</button></div></div>
 return <Dashboard staff={staff}/>
}