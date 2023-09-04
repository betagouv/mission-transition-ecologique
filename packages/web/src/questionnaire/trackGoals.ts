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
      value: { user_goals: 'impact' },
      title: { fr: 'Impact environnemental' },
      label: { fr: "🌱 Mesurer mon impact carbone et le réduire" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { user_goals: 'energy' },
      title: { fr: "Gestion de l'énergie" },
      label: { fr: "⚡️ Améliorer la performance énergétique de mon entreprise" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { user_goals: 'trash' },
      title: { fr: 'Gestion des déchets' },
      label: { fr: "🗑 Mieux gérer mes déchets" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { user_goals: 'economies' },
      title: { fr: 'Economies' },
      label: { fr: "💶 Faire des économies en réduisant nos pertes en énergie, matière, déchets et eau" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { user_goals: 'mobility' },
      title: { fr: 'Mobilité durable' },
      label: { fr: "🚲 Engager une démarche de mobilité durable" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { user_goals: 'renovation' },
      title: { fr: 'Rénovation du bâtiment' },
      label: { fr: "👷 Rénover mon bâtiment" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { user_goals: 'ecoconception' },
      title: { fr: 'Eco-conception' },
      label: { fr: "💡 Améliorer la performance environnementale de mes produits et services" },
      next: {
        default: 'track_results'
      }
    },
    {
      disabled: true,
      value: { user_goals: 'consolidation' },
      title: { fr: 'Consolider mon projet' },
      label: { fr: "📂 Consolider mon projet d'investissement durable" },
      next: {
        default: 'track_results'
      }
    },
    {
      disabled: true,
      value: { user_goals: '*' },
      title: { fr: 'Autre' },
      label: { fr: "💁 Je ne sais pas encore" },
      next: {
        default: 'track_results'
      }
    }
  ]
}