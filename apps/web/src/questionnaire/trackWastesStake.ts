import { TrackComponent, TrackId, YesNo, WasteManagementStatus, ThemeId, Track, TrackCategory } from '@/types'

export const wastesStake: Track = {
  id: TrackId.WastesStake,
  category: TrackCategory.myWastes,
  title: { fr: 'Enjeu' },
  label: { fr: 'Aimeriez-vous améliorer la gestion des déchets de votre activité ? ' },
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
      questionnaireData: { wastes_management_objective: WasteManagementStatus.Yes },
      title: { fr: 'Oui' },
      label: { fr: '👍 Oui, j’aimerais faire mieux !' },
      next: {
        default: TrackId.WastesSorting
      }
    },
    {
      value: 'maximum',
      questionnaireData: { wastes_management_objective: WasteManagementStatus.NoMax },
      title: { fr: 'Non' },
      label: { fr: '🤓 Non, je fais déja mon maximum' },
      next: {
        default: TrackId.WastesSorting
      }
    },
    {
      value: YesNo.No,
      questionnaireData: { wastes_management_objective: WasteManagementStatus.No },
      title: { fr: 'Non' },
      label: { fr: '👎 Non, la gestion des déchets n’est pas un enjeu pour moi ' },
      next: {
        default: TrackId.WastesSorting
      }
    },
    {
      value: YesNo.Unknown,
      questionnaireData: { wastes_management_objective: WasteManagementStatus.Unknown },
      title: { fr: 'Aucune idée' },
      label: { fr: 'Aucune idée' },
      next: {
        default: TrackId.WastesSorting
      }
    }
  ]
}
