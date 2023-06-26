export const siret = {
  id: 'track_siret',
  category: 'entreprise',
  title: { fr: 'Mon SIRET' },
  label: { fr: 'Quelle est votre entreprise ?' },
  info: { fr: "Cette information permet de filtrer les accompagnements en fonction de la taille de votre entreprise, de votre secteur d’activité et de votre zone géographique." },
  interface: {
    component: 'input',
  },
  behavior: {
    multipleChoices: false,
  },
  next: {
    default: 'track_structure_sizes'
  },
  options: [
    {
      id: 'search-siret',
      value: { structure_siret: undefined },
      title: { fr: 'SIRET' },
      label: { fr: "Indiquez votre numéro de SIRET" },
      placeholder: { fr: 'Nom, adresse, SIRET/SIREN...' },
      required: false,
      next: {
        default: 'track_structure_sizes'
      }
    }
  ]
}