import type { Track } from '@/types'
import { TrackComponents, TrackId } from '@/types'

export const sizes: Track = {
  id: TrackId.StructureSizes,
  category: 'myEntreprise',
  title: { fr: 'Mon entreprise' },
  label: { fr: 'Quelle est la taille de votre entreprise ?' },
  interface: {
    component: TrackComponents.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      value: { structure_sizes: 'TPE' },
      title: { fr: 'TPE' },
      label: { fr: 'TPE (moins de 20 salarié.e.s)' },
      next: {
        default: TrackId.Sectors
      }
    },
    {
      value: { structure_sizes: 'PME' },
      title: { fr: 'PME' },
      label: { fr: 'PME (entre 20 et 249 salarié.e.s)' },
      next: {
        default: TrackId.Sectors
      }
    },
    {
      disabled: false,
      value: { structure_sizes: 'Etablissement de Taille Intermédiaire (ETI)' },
      title: { fr: 'ETI' },
      label: { fr: 'ETI (entre 250 et 5000 salarié.e.s)' },
      next: {
        default: TrackId.Sectors
      }
    },
    {
      disabled: false,
      value: { structure_sizes: 'Grande Entreprise (GE)' },
      title: { fr: 'GE' },
      label: { fr: 'GE (plus de 5000 salarié.e.s)' },
      next: {
        default: TrackId.Sectors
      }
    }
  ]
}
