import type { Track } from '@/types'
import { TrackComponent, TrackFieldType, TrackId } from '@/types'

export const contactForm: Track = {
  id: TrackId.ContactForm,
  title: { fr: 'Formulaire' },
  label: { fr: 'Je prends contact' },
  interface: {
    component: TrackComponent.Form
  },
  behavior: {
    multipleChoices: false
  },
  next: {
    default: TrackId.Results
  },
  options: [
    {
      value: 'contact_form.email',
      label: { fr: 'Formulaire de contact' },
      fields: [
        {
          id: 'name',
          label: { fr: 'Prénom et Nom' },
          hint: { fr: 'Camille Dujardin' },
          required: true,
          type: TrackFieldType.Text
        },
        {
          id: 'tel',
          label: { fr: 'Téléphone' },
          hint: { fr: '06 05 04 03 02' },
          required: true,
          type: TrackFieldType.Text
        },
        {
          id: 'email',
          label: { fr: 'Email' },
          hint: { fr: 'camille@dujardin.fr' },
          required: false,
          type: TrackFieldType.Email
        },
        {
          id: 'siret',
          label: { fr: 'SIRET de votre entreprise' },
          hint: { fr: '385 290 309 00454' },
          required: false,
          type: TrackFieldType.Text
        },
        {
          id: 'needs',
          label: { fr: 'Quel est votre besoin ?' },
          hint: { fr: 'Je sais pas...' },
          required: false,
          type: TrackFieldType.Textarea
        }
      ],
      next: {
        default: TrackId.Results
      }
    }
  ]
}
