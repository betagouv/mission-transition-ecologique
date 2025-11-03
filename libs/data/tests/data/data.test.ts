import Ajv from 'ajv/dist/2020'
import { ValidateFunction } from 'ajv'
import programSchema from '../../schemas/program-with-publicodes-schema.json'
import regionSchema from '../../schemas/region-data-schema.json'
import communes from '../../static/communes.json'
import { jsonPrograms } from '../../static'
import { ProgramType } from '../../src/program/types/shared'

test('JSON Schema is valid', () => {
  expect(new Ajv().compile(programSchema)).not.toThrow()
})

test('Data is valid against the JSON schema', () => {
  const validate = compileSchema(programSchema)
  const programs = jsonPrograms as unknown as ProgramType[]

  programs.forEach((p) => {
    const { id: id, ...programWithoutId } = p
    testDataAgainstSchema(programWithoutId, `Data for the program with id ${id}`, validate)
  })
})

test('Region data from the passage table is consistent with what is expected in the publicodes interface', () => {
  const validate = compileSchema(regionSchema)
  testDataAgainstSchema(communes, 'Region data', validate)
})

// Test helpers

function compileSchema(schema: object): ValidateFunction {
  return new Ajv({ verbose: true }).compile(schema)
}

function testDataAgainstSchema(data: object, dataDesc: string, validate: ValidateFunction) {
  const valid = validate(data)

  if (!valid) {
    console.log(`${dataDesc} is not valid`)
    console.log(validate.errors)
  }

  expect(valid).toBe(true)
}
