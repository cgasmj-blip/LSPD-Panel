import type {Staff} from '../lib/supabase'
import {signOut} from '../lib/supabase'
import {LogOut,Shield} from 'lucide-react'
export function Dashboard({staff}:{staff:Staff}){
 return <div className="portal">
  <header className="portal-top"><div className="wordmark"><span className="mini-shield"><Shield size={16}/></span><div><b>LSPD</b><small>PORTAIL INTERNE</small></div></div><nav><button className="active">ACCUEIL</button></nav><button className="logout" onClick={()=>void signOut()}><LogOut size={14}/> Déconnexion</button></header>
  <div className="portal-layout">
   <aside className="profile-card"><div className="avatar">LSPD</div><h2>{staff.display_name}</h2><p>{staff.rank}</p><dl><dt>Grade</dt><dd>{staff.rank}</dd><dt>Division(s)</dt><dd>{staff.divisions?.length?staff.divisions.join(' · '):'Aucune'}</dd><dt>Accès</dt><dd><span className="tag green">AUTORISÉ</span></dd></dl></aside>
   <main className="portal-main"><section className="hero-mdt"><div><p className="kicker">LOS SANTOS POLICE DEPARTMENT</p><h1>Nouveau MDT</h1><p>Le socle a été remis à zéro. L’authentification et les rôles Discord sont conservés ; les nouveaux modules seront reconstruits proprement à partir d’ici.</p></div><Shield size={52}/></section>
   <section className="section"><div className="section-title"><b>SYSTÈME</b></div><div className="section-body"><div className="content-grid"><article className="content-card"><small>DISCORD</small><h3>Connexion opérationnelle</h3><p>Identité, grade et divisions sont synchronisés depuis Discord.</p></article><article className="content-card"><small>MDT</small><h3>Base propre</h3><p>Aucun ancien module de service, unité, véhicule, formulaire ou archive n’est chargé.</p></article></div></div></section>
   </main>
  </div>
 </div>
}