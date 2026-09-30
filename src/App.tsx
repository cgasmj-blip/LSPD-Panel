import { useEffect,useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase,signInDiscord,type Staff } from './lib/supabase'
import { Dashboard } from './pages/Dashboard'

export default function App(){
 const [session,setSession]=useState<Session|null>(null),[staff,setStaff]=useState<Staff|null>(null),[loading,setLoading]=useState(true)
 useEffect(()=>{supabase.auth.getSession().then(({data})=>setSession(data.session));const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>subscription.unsubscribe()},[])
 useEffect(()=>{if(!session){setStaff(null);setLoading(false);return} setLoading(true); supabase.from('staff').select('id,display_name,badge_number,rank,app_role,unit,duty_status').eq('auth_user_id',session.user.id).maybeSingle().then(({data})=>{setStaff(data as Staff|null);setLoading(false)})},[session])
 if(loading)return <div className="auth-screen"><div className="auth-card">Chargement du terminal…</div></div>
 if(!session)return <div className="auth-screen"><div className="auth-card"><b>LSPD MDT</b><h1>Mobile Data Terminal</h1><p>Accès réservé au personnel autorisé.</p><button className="quick" onClick={()=>void signInDiscord()}>SE CONNECTER AVEC DISCORD</button></div></div>
 if(!staff)return <div className="auth-screen"><div className="auth-card"><b>ACCÈS REFUSÉ</b><h1>Compte non autorisé</h1><p>Ton compte Discord est authentifié mais n'est pas encore associé à un profil LSPD.</p></div></div>
 return <Dashboard staff={staff}/>
}