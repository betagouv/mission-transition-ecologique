export const goals = {
  id: 'track_goals',
  label: { fr: "Dites-nous en plus sur votre objectif" },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      value: { project_sectors: 'impact' },
      label: { fr: "🔍 Connaître et améliorer l’impact environnemental de mon entreprise" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { project_sectors: 'energy' },
      label: { fr: "⚡️ Mieux gérer l’énergie dans mon entreprise" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { project_sectors: 'trash' },
      label: { fr: "🗑 Mieux gérer mes déchets" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { project_sectors: 'economies' },
      label: { fr: "💦 Faire des économies rapides en réduisant nos pertes en énergie, matière, déchets et eau" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { project_sectors: 'mobility' },
      label: { fr: "🚲 Engager une démarche de mobilité durable" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { project_sectors: 'renovation' },
      label: { fr: "👷 Rénover mon bâtiment" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { project_sectors: 'consolidation' },
      label: { fr: "📂 Consolider mon projet d'investissement durable" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { project_sectors: '*' },
      label: { fr: "💁 Je ne sais pas encore" },
      next: {
        default: 'track_results'
      }
    }
  ]
}