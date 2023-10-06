const objectifsPrioritaires = {
  'questionnaire . objectif prioritaire . est impact carbone': 'non',
  'questionnaire . objectif prioritaire . est ma performance énergétique': 'non',
  'questionnaire . objectif prioritaire . est la gestion des déchets': 'non',
  'questionnaire . objectif prioritaire . est faire des économies': 'non',
  'questionnaire . objectif prioritaire . est la mobilité durable': 'non',
  'questionnaire . objectif prioritaire . est rénover mon bâtiment': 'non',
  'questionnaire . objectif prioritaire . est ma performance environnementale': 'non',
  'questionnaire . objectif prioritaire . est investir durable': 'non',
  'questionnaire . objectif prioritaire . est performance énergétique': 'non',
  'questionnaire . objectif prioritaire . est je ne sais pas encore': 'non'
}

export const goals = {
  id: 'track_goals',
  category: 'myEntreprise',
  title: { fr: 'Mes objectifs' },
  label: { fr: 'Quel est votre objectif prioritaire' },
  hint: { fr: 'Je souhaite...' },
  // callout: {
  //   bgColor: '#FACF35', // 'fr-callout--green-emeraude',
  //   title: { fr : 'En avant !' },
  //   imageLeft: 'images/TEE-onboarding.png',
  //   description: { fr : 'Nous allons vous poser quelques questions pour mieux vous connaître et pouvoir vous proposer des actions personnalisées.' },
  //   hintIcon: 'fr-icon-timer-line',
  //   hint: { fr: '2 min. chrono' },
  // },
  interface: {
    component: 'buttons'
  },
  behavior: {
    multipleChoices: false
  },
  next: {
    default: 'track_results'
  },
  options: [
    {
      // WIP
      value: {
        ...objectifsPrioritaires,
        'questionnaire . objectif prioritaire . est impact carbone': 'oui'
      },
      title: { fr: 'Impact environnemental' },
      label: { fr: '🌱 Mesurer mon impact carbone et le réduire' },
      next: {
        default: 'track_results'
      }
    },
    {
      value: {
        ...objectifsPrioritaires,
        'questionnaire . objectif prioritaire . est ma performance énergétique': 'oui'
      },
      title: { fr: "Gestion de l'énergie" },
      label: { fr: '⚡️ Améliorer la performance énergétique de mon entreprise' },
      next: {
        default: 'track_results'
      }
    },
    {
      value: {
        ...objectifsPrioritaires,
        'questionnaire . objectif prioritaire . est la gestion des déchets': 'oui'
      },
      title: { fr: 'Gestion des déchets' },
      label: { fr: '🗑 Mieux gérer mes déchets' },
      next: {
        default: 'track_results'
      }
    },
    {
      value: {
        ...objectifsPrioritaires,
        'questionnaire . objectif prioritaire . est faire des économies': 'oui'
      },
      title: { fr: 'Economies' },
      label: {
        fr: '💶 Faire des économies en réduisant nos pertes en énergie, matière, déchets et eau'
      },
      next: {
        default: 'track_results'
      }
    },
    {
      value: {
        ...objectifsPrioritaires,
        'questionnaire . objectif prioritaire . est la mobilité durable': 'oui'
      },
      title: { fr: 'Mobilité durable' },
      label: { fr: '🚲 Engager une démarche de mobilité durable' },
      next: {
        default: 'track_results'
      }
    },
    {
      value: {
        ...objectifsPrioritaires,
        'questionnaire . objectif prioritaire . est rénover mon bâtiment': 'oui'
      },
      title: { fr: 'Rénovation du bâtiment' },
      label: { fr: '👷 Rénover mon bâtiment' },
      next: {
        default: 'track_results'
      }
    },
    {
      value: {
        ...objectifsPrioritaires,
        'questionnaire . objectif prioritaire . est ma performance environnementale': 'oui'
      },
      title: { fr: 'Eco-conception' },
      label: { fr: '💡 Améliorer la performance environnementale de mes produits et services' },
      next: {
        default: 'track_results'
      }
    },
    {
      disabled: true,
      value: {
        ...objectifsPrioritaires,
        'questionnaire . objectif prioritaire . est investir durable': 'oui'
      },
      title: { fr: 'Consolider mon projet' },
      label: { fr: "📂 Consolider mon projet d'investissement durable" },
      next: {
        default: 'track_results'
      }
    },
    {
      disabled: true,
      value: {
        ...objectifsPrioritaires,
        'questionnaire . objectif prioritaire . est je ne sais pas encore': 'oui'
      },
      title: { fr: 'Autre' },
      label: { fr: '💁 Je ne sais pas encore' },
      next: {
        default: 'track_results'
      }
    }
  ]
}
