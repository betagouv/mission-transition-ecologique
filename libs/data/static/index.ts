import { Project } from '../src/project/types/shared'
import { default as projectsJson } from './projects.json'
import { default as projectsTestsJson } from './projects_tests.json'

let projects: Project[]

if (process.env['TEST'] === 'true') {
  projects = projectsTestsJson as unknown as Project[]
} else {
  projects = projectsJson as unknown as Project[]
}

export { projects }
