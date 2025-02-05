import { ProgramYamlsGenerator } from '../program/yamlGenerator/programYamlsGenerator'

console.log('Start the program Yamls generation')

new ProgramYamlsGenerator()
  .createProgramYamls()
  .then(() => {
    console.log('Program Yamls generated')
  })
  .catch((error) => {
    console.error('Error during the program Yamls generation:', error)
  })
