import type { Track } from '@/types'
import { TrackComponents, TrackId, YesNo, Objectives } from '@/types'

export const mobilityNumberVehicles: Track = {
  id: TrackId.MobilityNumberVehicles,
  category: 'myMobility',
  title: { fr: 'Nombre de véhicules' },
  label: { fr: 'Possédez-vous un ou plusieurs véhicules motorisés dans votre entreprise ?' },
  interface: {
    component: TrackComponents.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  next: {
    default: TrackId.MobilityEnergy
  },
  options: [
    {
      value: {
        mobility_number_vehicles: 'yes',
        [Objectives.SustainableMobility]: YesNo.Yes
      },
      title: { fr: 'Oui' },
      label: { fr: '✅ Oui' },
      next: {
        default: TrackId.MobilityEnergy
      }
    },
    {
      value: {
        mobility_number_vehicles: 'no',
        [Objectives.SustainableMobility]: YesNo.No
      },
      title: { fr: 'Non' },
      label: { fr: '❌ Non, l’entreprise ne possède aucun véhicule motorisé' },
      next: {
        default: TrackId.WastesStake
      }
    },
    {
      value: {
        mobility_number_vehicles: 'unknown',
        [Objectives.SustainableMobility]: YesNo.Yes
      },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas' },
      next: {
        default: TrackId.WastesStake
      }
    }
  ]
}
