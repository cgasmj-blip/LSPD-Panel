import { useEffect,useState } from 'react'
import type { Staff } from '../lib/supabase'
import { signOut } from '../lib/supabase'
import { getContent,getDutyHistory,getRoster,setDuty,type DutyStatus } from '../lib/mdt'
import { BookOpen, GraduationCap, History, LogOut, Shield, Users } from 'lucide-react'

const labels:Record<DutyStatus,string>={on_duty:'EN SERVICE',break:'EN PAUSE',unavailable:'INDISPONIBLE',off_duty:'FIN DE SERVICE'}

export function Dashboard({staff}:{staff:Staff}){
 const [tab,setTab]=useState<'home'|'documents'|'training'|'history'>('home')
 const [roster,setRoster]=useState<any[]>([]),[items,setItems]=useState<any[]>([]),[history,setHistory]=useState<any[]>([])
 async function refresh(){setRoster(await getRoster())}
 useEffect(()=>{void refresh()},[])
 useEffect(()=>{if(tab==='documents')void getContent('document').then(setItems);if(tab==='training')void getContent('training').then(setItems);if(tab==='history')void getDutyHistory().then(setHistory)},[tab])
 async function duty(status:DutyStatus){await setDuty(staff.id,status);staff.duty_status=status;await refresh();setTab('home')}
 const inService=roster.filter(x=>x.duty_status==='on_duty').length
 return <div className="portal">
  <header className="portal-top"><div className="wordmark"><span className="mini-shield"><Shield size={16}/></span><div><b>LSPD MDT</b><small>PORTAIL INTERNE</small></div></div><nav><button onClick={()=>setTab('home')}>Effectifs</button><button onClick={()=>setTab('documents')}>Documentation</button><button onClick={()=>setTab('training')}>Formations</button><button onClick={()=>setTab('history')}>Archives service</button></nav><button className="logout" onClick={()=>void signOut()}><LogOut size={14}/> Déconnexion</button></header>
  <div className="portal-layout">
   <aside className="profile-card"><div className="avatar">LSPD</div><h2>{staff.display_name}</h2><p>{staff.rank}</p><dl><dt>Matricule</dt><dd>{staff.badge_number||'À renseigner'}</dd><dt>Division</dt><dd>{staff.unit||'Aucune'}</dd><dt>Statut</dt><dd><span className={'tag '+(staff.duty_status==='on_duty'?'green':'')}>{labels[staff.duty_status]}</span></dd></dl><h3>STATUT DE SERVICE</h3>{(Object.keys(labels) as DutyStatus[]).map(s=><button key={s} className="wide-btn" onClick={()=>void duty(s)}>{labels[s]}</button>)}</aside>
   <main className="portal-main">
    {tab==='home'&&<><section className="hero-mdt"><div><p className="kicker">LOS SANTOS POLICE DEPARTMENT</p><h1>Effectifs & service</h1><p>Vue interne des agents, grades, divisions et états de service.</p></div><div className="service-count"><strong>{inService}</strong><span>AGENT(S) EN SERVICE</span></div></section><Section title="EFFECTIF LSPD"><div className="roster-grid">{roster.map(a=><article className="agent" key={a.id}><div className="avatar small">{a.badge_number?.slice(0,3)||'PD'}</div><div><b>{a.display_name}</b><small>{a.rank}{a.unit?' · '+a.unit:''}</small><em>{a.badge_number||'Matricule non renseigné'}</em></div><span className={'tag '+(a.duty_status==='on_duty'?'green':'')}>{labels[a.duty_status as DutyStatus]}</span></article>)}</div></Section></>}
    {(tab==='documents'||tab==='training')&&<><section className="hero-mdt"><div><p className="kicker">{tab==='documents'?'BASE DOCUMENTAIRE':'CENTRE DE FORMATION'}</p><h1>{tab==='documents'?'Documentation LSPD':'Formations LSPD'}</h1><p>Seuls les contenus autorisés pour ton grade ou ta division apparaissent ici.</p></div>{tab==='documents'?<BookOpen size={52}/>:<GraduationCap size={52}/>}</section><Section title={tab==='documents'?'DOCUMENTS ACCESSIBLES':'FORMATIONS ACCESSIBLES'}><div className="content-grid">{items.length?items.map(i=><article className="content-card" key={i.id}><small>{i.category}</small><h3>{i.title}</h3><p>{i.summary||i.body.slice(0,180)||'Aucune description.'}</p>{i.external_url&&<a href={i.external_url} target="_blank" rel="noreferrer">OUVRIR LA RESSOURCE</a>}</article>):<Empty text="Aucun contenu accessible pour le moment."/ >}</div></Section></>}
    {tab==='history'&&<><section className="hero-mdt"><div><p className="kicker">ARCHIVES</p><h1>Historique des services</h1><p>Chaque changement de statut est conservé automatiquement.</p></div><History size={52}/></section><Section title="DERNIERS CHANGEMENTS"><div className="history-list">{history.map((h:any)=><div key={h.id}><b>{h.staff?.display_name||'Agent'}</b><span>{labels[h.status as DutyStatus]}</span><time>{new Date(h.changed_at).toLocaleString('fr-FR')}</time></div>)}</div></Section></>}
   </main>
  </div>
 </div>
}
function Section({title,children}:{title:string,children:React.ReactNode}){return <section className="section"><div className="section-title"><b>{title}</b></div><div className="section-body">{children}</div></section>}
function Empty({text}:{text:string}){return <div className="empty">{text}</div>}
