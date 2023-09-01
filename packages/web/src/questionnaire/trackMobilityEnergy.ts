export const mobilityEnergy = {
  id: 'track_mobility_energy',
  category: 'mobility',
  title: { fr: 'Energie des véhicules' },
  label: { fr: "Quelle est la source principale d'énergie de vos véhicules ?" },
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
      value: { mobility_energy: 'gas' },
      title: { fr: 'Essence ou gasoil' },
      label: { fr: "⛽️ Essence ou gasoil" },
      next: {
        default: 'track_wastes_stake'
      }
    },
    {
      value: { mobility_energy: 'electric' },
      title: { fr: "Electrique" },
      label: { fr: "⚡️ Electrique" },
      next: {
        default: 'track_wastes_stake'
      }
    },
    {
      value: { mobility_energy: 'hybrid' },
      title: { fr: 'Hybride' },
      label: { fr: "⛽️⚡️ Hybride" },
      next: {
        default: 'track_wastes_stake'
      }
    },
    {
      value: { mobility: 'other' },
      title: { fr: 'Autre' },
      label: { fr: "Autre : " },
      hasInput: 'text',
      next: {
        default: 'track_wastes_stake'
      }
    },
    {
      value: { mobility_energy: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas" },
      next: {
        default: 'track_wastes_stake'
      }
    }
  ]
}