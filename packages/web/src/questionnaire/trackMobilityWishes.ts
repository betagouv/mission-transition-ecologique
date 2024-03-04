import type { Track } from '@/types'
import { TrackComponent, TrackId, Objectives, YesNo } from '@/types'

export const mobilityWishes: Track = {
  id: TrackId.MobilityWishes,
  category: 'myMobility',
  title: { fr: 'Mobilité douce' },
  label: {
    fr: 'Souhaitez-vous favoriser des déplacements plus écologiques pour vous et vos employés ?'
  },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: #3A3A3A;',
    bgColor: '#1EBE8E',
    title: { fr: 'La mobilité dans votre entreprise' },
    titleStyle: 'color: #000091;',
    bigTitle: true,
    imageLeft: 'images/thema/thema-mobilite.svg'
  },
  interface: {
    component: TrackComponent.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  next: {
    default: TrackId.WastesStake
  },
  options: [
    {
      value: {
        [Objectives.SustainableMobility]: YesNo.Yes
      },
      title: { fr: 'Oui' },
      label: { fr: "👏 Oui, ça m'intéresse !" },
      next: {
        default: TrackId.WastesStake
      }
    },
    {
      value: {
        [Objectives.SustainableMobility]: YesNo.No
      },
      title: { fr: 'Non, on fait le maximum' },
      label: { fr: '🚲 Non, on fait déjà le maximum sur le sujet' },
      next: {
        default: TrackId.WastesStake
      }
    },
    {
      value: {
        [Objectives.SustainableMobility]: YesNo.No
      },
      title: { fr: 'Non, pas un enjeu' },
      label: { fr: "❌ Non, ce n'est pas un enjeu pour moi" },
      next: {
        default: TrackId.WastesStake
      }
    },
    {
      value: {
        [Objectives.SustainableMobility]: YesNo.Yes
      },
      title: { fr: 'Ne sais pas' },
      label: { fr: 'Aucune idée' },
      next: {
        default: TrackId.WastesStake
      }
    }
  ]
}
