import { status } from './choicesStatus'
import { needs } from './choicesNeeds'
import { sectors } from './choicesSectors'
import { sizes } from './choicesStructureSizes'
import { contactForm } from './choicesContactForm'
import { results } from './choicesResults'

export const tracks = [
  { 
    id: 'needs',
    label: { fr: 'Votre besoin' },
    config: needs
  },
  { 
    id: 'status',
    label: { fr: 'Statut de votre projet' },
    config: status
  },
  { 
    id: 'sectors',
    label: { fr: "Secteur d'activité" },
    config: sectors
  },
  { 
    id: 'sizes',
    label: { fr: 'Taille de votre structure' },
    config: sizes
  },
  { 
    id: 'contact_form',
    label: { fr: 'Formulaire' },
    config: contactForm
  },
  {
    id: 'results',
    label: { fr: 'Résultats'},
    config: results
  }
]
