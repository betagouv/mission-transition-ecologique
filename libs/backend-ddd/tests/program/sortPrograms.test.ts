import { sortPrograms } from '../../src/program/domain/sortPrograms'
import { QuestionnaireRoute } from '@tee/common'
import { ProgramType, ProgramAidType, ProgramEligibilityType, ProgramTypeWithEligibility } from '@tee/data'
import { makeProgramHelper } from './testing'

const makeProgram = (id: string, nature: ProgramAidType, cost = '') => ({
  ...makeProgramHelper({
    id: id,
    nature: nature,
    cost: cost
  }),
  eligibility: ProgramEligibilityType.Eligible
})

const addEligibility = (programs: ProgramType[]): ProgramTypeWithEligibility[] => {
  return programs.map((program) => ({
    ...program,
    eligibility: ProgramEligibilityType.Eligible
  }))
}

type TestCase = {
  name: string
  programs: ProgramType[]
  expectedIdOrder: string[]
}

type TestCaseWithQuestionnaireRoute = TestCase & { questionnaireRoute: QuestionnaireRoute }

describe(`
 GIVEN a list of programs
  WHEN sorting the programs
EXPECT that the programs respect a set of given rules
`, () => {
  // test helper
  const addQuestionnaireRoute = (questionnaireRoute: QuestionnaireRoute, testCases: TestCase[]): TestCaseWithQuestionnaireRoute[] => {
    return testCases.map((testCase) => {
      return { questionnaireRoute: questionnaireRoute, ...testCase } as TestCaseWithQuestionnaireRoute
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
    }
  ]

  // test cases for questionnaire route "Je ne sais pas par où commencer"
  const testCasesNoSpecificGoal: TestCase[] = [
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

  // test cases for the questionnaire route "j'ai un objectif précis"
  const testCasesSpecificGoal: TestCase[] = [
    {
      name: 'free coaching last 1',
      programs: [makeProgram('1', ProgramAidType.study, 'gratuit'), makeProgram('2', ProgramAidType.study)],
      expectedIdOrder: ['2', '1']
    },
    {
      name: 'free coaching last 2 (case insensitive)',
      programs: [makeProgram('1', ProgramAidType.study, 'Gratuit'), makeProgram('2', ProgramAidType.study)],
      expectedIdOrder: ['2', '1']
    },
    {
      name: 'possible free coaching second last 1',
      programs: [
        makeProgram('1', ProgramAidType.study, 'gratuit'),
        makeProgram('2', ProgramAidType.study, 'Sur devis (gratuit en bretagne)'),
        makeProgram('3', ProgramAidType.study)
      ],
      expectedIdOrder: ['3', '2', '1']
    },
    {
      name: 'possible free coaching second last 2 (case insensitive)',
      programs: [
        makeProgram('1', ProgramAidType.study, 'gratuit'),
        makeProgram('2', ProgramAidType.study, 'Sur devis (Gratuit en bretagne)'),
        makeProgram('3', ProgramAidType.study)
      ],
      expectedIdOrder: ['3', '2', '1']
    },
    {
      name: 'correct ordering of types',
      programs: [
        makeProgram('1', ProgramAidType.study, 'gratuit'),
        makeProgram('2', ProgramAidType.study, 'Sur devis (Gratuit en bretagne)'),
        makeProgram('3', ProgramAidType.study),
        makeProgram('4', ProgramAidType.train),
        makeProgram('5', ProgramAidType.tax),
        makeProgram('6', ProgramAidType.loan),
        makeProgram('7', ProgramAidType.fund)
      ],
      expectedIdOrder: ['7', '6', '5', '3', '4', '2', '1']
    }
  ]

  const allTestCases = [
    ...addQuestionnaireRoute(QuestionnaireRoute.NoSpecificGoal, testCasesCommon),
    ...addQuestionnaireRoute(QuestionnaireRoute.SpecificGoal, testCasesCommon),
    ...addQuestionnaireRoute(QuestionnaireRoute.NoSpecificGoal, testCasesNoSpecificGoal),
    ...addQuestionnaireRoute(QuestionnaireRoute.SpecificGoal, testCasesSpecificGoal)
  ]

  allTestCases.map((tc) => {
    test(`${tc.questionnaireRoute}: ${tc.name}`, () => {
      const sortedPrograms = sortPrograms(addEligibility(tc.programs), tc.questionnaireRoute)
      expect(sortedPrograms).toHaveLength(tc.expectedIdOrder.length)

      const expectedSortedPrograms = tc.expectedIdOrder.map((id) => {
        return tc.programs.find((prog) => prog.id === id)
      })
      expect(sortedPrograms).toStrictEqual(expectedSortedPrograms)
    })
  })
})
