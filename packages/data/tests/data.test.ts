import Ajv from 'ajv/dist/2020'
import schema from '../schemas/program-data-schema.json'

import { prependConstants, readPrograms } from '../src/dataPipeline'

import Engine from 'publicodes'
import { FILTERING_RULE_NAME } from '@tee/backend/src/domain/eligibility'

test('JSON Schema is valid', () => {
  expect(new Ajv().compile(schema)).not.toThrowError()
})

test('Data is valid against the JSON schema', () => {
  const validate = new Ajv().compile(schema)

  const programs = readPrograms()

  programs.forEach((p) => {
    const { id: id, ...programWithoutId } = p
    const valid = validate(programWithoutId)

    if (!valid) {
      console.log('Data for the program with id', id, 'is not valid')
      console.log(validate.errors)
    }

    expect(valid).toBe(true)
  })
})

test('Publicode data is valid when appended with interface', () => {
  let programs = readPrograms()
  programs = prependConstants(programs)

  programs.forEach((p) => {
    expect(() => new Engine(p.publicodes as any)).not.toThrowError()
  })
})
