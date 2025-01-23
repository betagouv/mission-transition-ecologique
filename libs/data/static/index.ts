import { ProjectType } from '../src/project/types/shared'
import { EnrichedOperator } from '../src/operators/types/shared'
import { default as projectsJson } from './projects.json'
import { default as projectsTestsJson } from './projects_tests.json'
import operatorsJson from './operators.json'
import { ProgramType } from '../src/program/program'
import { default as programsJson } from './programs.json'
import { default as programsTestJson } from './programs_tests.json'

let projects = projectsJson as unknown as ProjectType[]

if (process.env['VITE_DATA_TEST'] === 'true') {
  projects = projectsTestsJson as unknown as ProjectType[]
}
export { projects }

const enrichedOperators: EnrichedOperator[] = operatorsJson as unknown as EnrichedOperator[]
export { enrichedOperators }

let jsonPrograms = programsJson as unknown as ProgramType[]

if (process.env['VITE_DATA_TEST'] === 'true') {
  jsonPrograms = programsTestJson as unknown as ProgramType[]
}

export { jsonPrograms }

export { default as communes } from './communes.json'
export { default as nafMapping } from './nafMapping.json'
