import { sortPrograms } from '@tee/backend/src/domain/sort-programs'
import { ProgramData } from '@tee/web/src/types'
import { makeProgram } from './testing'

describe(`
 GIVEN a list of programs
  WHEN sorting the programs
EXPECT that the programs respect a set of given rules
`, () => {
  type TestCase = {
    name: string
    programs: ProgramData[]
    expectedPrograms: ProgramData[]
  }

  const program = makeProgram('')

  const testCases: TestCase[] = [
    {
      name: 'empty',
      programs: [],
      expectedPrograms: []
    },
    {
      name: 'single program',
      programs: [program],
      expectedPrograms: [program]
    }
  ]
  testCases.map((tc) => {
    test(`${tc.name}`, () => {
      expect(sortPrograms(tc.programs)).toStrictEqual(tc.expectedPrograms)
    })
  })
})
