// #####> PROJECTS ######
import { ProjectType } from '../src/project/types/shared'
import { default as projectsJson } from './projects.json'
import { default as projectsTestsJson } from './projects_tests.json'

let projects = projectsJson as unknown as ProjectType[]
export { projects }

// #####> PROGRAMS ######
import { ProgramType } from '../src/program/types/shared'
import { default as programsJson } from './programs.json'
import { default as programsTestJson } from './programs_tests.json'

let jsonPrograms = programsJson as unknown as ProgramType[]
export { jsonPrograms }

// Re-initializes data at runtime (called from Nitro plugin via runtimeConfig)
export function initData(isTestData: boolean) {
  projects = isTestData ? (projectsTestsJson as unknown as ProjectType[]) : (projectsJson as unknown as ProjectType[])
  jsonPrograms = isTestData ? (programsTestJson as unknown as ProgramType[]) : (programsJson as unknown as ProgramType[])
}

// Auto-init from process.env (works in dev mode when .env is loaded by Vite)
if (process.env['VITE_DATA_TEST'] === 'true') {
  initData(true)
}

// #####> REDIRECTS ######
import { default as untypedRedirects } from './redirects.json'
import { RedirectJson } from '../src/common/redirect/types'

const redirects: RedirectJson = untypedRedirects as unknown as RedirectJson
export { redirects }

// #####> OTHERS DATA ######
export { default as communes } from './communes.json'
export { default as nafMapping } from './nafMapping.json'
