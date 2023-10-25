export const wastesStake = {
  id: 'track_wastes_stake',
  category: 'myWastes',
  title: { fr: 'Enjeu' },
  label: { fr: "Aimeriez-vous améliorer la gestion des déchets de votre activité ? " },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: #3A3A3A;',
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
      label: { fr: "👍 Oui, j’aimerais faire mieux !" },
      next: {
        default: 'track_wastes_sorting'
      }
    },
    {
      value: { wastes_stake : 'no-max' },
      title: { fr: "Non" },
      label: { fr: "🤓 Non, je fais déja mon maximum" },
      next: {
        default: 'track_wastes_sorting'
      }
    },
    {
      value: { wastes_stake : 'no' },
      title: { fr: "Non" },
      label: { fr: "👎 Non, la gestion des déchets n’est pas un enjeu pour moi " },
      next: {
        default: 'track_wastes_sorting'
      }
    },
    {
      value: { wastes_stake: 'unknown' },
      title: { fr: 'Aucune idée' },
      label: { fr: "Aucune idée" },
      next: {
        default: 'track_wastes_sorting'
      }
    }
  ]
}