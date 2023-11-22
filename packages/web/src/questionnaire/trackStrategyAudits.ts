import type { Track } from '@/types'
import { TrackComponents, TrackId } from '@/types'

export const strategyAudits: Track = {
  id: TrackId.StrategyAudits,
  category: 'myStrategy',
  title: { fr: "Audits" },
  label: { fr: "Pour finir, avez-vous déjà réalisé des audits environnementaux ces 2 dernières années ?" },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: white;',
    bgColor: '#646EFA',
    title: { fr : "Votre stratégie environnementale" },
    titleStyle: 'color: white;',
    bigTitle: true,
    imageLeft: 'images/thema/thema-strategie.svg',
  },
  interface: {
    component: TrackComponents.Buttons,
  },
  behavior: {
    multipleChoices: false,
  },
  next: {
    default: TrackId.Results,
  },
  options: [
    {
      value: { strategy_audits : 'yes' },
      title: { fr: 'Oui' },
      label: { fr: "✅ Oui !" },
      next: {
        default: TrackId.StrategyAuditsSelect
      }
    },
    {
      value: { strategy_audits : 'no' },
      title: { fr: "Non" },
      label: { fr: "❌ Non" },
      next: {
        default: TrackId.Results,
      }
    },
    {
      value: { strategy_audits : 'unknown' },
      title: { fr: "Je ne sais pas" },
      label: { fr: "Je ne sais pas" },
      next: {
        default: TrackId.Results,
      }
    }
  ]
}
