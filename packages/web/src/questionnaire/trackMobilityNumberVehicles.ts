export const mobilityNumberVehicles = {
  id: 'track_mobility_number_vehicles',
  category: 'mobility',
  title: { fr: 'Nombre de véhicules' },
  label: { fr: "Possédez-vous un ou plusieurs véhicules motorisés dans votre entreprise ?" },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  next: {
    default: 'track_mobility_energy'
  },
  options: [
    {
      value: { mobility_number_vehicles: 'yes' },
      title: { fr: 'Oui' },
      label: { fr: "Oui" },
      next: {
        default: 'track_mobility_energy'
      }
    },
    {
      value: { mobility_number_vehicles: 'no' },
      title: { fr: "Non" },
      label: { fr: "Non" },
      next: {
        default: 'track_mobility_energy'
      }
    },
    {
      value: { mobility_number_vehicles: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas" },
      next: {
        default: 'track_mobility_energy'
      }
    }
  ]
}