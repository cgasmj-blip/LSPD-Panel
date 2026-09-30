import { useState } from 'react'
import { BadgeAlert, Car, FileText, Radio, Search, Shield, Siren, UserRoundSearch, Users, LogOut, ChevronRight } from 'lucide-react'

const stats = [
  ['Agents', '1', Users], ['Véhicules', '0', Car], ['Mandats', '0', BadgeAlert],
  ['BOLO', '0', Siren], ['Rapports', '0', FileText], ['Unités', '0', Radio],
] as const

const modules = [
  ['Citoyens', 'Identités, antécédents et dossiers', UserRoundSearch],
  ['Los Santos Police Department', 'Effectifs, unités et administration', Shield],
  ['Véhicules', 'Plaques, propriétaires et signalements', Car],
] as const

export function Dashboard() {
  const [query, setQuery] = useState('')
  return <div className="mdt">
    <header className="topbar">
      <div className="wordmark"><span className="mini-shield"><Shield size={16}/></span><div><b>LSPD MDT</b><small>MOBILE DATA TERMINAL</small></div></div>
      <div className="searchbar"><select aria-label="Type de recherche"><option>Recherche globale</option><option>Citoyen</option><option>Plaque</option><option>Rapport</option></select><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un nom, une plaque, un dossier..."/><button><Search size={15}/> RECHERCHER</button></div>
      <button className="logout"><LogOut size={14}/> Déconnexion</button>
    </header>

    <div className="mdt-grid">
      <aside className="left-rail">
        <Panel title="PROFIL OPÉRATEUR">
          <div className="operator"><div className="avatar">DEV</div><div><b>Développeur</b><small>Accès permanent</small><span className="tag green">AUTORISÉ</span></div></div>
          <div className="dept-card active"><Shield size={25}/><div><b>LOS SANTOS PD</b><small>Administration système</small><div><span className="tag">DEV</span><span className="tag">ADMIN</span></div></div></div>
        </Panel>
        <Panel title="AFFECTATION PRINCIPALE"><RailItem icon={<Shield/>} title="Los Santos PD" sub="Administration · Développeur"/></Panel>
        <Panel title="OUTILS"><Nav label="Citoyens"/><Nav label="Effectifs"/><Nav label="Rapports"/><Nav label="Véhicules"/></Panel>
        <Panel title="ADMINISTRATION"><Nav label="Gestion des membres"/><Nav label="Grades & permissions"/><Nav label="Paramètres LSPD"/></Panel>
      </aside>

      <main className="main">
        <section className="hero-mdt">
          <div><p className="kicker">TABLEAU DE BORD <span className="tag">BETA</span></p><h1>Mobile Data Terminal</h1><p>Centre de commandement LSPD pour les agents, véhicules, mandats, signalements et rapports.</p></div>
          <div className="dept-summary"><Shield size={42}/><div><small>DÉPARTEMENT PRINCIPAL</small><b>LOS SANTOS PD</b><span>Los Santos, San Andreas</span></div></div>
        </section>

        <section className="stats">{stats.map(([label,value,Icon])=><div className="stat" key={label}><Icon size={15}/><strong>{value}</strong><span>{label}</span></div>)}</section>

        <Section title="TERMINAUX & MODULES">
          <div className="module-grid">{modules.map(([title,sub,Icon])=><button className="module" key={title}><span className="module-icon"><Icon size={20}/></span><span><b>{title}</b><small>{sub}</small><i>OUVRIR</i></span></button>)}</div>
        </Section>

        <div className="three-cols">
          <Section title="MANDATS ACTIFS" badge="0"><Empty text="Aucun mandat actif."/></Section>
          <Section title="BOLO ACTIFS" badge="0"><Empty text="Aucun signalement actif."/></Section>
          <Section title="CONTRAVENTIONS RÉCENTES" badge="0"><Empty text="Aucune contravention récente."/></Section>
        </div>

        <div className="two-cols">
          <Section title="UNITÉS EN SERVICE" badge="0"><Empty text="Aucune unité actuellement en service."/></Section>
          <Section title="EFFECTIF LSPD"><div className="roster"><div className="avatar small">DEV</div><div><b>Développeur</b><small>Administration système</small></div><span className="tag green">EN LIGNE</span></div></Section>
        </div>
      </main>

      <aside className="right-rail">
        <Panel title="STATUT SYSTÈME"><Status label="Base de données" ok={false}/><Status label="Session" ok/><Status label="Discord" ok={false}/></Panel>
        <Panel title="RADIO"><RailItem icon={<Radio/>} title="Dispatch principal" sub="Canal à configurer"/><button className="wide-btn">VOIR LES CANAUX</button></Panel>
        <Panel title="RECHERCHE RAPIDE"><button className="quick">CODES PÉNAUX</button><button className="quick">PLAQUE VÉHICULE</button><button className="quick">NOM CITOYEN</button><button className="quick">N° RAPPORT</button></Panel>
        <Panel title="DOSSIERS RÉCENTS"><Empty text="Aucun dossier récent."/></Panel>
      </aside>
    </div>
    <footer>LSPD MOBILE DATA TERMINAL · SYSTÈME INTERNE <span>VERSION 0.2 BETA</span></footer>
  </div>
}

function Panel({title,children}:{title:string,children:React.ReactNode}) { return <section className="rail-panel"><h3>{title}</h3>{children}</section> }
function Section({title,badge,children}:{title:string,badge?:string,children:React.ReactNode}) { return <section className="section"><div className="section-title"><b>{title}</b>{badge&&<span>{badge}</span>}</div><div className="section-body">{children}</div></section> }
function Empty({text}:{text:string}) { return <div className="empty">{text}</div> }
function Nav({label}:{label:string}) { return <button className="nav">{label}<ChevronRight size={13}/></button> }
function RailItem({icon,title,sub}:{icon:React.ReactNode,title:string,sub:string}) { return <div className="rail-item"><span>{icon}</span><div><b>{title}</b><small>{sub}</small></div></div> }
function Status({label,ok}:{label:string,ok:boolean}) { return <div className="status"><div><b>{label}</b><small>{ok?'Opérationnel':'À configurer'}</small></div><i className={ok?'ok':'bad'}/></div> }
