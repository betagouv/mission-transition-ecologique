import { Sectors, SectorByNAF, NAF1ToVar, codesNAF1, EntrepriseSector, YesNo, Sector, TrackComponents, TrackId } from '@/types'
import type { Track } from '@/types'

export const sectors: Track = {
  id: TrackId.Sectors,
  help: 'https://www.insee.fr/fr/metadonnees/nafr2',
  category: 'myEntreprise',
  title: { fr: 'Mon activité' },
  label: { fr: 'Quelle est votre activité ?' },
  interface: {
    component: TrackComponents.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      value: {
        secteur: Sector.Craftsmanship,
        ...Sectors,
        [EntrepriseSector.Craftsmanship]: YesNo.Yes,
        // "entreprise . code NAF niveau 1 . est A": YesNo.Yes
        ...Object.assign(
          {},
          ...SectorByNAF[EntrepriseSector.Craftsmanship].map((l) => {
            return { [NAF1ToVar(l)]: YesNo.Yes }
          })
        )
      },
      title: { fr: 'Artisanat' },
      label: { fr: '👩‍🎨 J’ai une activité artisanale' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: {
        secteur: Sector.Industry,
        ...Sectors,
        [EntrepriseSector.Industry]: YesNo.Yes,
        ...codesNAF1,
        ...Object.assign(
          {},
          ...SectorByNAF[EntrepriseSector.Industry].map((l) => {
            return { [NAF1ToVar(l)]: YesNo.Yes }
          })
        )
      },
      title: { fr: 'Industrie' },
      label: { fr: '👩‍🔧 J’ai une activité industrielle, fabrication, production' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: {
        secteur: Sector.Tourism,
        ...Sectors,
        [EntrepriseSector.Tourism]: YesNo.Yes,
        ...codesNAF1,
        ...Object.assign(
          {},
          ...SectorByNAF[EntrepriseSector.Tourism].map((l) => {
            return { [NAF1ToVar(l)]: YesNo.Yes }
          })
        )
      },
      title: { fr: 'Tourisme' },
      label: { fr: '🤵‍♂️ J’ai une activité de tourisme, restauration' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: {
        secteur: Sector.Tertiary,
        ...Sectors,
        [EntrepriseSector.Tertiary]: YesNo.Yes,
        ...codesNAF1,
        ...Object.assign(
          {},
          ...SectorByNAF[EntrepriseSector.Tertiary].map((l) => {
            return { [NAF1ToVar(l)]: YesNo.Yes }
          })
        )
      },
      title: { fr: 'Tertiaire' },
      label: { fr: '🧑‍⚖️ J’ai une activité tertiaire, de services' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: {
        secteur: Sector.Agriculture,
        ...Sectors,
        [EntrepriseSector.Agriculture]: YesNo.Yes,
        ...codesNAF1,
        ...Object.assign(
          {},
          ...SectorByNAF[EntrepriseSector.Agriculture].map((l) => {
            return { [NAF1ToVar(l)]: YesNo.Yes }
          })
        )
      },
      title: { fr: 'Agriculture' },
      label: { fr: '👩‍🌾 J’ai une activité agricole' },
      next: {
        default: TrackId.StructureRegion
      }
    },
    {
      value: {
        secteur: Sector.Other,
        ...Sectors,
        [EntrepriseSector.Other]: YesNo.Yes,
        ...codesNAF1,
        ...Object.assign(
          {},
          ...SectorByNAF[EntrepriseSector.Other].map((l) => {
            return { [NAF1ToVar(l)]: YesNo.Yes }
          })
        )
      },
      title: { fr: 'Autre' },
      label: { fr: "Je suis dans un autre secteur d'activité" },
      next: {
        default: TrackId.StructureRegion
      }
    }
  ]
}
