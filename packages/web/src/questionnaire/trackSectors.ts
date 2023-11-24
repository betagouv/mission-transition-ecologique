import {
  sectors,
  SectorByNAF,
  NAF1ToVar,
  codesNAF1,
  EntrepriseSector,
  YesNo,
  Sector,
  ConditionOperators,
  DataMappingFrom,
  TrackComponents,
  TrackId
} from '@/types'
import type { Track, NextTrackRuleSet } from '@/types'

const nextExceptions: NextTrackRuleSet[] = [
  {
    help: "Goes to track_structure_building_property if : user_help == 'unknown' (newbie)",
    rules: [
      {
        from: DataMappingFrom.UsedTracks,
        id: 'user_help',
        dataField: 'user_help',
        conditions: [
          {
            type: 'user_help',
            operator: ConditionOperators.is,
            value: 'unknown'
          }
        ]
      }
    ],
    next: { default: TrackId.BuildingProperty }
  },
  {
    help: "Goes to track_goals if : user_help == 'preise' (pro)",
    rules: [
      {
        from: DataMappingFrom.UsedTracks,
        id: 'user_help',
        dataField: 'user_help',
        conditions: [
          {
            type: 'user_help',
            operator: ConditionOperators.is,
            value: 'precise'
          }
        ]
      }
    ],
    next: { default: TrackId.Goals }
  }
]

export const trackSectors: Track = {
  id: TrackId.Sectors,
  help: 'https://www.insee.fr/fr/metadonnees/nafr2',
  category: 'myEntreprise',
  title: { fr: 'Mon activité' },
  label: { fr: 'Quelle est votre activité ?' },
  interface: {
    component: TrackComponents.Buttons,
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      value: {
        secteur: Sector.Craftsmanship,
        ...sectors,
        [EntrepriseSector.Craftsmanship] : YesNo.Yes,
        // "entreprise . code NAF niveau 1 . est A": YesNo.Yes
        ...Object.assign({}, ...SectorByNAF[EntrepriseSector.Craftsmanship].map((l) => { return { [NAF1ToVar(l)]: YesNo.Yes } }))
      },
      title: { fr: 'Artisanat' },
      label: { fr: '👩‍🎨 J’ai une activité artisanale' },
      next: {
        default: TrackId.Roles,
        exceptions: nextExceptions
      }
    },
    {
      value: {
        secteur: Sector.Industry,
        ...sectors,
        [EntrepriseSector.Industry] : YesNo.Yes,
        ...codesNAF1,
        ...Object.assign({}, ...SectorByNAF[EntrepriseSector.Industry].map((l) => { return { [NAF1ToVar(l)]: YesNo.Yes } }))
      },
      title: { fr: 'Industrie' },
      label: { fr: '👩‍🔧 J’ai une activité industrielle, fabrication, production' },
      next: {
        default: TrackId.Roles,
        exceptions: nextExceptions
      }
    },
    {
      value: {
        secteur: Sector.Tourism,
        ...sectors,
        [EntrepriseSector.Tourism] : YesNo.Yes,
        ...codesNAF1,
        ...Object.assign({}, ...SectorByNAF[EntrepriseSector.Tourism].map((l) => { return { [NAF1ToVar(l)]: YesNo.Yes } }))
      },
      title: { fr: 'Tourisme' },
      label: { fr: '🤵‍♂️ J’ai une activité de tourisme, restauration' },
      next: {
        default: TrackId.Roles,
        exceptions: nextExceptions
      }
    },
    {
      value: {
        secteur: Sector.Tertiary,
        ...sectors,
        [EntrepriseSector.Tertiary] : YesNo.Yes,
        ...codesNAF1,
        ...Object.assign({}, ...SectorByNAF[EntrepriseSector.Tertiary].map((l) => { return { [NAF1ToVar(l)]: YesNo.Yes } }))
      },
      title: { fr: 'Tertiaire' },
      label: { fr: '🧑‍⚖️ J’ai une activité tertiaire, de services' },
      next: {
        default: TrackId.Roles,
        exceptions: nextExceptions
      }
    },
    {
      value: {
        secteur: Sector.Agriculture,
        ...sectors,
        [EntrepriseSector.Agriculture] : YesNo.Yes,
        ...codesNAF1,
        ...Object.assign({}, ...SectorByNAF[EntrepriseSector.Agriculture].map((l) => { return { [NAF1ToVar(l)]: YesNo.Yes } }))
      },
      title: { fr: 'Agriculture' },
      label: { fr: '👩‍🌾 J’ai une activité agricole' },
      next: {
        default: TrackId.Roles,
        exceptions: nextExceptions
      }
    },
    {
      value: {
        secteur: Sector.Other,
        ...sectors,
        [EntrepriseSector.Other] : YesNo.Yes,
        ...codesNAF1,
        ...Object.assign({}, ...SectorByNAF[EntrepriseSector.Other].map((l) => { return { [NAF1ToVar(l)]: YesNo.Yes } }))
      },
      title: { fr: 'Autre' },
      label: { fr: "Je suis dans un autre secteur d'activité" },
      next: {
        default: TrackId.Roles,
        exceptions: nextExceptions
      }
    }
  ]
}
