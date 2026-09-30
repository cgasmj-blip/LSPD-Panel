import {
  BadgeDollarSign,
  CalendarClock,
  Car,
  FileSearch,
  History,
  LayoutDashboard,
  ShieldCheck,
  Siren,
  UserRoundSearch,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type TabKey =
  | 'services'
  | 'citizens'
  | 'reports'
  | 'vehicles'
  | 'wanted'
  | 'agenda'
  | 'history'
  | 'roster'
  | 'management'

export interface TileSection {
  key: TabKey
  label: string
  icon: LucideIcon
  color: string
  description: string
}

export const TILE_SECTIONS: TileSection[] = [
  { key: 'services', label: 'Unités en service', icon: Siren, color: 'var(--tile-blue)', description: 'Patrouilles, unités et statuts opérationnels' },
  { key: 'citizens', label: 'Recherche citoyens', icon: UserRoundSearch, color: 'var(--tile-cyan)', description: 'Identité, antécédents et informations utiles' },
  { key: 'reports', label: 'Rapports', icon: FileSearch, color: 'var(--tile-indigo)', description: 'Créer et consulter les rapports d’intervention' },
  { key: 'vehicles', label: 'Véhicules', icon: Car, color: 'var(--tile-emerald)', description: 'Recherche par plaque et suivi des véhicules' },
  { key: 'wanted', label: 'Mandats & signalements', icon: ShieldCheck, color: 'var(--tile-red)', description: 'BOLO, mandats et personnes recherchées' },
  { key: 'agenda', label: 'Agenda', icon: CalendarClock, color: 'var(--tile-violet)', description: 'Briefings, formations et rendez-vous' },
  { key: 'history', label: 'Historique', icon: History, color: 'var(--tile-slate)', description: 'Journal des actions et interventions' },
  { key: 'roster', label: 'Effectifs', icon: Users, color: 'var(--tile-amber)', description: 'Agents, matricules, grades et affectations' },
  { key: 'management', label: 'Gestion', icon: LayoutDashboard, color: 'var(--tile-fuchsia)', description: 'Administration du panel LSPD' },
]

export const FINES_PREVIEW = [
  { label: 'Excès de vitesse', amount: 750 },
  { label: 'Conduite dangereuse', amount: 1500 },
  { label: 'Refus d’obtempérer', amount: 2500 },
]

export { BadgeDollarSign }