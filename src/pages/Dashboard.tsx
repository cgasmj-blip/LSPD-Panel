import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BadgeDollarSign, Moon, Shield, Sun } from 'lucide-react'
import { FINES_PREVIEW, TILE_SECTIONS, type TabKey } from '../lib/tiles'

type Theme = 'dark' | 'light'

export function Dashboard() {
  const [active, setActive] = useState<TabKey | null>(null)
  const [theme, setTheme] = useState<Theme>('dark')
  const section = useMemo(() => TILE_SECTIONS.find((item) => item.key === active), [active])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark"><Shield size={24} /></div>
        <button className="icon-btn" onClick={() => setActive(null)} aria-label="Accueil">⌂</button>
        <div className="sidebar-spacer" />
        <button className="icon-btn" onClick={toggleTheme} aria-label="Changer le thème">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </aside>

      <main className="content">
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="page"
            >
              <div className="hero">
                <div>
                  <p className="eyebrow">LOS SANTOS POLICE DEPARTMENT</p>
                  <h1>Officer Dashboard</h1>
                  <p className="muted">Centre opérationnel, effectifs et dossiers LSPD.</p>
                </div>
                <div className="status-chip">● Système opérationnel</div>
              </div>

              <div className="tiles">
                {TILE_SECTIONS.map((item) => {
                  const Icon = item.icon
                  return (
                    <button key={item.key} className="tile" onClick={() => setActive(item.key)}>
                      <div className="tile-icon" style={{ background: item.color }}><Icon size={21} /></div>
                      <div>
                        <strong>{item.label}</strong>
                        <span>{item.description}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key={active}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="page"
            >
              <button className="back-btn" onClick={() => setActive(null)}><ArrowLeft size={16} /> Retour</button>
              <div className="section-heading">
                <div className="tile-icon" style={{ background: section?.color }}>{section && <section.icon size={22} />}</div>
                <div>
                  <p className="eyebrow">LSPD PANEL</p>
                  <h2>{section?.label}</h2>
                  <p className="muted">{section?.description}</p>
                </div>
              </div>

              {active === 'reports' ? (
                <div className="panel-grid">
                  <article className="panel">
                    <h3>Nouveau rapport</h3>
                    <label>Titre<input placeholder="Ex. Braquage supérette Strawberry" /></label>
                    <label>Agents impliqués<input placeholder="Matricules / noms" /></label>
                    <label>Compte rendu<textarea rows={7} placeholder="Déroulé de l’intervention..." /></label>
                    <button className="primary-btn">Enregistrer le rapport</button>
                  </article>
                  <article className="panel">
                    <h3>Derniers rapports</h3>
                    <div className="empty-state">Aucun rapport enregistré pour le moment.</div>
                  </article>
                </div>
              ) : active === 'wanted' ? (
                <div className="panel-grid">
                  <article className="panel">
                    <h3>Nouveau signalement</h3>
                    <label>Individu<input placeholder="Nom Prénom" /></label>
                    <label>Motif<input placeholder="Motif du mandat / BOLO" /></label>
                    <label>Niveau de priorité<select><option>Standard</option><option>Élevé</option><option>Critique</option></select></label>
                    <button className="primary-btn">Publier</button>
                  </article>
                  <article className="panel">
                    <h3>Actifs</h3>
                    <div className="empty-state">Aucun mandat actif.</div>
                  </article>
                </div>
              ) : active === 'management' ? (
                <div className="panel-grid">
                  <article className="panel">
                    <h3>Barème rapide</h3>
                    {FINES_PREVIEW.map((fine) => (
                      <div className="fine-row" key={fine.label}>
                        <span>{fine.label}</span>
                        <strong><BadgeDollarSign size={14} /> {fine.amount}$</strong>
                      </div>
                    ))}
                  </article>
                  <article className="panel">
                    <h3>Administration</h3>
                    <div className="empty-state">Gestion des grades, habilitations et paramètres à connecter à Supabase.</div>
                  </article>
                </div>
              ) : (
                <article className="panel">
                  <h3>{section?.label}</h3>
                  <div className="empty-state">
                    Module LSPD prêt à être connecté aux données. La structure UI est en place.
                  </div>
                </article>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}