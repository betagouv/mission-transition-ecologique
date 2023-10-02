export const waterStake = {
  id: 'track_water_stake',
  category: 'myWater',
  title: { fr: "Enjeu" },
  label: { fr: "Pensez-vous avoir un enjeu important sur votre consommation d'eau ?" },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: #000091;',
    bgColor: '#E8EDFF',
    title: { fr : "Votre gestion de l'eau" },
    titleStyle: 'color: #000091;',
    bigTitle: true,
    imageLeft: 'images/thema/thema-eau.svg',
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
      value: { water_stake : 'yes' },
      title: { fr: 'Oui' },
      label: { fr: "👍 Oui, je pense que c'est un enjeu pour mon entreprise" },
      next: {
        default: 'track_energy_reduction_priority'
      }
    },
    {
      value: { water_stake : 'no' },
      title: { fr: "Non" },
      label: { fr: "👎 Non, pas vraiment" },
      next: {
        default: 'track_energy_reduction_priority'
      }
    },
    {
      value: { water_stake: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Aucune idée !" },
      next: {
        default: 'track_energy_reduction_priority'
      }
    }
  ]
}