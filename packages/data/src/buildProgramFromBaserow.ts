import { ProgramYamlGenerator } from './programs/program'

console.log('Start the project data generation')

new ProgramYamlGenerator()
  .createProgramYamls()
  .then(() => {
    console.log('Project data generated')
  })
  .catch((error) => {
    console.error('Error during the project data generation:', error)
  })
