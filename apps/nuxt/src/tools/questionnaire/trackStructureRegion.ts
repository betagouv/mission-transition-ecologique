// CONSOLE LOG TEMPLATE
// console.log(`questionnaire.trackStructureRegion > FUNCTION_NAME > MSG_OR_VALUE :`)

import { Track, TrackCategory, HasInputOptions } from '@/types'
import { TrackComponent, TrackId } from '@/types'

export const regions: Track = {
  id: TrackId.StructureCity,
  category: TrackCategory.MyEntreprise,
  title: { fr: 'Ma localisation' },
  label: { fr: 'Quelle est votre ville ?' },
  interface: {
    component: TrackComponent.CitySearch
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      id: 'search-city',
      hint: { fr: 'Recherchez par code postal ou nom de ville' },
      hasInput: HasInputOptions.Search,
      value: undefined,
      questionnaireData: { ville: '', region: '', codePostal: '' },
      title: { fr: 'LOCALISATION' },
      next: {
        default: TrackId.BuildingProperty
      }
    }
  ]
}
