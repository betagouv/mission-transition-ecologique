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
      label: { fr: '👩‍🎨 J’ai une activité artisanale' },
      shortLabel: { fr: 'artisanale' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: Sector.Industry,
      questionnaireData: { sector: Sector.Industry },
      title: { fr: 'Industrie' },
      label: { fr: '👩‍🔧 J’ai une activité industrielle, fabrication, production' },
      shortLabel: { fr: 'industrie, fabrication, production' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: Sector.Tourism,
      questionnaireData: { sector: Sector.Tourism },
      title: { fr: 'Tourisme' },
      label: { fr: '🤵‍♂️ J’ai une activité de tourisme, restauration' },
      shortLabel: { fr: 'tourisme, restauration' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: Sector.Tertiary,
      questionnaireData: { sector: Sector.Tertiary },
      title: { fr: 'Tertiaire' },
      label: { fr: '🧑‍⚖️ J’ai une activité tertiaire, de services' },
      shortLabel: { fr: 'tertiaire, services' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: Sector.Agriculture,
      questionnaireData: { sector: Sector.Agriculture },
      title: { fr: 'Agriculture' },
      label: { fr: '👩‍🌾 J’ai une activité agricole' },
      shortLabel: { fr: 'agricole' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: Sector.Other,
      questionnaireData: { sector: Sector.Other },
      title: { fr: 'Autre' },
      label: { fr: "Je suis dans un autre secteur d'activité" },
      shortLabel: { fr: "autre secteur d'activité" },
      next: {
        default: TrackId.StructureRegion
      }
    }
  ]
}
