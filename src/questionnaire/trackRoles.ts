export const roles = {
  id: 'track_roles',
  label: { fr: "Quel est votre rôle ?" },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      value: { project_sectors: 'manager' },
      label: { fr: "🧑‍💼 Je suis gérant.e de cette entreprise" },
      next: {
        default: 'track_goals'
      }
    },
    {
      value: { project_sectors: 'employee' },
      label: { fr: "👩‍🎤 Je suis salarié.e de cette entreprise" },
      next: {
        default: 'track_goals'
      }
    },
    {
      value: { project_sectors: 'consultant' },
      label: { fr: "🧑‍💻 Je suis un.e consultant.e extérieur.e" },
      next: {
        default: 'track_goals'
      }
    },
    {
      value: { project_sectors: '*' },
      label: { fr: "💁 J'ai un autre rôle" },
      next: {
        default: 'track_goals'
      }
    }
  ]
}