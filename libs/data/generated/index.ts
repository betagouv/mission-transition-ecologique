import { ProgramType } from '../src/program/program'
import { default as jsonProgramsProd } from './dataset_out.json'
import { default as jsonProgramsTests } from './dataset_tests.json'

let jsonPrograms = jsonProgramsProd as unknown as ProgramType[]

if (process.env['DATA_TEST'] === 'true') {
  jsonPrograms = jsonProgramsTests as unknown as ProgramType[]
}

export { jsonPrograms }
