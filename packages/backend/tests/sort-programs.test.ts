import { sortPrograms } from '@tee/backend/src/domain/sort-programs'
import { ProgramData } from '@tee/web/src/types'
import { makeProgramHelper } from './testing'

const makeProgram = (id: string) => makeProgramHelper({ id: id })
const makeCoachingProgram = (id: string, cost: string) => makeProgramHelper({ id: id, cost: cost })

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
    },
    {
      name: 'free coaching first 1',
      programs: [makeCoachingProgram('1', 'gratuit'), makeProgram('2')],
      expectedIdOrder: ['1', '2']
    },
    {
      name: 'free coaching first 2',
      programs: [makeProgram('1'), makeCoachingProgram('2', 'gratuit')],
      expectedIdOrder: ['2', '1']
    },
    {
      name: 'free coaching first 3 (case insensitive)',
      programs: [makeProgram('1'), makeCoachingProgram('2', 'Gratuit')],
      expectedIdOrder: ['2', '1']
    },
    {
      name: 'maybe free coaching second',
      programs: [
        makeProgram('1'),
        makeCoachingProgram('2', 'Sur devis (gratuit en bretagne)'),
        makeCoachingProgram('3', 'gratuit')
      ],
      expectedIdOrder: ['3', '2', '1']
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
