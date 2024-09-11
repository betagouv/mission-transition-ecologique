import { ProgramYamlGenerator } from './program/programYamlGenerator'

console.log('Start the program Yamls generation')

new ProgramYamlGenerator()
  .createProgramYamls()
  .then(() => {
    console.log('Program Yamls generated')
  })
  .catch((error) => {
    console.error('Error during the program Yamls generation:', error)
  })
