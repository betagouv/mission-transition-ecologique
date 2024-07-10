<<<<<<<< HEAD:libs/data/src/buildProgramJsonOutput.ts
import { readPrograms, prependInterface, buildProgramJSONOutput } from './dataPipeline'
========
import { readPrograms, prependInterface, buildProgramJson } from './dataPipeline'
>>>>>>>> origin/release/project:libs/data/src/buildProgramJson.ts
// Script

console.log('▶ Starting data consolidation (buildJsonOutput.ts)\n')

let programs = readPrograms(true)

console.log()

programs = prependInterface(programs, true)

console.log()

<<<<<<<< HEAD:libs/data/src/buildProgramJsonOutput.ts
buildProgramJSONOutput(programs)
========
buildProgramJson(programs)
>>>>>>>> origin/release/project:libs/data/src/buildProgramJson.ts
