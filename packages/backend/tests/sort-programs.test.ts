import { sortPrograms } from '@tee/backend/src/domain/sort-programs'
import { ProgramAidType, ProgramData, TrackHelpValue } from '@tee/web/src/types'
import { makeProgramHelper } from './testing'

const makeProgram = (id: string, nature: ProgramAidType, cost: string = '') =>
  makeProgramHelper({
    id: id,
    nature: nature,
    cost: cost
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
    questionnaireRoute?: TrackHelpValue
  }

  // helper to generate `testCase`s that check that a given program type has priority over other
  // ones
  const TestProgramTypePriority = (
    priorityType: ProgramAidType,
    over: ProgramAidType[]
  ): TestCase[] => {
    return over.map((aidType) => {
      return {
        name: `${priorityType} over ${aidType}`,
        programs: [makeProgram('1', aidType), makeProgram('2', priorityType)],
        expectedIdOrder: ['2', '1']
      }
    })
  }

  // test helper
  const addQuestionnaireRoute = (
    questionnaireRoute: TrackHelpValue,
    testCases: TestCase[]
  ): TestCase[] => {
    return testCases.map((testCase) => {
      testCase.questionnaireRoute = questionnaireRoute
      return testCase
    })
  }

  // test cases independent from questionnaire route
  const testCasesCommon: TestCase[] = [
    {
      name: 'empty',
      programs: [],
      expectedIdOrder: []
    },
    {
      name: 'single program',
      programs: [makeProgram('1', ProgramAidType.acc)],
      expectedIdOrder: ['1']
    }
  ]

  // test cases for questionnaire route "Je ne sais pas par où commencer"
  const testCasesNoSpecificGoal: TestCase[] = [
    {
      name: 'free coaching first 1',
      programs: [
        makeProgram('1', ProgramAidType.acc, 'gratuit'),
        makeProgram('2', ProgramAidType.acc)
      ],
      expectedIdOrder: ['1', '2']
    },
    {
      name: 'free coaching first 2',
      programs: [
        makeProgram('1', ProgramAidType.acc),
        makeProgram('2', ProgramAidType.acc, 'gratuit')
      ],
      expectedIdOrder: ['2', '1']
    },
    {
      name: 'free coaching first 3 (case insensitive)',
      programs: [
        makeProgram('1', ProgramAidType.acc),
        makeProgram('2', ProgramAidType.acc, 'Gratuit')
      ],
      expectedIdOrder: ['2', '1']
    },
    {
      name: 'possible free coaching second 1',
      programs: [
        makeProgram('1', ProgramAidType.acc),
        makeProgram('2', ProgramAidType.acc, 'Sur devis (gratuit en bretagne)'),
        makeProgram('3', ProgramAidType.acc, 'gratuit')
      ],
      expectedIdOrder: ['3', '2', '1']
    },
    {
      name: 'possible free coaching second 2 (case insensitive)',
      programs: [
        makeProgram('1', ProgramAidType.acc),
        makeProgram('2', ProgramAidType.acc, 'Sur devis (Gratuit en bretagne)'),
        makeProgram('3', ProgramAidType.acc, 'gratuit')
      ],
      expectedIdOrder: ['3', '2', '1']
    },
    ...TestProgramTypePriority(
      ProgramAidType.acc,
      /* has priority over*/ [
        ProgramAidType.fund,
        ProgramAidType.loan,
        ProgramAidType.tax,
        ProgramAidType.train
      ]
    ),
    ...TestProgramTypePriority(
      ProgramAidType.fund,
      /*has priority over*/ [ProgramAidType.loan, ProgramAidType.tax, ProgramAidType.train]
    ),
    ...TestProgramTypePriority(
      ProgramAidType.loan,
      /*has priority over*/ [ProgramAidType.tax, ProgramAidType.train]
    ),
    ...TestProgramTypePriority(ProgramAidType.tax /*has priority over*/, [ProgramAidType.train]),
    {
      name: 'wrap up',
      programs: [
        makeProgram('1', ProgramAidType.train),
        makeProgram('2', ProgramAidType.tax),
        makeProgram('3', ProgramAidType.loan),
        makeProgram('4', ProgramAidType.fund),
        makeProgram('5', ProgramAidType.acc),
        makeProgram('6', ProgramAidType.acc, 'Sur devis (Gratuit en bretagne)'),
        makeProgram('7', ProgramAidType.acc, 'gratuit')
      ],
      expectedIdOrder: ['7', '6', '5', '4', '3', '2', '1']
    }
  ]

  // test cases for the questionnaire route "j'ai un objectif précis"
  const testCasesSpecificGoal: TestCase[] = [
    ...TestProgramTypePriority(
      ProgramAidType.fund,
      /* has priority over*/ [
        ProgramAidType.loan,
        ProgramAidType.tax,
        ProgramAidType.acc,
        ProgramAidType.train
      ]
    ),
    ...TestProgramTypePriority(
      ProgramAidType.loan,
      /*has priority over*/ [ProgramAidType.tax, ProgramAidType.acc, ProgramAidType.train]
    ),
    ...TestProgramTypePriority(
      ProgramAidType.tax,
      /*has priority over*/ [ProgramAidType.acc, ProgramAidType.train]
    ),
    ...TestProgramTypePriority(ProgramAidType.acc /*has priority over*/, [ProgramAidType.train]),

    {
      name: 'free coaching last 1',
      programs: [
        makeProgram('1', ProgramAidType.acc, 'gratuit'),
        makeProgram('2', ProgramAidType.acc)
      ],
      expectedIdOrder: ['2', '1']
    },
    {
      name: 'free coaching last 2',
      programs: [
        makeProgram('1', ProgramAidType.acc),
        makeProgram('2', ProgramAidType.acc, 'gratuit')
      ],
      expectedIdOrder: ['1', '2']
    },
    {
      name: 'free coaching last 3 (case insensitive)',
      programs: [
        makeProgram('1', ProgramAidType.acc, 'Gratuit'),
        makeProgram('2', ProgramAidType.acc)
      ],
      expectedIdOrder: ['2', '1']
    },
    {
      name: 'possible free coaching second last 1',
      programs: [
        makeProgram('1', ProgramAidType.acc, 'gratuit'),
        makeProgram('2', ProgramAidType.acc, 'Sur devis (gratuit en bretagne)'),
        makeProgram('3', ProgramAidType.acc)
      ],
      expectedIdOrder: ['3', '2', '1']
    },
    {
      name: 'possible free coaching second last 2 (case insensitive)',
      programs: [
        makeProgram('1', ProgramAidType.acc, 'gratuit'),
        makeProgram('2', ProgramAidType.acc, 'Sur devis (Gratuit en bretagne)'),
        makeProgram('3', ProgramAidType.acc)
      ],
      expectedIdOrder: ['3', '2', '1']
    }
  ]

  const allTestCases = [
    ...addQuestionnaireRoute(TrackHelpValue.Unknown, testCasesCommon),
    ...addQuestionnaireRoute(TrackHelpValue.Precise, testCasesCommon),
    ...addQuestionnaireRoute(TrackHelpValue.Unknown, testCasesNoSpecificGoal),
    ...addQuestionnaireRoute(TrackHelpValue.Precise, testCasesSpecificGoal)
  ]

  allTestCases.map((tc) => {
    test(`${tc.name}`, () => {
      const sortedPrograms = sortPrograms(tc.programs, tc.questionnaireRoute!)
      expect(sortedPrograms).toHaveLength(tc.expectedIdOrder.length)

      const expectedSortedPrograms = tc.expectedIdOrder.map((id) => {
        return tc.programs.find((prog) => prog.id === id)
      })
      expect(sortedPrograms).toStrictEqual(expectedSortedPrograms)
    })
  })
})
