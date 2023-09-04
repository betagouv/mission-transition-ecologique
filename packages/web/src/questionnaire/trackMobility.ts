export const mobility = {
  id: 'track_mobility',
  category: 'myMobility',
  title: { fr: 'Mode de transport' },
  label: { fr: "Quel est le mode de transport principal des salariés pour le trajet domicile-travail ?" },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: #000091; font-weight: 400; font-size: 1.3rem; margin-bottom: auto;',
    bgColor: '#1EBEBE',
    title: { fr : 'La mobilité dans votre entreprise' },
    titleStyle: 'color: #000091;',
    bigTitle: true,
    imageLeft: 'images/thema/thema-mobilite.svg',
  },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  next: {
    default: 'track_mobility_number_vehicles'
  },
  options: [
    {
      value: { mobility: 'bus' },
      title: { fr: 'Bus' },
      label: { fr: "🚌 Le bus" },
      next: {
        default: 'track_mobility_number_vehicles'
      }
    },
    {
      value: { mobility: 'train' },
      title: { fr: "Train ou métro" },
      label: { fr: "🚆 Le train ou le métro" },
      next: {
        default: 'track_mobility_number_vehicles'
      }
    },
    {
      value: { mobility: 'car' },
      title: { fr: 'Voiture' },
      label: { fr: "🚗 La voiture" },
      next: {
        default: 'track_mobility_number_vehicles'
      }
    },
    {
      value: { mobility: 'cycle' },
      title: { fr: 'Vélo' },
      label: { fr: "🚲 Le vélo" },
      next: {
        default: 'track_mobility_number_vehicles'
      }
    },
    {
      value: { mobility: 'motorcycle' },
      title: { fr: 'Moto' },
      label: { fr: "🏍 La moto ou le scooter" },
      next: {
        default: 'track_mobility_number_vehicles'
      }
    },
    {
      value: { mobility: 'truck' },
      title: { fr: 'Camion' },
      label: { fr: "🚐 Une camionette, un véhicule de chantier ou un poids lourd" },
      next: {
        default: 'track_mobility_number_vehicles'
      }
    },
    {
      value: { mobility: 'other' },
      title: { fr: 'Autre' },
      label: { fr: "Autre : " },
      hasInput: 'text',
      next: {
        default: 'track_mobility_number_vehicles'
      }
    },
    {
      value: { mobility: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas" },
      next: {
        default: 'track_mobility_number_vehicles'
      }
    },
  ]
}