import { readPrograms, prependInterface, buildProgramJson } from '../program/dataPipeline'

console.log('▶ Starting data consolidation (buildJsonOutput.ts)\n')

let programs = readPrograms(true)

console.log()

programs = prependInterface(programs, true)

console.log()

buildProgramJson(programs)
