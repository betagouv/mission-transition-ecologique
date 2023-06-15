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
      value: { user_roles: 'manager' },
      label: { fr: "🧑‍💼 Je suis gérant.e de cette entreprise" },
      next: {
        default: 'track_goals'
      }
    },
    {
      value: { user_roles: 'employee' },
      label: { fr: "👩‍🎤 Je suis salarié.e de cette entreprise" },
      next: {
        default: 'track_goals'
      }
    },
    {
      value: { user_roles: 'consultant' },
      label: { fr: "🧑‍💻 Je suis un.e consultant.e extérieur.e" },
      next: {
        default: 'track_goals'
      }
    },
    {
      value: { user_roles: '*' },
      label: { fr: "💁 J'ai un autre rôle" },
      next: {
        default: 'track_goals'
      }
    }
  ]
}