import { HasInputOptions, TrackCategory, TrackComponent, TrackId } from '@/types'
import type { Track } from '@/types'

export const sectors: Track = {
  id: TrackId.Sectors,
  help: 'https://www.insee.fr/fr/metadonnees/nafr2',
  category: TrackCategory.MyEntreprise,
  title: { fr: 'Mon activité' },
  label: { fr: 'Quelle est votre activité ?' },
  interface: {
    component: TrackComponent.Activity
  },
  behavior: {
    multipleChoices: true
  },
  options: [
    {
      id: 'search-naf',
      hint: { fr: 'Recherchez par libellé, code NAF ou code NAF1' },
      hasInput: HasInputOptions.Search,
      value: undefined,
      questionnaireData: { codeNAF: '', codeNAF1: '', secteur: '' },
      title: { fr: 'ACTIVITE' },
      next: {
        default: TrackId.StructureRegion
      }
    }
  ]
}
