import { status } from './trackStatus'
import { needs } from './trackNeeds'
import { sectors } from './trackSectors'
import { sizes } from './trackStructureSizes'
import { contactForm } from './trackContactForm'
import { results } from './trackResults'

export const tracks = [
  needs,          // project_needs
  status,         // project_status
  sectors,        // project_sectors  
  sizes,          // project_sizes
  contactForm,    // contact_form
  results         // results
]

// export const tracksBehavior = [
//   'project_needs',
//   '&',
//   'project_status',
//   '&',
//   'project_sectors',
//   '&',
//   'project_sizes'
// ]