import { sortPrograms } from '../../src/program/domain/sortPrograms'
import { ProgramType, ProgramAidType, ProgramEligibilityStatus, ProgramTypeWithEligibility } from '@tee/data'
import { makeProgramHelper } from './testing'

const makeProgram = (id: string, nature: ProgramAidType, cost = '') => ({
  ...makeProgramHelper({
    id: id,
    nature: nature,
    cost: cost
  }),
  eligibility: ProgramEligibilityStatus.Eligible
})

const addEligibility = (programs: ProgramType[]): ProgramTypeWithEligibility[] => {
  return programs.map((program) => ({
    ...program,
    eligibility: ProgramEligibilityStatus.Eligible
  }))
}

type TestCase = {
  name: string
  programs: ProgramType[]
  expectedIdOrder: string[]
}

describe(`
 GIVEN a list of programs
  WHEN sorting the programs
EXPECT that the programs respect a set of given rules
`, () => {
  const allTestCases: TestCase[] = [
    {
      name: 'empty',
      programs: [],
      expectedIdOrder: []
    },
    {
      name: 'single program',
      programs: [makeProgram('1', ProgramAidType.study)],
      expectedIdOrder: ['1']
    },
    {
      name: 'no reordering of coaching/training 1',
      programs: [makeProgram('1', ProgramAidType.train), makeProgram('2', ProgramAidType.study)],
      expectedIdOrder: ['1', '2']
    },
    {
      name: 'no reordering of coaching/training 2',
      programs: [makeProgram('1', ProgramAidType.study), makeProgram('2', ProgramAidType.train)],
      expectedIdOrder: ['1', '2']
    },
    {
      name: 'free coaching first 1',
      programs: [makeProgram('1', ProgramAidType.study), makeProgram('2', ProgramAidType.study, 'gratuit')],
      expectedIdOrder: ['2', '1']
    },
    {
      name: 'free coaching first 2 (case insensitive)',
      programs: [makeProgram('1', ProgramAidType.study), makeProgram('2', ProgramAidType.study, 'Gratuit')],
      expectedIdOrder: ['2', '1']
    },
    {
      name: 'possible free coaching second 1',
      programs: [
        makeProgram('1', ProgramAidType.study),
        makeProgram('2', ProgramAidType.study, 'Sur devis (gratuit en bretagne)'),
        makeProgram('3', ProgramAidType.study, 'gratuit')
      ],
      expectedIdOrder: ['3', '2', '1']
    },
    {
      name: 'possible free coaching second 2 (case insensitive)',
      programs: [
        makeProgram('1', ProgramAidType.study),
        makeProgram('2', ProgramAidType.study, 'Sur devis (Gratuit en bretagne)'),
        makeProgram('3', ProgramAidType.study, 'gratuit')
      ],
      expectedIdOrder: ['3', '2', '1']
    },
    {
      name: 'correct ordering of types',
      programs: [
        makeProgram('1', ProgramAidType.tax),
        makeProgram('2', ProgramAidType.loan),
        makeProgram('3', ProgramAidType.fund),
        makeProgram('4', ProgramAidType.train),
        makeProgram('5', ProgramAidType.study),
        makeProgram('6', ProgramAidType.study, 'Sur devis (Gratuit en bretagne)'),
        makeProgram('7', ProgramAidType.study, 'gratuit')
      ],
      expectedIdOrder: ['7', '6', '4', '5', '3', '2', '1']
    }
  ]

  allTestCases.map((tc) => {
    test(tc.name, () => {
      const sortedPrograms = sortPrograms(addEligibility(tc.programs))
      expect(sortedPrograms).toHaveLength(tc.expectedIdOrder.length)

      const expectedSortedPrograms = tc.expectedIdOrder.map((id) => {
        return tc.programs.find((prog) => prog.id === id)
      })
      expect(sortedPrograms).toStrictEqual(expectedSortedPrograms)
    })
  })
})
