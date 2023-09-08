export const strategyAuditsSelect = {
  id: 'track_strategy_audits_select',
  category: 'myStrategy',
  title: { fr: "Quels audits" },
  label: { fr: "Le ou lesquels ?" },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: true,
  },
  next: {
    default: 'track_results'
  },
  options: [
    {
      value: { strategy_audits_select : 'carbon_audit' },
      title: { fr: 'Oui' },
      label: { fr: "🌱 Bilan de gaz à effet de serre ou bilan carbone" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { strategy_audits_select : 'energetic_performance_audit' },
      title: { fr: "Performance énergétique" },
      label: { fr: "⚡️ ️ Audit de performance énergétique des bâtiments ou Certification ISO 50001" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { strategy_audits_select : 'energy_consumption_audit' },
      title: { fr: "Consommation d'énergie" },
      label: { fr: "⚡️ ️ Audit consommation d’énergie" },
      next: {
        default: 'track_results'
      }
    },

    {
      value: { strategy_audits_select : 'water_audit' },
      title: { fr: "Eau" },
      label: { fr: "💧 Audit eau" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { strategy_audits_select : 'wastes_audit' },
      title: { fr: "Déchets" },
      label: { fr: "🗑  Audit déchets" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { strategy_audits_select : 'raw_materials_audit' },
      title: { fr: "Matières premières" },
      label: { fr: "🧱  Audit matières premières" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: { strategy_audits_select : 'certification' },
      title: { fr: "Certification" },
      label: { fr: "🎖  Certification ISO 14001 " },
      next: {
        default: 'track_results'
      }
    },

    {
      value: { strategy_audits_select: 'other' },
      title: { fr: 'Autre' },
      label: { fr: "Autre : " },
      hasInput: 'text',
      next: {
        default: 'track_wastes_stake'
      }
    },
    {
      value: { strategy_audits_select : 'unknown' },
      title: { fr: "Je ne sais pas" },
      label: { fr: "Je ne sais pas" },
      next: {
        default: 'track_results'
      }
    }
  ]
}