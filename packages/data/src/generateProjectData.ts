import { buildProjectsJSONOutputs } from './projects/buildProjectsJsonOutputs'

buildProjectsJSONOutputs().catch((error) => {
  console.error('Error in main execution:', error)
})
