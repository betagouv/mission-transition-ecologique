import { Project } from '../src/project/types/shared'
import { EnrichedOperator } from '../src/operators/types/shared'
import { default as projectsJson } from './projects.json'
import { default as projectsTestsJson } from './projects_tests.json'
import operatorsJson from './operators.json'
import { ProgramType } from '../src/program/program'
import { default as jsonProgramsProd } from './programs.json'
import { default as jsonProgramsTests } from './programs_tests.json'

let projects = projectsJson as unknown as Project[]

if (process.env['TEST'] === 'true') {
  projects = projectsTestsJson as unknown as Project[]
}
export { projects }

const enrichedOperators: EnrichedOperator[] = operatorsJson as unknown as EnrichedOperator[]
export { enrichedOperators }

let jsonPrograms = jsonProgramsProd as unknown as ProgramType[]

if (process.env['TEST'] === 'true') {
  jsonPrograms = jsonProgramsTests as unknown as ProgramType[]
}

export { jsonPrograms }
