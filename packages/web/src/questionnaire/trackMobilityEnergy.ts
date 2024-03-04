import type { Track } from '@/types'
import { HasInputOptions, TrackComponent, TrackId } from '@/types'

export const mobilityEnergy: Track = {
  id: TrackId.MobilityEnergy,
  category: 'myMobility',
  title: { fr: 'Energie des véhicules' },
  label: { fr: "Quelle est la source principale d'énergie de vos véhicules ?" },
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
      value: { mobility_energy: 'gas' },
      title: { fr: 'Essence ou gasoil' },
      label: { fr: '⛽️ Essence ou gasoil' },
      next: {
        default: TrackId.MobilityWishes
      }
    },
    {
      value: { mobility_energy: 'electric' },
      title: { fr: 'Electrique' },
      label: { fr: '⚡️ Electrique' },
      next: {
        default: TrackId.MobilityWishes
      }
    },
    {
      value: { mobility_energy: 'hybrid' },
      title: { fr: 'Hybride' },
      label: { fr: '⛽️⚡️ Hybride' },
      next: {
        default: TrackId.MobilityWishes
      }
    },
    {
      value: { mobility: 'other' },
      title: { fr: 'Autre' },
      label: { fr: 'Autre : ' },
      hasInput: HasInputOptions.Text,
      next: {
        default: TrackId.MobilityWishes
      }
    },
    {
      value: { mobility_energy: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas' },
      next: {
        default: TrackId.MobilityWishes
      }
    }
  ]
}
