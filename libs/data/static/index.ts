import { Project } from '../src/project/types/shared'
import { default as projectsJson } from './projects.json'
import { default as projectsTestsJson } from './projects_tests.json'

let projects = projectsJson as unknown as Project[]

if (process.env['TEST'] === 'true') {
  projects = projectsTestsJson as unknown as Project[]
}

export { projects }
