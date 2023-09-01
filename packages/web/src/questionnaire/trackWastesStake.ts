export const wastesStake = {
  id: 'track_wastes_stake',
  category: 'wastes',
  title: { fr: 'Déchets' },
  label: { fr: "Pensez-vous avoir un enjeu important sur la gestion des déchets ?" },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: #000091; font-weight: 400; font-size: 1.3rem; margin-bottom: auto;',
    bgColor: '#FCA081',
    title: { fr : 'Votre gestion des déchets' },
    titleStyle: 'color: #000091;',
    bigTitle: true,
    imageLeft: 'images/thema/thema-dechets.svg',
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
      value: { wastes_stake : 'yes' },
      title: { fr: 'Oui' },
      label: { fr: "👍 Oui, je pense que c’est un enjeu pour mon entreprise" },
      next: {
        default: 'track_wastes_sorting'
      }
    },
    {
      value: { wastes_stake : 'no' },
      title: { fr: "Non" },
      label: { fr: "👎 Non, pas vraiment " },
      next: {
        default: 'track_wastes_sorting'
      }
    },
    {
      value: { wastes_stake: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas" },
      next: {
        default: 'track_wastes_sorting'
      }
    }
  ]
}