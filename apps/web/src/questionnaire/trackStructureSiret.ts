// CONSOLE LOG TEMPLATE
// console.log(`questionnaire.trackSiret > FUNCTION_NAME > MSG_OR_VALUE :`)

import { HasInputOptions, SiretValue, TrackComponent, TrackId } from '@/types'
import type { Track, EstablishmentType } from '@/types'

const defaultQuestionnaireData: EstablishmentType = {
  siret: '',
  codeNAF: '',
  codeNAF1: '',
  ville: '',
  codePostal: '',
  region: undefined,
  structure_size: undefined,
  denomination: '',
  secteur: '',
  creationDate: ''
}

export const siret: Track = {
  id: TrackId.Siret,
  category: 'myEntreprise',
  title: { fr: 'Mon SIRET' },
  label: { fr: 'Quelle est votre entreprise ?' },
  interface: {
    component: TrackComponent.Siret
  },
  next: {
    default: TrackId.StructureWorkforce
  },
  options: [
    {
      id: 'search-siret',
      hasInput: HasInputOptions.Search,
      value: undefined,
      questionnaireData: { ...defaultQuestionnaireData },
      title: { fr: 'SIRET' },
      hintLabel: { fr: 'ex : "Fromagerie Sanzot Angers" ou N° SIRET "130 025 265 00013"' },
      next: {
        default: TrackId.StructureWorkforce
      },
      wildcard: {
        label: { fr: 'je préfère compléter mes informations manuellement' },
        value: SiretValue.Wildcard,
        next: {
          default: TrackId.StructureWorkforce
        }
      }
    }
  ]
}
