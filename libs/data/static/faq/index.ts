import { FaqSection } from '../../src'
import { default as homeJson } from './home.json'

let faqHomeJson = homeJson as unknown as FaqSection[]
let faqHomeJson = homeJson as unknown as FaqSection[]
let projects = homeJson as unknown as FaqSection[]
let projects = homeJson as unknown as FaqSection[]

if (process.env['VITE_DATA_TEST'] === 'true') {
  projects = projectsTestsJson as unknown as ProjectType[]
}
export { projects }

import operatorsJson from './operators.json'
const enrichedOperators: EnrichedOperator[] = operatorsJson as unknown as EnrichedOperator[]
export { enrichedOperators }

let jsonPrograms = programsJson as unknown as ProgramType[]

if (process.env['VITE_DATA_TEST'] === 'true') {
  jsonPrograms = programsTestJson as unknown as ProgramType[]
}

export { jsonPrograms }

export { default as communes } from './communes.json'
export { default as nafMapping } from './nafMapping.json'

const redirects: RedirectJson = untypedRedirects as unknown as RedirectJson
export { redirects }

import testimoniesJson from './testimonies.json'
import { Testimony } from '../src/testimony/types/shared'
const testimonies = testimoniesJson as unknown as Testimony[]
export { testimonies }
