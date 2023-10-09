export const energyReductionPriority = {
  id: 'track_energy_reduction_priority',
  category: 'myEnergy',
  title: { fr: "Réduction de la consommation" },
  label: { fr: "La réduction de vos consommations d’énergie est-elle une priorité pour vous ? " },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: #3A3A3A;',
    bgColor: '#FACF35',
    title: { fr : "Votre gestion de l'énergie" },
    titleStyle: 'color: #000091;',
    bigTitle: true,
    imageLeft: 'images/thema/thema-energie.svg',
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
      value: { energy_reduction_priority : 'yes' },
      title: { fr: 'Oui' },
      label: { fr: "👍 Oui, c’est une priorité" },
      next: {
        default: 'track_strategy_audits'
      }
    },
    {
      value: { energy_reduction_priority : 'no' },
      title: { fr: "Non" },
      label: { fr: "❌ Ce n’est pas ma priorité" },
      next: {
        default: 'track_strategy_audits'
      }
    },
    {
      value: { energy_reduction_priority: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas" },
      next: {
        default: 'track_strategy_audits'
      }
    },
  ]
}