import type { Track } from '@/types'
import { HasInputOptions, TrackComponent, TrackId } from '@/types'

export const energyTypes: Track = {
  id: TrackId.EnergyTypes,
  category: 'myEnergy',
  title: { fr: 'Source principale' },
  label: { fr: "Quelle est la source principale d'énergie pour vos locaux ?" },
  interface: {
    component: TrackComponent.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  next: {
    default: TrackId.Results
  },
  options: [
    {
      value: { energy_type: 'electric' },
      title: { fr: 'Electrique' },
      label: { fr: '⚡️ Électrique' },
      next: {
        default: TrackId.StrategyAudits
      }
    },
    {
      value: { energy_type: 'gas' },
      title: { fr: 'Gas' },
      label: { fr: '💨 Gaz' },
      next: {
        default: TrackId.StrategyAudits
      }
    },
    {
      value: { energy_type: 'fuel' },
      title: { fr: 'Fioul' },
      label: { fr: '⛽️ Essence / fioul' },
      next: {
        default: TrackId.StrategyAudits
      }
    },
    {
      value: { energy_type: 'coal' },
      title: { fr: 'Charbon' },
      label: { fr: '〰 Charbon' },
      next: {
        default: TrackId.StrategyAudits
      }
    },
    {
      value: { energy_type: 'wood' },
      title: { fr: 'Bois' },
      label: { fr: '🪵 Bois' },
      next: {
        default: TrackId.StrategyAudits
      }
    },
    {
      value: { energy_type: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas ou je ne suis pas concerné' },
      next: {
        default: TrackId.StrategyAudits
      }
    },
    {
      value: { energy_type: 'other' },
      title: { fr: 'Autre' },
      label: { fr: 'Autre : ' },
      hasInput: HasInputOptions.Text,
      next: {
        default: TrackId.StrategyAudits
      }
    }
  ]
}
