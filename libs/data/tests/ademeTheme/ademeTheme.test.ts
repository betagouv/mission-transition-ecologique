import { describe, expect, test } from 'vitest'
import { AdemeThemeBaserow } from '../../src/common/baserow/ademeThemeBaserow'
import { AdemeThemeReferential } from '../../src/ademeTheme/ademeThemeReferential'
import { AdemeTheme } from '../../src/ademeTheme/types/domain'
import { setAdemeThemes } from '../../src/program/programDto/ademeThemeDto'
import { ProgramDto } from '../../src/program/programDto/programDto'
import { Logger } from '../../src/common/logger/logger'
import { LoggerMock } from '../logger.mock'
import { makeMockProgram } from '../mockData/mockProgram.factory'

const water: AdemeTheme = { id: 96, code: '19_03', parentCode: '19', label: 'Eau' }
const society: AdemeTheme = { id: 93, code: '19', parentCode: null, label: 'Société et politiques publiques' }
const energy: AdemeTheme = { id: 40, code: '08', parentCode: null, label: 'Energies' }

describe('AdemeThemeBaserow.convertToDomain', () => {
  test('converts a root theme with a null parent code', () => {
    expect(AdemeThemeBaserow.convertToDomain({ id: 40, THEME_ADEME: 'Energies', CODE: '08', CODE_PERE: '', LIBELLE: 'Energies' })).toEqual(
      energy
    )
  })

  test('converts a sub theme and trims the values', () => {
    expect(
      AdemeThemeBaserow.convertToDomain({
        id: 96,
        THEME_ADEME: 'Société et politiques publiques > Eau',
        CODE: ' 19_03 ',
        CODE_PERE: '19 ',
        LIBELLE: 'Eau '
      })
    ).toEqual(water)
  })
})

describe('AdemeThemeReferential.build', () => {
  test('sorts by code, so that parents come before their children, and drops the Baserow id', () => {
    expect(AdemeThemeReferential.build([water, society, energy])).toEqual([
      { code: '08', parentCode: null, label: 'Energies' },
      { code: '19', parentCode: null, label: 'Société et politiques publiques' },
      { code: '19_03', parentCode: '19', label: 'Eau' }
    ])
  })

  test('ignores themes without code and duplicated codes', () => {
    const withoutCode: AdemeTheme = { id: 1, code: '', parentCode: null, label: 'Sans code' }
    const duplicate: AdemeTheme = { ...energy, id: 41, label: 'Doublon' }
    expect(AdemeThemeReferential.build([energy, withoutCode, duplicate])).toEqual([{ code: '08', parentCode: null, label: 'Energies' }])
  })
})

describe('setAdemeThemes', () => {
  const buildGenerator = (themes: AdemeTheme[]) =>
    new ProgramDto(makeMockProgram({ 'Thème ADEME': themes }), new LoggerMock() as unknown as Logger)

  test('exports the codes of the program themes, in the Baserow order', () => {
    const generator = buildGenerator([society, water, energy])
    setAdemeThemes(generator)
    expect(generator.programData['ademeThemes']).toEqual(['19', '19_03', '08'])
  })

  test('does not add the property when the program has no theme', () => {
    const generator = buildGenerator([])
    setAdemeThemes(generator)
    expect(generator.programData).not.toHaveProperty('ademeThemes')
  })

  test('ignores themes without code and duplicated codes', () => {
    const generator = buildGenerator([energy, { id: 1, code: '', parentCode: null, label: 'Sans code' }, energy])
    setAdemeThemes(generator)
    expect(generator.programData['ademeThemes']).toEqual(['08'])
  })
})
