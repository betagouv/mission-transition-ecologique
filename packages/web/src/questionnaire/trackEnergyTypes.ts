export const energyTypes = {
  id: 'track_energy_types',
  category: 'myEnergy',
  title: { fr: "Source principale" },
  label: { fr: "Quelle est la source principale d'énergie pour vos locaux ?" },
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
      value: { energy_type : 'electric' },
      title: { fr: 'Electrique' },
      label: { fr: "⚡️ Électrique" },
      next: {
        default: 'track_strategy_audits'
      }
    },
    {
      value: { energy_type : 'gas' },
      title: { fr: "Gas" },
      label: { fr: "💨 Gaz" },
      next: {
        default: 'track_strategy_audits'
      }
    },
    {
      value: { energy_type : 'fuel' },
      title: { fr: "Fioul" },
      label: { fr: "⛽️ Essence / fioul" },
      next: {
        default: 'track_strategy_audits'
      }
    },
    {
      value: { energy_type : 'coal' },
      title: { fr: "Charbon" },
      label: { fr: "〰 Charbon" },
      next: {
        default: 'track_strategy_audits'
      }
    },
    {
      value: { energy_type : 'wood' },
      title: { fr: "Bois" },
      label: { fr: "🪵 Bois" },
      next: {
        default: 'track_strategy_audits'
      }
    },
    {
      value: { energy_type: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas ou je ne suis pas concerné" },
      next: {
        default: 'track_strategy_audits'
      }
    },
    {
      value: { energy_type: 'other' },
      title: { fr: 'Autre' },
      label: { fr: "Autre : " },
      hasInput: 'text',
      next: {
        default: 'track_strategy_audits'
      }
    },
  ]
}