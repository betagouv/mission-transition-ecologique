import type { ProgramData } from '@tee/web/src/types/programTypes'
import { makeProgramHelper } from './testing'
import { filterPrograms, FILTERING_RULE_NAME } from '../src/domain/filter-programs'
import { Result, ResultNS } from 'true-myth'

const rulesBoilerplate = {
  entreprise: null,
  'entreprise . effectif': null,
  [FILTERING_RULE_NAME]: 'entreprise . effectif > 0'
}

const makeProgram = (rules: object) => makeProgramHelper({ rules: rules })

// As we do not use ES6 modules, I could not find more elegant way to import Ok
type Ok<T, E> = ResultNS.Ok<T, E>
type Err<T, E> = ResultNS.Err<T, E>

// Helper function that performs type narrowing.
// Not automatic in jest, see https://github.com/jestjs/jest/issues/10094
// Cannot use arrow functions for assertions.
// See https://github.com/microsoft/TypeScript/issues/34523

// check that `Result` is `Ok`, i.e. does not return an error
function expectToBeOk<T, E>(v: Result<T, E>): asserts v is Ok<T, E> {
  expect(v.isOk).toBe(true)
}

// check that `Result` is `Err`, i.e. returns an error
function expectToBeErr<T, E>(v: Result<T, E>): asserts v is Err<T, E> {
  expect(v.isErr).toBe(true)
}

describe(`
GIVEN  input data
  AND  a list of programs with a rule named after FILTERING_RULE_NAME with a valid publicodes expression
WHEN   filtering the programs with data that allows to fully evaluate all the rules (no missing data)
EXPECT that the filtering only keeps programs that are eligible (rule
       evaluated to true)
`, () => {
  type TestCase = {
    name: string
    inputData: Record<string, number>
    // one program is created for each rule of `rules`
    rules: string[]
    expectedProgramIndexes: number[]
  }

  const testCases: TestCase[] = [
    {
      name: 'empty',
      inputData: {},
      rules: [],
      expectedProgramIndexes: []
    },
    {
      name: 'one true',
      inputData: {},
      rules: ['oui'],
      expectedProgramIndexes: [0]
    },
    {
      name: 'one false',
      inputData: {},
      rules: ['non'],
      expectedProgramIndexes: []
    },
    {
      name: 'eligible < 20 people company',
      inputData: { 'entreprise . effectif': 12 },
      rules: ['entreprise . effectif < 20'],
      expectedProgramIndexes: [0]
    },
    {
      name: 'non eligible >= 20 people company',
      inputData: { 'entreprise . effectif': 25 },
      rules: ['entreprise . effectif < 20'],
      expectedProgramIndexes: []
    },
    {
      name: 'eligible >= 20 people company',
      inputData: { 'entreprise . effectif': 25 },
      rules: ['entreprise . effectif >= 20'],
      expectedProgramIndexes: [0]
    },
    {
      name: 'both eligible',
      inputData: { 'entreprise . effectif': 25 },
      rules: ['entreprise . effectif >= 20', 'oui'],
      expectedProgramIndexes: [0, 1]
    },
    {
      name: 'both non eligible',
      inputData: { 'entreprise . effectif': 25 },
      rules: ['non', 'entreprise . effectif < 20'],
      expectedProgramIndexes: []
    },
    {
      name: 'one of each',
      inputData: { 'entreprise . effectif': 12 },
      rules: ['non', 'entreprise . effectif < 20'],
      expectedProgramIndexes: [1]
    }
  ]

  const makePrograms = (rules: string[]): ProgramData[] => {
    const progs = rules.map((r) => {
      const completeRules = { ...rulesBoilerplate, [FILTERING_RULE_NAME]: r }
      return makeProgram(completeRules)
    })
    return progs
  }

  testCases.map((tc) => {
    test(`${tc.name}`, () => {
      const programs = makePrograms(tc.rules)

      const result = filterPrograms(programs, tc.inputData)

      expectToBeOk(result)

      const filteredPrograms = result.value
      expect(filteredPrograms.length).toBe(tc.expectedProgramIndexes.length)

      tc.expectedProgramIndexes.forEach((expectedProgramIndex, index) => {
        expect(filteredPrograms[index]).toBe(programs[expectedProgramIndex])
      })
    })
  })
})

