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
      label: { fr: "Formulaire de contact" },
      fields: [

      ],
      next: {
        default: 'results'
      }
    }
  ]
}