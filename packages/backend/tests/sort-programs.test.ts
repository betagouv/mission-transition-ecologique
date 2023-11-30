import { sortPrograms } from '@tee/backend/src/domain/sort-programs'
import { ProgramAidType, ProgramData } from '@tee/web/src/types'
import { makeProgramHelper } from './testing'

const makeProgram = (id: string, cost: string, nature: ProgramAidType) =>
  makeProgramHelper({
    id: id,
    cost: cost,
    nature: nature
  })

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
      programs: [makeProgram('1', '', ProgramAidType.acc)],
      expectedIdOrder: ['1']
    },
    {
      name: 'free coaching first 1',
      programs: [
        makeProgram('1', 'gratuit', ProgramAidType.acc),
        makeProgram('2', '', ProgramAidType.acc)
      ],
      expectedIdOrder: ['1', '2']
    },
    {
      name: 'free coaching first 2',
      programs: [
        makeProgram('1', '', ProgramAidType.acc),
        makeProgram('2', 'gratuit', ProgramAidType.acc)
      ],
      expectedIdOrder: ['2', '1']
    },
    {
      name: 'free coaching first 3 (case insensitive)',
      programs: [
        makeProgram('1', '', ProgramAidType.acc),
        makeProgram('2', 'Gratuit', ProgramAidType.acc)
      ],
      expectedIdOrder: ['2', '1']
    },
    {
      name: 'maybe free coaching second 1',
      programs: [
        makeProgram('1', '', ProgramAidType.acc),
        makeProgram('2', 'Sur devis (gratuit en bretagne)', ProgramAidType.acc),
        makeProgram('3', 'gratuit', ProgramAidType.acc)
      ],
      expectedIdOrder: ['3', '2', '1']
    },
    {
      name: 'maybe free coaching second 2 (case insensitive)',
      programs: [
        makeProgram('1', '', ProgramAidType.acc),
        makeProgram('2', 'Sur devis (Gratuit en bretagne)', ProgramAidType.acc),
        makeProgram('3', 'gratuit', ProgramAidType.acc)
      ],
      expectedIdOrder: ['3', '2', '1']
    },
    {
      name: 'coaching over other types (case insensitive)',
      programs: [
        makeProgram('1', '', ProgramAidType.fund),
        makeProgram('2', '', ProgramAidType.acc)
      ],
      expectedIdOrder: ['2', '1']
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
