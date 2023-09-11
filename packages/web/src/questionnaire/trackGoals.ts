export const goals = {
  id: 'track_goals',
  category: 'myEntreprise',
  title: { fr: 'Mes objectifs' },
  label: { fr: "Quel est votre objectif prioritaire" },
  hint: { fr: "Je souhaite..." },
  // callout: {
  //   bgColor: '#FACF35', // 'fr-callout--green-emeraude',
  //   title: { fr : 'En avant !' },
  //   imageLeft: 'images/TEE-onboarding.png',
  //   description: { fr : 'Nous allons vous poser quelques questions pour mieux vous connaître et pouvoir vous proposer des actions personnalisées.' },
  //   hintIcon: 'fr-icon-timer-line',
  //   hint: { fr: '2 min. chrono' },
  // },
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
      value: { user_goals: 'impact', objectif: 'impact carbone' },
      title: { fr: 'Impact environnemental' },
      label: { fr: "🌱 Mesurer mon impact carbone et le réduire" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { user_goals: 'energy', objectif: 'ma performance énergétique' },
      title: { fr: "Gestion de l'énergie" },
      label: { fr: "⚡️ Améliorer la performance énergétique de mon entreprise" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { user_goals: 'trash', objectif: 'la gestion des déchets' },
      title: { fr: 'Gestion des déchets' },
      label: { fr: "🗑 Mieux gérer mes déchets" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { user_goals: 'economies', objectif: 'faire des économies' },
      title: { fr: 'Economies' },
      label: { fr: "💶 Faire des économies en réduisant nos pertes en énergie, matière, déchets et eau" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { user_goals: 'mobility', objectif: 'la mobilité durable' },
      title: { fr: 'Mobilité durable' },
      label: { fr: "🚲 Engager une démarche de mobilité durable" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { user_goals: 'renovation', objectif: 'rénover mon bâtiment' },
      title: { fr: 'Rénovation du bâtiment' },
      label: { fr: "👷 Rénover mon bâtiment" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { user_goals: 'ecoconception', objectif: 'ma performance environnementale' },
      title: { fr: 'Eco-conception' },
      label: { fr: "💡 Améliorer la performance environnementale de mes produits et services" },
      next: {
        default: 'track_results'
      }
    },
    {
      disabled: true,
      value: { user_goals: 'consolidation', objectif: 'investir durable' },
      title: { fr: 'Consolider mon projet' },
      label: { fr: "📂 Consolider mon projet d'investissement durable" },
      next: {
        default: 'track_results'
      }
    },
    {
      disabled: true,
      value: { user_goals: '*', objectif: 'je ne sais pas encore' },
      title: { fr: 'Autre' },
      label: { fr: "💁 Je ne sais pas encore" },
      next: {
        default: 'track_results'
      }
    }
  ]
}