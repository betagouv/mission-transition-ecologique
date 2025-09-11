// #####> PROJECTS ######
import { ProjectType } from '../src/project/types/shared'
import { default as projectsJson } from './projects.json'
import { default as projectsTestsJson } from './projects_tests.json'

let projects = projectsJson as unknown as ProjectType[]

if (process.env['VITE_DATA_TEST'] === 'true') {
  projects = projectsTestsJson as unknown as ProjectType[]
}
export { projects }

// #####> OPERATORS ######
import { EnrichedOperator } from '../src/operators/types/shared'
import operatorsJson from './operators.json'

const enrichedOperators: EnrichedOperator[] = operatorsJson as unknown as EnrichedOperator[]
export { enrichedOperators }

// #####> PROGRAMS ######
import { ProgramType } from '../src/program/types/shared'
import { default as programsJson } from './programs.json'
import { default as programsTestJson } from './programs_tests.json'

let jsonPrograms = programsJson as unknown as ProgramType[]

if (process.env['VITE_DATA_TEST'] === 'true') {
  jsonPrograms = programsTestJson as unknown as ProgramType[]
}

export { jsonPrograms }

// #####> REDIRECTS ######
import { default as untypedRedirects } from './redirects.json'
import { RedirectJson } from '../src/common/redirect/types'

const redirects: RedirectJson = untypedRedirects as unknown as RedirectJson
export { redirects }

// #####> OTHERS DATA ######
export { default as communes } from './communes.json'
export { default as nafMapping } from './nafMapping.json'
