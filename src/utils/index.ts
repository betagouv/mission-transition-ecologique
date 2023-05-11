import { status } from './choicesStatus'
import { needs } from './choicesNeeds'
import { sectors } from './choicesSectors'
import { sizes } from './choicesStructureSizes'
import { contactForm } from './choicesContactForm'
import { results } from './choicesResults'

export const tracks = [
  needs,          // project_needs
  status,         // project_status
  sectors,        // project_sectors  
  sizes,          // project_sizes
  contactForm,    // contact_form
  results         // results
]
