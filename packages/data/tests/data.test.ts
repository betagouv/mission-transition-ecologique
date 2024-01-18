import Ajv from 'ajv/dist/2020'
import { ValidateFunction } from 'ajv'
import programSchema from '../schemas/program-data-schema.json'
import regionSchema from '../schemas/region-data-schema.json'
import regionData from '../../web/public/data/references/com_codes.json'
import { ensureError } from '@tee/backend/src/common/domain/error/errors'

import { prependInterface, readPrograms } from '../src/dataPipeline'

import Engine from 'publicodes'

test('JSON Schema is valid', () => {
  expect(new Ajv().compile(programSchema)).not.toThrow()
})

test('Data is valid against the JSON schema', () => {
  const validate = compileSchema(programSchema)

  const programs = readPrograms()

  programs.forEach((p) => {
    const { id: id, ...programWithoutId } = p
    testDataAgainstSchema(programWithoutId, `Data for the program with id ${id}`, validate)
  })
})

test('Publicode data is valid when appended with interface', () => {
  let programs = readPrograms()
  programs = prependInterface(programs)

  programs.forEach((p) => {
    try {
      expect(() => new Engine(p.publicodes as object)).not.toThrow()
    } catch (errUnknown) {
      const err = ensureError(errUnknown)
      err.message = `Program: ${p.titre}\n\n${err.message}`
      throw err // throw the error so test fails as expected
    }
  })
})

test('Region data from the passage table is consistent with what is expected in the publicodes interface', () => {
  const validate = compileSchema(regionSchema)
  testDataAgainstSchema(regionData, 'Region data', validate)
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
