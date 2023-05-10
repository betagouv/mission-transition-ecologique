export const contactForm = {
  interface: {
    component: 'form',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      value: 'contact_form.email',
      label: { fr: 'Formulaire de contact' },
      intro: { fr: '<h4>Accompagnements proposés:</h4>\
        <p>\
          <ul>\
            <li>identifier les actions ayant un impact environnemental</li>\
            <li>échanger avec un conseiller dans la transition écologique</li>\
            <li>élaborer un plan d&lsquo;action pour vos activités quotidiennes</li>\
          </ul>\
        </p>\
        <h5>Déposez votre demande, vous serez recontacté rapidement</h5>\
      ' },
      fields: [
        {
          id: 'name',
          label: { fr: 'Prénom et Nom'},
          hint: { fr: 'Camille Dujardin' },
          type: 'simple'
        },
        {
          id: 'tel',
          label: { fr: 'Téléphone'},
          hint: { fr: '06 05 04 03 02' },
          type: 'simple'
        },
        {
          id: 'email',
          label: { fr: 'Email'},
          hint: { fr: 'camille@dujardin.fr' },
          type: 'simple'
        },
        {
          id: 'siret',
          label: { fr: 'SIRET de votre entreprise'},
          hint: { fr: '385 290 309 00454' },
          type: 'simple'
        },
        {
          id: 'needs',
          label: { fr: 'Quel est votre besoin ?'},
          hint: { fr: 'Je sais pas...' },
          type: 'longtext'
        },
      ],
      next: {
        default: 'results'
      }
    }
  ]
}