describe(`
  GIVEN  a list of programs
  WHEN   the data does not allow to fully evaluate the eligibility rule (missing data)
  EXPECT that filterPrograms does not filter out the programs
`, () => {
  test('undefined rule', () => {
    const programs = [makeProgram(rulesBoilerplate)]
    const inputData = {}

    const result = filterPrograms(programs, inputData)

    expectToBeOk(result)
    expect(result.value.length).toBe(1)
  })
})

describe(`
  GIVEN  a program with an eligibility rules
    AND  input data
  WHEN   the data has some additional keys compared to what is expected in the rules
  EXPECT the filter programs ignores the excess data and does not return an
error`, () => {
  type TestCase = {
    name: string
    rules: object
    inputData: Record<string, number>
  }

  const testCases: TestCase[] = [
    {
      name: "keep 'entreprise . effectif', discard 'additionalProperty'",
      rules: rulesBoilerplate,
      inputData: { 'entreprise . effectif': 12, additionalProperty: 0 }
    },
    {
      name: "keep 'age', discard 'extraProperty'",
      rules: { age: 0, [FILTERING_RULE_NAME]: 'age = 0' },
      inputData: { age: 0, extraProperty: 0 }
    }
  ]

  testCases.map((tc) => {
    test(`${tc.name}`, () => {
      const result = filterPrograms([makeProgram(tc.rules)], tc.inputData)

      expectToBeOk(result)
    })
  })
})

describe(`
  GIVEN  a rule
  WHEN   the rule is not valid Publicodes
  EXPECT an explicit error
`, () => {
  test('invalid rule', () => {
    const result = filterPrograms([makeProgram({ [FILTERING_RULE_NAME]: 'invalid Publicode expression' })], {})

    expectToBeErr(result)
  })
})

describe(`
  GIVEN  input data from the questionnaire
    AND  rules that use values from the keys of "PublicodesInputData" type
   WHEN  the rules are evaluated
 EXPECT the values from "PublicodesInputData" used for evaluation are properly computed from the questionnaire data
`, () => {
  const testCodeNAFMapping = (inputNAFCode: string, programNAFCode: string) => {
    test(`"codeNaf" mapped to "entreprise . code NAF" (input: ${inputNAFCode}, program: ${programNAFCode})`, () => {
      const program = makeProgram({
        entreprise: null,
        'entreprise . code NAF': null,
        [FILTERING_RULE_NAME]: `entreprise . code NAF = "${programNAFCode}"`
      })

      const inputData = { codeNaf: inputNAFCode }

      const result = filterPrograms([program], inputData)

      expectToBeOk(result)

      const expectedLength = inputNAFCode == programNAFCode ? 1 : 0
      expect(result.value).toHaveLength(expectedLength)
    })
  }

  const testCases: { inputNAFCode: string; programNAFCode: string }[] = [
    { inputNAFCode: '12.34Z', programNAFCode: '12.34Z' },
    { inputNAFCode: '34.12Z', programNAFCode: '34.12Z' },
    { inputNAFCode: '11.11Z', programNAFCode: '99.99Z' }
  ]

  for (const testCase of testCases) {
    testCodeNAFMapping(testCase.inputNAFCode, testCase.programNAFCode)
  }
})

describe(`
  GIVEN  data from the program
    AND  rules that use values from the keys of "PublicodesInputData" type
   WHEN  the rules are evaluated
 EXPECT  the values from "PublicodesInputData" used for evaluation to be properly computed from the program data
`, () => {
  test(`"début de validité" mapped to "dispositif . début de validité", interpreted as date`, () => {
    const program = makeProgram({
      dispositif: null,
      'dispositif . début de validité': null,
      [FILTERING_RULE_NAME]: 'dispositif . début de validité > 01/01/2024'
    })

    program['début de validité'] = '19/12/2023'

    const result = filterPrograms([program], {})

    if (!result.isOk) {
      console.log(result.error)
    }
    expectToBeOk(result)

    const expectedLength = 0
    expect(result.value).toHaveLength(expectedLength)
  })

  test(`"début de validité" mapped to "dispositif . début de validité", interpreted as date 2`, () => {
    const program = makeProgram({
      dispositif: null,
      'dispositif . début de validité': null,
      [FILTERING_RULE_NAME]: 'dispositif . début de validité > 01/01/2024'
    })

    program['début de validité'] = '02/01/2024'

    const result = filterPrograms([program], {})

    if (!result.isOk) {
      console.log(result.error)
    }
    expectToBeOk(result)

    const expectedLength = 1
    expect(result.value).toHaveLength(expectedLength)
  })
})
