import { Project } from '../src/project/types/shared'
import { EnrichedOperator } from '../src/operators/types/shared'
import { default as projectsJson } from './projects.json'
import { default as projectsTestsJson } from './projects_tests.json'
import operatorsJson from './operators.json'

let projects = projectsJson as unknown as Project[]
const projectsTest = projectsTestsJson as unknown as Project[]

if (process.env['DATA_TEST'] === 'true') {
  projects = projectsTest
}
export { projects, projectsTest }

const enrichedOperators: EnrichedOperator[] = operatorsJson as unknown as EnrichedOperator[]
export { enrichedOperators }
