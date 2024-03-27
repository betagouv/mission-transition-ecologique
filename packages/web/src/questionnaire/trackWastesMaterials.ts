import type { Track } from '@/types'
import { Objectives, TrackComponents, TrackId, YesNo } from '@/types'

export const wastesMaterials: Track = {
  id: TrackId.WastesMaterials,
  category: 'myWastes',
  title: { fr: 'Matières premières' },
  label: {
    fr: 'Avez-vous pour objectif de réduire vos pertes de matières premières ?'
  },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: #3A3A3A;',
    bgColor: '#FCA081',
    title: { fr: 'Votre gestion des déchets' },
    titleStyle: 'color: #000091;',
    bigTitle: true,
    imageLeft: 'images/thema/thema-dechets.svg'
  },
  interface: {
    component: TrackComponents.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  next: {
    default: TrackId.Results
  },
  options: [
    {
      value: { wastes_materials: 'yes', [Objectives.EcoDesign]: YesNo.Yes },
      title: { fr: 'Oui' },
      label: { fr: '👍 Oui, nous aimerions limiter nos pertes de matières premières' },
      next: {
        default: TrackId.WaterStake
      }
    },
    {
      value: { wastes_materials: 'no', [Objectives.EcoDesign]: YesNo.No },
      title: { fr: 'Non' },
      label: { fr: '❌ Non, pas vraiment' },
      next: {
        default: TrackId.WaterStake
      }
    },
    {
      value: { wastes_materials: 'unknown', [Objectives.EcoDesign]: YesNo.Yes },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas / Je ne suis pas concerné' },
      next: {
        default: TrackId.WaterStake
      }
    }
  ]
}
