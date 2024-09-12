import { TrackComponent, TrackId, YesNo, Objective, Track, TrackCategory } from '@/types'

export const strategyAudits: Track = {
  id: TrackId.StrategyAudits,
  category: TrackCategory.myStrategy,
  title: { fr: 'Audits' },
  label: {
    fr: 'Pour finir, avez-vous déjà réalisé des audits environnementaux ces 2 dernières années ?'
  },
  objective: Objective.EnvironmentalImpact,
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
      questionnaireData: { recently_audited: YesNo.Yes },
      title: { fr: 'Oui' },
      label: { fr: '✅ Oui !' },
      next: {
        default: TrackId.StrategyAuditsSelect
      }
    },
    {
      value: YesNo.No,
      questionnaireData: { recently_audited: YesNo.No },
      title: { fr: 'Non' },
      label: { fr: '❌ Non' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: YesNo.Unknown,
      questionnaireData: { recently_audited: YesNo.Unknown },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas' },
      next: {
        default: TrackId.Results
      }
    }
  ]
}
