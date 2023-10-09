import Ajv from 'ajv/dist/2020'
import schema from '../schemas/program-data-schema.json'

import { readPrograms } from '../src/dataPipeline'

test('JSON Schema is valid', () => {
  expect(new Ajv().compile(schema)).not.toThrowError()
})

test('Data is valid against the JSON schema', () => {
  const validate = new Ajv().compile(schema)

  let programs = readPrograms()

  programs.forEach((p) => {
    const { id: _, ...programWithoutId } = p
    const valid = validate(programWithoutId)
    if (!valid) console.log(validate.errors)

    expect(valid).toBe(true)
  })
})
