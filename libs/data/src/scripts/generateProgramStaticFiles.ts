import { ProgramFeatures } from '../program/programFeatures'

console.log('Start the program Update')

new ProgramFeatures()
  .updatePrograms()
  .then(() => console.log('Program Updated'))
  .catch((error) => console.error('Error during the program update:', error))
