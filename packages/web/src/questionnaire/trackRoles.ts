import type { Track } from '@/types'
import { TrackComponents, TrackId } from '@/types'

export const roles: Track = {
  id: TrackId.Roles,
  category: 'myEntreprise',
  title: { fr: 'Mon rôle' },
  label: { fr: 'Quel est votre rôle ?' },
  interface: {
    component: TrackComponents.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      value: { user_roles: 'manager' },
      title: { fr: 'Gérant.e' },
      label: { fr: '🧑‍💼 Je suis gérant.e de cette entreprise' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: { user_roles: 'employee' },
      title: { fr: 'Salarié.e' },
      label: { fr: '👩‍🎤 Je suis salarié.e de cette entreprise' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: { user_roles: 'consultant' },
      title: { fr: 'Consultant.e' },
      label: { fr: '🧑‍💻 Je suis un.e consultant.e extérieur.e' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: { user_roles: '*' },
      title: { fr: 'Autre' },
      label: { fr: "💁 J'ai un autre rôle" },
      next: {
        default: TrackId.Results
      }
    }
  ]
}
