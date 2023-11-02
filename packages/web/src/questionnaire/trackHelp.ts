export const help = {
  id: 'track_help',
  category: 'ourHelp',
  title: { fr: 'Par où commencer ?' },
  label: { fr: "Comment pouvons-nous vous aider ?" },
  callout: {
    bgColor: '#FACF35', // 'fr-callout--green-emeraude',
    title: { fr : 'En avant !' },
    imageLeft: 'images/TEE-onboarding.png',
    description: { fr : 'Nous allons vous poser quelques questions pour pouvoir identifier les accompagnements et les financements dont vous pouvez bénéficier.' },
    hintIcon: 'fr-icon-timer-line'
  },
  interface: {
    component: 'cards',
    columnWidth: 6,
  },
  behavior: {
    multipleChoices: false,
  },
  next: {
    default: 'track_results'
  },
  options: [
    {
      value: { user_help: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas par où commencer" },
      resume: { fr: 'Faisons un état des lieux à 360° sur votre empreinte carbone : énergie, eau, déchets, mobilité...' },
      hintImage: { fr: '5 min. chrono !' },
      hintImageIcon: 'fr-icon-timer-line',
      imageTop: 'images/tracks/je-ne-sais-pas-par-ou-commencer.svg',
      next: {
        default: 'track_siret'
      }
    },
    {
      value: { user_help: 'precise' },
      title: { fr: "J'ai un objectif" },
      label: { fr: "J'ai un objectif précis en tête" },
      resume: { fr: 'Trouvons les accompagnements et financements qui peuvent vous aider à réaliser votre projet' },
      hintImage: { fr: '2 min. chrono !' },
      hintImageIcon: 'fr-icon-timer-line',
      imageTop: 'images/tracks/j-ai-un-obectif.svg',
      next: {
        default: 'track_siret'
      }
    },
    {
      disabled: true,
      value: { user_help: 'direct' },
      title: { fr: "Résultats" },
      label: { fr: "Les résultas" },
      resume: { fr: 'Accès direct à tous les résultats' },
      hintImage: { fr: '0 min. chrono !' },
      hintImageIcon: 'fr-icon-timer-line',
      imageTop: 'images/tracks/j-ai-un-obectif.svg',
      next: {
        default: 'track_results'
      }
    }
  ]
}