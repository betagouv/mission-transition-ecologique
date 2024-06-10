import { readPrograms, prependInterface, buildProgramJSONOutput } from './dataPipeline'
import { ProjectFeatures } from './projects/project'
// Script

console.log('▶ Starting data consolidation (buildJsonOutput.ts)\n')

let programs = readPrograms(true)

console.log()

programs = prependInterface(programs, true)

console.log()

buildProgramJSONOutput(programs)

console.log('Start the project data generation')

new ProjectFeatures()
  .buildProjectsJSONOutputs()
  .then(() => {
    console.log('Project data generated')
  })
  .catch((error) => {
    console.error('Error during the project data generation:', error)
  })
