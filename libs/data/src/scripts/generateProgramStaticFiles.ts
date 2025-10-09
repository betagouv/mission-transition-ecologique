import { ProgramFeatures } from '../program/programFeatures'

console.log('Start the program Yamls generation')

new ProgramFeatures()
  .updatePrograms()
  .then(() => console.log('Program Yamls generated'))
  .catch((error) => console.error('Error during the program Yamls generation:', error))
