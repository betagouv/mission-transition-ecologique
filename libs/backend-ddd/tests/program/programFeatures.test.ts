import { LegalCategory, QuestionnaireData, StructureSize, WasteManagementStatus, YesNo } from '@tee/common'
import { ProgramEligibilityType } from '@tee/data'
import { describe, expect, test } from 'vitest'
import { expectToBeErr, expectToBeOk } from '../testing'
import {
  allFixturePrograms,
  programExcludingMicroentrepreneur,
  programWithDateValidity,
  programWithEnergyObjective,
  programWithEnvironmentalObjective,
  programWithExpiredDates,
  programWithMaxEmployees,
  programWithMinEmployees,
  programWithMultipleObjectives,
  programWithNafRestriction,
  programWithRegionRestriction,
  validProgram
} from './fixtures/programFixtures'
import { makeProgramFeatures } from './testing'

describe('ProgramFeatures', () => {
  describe('getOneById', () => {
    test('should return program when it exists', () => {
      const programFeatures = makeProgramFeatures([validProgram])

      const result = programFeatures.getOneById('valid-program')

      expect(result).toBeDefined()
      expect(result?.id).toBe('valid-program')
      expect(result?.titre).toBe('Programme Valide')
    })

    test('should return undefined when program does not exist', () => {
      const programFeatures = makeProgramFeatures([validProgram])

      const result = programFeatures.getOneById('non-existent-id')

      expect(result).toBeUndefined()
    })
  })

  describe('getOneByIdWithMaybeEligibility', () => {
    test('should return Unknown eligibility when questionnaire is empty', () => {
      const programFeatures = makeProgramFeatures([validProgram])

      const result = programFeatures.getOneByIdWithMaybeEligibility('valid-program', {})

      expectToBeOk(result)
      expect(result.value.id).toBe('valid-program')
      expect(result.value.eligibility).toBe(ProgramEligibilityType.Unknown)
    })

    test('should return error when program does not exist', () => {
      const programFeatures = makeProgramFeatures([validProgram])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France'
      }

      const result = programFeatures.getOneByIdWithMaybeEligibility('non-existent-id', questionnaireData)

      expectToBeErr(result)
    })

    test('should return Eligible when program matches questionnaire criteria', () => {
      const programFeatures = makeProgramFeatures([validProgram])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.TPE
      }

      const result = programFeatures.getOneByIdWithMaybeEligibility('valid-program', questionnaireData)

      expectToBeOk(result)
      expect(result.value.id).toBe('valid-program')
      expect(result.value.eligibility).toBe(ProgramEligibilityType.Eligible)
    })
  })

  describe('getAll', () => {
    test('should return all programs from repository', () => {
      const programFeatures = makeProgramFeatures(allFixturePrograms)

      const result = programFeatures.getAll()

      expect(result).toHaveLength(allFixturePrograms.length)
      expect(result).toEqual(allFixturePrograms)
    })

    test('should return empty array when no programs exist', () => {
      const programFeatures = makeProgramFeatures([])

      const result = programFeatures.getAll()

      expect(result).toHaveLength(0)
    })
  })

  describe('getFilteredBy - Date validity conditions', () => {
    test('should mark expired programs as ProgramEol (filtered out by default)', () => {
      const programFeatures = makeProgramFeatures([programWithExpiredDates])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.TPE
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      // ProgramEol is always filtered out, even with onlyEligible: false
      expect(result.value).toHaveLength(0)
    })

    test('should keep programs with valid dates within current year', () => {
      const mockDate = new Date(2024, 2, 1)
      vi.setSystemTime(mockDate)

      const programFeatures = makeProgramFeatures([programWithDateValidity])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.TPE
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.PartiallyEligible)

      vi.useRealTimers()
    })
  })

  describe('getFilteredBy - Employee count conditions', () => {
    test('should filter out programs with minEmployees when company is too small', () => {
      const programFeatures = makeProgramFeatures([programWithMinEmployees])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.TPE, // Less than 50 employees
        onlyEligible: false // Include NotEligible in results
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.NotEligible)
    })

    test('should keep programs with minEmployees when company is large enough', () => {
      const programFeatures = makeProgramFeatures([programWithMinEmployees])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.GE // 250+ employees
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.PartiallyEligible)
    })

    test('should filter out programs with maxEmployees when company is too large', () => {
      const programFeatures = makeProgramFeatures([programWithMaxEmployees])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.GE, // 250+ employees
        onlyEligible: false // Include NotEligible in results
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.NotEligible)
    })

    test('should keep programs with maxEmployees when company is small enough', () => {
      const programFeatures = makeProgramFeatures([programWithMaxEmployees])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.ME // 50-250 employees
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.PartiallyEligible)
    })
  })

  describe('getFilteredBy - Microentrepreneur exclusion', () => {
    test('should filter out programs excluding microentrepreneur when company is EI', () => {
      const programFeatures = makeProgramFeatures([programExcludingMicroentrepreneur])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.EI,
        legalCategory: LegalCategory.EI,
        onlyEligible: false // Include NotEligible in results
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.NotEligible)
    })

    test('should keep programs excluding microentrepreneur when company is not EI', () => {
      const programFeatures = makeProgramFeatures([programExcludingMicroentrepreneur])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.TPE,
        legalCategory: LegalCategory.EI
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.PartiallyEligible)
    })
  })

  describe('getFilteredBy - NAF code filtering', () => {
    test('should filter out programs with NAF restrictions when code does not match', () => {
      const programFeatures = makeProgramFeatures([programWithNafRestriction])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'J', // Not in allowed sections B, C, D
        structure_size: StructureSize.TPE,
        onlyEligible: false // Include NotEligible in results
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.NotEligible)
    })

    test('should keep programs with NAF restrictions when code matches', () => {
      const programFeatures = makeProgramFeatures([programWithNafRestriction])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C', // In allowed sections
        structure_size: StructureSize.TPE
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.PartiallyEligible)
    })

    test('should keep programs when NAF code is not provided in questionnaire', () => {
      const programFeatures = makeProgramFeatures([programWithNafRestriction])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        structure_size: StructureSize.TPE
        // No codeNAF1 provided
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.PartiallyEligible)
    })
  })

  describe('getFilteredBy - Region filtering', () => {
    test('should filter out programs with region restrictions when region does not match', () => {
      const programFeatures = makeProgramFeatures([programWithRegionRestriction])

      const questionnaireData: QuestionnaireData = {
        region: 'Bretagne', // Not Île-de-France
        codeNAF1: 'C',
        structure_size: StructureSize.TPE,
        onlyEligible: false // Include NotEligible in results
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.NotEligible)
    })

    test('should keep programs with region restrictions when region matches', () => {
      const programFeatures = makeProgramFeatures([programWithRegionRestriction])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.TPE
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.PartiallyEligible)
    })

    test('should keep programs when region is not provided in questionnaire', () => {
      const programFeatures = makeProgramFeatures([programWithRegionRestriction])

      const questionnaireData: QuestionnaireData = {
        codeNAF1: 'C',
        structure_size: StructureSize.TPE
        // No region provided
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.PartiallyEligible)
    })
  })

  describe('getFilteredBy - Objectives matching', () => {
    test('should keep programs even when specific objectives do not match (building/biodiversity/RH always match)', () => {
      const programFeatures = makeProgramFeatures([programWithEnergyObjective])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.TPE,
        energy_reduction_objective: YesNo.Yes, // Does not match energy objective
        water_reduction_objective: YesNo.No,
        wastes_management_objective: WasteManagementStatus.No
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      // Building, Biodiversity, and RH are always added to objectives, so program matches
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.PartiallyEligible)
    })

    test('should keep programs when energy objective matches', () => {
      const programFeatures = makeProgramFeatures([programWithEnergyObjective])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.TPE,
        energy_reduction_objective: YesNo.Yes // Matches energy objective
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.PartiallyEligible)
    })

    test('should keep programs when environmental objective matches', () => {
      const programFeatures = makeProgramFeatures([programWithEnvironmentalObjective])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.TPE,
        recently_audited: YesNo.No // Matches environmental objective
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.PartiallyEligible)
    })

    test('should keep programs when at least one of multiple objectives matches', () => {
      const programFeatures = makeProgramFeatures([programWithMultipleObjectives])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.TPE,
        water_reduction_objective: YesNo.Yes // Matches one of the objectives (water)
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      expect(result.value).toHaveLength(1)
      expect(result.value[0].eligibility).toBe(ProgramEligibilityType.PartiallyEligible)
    })
  })

  describe('getFilteredBy - Multiple programs filtering', () => {
    test('should filter multiple programs based on different criteria', () => {
      const programFeatures = makeProgramFeatures([
        validProgram,
        programWithExpiredDates,
        programWithNafRestriction,
        programWithRegionRestriction
      ])

      const questionnaireData: QuestionnaireData = {
        region: 'Île-de-France',
        codeNAF1: 'C',
        structure_size: StructureSize.TPE
      }

      const result = programFeatures.getFilteredBy(questionnaireData)

      expectToBeOk(result)
      // ProgramEol is filtered out by default, so only 3 programs remain
      expect(result.value).toHaveLength(3)

      // Check individual eligibilities
      const validProgramResult = result.value.find((p) => p.id === 'valid-program')
      expect(validProgramResult?.eligibility).toBe(ProgramEligibilityType.Eligible)

      // Expired program should not be in results (ProgramEol filtered out)
      const expiredProgramResult = result.value.find((p) => p.id === 'program-expired')
      expect(expiredProgramResult).toBeUndefined()

      const nafProgramResult = result.value.find((p) => p.id === 'program-naf-restriction')
      expect(nafProgramResult?.eligibility).toBe(ProgramEligibilityType.PartiallyEligible)

      const regionProgramResult = result.value.find((p) => p.id === 'program-region-restriction')
      expect(regionProgramResult?.eligibility).toBe(ProgramEligibilityType.PartiallyEligible)
    })
  })
})
