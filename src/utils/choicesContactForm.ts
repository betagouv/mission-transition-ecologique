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
          required: true,
          type: 'text'
        },
        {
          id: 'tel',
          label: { fr: 'Téléphone'},
          hint: { fr: '06 05 04 03 02' },
          required: true,
          type: 'text'
        },
        {
          id: 'email',
          label: { fr: 'Email'},
          hint: { fr: 'camille@dujardin.fr' },
          required: false,
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
          hint: { fr: 'Je sais pas...' },
          required: false,
          type: 'textarea'
        },
      ],
      next: {
        default: 'results'
      }
    }
  ]
}