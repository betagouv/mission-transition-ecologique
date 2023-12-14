import type { Track } from '@/types'
import { HasInputOptions, TrackComponents, TrackId } from '@/types'

export const strategyAuditsSelect: Track = {
  id: TrackId.StrategyAuditsSelect,
  category: 'myStrategy',
  title: { fr: 'Quels audits' },
  label: { fr: 'Le ou lesquels ?' },
  interface: {
    component: TrackComponents.Buttons
  },
  behavior: {
    multipleChoices: true
  },
  next: {
    default: TrackId.Results
  },
  options: [
    {
      value: { strategy_audits_select: 'carbon_audit' },
      title: { fr: 'Oui' },
      label: { fr: '🌱 Bilan de gaz à effet de serre ou bilan carbone' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: { strategy_audits_select: 'energetic_performance_audit' },
      title: { fr: 'Performance énergétique' },
      label: { fr: '⚡️ ️ Audit de performance énergétique des bâtiments ou Certification ISO 50001' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: { strategy_audits_select: 'energy_consumption_audit' },
      title: { fr: "Consommation d'énergie" },
      label: { fr: '⚡️ ️ Audit consommation d’énergie' },
      next: {
        default: TrackId.Results
      }
    },

    {
      value: { strategy_audits_select: 'water_audit' },
      title: { fr: 'Eau' },
      label: { fr: '💧 Audit eau' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: { strategy_audits_select: 'wastes_audit' },
      title: { fr: 'Déchets' },
      label: { fr: '🗑  Audit déchets' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: { strategy_audits_select: 'raw_materials_audit' },
      title: { fr: 'Matières premières' },
      label: { fr: '🧱  Audit matières premières' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: { strategy_audits_select: 'certification' },
      title: { fr: 'Certification' },
      label: { fr: '🎖  Certification ISO 14001 ' },
      next: {
        default: TrackId.Results
      }
    },

    {
      value: { strategy_audits_select: 'other' },
      title: { fr: 'Autre' },
      label: { fr: 'Autre : ' },
      hasInput: HasInputOptions.Text,
      next: {
        default: TrackId.WastesStake
      }
    },
    {
      value: { strategy_audits_select: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas' },
      next: {
        default: TrackId.Results
      }
    }
  ]
}
