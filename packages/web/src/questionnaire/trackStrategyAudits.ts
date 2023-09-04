export const strategyAudits = {
  id: 'track_strategy_audits',
  category: 'myStrategy',
  title: { fr: "Audits" },
  label: { fr: "Pour finir, avez-vous déjà réalisé des audits environnementaux ces 2 dernières années ?" },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: #000091; font-weight: 400; font-size: 1.3rem; margin-bottom: auto;',
    bgColor: '#1EBEBE',
    title: { fr : "Votre stratégie" },
    titleStyle: 'color: #000091;',
    bigTitle: true,
    imageLeft: 'images/tracks/je-ne-sais-pas-par-ou-commencer.svg',
  },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  next: {
    default: 'track_results'
  },
  options: [
    {
      value: { strategy_audits : 'yes' },
      title: { fr: 'Oui' },
      label: { fr: "✅ Oui !" },
      next: {
        default: 'track_strategy_audits_select'
      }
    },
    {
      value: { strategy_audits : 'no' },
      title: { fr: "Non" },
      label: { fr: "❌ Non" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { strategy_audits : 'unknown' },
      title: { fr: "Je ne sais pas" },
      label: { fr: "Je ne sais pas" },
      next: {
        default: 'track_results'
      }
    }
  ]
}