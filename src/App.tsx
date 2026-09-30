import {useEffect,useState} from 'react'
import type {Session} from '@supabase/supabase-js'
import {supabase,signInDiscord,type Staff} from './lib/supabase'
import {Dashboard} from './pages/Dashboard'
import {Recruitment} from './pages/Recruitment'
import {Appointment} from './pages/Appointment'
import {Regulations} from './pages/Regulations'
import {VehicleAssignments} from './pages/VehicleAssignments'
import {RadioCommunication} from './pages/RadioCommunication'
const fields='id,display_name,badge_number,rank,app_role,divisions,active'
const logo='https://cdn.picflow.com/assets/images/proxy/full/13da8b62-5943-40f5-9872-a24bd5cbb7f1.webp'
type PublicContent={id:string;content_type:'regulation'|'information'|'announcement';title:string;body:string}
export default function App(){
 const [session,setSession]=useState<Session|null>(null),[staff,setStaff]=useState<Staff|null>(null),[loading,setLoading]=useState(true),[checking,setChecking]=useState(false),[error,setError]=useState(''),[view,setView]=useState<'home'|'regulation'|'vehicles'|'radio'|'appointment'|'information'>('home'),[content,setContent]=useState<PublicContent[]>([]),[intent,setIntent]=useState<'recruitment'|'appointment'|null>(()=>sessionStorage.getItem('public-intent') as 'recruitment'|'appointment'|null)
 useEffect(()=>{supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false)});const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>subscription.unsubscribe()},[])
 useEffect(()=>{void supabase.from('public_content').select('id,content_type,title,body').eq('published',true).order('sort_order').then(({data})=>setContent((data??[]) as PublicContent[]))},[])
 async function personnel(){if(!session){await signInDiscord();return}setChecking(true);setError('');try{if(!session.provider_token){await supabase.auth.signOut({scope:'local'});await signInDiscord();return}const {data:sync,error:e}=await supabase.functions.invoke('sync-discord-access',{body:{provider_token:session.provider_token}});if(e||!sync?.authorized){setError(sync?.error==='panel_role_required'?'Ce compte ne possède pas l’autorisation personnel LSPD requise.':'La vérification d’accès a échoué.');return}const r=await supabase.from('staff').select(fields).eq('auth_user_id',session.user.id).maybeSingle();setStaff(r.data as Staff|null)}finally{setChecking(false)}}
 if(intent==='recruitment'&&session)return <Recruitment session={session} onBack={()=>{sessionStorage.removeItem('public-intent');setIntent(null)}}/>
 if(intent==='appointment'&&session)return <Appointment session={session} onBack={()=>{sessionStorage.removeItem('public-intent');setIntent(null);setView('home')}}/>
 if(staff)return <Dashboard staff={staff}/>
 if(view==='regulation')return <Regulations onBack={()=>setView('home')} onVehicles={()=>setView('vehicles')} onRadio={()=>setView('radio')}/>
 if(view==='vehicles')return <VehicleAssignments onBack={()=>setView('regulation')}/>
 if(view==='radio')return <RadioCommunication onBack={()=>setView('regulation')}/>
 if(view==='appointment'&&session)return <Appointment session={session} onBack={()=>setView('home')}/>
 if(loading)return <div className="auth-screen"><div className="auth-card">Chargement du portail…</div></div>
 const shown=view==='home'?content.filter(x=>x.content_type==='announcement'||x.content_type==='information'):content.filter(x=>x.content_type==='information')
 return <div className="public-mdt">
  <header className="public-top"><div className="public-brand"><img src={logo} alt="LSPD"/><div><b>LOS SANTOS POLICE DEPARTMENT</b><small>PUBLIC ACCESS TERMINAL</small></div></div><button onClick={()=>void personnel()}>{checking?'VÉRIFICATION…':'CONNEXION PERSONNEL LSPD'}</button></header>
  <main className="public-wrap">
   <section className="public-hero"><div><p>LOS SANTOS POLICE DEPARTMENT</p><h1>Servir. Protéger. Informer.</h1><span>Portail public officiel du département. Effectuez vos démarches et consultez les communications du LSPD depuis un point d'accès unique.</span></div><img src={logo} alt="Emblème LSPD"/></section>
   <section className="public-actions">
    <button onClick={()=>{sessionStorage.setItem('public-intent','recruitment');setIntent('recruitment');if(!session)void signInDiscord()}}><b>POSTULER</b><span>Déposer une candidature au LSPD.</span></button>
    <button onClick={()=>{sessionStorage.setItem('public-intent','appointment');setIntent('appointment');if(!session)void signInDiscord()}}><b>PRENDRE RENDEZ-VOUS</b><span>Préparer une demande de rendez-vous.</span></button>
    <button onClick={()=>setView('regulation')}><b>RÈGLEMENT</b><span>Consulter les règles et procédures publiques.</span></button>
    <button onClick={()=>setView('information')}><b>INFORMATIONS</b><span>Communiqués, affichages et informations complémentaires.</span></button>
   </section>
   {error&&<div className="public-alert">{error}</div>}
   <section className="public-feed"><div className="public-section-title"><b>{view==='home'?'INFORMATIONS OFFICIELLES':'INFORMATIONS & AFFICHAGES'}</b>{view!=='home'&&<button onClick={()=>setView('home')}>RETOUR À L'ACCUEIL</button>}</div>
    <div className="public-cards">{shown.length?shown.map(x=><article key={x.id}><small>{x.content_type}</small><h2>{x.title}</h2><p>{x.body}</p></article>):<div className="public-empty">Aucun contenu publié pour le moment.</div>}</div>
   </section>
  </main><footer className="public-footer">LSPD • MOBILE DATA TERMINAL • PUBLIC ACCESS</footer>
 </div>
}