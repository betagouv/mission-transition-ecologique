import { ProjectFeatures } from '../project/projectFeatures'

console.log('Start the project data generation')

new ProjectFeatures()
  .generateProjectsJson()
  .then(() => console.log('Project data generated'))
  .catch((error) => console.error('Error during the project data generation:', error))
