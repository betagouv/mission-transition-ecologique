import { sortPrograms } from '@tee/backend/src/domain/sort-programs'
import { ProgramData } from '@tee/web/src/types'
import { makeProgramHelper } from './testing'

const makeProgram = (id: string) => makeProgramHelper({ id: id })

describe(`
 GIVEN a list of programs
  WHEN sorting the programs
EXPECT that the programs respect a set of given rules
`, () => {
  type TestCase = {
    name: string
    programs: ProgramData[]
    expectedIdOrder: string[]
  }

  const testCases: TestCase[] = [
    {
      name: 'empty',
      programs: [],
      expectedIdOrder: []
    },
    {
      name: 'single program',
      programs: [makeProgram('1')],
      expectedIdOrder: ['1']
    }
  ]
  testCases.map((tc) => {
    test(`${tc.name}`, () => {
      const sortedPrograms = sortPrograms(tc.programs)
      expect(sortedPrograms).toHaveLength(tc.expectedIdOrder.length)

      const expectedSortedPrograms = tc.expectedIdOrder.map((id) => {
        return tc.programs.find((prog) => prog.id === id)
      })
      expect(sortedPrograms).toStrictEqual(expectedSortedPrograms)
    })
  })
})
