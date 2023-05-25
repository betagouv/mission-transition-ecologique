export const results = {
  id: 'track_results',
  label: { fr: 'Résultats'},
  intro: { fr: 'Résultats'},
  interface: {
    component: 'results',
  },
  behavior: {
    static: true,
  },
  config: {
    showAlert: false,
    showResultsTitle: false,
    showProgramInfos: false,
    showProgramSubtitles: false
  },
  options: [
    {
      value: 'results.summary',
      label: { fr: "Vos résultats" },
      fields: [

      ],
      next: {
        default: false
      }
    }
  ],
  form: {
    value: 'contact_form.email',
    // label: { fr: 'Formulaire de contact' },
    intro: { fr: '<h4>Accompagnements proposés :</h4>\
      <p>\
        <ul>\
          <li>Identifier les actions ayant un impact environnemental</li>\
          <li>Échanger avec un conseiller dans la transition écologique</li>\
          <li>Élaborer un plan d&lsquo;action pour vos activités quotidiennes</li>\
        </ul>\
      </p>\
      <h5>\
        <span class="fr-icon-phone-fill" aria-hidden="true"></span>\
        Déposez votre demande, vous serez recontacté rapidement\
      </h5>\
    ' },
    fields: [
      {
        id: 'surname',
        label: { fr: 'Prénom'},
        hint: { fr: 'Camille' },
        required: true,
        type: 'text',
        cols: 6
      },
      {
        id: 'name',
        label: { fr: 'Nom'},
        hint: { fr: 'Dujardin' },
        required: true,
        type: 'text',
        cols: 6
      },
      {
        id: 'tel',
        label: { fr: 'Téléphone'},
        hint: { fr: '06 05 04 03 02' },
        required: false,
        type: 'text'
      },
      {
        id: 'email',
        label: { fr: 'Email'},
        hint: { fr: 'camille@dujardin.fr' },
        required: true,
        type: 'email'
      },
      {
        id: 'siret',
        label: { fr: 'SIRET de votre entreprise'},
        hint: { fr: '385 290 309 00454' },
        required: false,
        type: 'text'
      },
      {
        id: 'needs',
        label: { fr: 'Quel est votre besoin ?'},
        hint: { fr: 'Je ne sais pas...' },
        required: false,
        type: 'textarea'
      },
      {
        id: 'cgu',
        label: { fr: "J'accepte les CGU *"},
        hint: { fr: "Voir les Conditions Générales d'Utilisation" },
        required: true,
        type: 'checkbox'
      },
    ],
    callbacks: [
      {
        help: 'First action to trigger when the user clicks on the send button / create a contact in Brevo',
        helpDocumentation: 'https://developers.brevo.com/reference/createcontact',
        action: 'fetch',
        url: 'https://api.brevo.com/v3/contacts',
        token: 'VITE_BREVO_TOKEN',
        method: 'POST',
        dataMapping: [
          {
            from: 'env',
            id: 'VITE_BREVO_LIST_IDS',
            dataField: 'listIds'
          },
          {
            from: 'formData',
            id: 'surname',
            dataField: 'NOM'
          },
          {
            from: 'formData',
            id: 'name',
            dataField: 'PRENOM'
          },
          {
            from: 'formData',
            id: 'tel',
            dataField: 'TEL'
          },
          {
            from: 'formData',
            id: 'email',
            dataField: 'EMAIL'
          },
          {
            from: 'formData',
            id: 'siret',
            dataField: 'SIRET'
          },
          {
            from: 'formData',
            id: 'needs',
            dataField: 'FORM_NEEDS'
          },
          {
            from: 'formData',
            id: 'cgu',
            dataField: 'OPT_IN'
          },
          {
            from: 'store',
            id: 'project_needs',
            dataField: 'PROJECT_NEEDS'
          },
          {
            from: 'store',
            id: 'project_sectors',
            dataField: 'PROJECT_SECTORS'
          },
          {
            from: 'store',
            id: 'project_status',
            dataField: 'PROJECT_STATUS'
          },
          {
            from: 'store',
            id: 'structure_sizes',
            dataField: 'STRUCTURE_SIZE'
          },
        ]
      }
    ],
    // next: {
    //   default: 'track_results'
    // }
  }
}