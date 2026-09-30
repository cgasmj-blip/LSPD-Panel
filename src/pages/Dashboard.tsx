import {useEffect,useMemo,useState} from 'react'
import type {Staff} from '../lib/supabase'
import {chooseBadge,getServiceUnits,joinService,leaveService,signOut,startService,subscribeService} from '../lib/supabase'
import {LogOut,Shield,Users,UserRound,LockKeyhole,Radio} from 'lucide-react'
export function Dashboard({staff}:{staff:Staff}){
 const [units,setUnits]=useState<any[]>([]),[error,setError]=useState(''),[badge,setBadge]=useState(''),[busy,setBusy]=useState(false)
 const refresh=async()=>{try{setUnits(await getServiceUnits())}catch(e:any){setError(e.message)}}
 useEffect(()=>{void refresh();return subscribeService(()=>void refresh())},[])
 const myUnit=useMemo(()=>units.find(u=>u.service_unit_members?.some((m:any)=>m.staff_id===staff.id)),[units,staff.id])
 const completeAdam=units.some(u=>u.service_type==='adam'&&(u.service_unit_members?.length??0)>=2)
 async function act(fn:()=>Promise<any>){setBusy(true);setError('');try{const r=await fn();if(r?.error)throw r.error;await refresh()}catch(e:any){setError(e.message||'Action impossible')}finally{setBusy(false)}}
 async function saveBadge(){await act(async()=>{const r=await chooseBadge(badge);if(r.error)throw r.error;staff.badge_number=badge.trim();return r})}
 const divisions=staff.divisions??[]
 return <div className="portal">
  <header className="portal-top"><div className="wordmark"><span className="mini-shield"><Shield size={16}/></span><div><b>LSPD</b><small>MOBILE DATA TERMINAL</small></div></div><nav><button className="active">SERVICE</button></nav><button className="logout" onClick={()=>void signOut()}><LogOut size={14}/> Déconnexion</button></header>
  <div className="portal-layout">
   <aside className="profile-card"><div className="avatar">LSPD</div><h2>{staff.display_name}</h2><p>{staff.rank}</p><dl><dt>Matricule</dt><dd>{staff.badge_number||'Non défini'}</dd><dt>Division(s)</dt><dd>{divisions.length?divisions.join(' · '):'Aucune'}</dd><dt>Statut</dt><dd><span className={'tag '+(myUnit?'green':'')}>{myUnit?'EN SERVICE':'HORS SERVICE'}</span></dd></dl></aside>
   <main className="portal-main">
    <section className="hero-mdt"><div><p className="kicker">LOS SANTOS POLICE DEPARTMENT</p><h1>Prise de service</h1><p>Choisis ton type de patrouille. Les unités et conditions divisionnaires sont synchronisées en temps réel.</p></div><Radio size={52}/></section>
    {!staff.badge_number&&<section className="section"><div className="section-title"><b>MATRICULE</b></div><div className="section-body badge-setup"><p>Choisis ton matricule. Il est unique et ne pourra pas être modifié depuis le panel.</p><div className="badge-row"><input value={badge} onChange={e=>setBadge(e.target.value)} placeholder="Ex. 23"/><button disabled={!badge.trim()||busy} onClick={()=>void saveBadge()}>VALIDER LE MATRICULE</button></div></div></section>}
    {staff.badge_number&&!myUnit&&<><section className="section"><div className="section-title"><b>SERVICE CLASSIQUE</b></div><div className="section-body duty-buttons">
      <button className="duty-choice" disabled={busy} onClick={()=>void act(()=>startService('lincoln'))}><UserRound/><span><b>LINCOLN</b><small>Patrouille solo</small></span></button>
      <button className="duty-choice" disabled={busy} onClick={()=>void act(()=>startService('adam'))}><Users/><span><b>ADAM</b><small>Patrouille duo</small></span></button>
    </div></section>
    {divisions.length>0&&<section className="section"><div className="section-title"><b>SERVICE DIVISIONNAIRE</b></div><div className="section-body duty-buttons">{divisions.map(d=>{const locked=(d==='HSP'||d==='K-9')&&!completeAdam;return <button key={d} className={'duty-choice division-choice '+(locked?'locked':'')} disabled={busy||locked} onClick={()=>void act(()=>startService('division',d))}>{locked?<LockKeyhole/>:<Shield/>}<span><b>{d}</b><small>{locked?'Adam complet requis':'Prendre le service '+d}</small></span></button>})}</div></section>}</>}
    {myUnit&&<section className="section active-duty"><div className="section-title"><b>MON UNITÉ</b></div><div className="section-body"><div className="unit-focus"><div><small>EN SERVICE</small><h2>{myUnit.name}</h2><p>{myUnit.service_type==='adam'?(myUnit.service_unit_members.length<2?'En attente du second agent':'Adam complet'):myUnit.division||'Patrouille solo'}</p></div><button disabled={busy} onClick={()=>void act(()=>leaveService())}>QUITTER LE SERVICE</button></div></div></section>}
    <section className="section"><div className="section-title"><b>UNITÉS EN SERVICE</b><span>{units.length}</span></div><div className="section-body units-board">{units.length===0?<p className="empty">Aucune unité actuellement en service.</p>:units.map(u=>{const count=u.service_unit_members?.length??0;const canJoin=!myUnit&&((u.service_type==='adam'&&count<2)||(u.service_type==='division'&&divisions.includes(u.division)));return <article className="unit-card" key={u.id}><div><small>{u.service_type==='division'?u.division:u.service_type.toUpperCase()}</small><h3>{u.name}</h3><p>{u.service_unit_members?.map((m:any)=>m.staff?.display_name).filter(Boolean).join(' · ')}</p></div><div className="unit-side"><b>{count}{u.service_type==='adam'?' / 2':''}</b>{canJoin&&<button disabled={busy} onClick={()=>void act(()=>joinService(u.id))}>REJOINDRE</button>}</div></article>})}</div></section>
    {error&&<div className="service-error">{error}</div>}
   </main>
  </div>
 </div>
}