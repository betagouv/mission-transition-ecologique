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
      // fields: [],
      next: {
        default: false
      }
    }
  ],
  form: {
    value: 'contact_form.email',
    // label: { fr: 'Formulaire de contact' },
    intro: { fr: '\
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
        required: false,
        type: 'text',
        cols: 6,
        // for debugging purposes
        defaultValue: 'Julien'
      },
      {
        id: 'name',
        label: { fr: 'Nom'},
        hint: { fr: 'Dujardin' },
        required: false,
        type: 'text',
        cols: 6,
        // for debugging purposes
        defaultValue: 'Paris'
      },
      {
        id: 'email',
        label: { fr: 'Email'},
        hint: { fr: 'camille@dujardin.fr' },
        required: true,
        type: 'email',
        // for debugging purposes
        defaultValue: 'julien.paris@gmail.com'
      },
      {
        id: 'siret',
        label: { fr: 'SIRET de votre entreprise'},
        hint: { fr: '385 290 309 00454' },
        required: false,
        type: 'text',
        cols: 12,
        // for debugging purposes
        defaultValue: '83014132100034'
      },
      {
        id: 'tel',
        label: { fr: 'Téléphone'},
        hint: { fr: '06 05 04 03 02' },
        required: false,
        type: 'text',
        cols: 12,
        // for debugging purposes
        defaultValue: '06 05 04 03 02'
      },
      {
        id: 'needs',
        label: { fr: 'Quel est votre besoin ?'},
        hint: { fr: 'Je souhaite connaître les aides pour installer des éoliennes sur mon immeuble' },
        required: false,
        type: 'textarea',
        // for debugging purposes
        defaultValue: 'Just some tests'
      },
      {
        id: 'cgu',
        label: { fr: "J'accepte les CGU *"},
        hint: { fr: "Voir les Conditions Générales d'Utilisation" },
        required: true,
        type: 'checkbox',
        // for debugging purposes
        defaultValue: true
      },
    ],
    callbacks: [
      {
        disabled: false,
        help: 'First action to trigger when the user clicks on the send button / create a contact in Brevo',
        helpDocumentation: 'https://developers.brevo.com/reference/createcontact',
        action: 'createContact',
        url: 'https://api.brevo.com/v3/contacts',
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': ''
        },
        headerApiKey: 'api-key',
        envApiKey: 'VITE_BREVO_TOKEN',
        dataStructure: {
          email: '',
          listIds: [],
          attributes: {}
        },
        dataMapping: [
          {
            from: 'formData',
            id: 'email',
            dataField: 'email',
          },
          {
            from: 'env',
            id: 'VITE_BREVO_LIST_IDS',
            dataField: 'listIds',
            asArray: true,
            sep: ',',
            type: 'integer'
          },
          {
            from: 'formData',
            id: 'surname',
            dataField: 'attributes.NOM',
          },
          {
            from: 'formData',
            id: 'name',
            dataField: 'attributes.PRENOM',
          },
          {
            from: 'formData',
            id: 'tel',
            dataField: 'attributes.TEL',
          },
          {
            from: 'formData',
            id: 'siret',
            dataField: 'attributes.SIRET',
          },
          {
            from: 'formData',
            id: 'needs',
            dataField: 'attributes.FORM_NEEDS',
          },
          {
            from: 'formData',
            id: 'cgu',
            dataField: 'attributes.OPT_IN',
          },
          {
            from: 'usedTracks',
            id: 'project_needs',
            dataField: 'attributes.PROJECT_NEEDS',
          },
          {
            from: 'usedTracks',
            id: 'project_sectors',
            dataField: 'attributes.PROJECT_SECTORS',
          },
          {
            from: 'usedTracks',
            id: 'project_status',
            dataField: 'attributes.PROJECT_STATUS',
          },
          {
            from: 'usedTracks',
            id: 'structure_sizes',
            dataField: 'attributes.STRUCTURE_SIZE',
          },
        ]
      },
      {
        disabled: false,
        help: 'Second action send a transactional email',
        helpDocumentation: 'https://developers.brevo.com/docs/send-a-transactional-email',
        action: 'sendTransactionalEmail',
        url: 'https://api.brevo.com/v3/smtp/email',
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': ''
        },
        headerApiKey: 'api-key',
        envApiKey: 'VITE_BREVO_TOKEN',
        dataStructure: {
          sender: {
            name: 'Transition Ecologique des Entreprises',
            email: ''
          },
          to: [
            {
              name: '',
              email: ''
            }
          ],
          subject: 'Test transactional email',
          htmlContent: `
            <html>
              <head></head>
              <body>
                <p>
                  Hello,
                </p>
                <p>
                  This is my first transactional
                  email sent from Brevo.
                </p>
              </body>
            </html>`
        },
        dataMapping: [
          {
            from: 'env',
            id: 'VITE_BREVO_SENDER_EMAIL',
            dataField: 'sender.email',
          },
          {
            from: 'formData',
            id: 'email',
            dataField: 'to.0.email',
          },
          {
            from: 'formData',
            id: 'name',
            dataField: 'to.0.name',
          },
        ]
      }
    ],
    // next: {
    //   default: 'track_results'
    // }
  }
}