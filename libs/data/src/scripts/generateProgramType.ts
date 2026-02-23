import { ProgramFeatures } from '../program/programFeatures'

console.log('▶ Starting Program type generation')

new ProgramFeatures()
  .generateProgramType()
  .then(() => console.log('Program type generated successfully'))
  .catch((error) => console.error('Error during Program type generation:', error))
