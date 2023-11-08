import Ajv from 'ajv/dist/2020'
import programSchema from '../schemas/program-data-schema.json'
import regionSchema from '../schemas/region-data-schema.json'
import regionData from '../../web/public/data/references/com_codes.json'

import { prependInterface, readPrograms } from '../src/dataPipeline'

import Engine from 'publicodes'

test('JSON Schema is valid', () => {
  expect(new Ajv().compile(programSchema)).not.toThrowError()
})

test('Data is valid against the JSON schema', () => {
  const validate = new Ajv({ verbose: true }).compile(programSchema)

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
  programs = prependInterface(programs)

  programs.forEach((p) => {
    expect(() => new Engine(p.publicodes as any)).not.toThrowError()
  })
})

test('Region data from the passage table is consistent with what is expected in the publicodes interface', () => {
  const validate = new Ajv({ verbose: true }).compile(regionSchema)
  const valid = validate(regionData)

  if (!valid) {
    console.log('Region data is not valid')
    console.log(validate.errors)
  }

  expect(valid).toBe(true)
})
