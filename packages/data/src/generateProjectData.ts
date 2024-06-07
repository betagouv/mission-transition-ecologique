import { ProjectRepository } from './projects/project'

console.log('Start the project data generation')

new ProjectRepository()
  .buildProjectsJSONOutputs()
  .then(() => {
    console.log('Project data generated')
  })
  .catch((error) => {
    console.error('Error during the project data generation:', error)
  })

// Note : should be executed AFTER the program generation !
