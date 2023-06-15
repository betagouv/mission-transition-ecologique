import { needs } from './trackNeeds'
import { sizes } from './trackStructureSizes'
import { sectors } from './trackSectors'
import { roles } from './trackRoles'
import { goals } from './trackGoals'
import { status } from './trackStatus'
import { contactForm } from './trackContactForm'
import { results } from './trackResults'

export const tracks = [
  needs,          // project_needs
  sizes,          // project_sizes
  status,         // project_status
  roles,          // project_roles
  goals,          // project_goals
  sectors,        // project_sectors  
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