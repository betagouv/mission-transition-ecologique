import Engine from 'publicodes'
import { default as minimalProgram } from './minimalProgram.json'
import { preprocessInputForPublicodes } from '../../src/program/infrastructure/preprocessProgramsPublicodes'
import { ProgramType } from '@tee/data'
import { narrowInput } from '../../src/program/infrastructure/publicodes'
import { FILTERING_RULE_NAME } from '../../src/program/domain/filterPrograms'
import fs from 'fs'
import path from 'path'

describe(`new test suite`, () => {
  test('loading the minimalProgramJson', () => {
    expect(() => minimalProgram as unknown as ProgramType).not.toThrow()
  })

  test('Apply filter works on the minimalProgram', () => {
    expect(() => {
      const myProgram = minimalProgram as unknown as ProgramType
      const inputData = {}
      const preprocessedData = preprocessInputForPublicodes(inputData, myProgram, '11/12/2024')
      const engine = new Engine(myProgram.publicodes as object, { strict: { noOrphanRule: false } })
      const narrowedData = narrowInput(preprocessedData, engine)
      engine.setSituation(narrowedData)
      const evaluationResult = engine.evaluate(FILTERING_RULE_NAME)

      const logFilePath = path.resolve(__dirname, './filteringRuleResult.json')
      fs.writeFileSync(logFilePath, JSON.stringify(evaluationResult, null, 2))
    }).not.toThrow()
  })
})

// const programs = [program]
// PublicodesService.init(programs)
// const result = new ProgramFeatures(
//   makeProgramsRepository(programs),
//   testCurrentDateService,
//   PublicodesService.getInstance()
// ).getFilteredBy(questionnaireData)
