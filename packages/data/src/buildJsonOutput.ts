import { readPrograms, prependConstants, buildJSONOutput } from './dataPipeline'
// Script

console.log('▶ Starting data consolidation (buildJsonOutput.ts)\n')

let programs = readPrograms(true)

console.log()

programs = prependConstants(programs)

console.log()

buildJSONOutput(programs)
