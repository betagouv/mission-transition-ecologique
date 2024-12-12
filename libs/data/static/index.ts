import { Project } from '../src/project/types/shared'
import { EnrichedOperator } from '../src/operators/types/shared'
import { default as projectsJson } from './projects.json'
import { default as projectsTestsJson } from './projects_tests.json'
import operatorsJson from './operators.json'

let projects = projectsJson as unknown as Project[]

if (process.env['VITE_DATA_TEST'] === 'true') {
  projects = projectsTestsJson as unknown as Project[]
}
export { projects }

const enrichedOperators: EnrichedOperator[] = operatorsJson as unknown as EnrichedOperator[]
export { enrichedOperators }
