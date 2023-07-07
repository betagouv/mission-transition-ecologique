export const goals = {
  id: 'track_goals',
  category: 'goals',
  title: { fr: 'Mes objectifs' },
  label: { fr: "Pour commencer, choisissez votre objectif prioritaire" },
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
      label: { fr: "🔍 Connaître et améliorer l’impact environnemental de mon entreprise" },
      next: {
        default: 'track_siret'
      }
    },
    {
      value: { user_goals: 'energy' },
      title: { fr: "Gestion de l'énergie" },
      label: { fr: "⚡️ Mieux gérer l’énergie dans mon entreprise" },
      next: {
        default: 'track_siret'
      }
    },
    {
      value: { user_goals: 'trash' },
      title: { fr: 'Gestion des déchets' },
      label: { fr: "🗑 Mieux gérer mes déchets" },
      next: {
        default: 'track_siret'
      }
    },
    {
      value: { user_goals: 'economies' },
      title: { fr: 'Economies' },
      label: { fr: "💦 Faire des économies rapides en réduisant nos pertes en énergie, matière, déchets et eau" },
      next: {
        default: 'track_siret'
      }
    },
    {
      value: { user_goals: 'mobility' },
      title: { fr: 'Mobilité durable' },
      label: { fr: "🚲 Engager une démarche de mobilité durable" },
      next: {
        default: 'track_siret'
      }
    },
    {
      value: { user_goals: 'renovation' },
      title: { fr: 'Rénovation du bâtiment' },
      label: { fr: "👷 Rénover mon bâtiment" },
      next: {
        default: 'track_siret'
      }
    },
    {
      value: { user_goals: 'ecoconception' },
      title: { fr: 'Eco-conception' },
      label: { fr: "♻️ Améliorer mon produit ou service dans une logique d'éco-conception" },
      next: {
        default: 'track_siret'
      }
    },
    {
      value: { user_goals: 'consolidation' },
      title: { fr: 'Consolider mon projet' },
      label: { fr: "📂 Consolider mon projet d'investissement durable" },
      next: {
        default: 'track_siret'
      }
    },
    {
      disabled: true,
      value: { user_goals: '*' },
      title: { fr: 'Autre' },
      label: { fr: "💁 Je ne sais pas encore" },
      next: {
        default: 'track_siret'
      }
    }
  ]
}