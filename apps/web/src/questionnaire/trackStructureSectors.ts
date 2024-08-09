import { Sector, TrackComponent, TrackId } from '@/types'
import type { Track } from '@/types'

export const sectors: Track = {
  id: TrackId.Sectors,
  help: 'https://www.insee.fr/fr/metadonnees/nafr2',
  category: 'myEntreprise',
  title: { fr: 'Mon activité' },
  label: { fr: 'Quelle est votre activité ?' },
  interface: {
    component: TrackComponent.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      value: Sector.Craftsmanship,
      questionnaireData: { sector: Sector.Craftsmanship },
      title: { fr: 'Artisanat' },
      label: { fr: '👩‍🎨 Activité artisanale' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: Sector.Industry,
      questionnaireData: { sector: Sector.Industry },
      title: { fr: 'Industrie' },
      label: { fr: '👩‍🔧 Industrie, fabrication, production' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: Sector.Tourism,
      questionnaireData: { sector: Sector.Tourism },
      title: { fr: 'Tourisme' },
      label: { fr: '🤵‍♂️ Tourisme, restauration' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: Sector.Tertiary,
      questionnaireData: { sector: Sector.Tertiary },
      title: { fr: 'Tertiaire' },
      label: { fr: '🧑‍⚖️ Tertiaire, services' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: Sector.Agriculture,
      questionnaireData: { sector: Sector.Agriculture },
      title: { fr: 'Agriculture' },
      label: { fr: '👩‍🌾 Agricole' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: Sector.Other,
      questionnaireData: { sector: Sector.Other },
      title: { fr: 'Autre' },
      label: { fr: "Autre secteur d'activité" },
      next: {
        default: TrackId.StructureRegion
      }
    }
  ]
}
