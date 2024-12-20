import { TrackComponent, TrackId, YesNo, ThemeId, Track, TrackCategory } from '@/types'

export const wastesMaterials: Track = {
  id: TrackId.WastesMaterials,
  category: TrackCategory.MyWastes,
  title: { fr: 'Matières premières' },
  label: {
    fr: 'Avez-vous pour objectif de réduire vos pertes de matières premières ?'
  },
  theme: ThemeId.Waste,
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
      value: YesNo.Yes,
      questionnaireData: { wastes_materials_objective: YesNo.Yes },
      title: { fr: 'Oui' },
      label: { fr: '👍 Oui, nous aimerions limiter nos pertes de matières premières' },
      next: {
        default: TrackId.WaterStake
      }
    },
    {
      value: YesNo.No,
      questionnaireData: { wastes_materials_objective: YesNo.No },
      title: { fr: 'Non' },
      label: { fr: '❌ Non, pas vraiment' },
      next: {
        default: TrackId.WaterStake
      }
    },
    {
      value: YesNo.Unknown,
      questionnaireData: { wastes_materials_objective: YesNo.Unknown },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas / Je ne suis pas concerné' },
      next: {
        default: TrackId.WaterStake
      }
    }
  ]
}
