export const energyStake = {
  id: 'track_energy_stake',
  category: 'energy',
  title: { fr: "L'énergie" },
  label: { fr: "Quelle est la source principale d'énergie pour vos locaux ?" },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: #000091; font-weight: 400; font-size: 1.3rem; margin-bottom: auto;',
    bgColor: '#FACF35',
    title: { fr : "Votre gestion de l'énergie" },
    titleStyle: 'color: #000091;',
    bigTitle: true,
    imageLeft: 'images/thema/thema-energie.svg',
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
      value: { energy_stake : 'electric' },
      title: { fr: 'Electrique' },
      label: { fr: "⚡️ Électrique" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { energy_stake : 'gas' },
      title: { fr: "Gas" },
      label: { fr: "💨 Gaz" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { energy_stake : 'fuel' },
      title: { fr: "Fioul" },
      label: { fr: "⛽️ Essence / fioul" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { energy_stake : 'coal' },
      title: { fr: "Charbon" },
      label: { fr: "〰 Charbon" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { energy_stake : 'wood' },
      title: { fr: "Bois" },
      label: { fr: "🪵 Bois" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { energy_stake: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas ou je ne suis pas concerné" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { energy_stake: 'other' },
      title: { fr: 'Autre' },
      label: { fr: "Autre : " },
      hasInput: 'text',
      next: {
        default: 'track_results'
      }
    },
  ]
}