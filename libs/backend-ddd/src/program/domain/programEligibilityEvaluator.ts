import { Result } from 'true-myth'
import { LegalCategory, QuestionnaireChecker, QuestionnaireData, SizeToWorkforce, StructureSize, ThemeId } from '@tee/common'
import { EligibilityData, ProgramEligibility, ProgramEligibilityType, ProgramType, ProgramTypeWithEligibility } from '@tee/data'
import { EligibilityEvaluator } from './spi'

export class ProgramEligibilityEvaluator implements EligibilityEvaluator {
  evaluate(program: ProgramType, questionnaireData: QuestionnaireData): Result<ProgramTypeWithEligibility, Error> {
    try {
      const eligibilityData: EligibilityData = program.eligibilityData
      if (!this._isDateValid(eligibilityData)) {
        return Result.ok({ ...program, eligibility: ProgramEligibilityType.ProgramEol })
      }

      if (!this._matchCompanyConditions(eligibilityData, questionnaireData) || !this._matchObjectives(eligibilityData, questionnaireData)) {
        return Result.ok({ ...program, eligibility: ProgramEligibilityType.NotEligible })
      }

      return Result.ok({
        ...program,
        eligibility: ProgramEligibility.isPartiallyEligible(program)
          ? ProgramEligibilityType.PartiallyEligible
          : ProgramEligibilityType.Eligible
      })
    } catch (err) {
      return Result.err(
        new Error('Error during the eligibility evaluation', {
          cause: err
        })
      )
    }
  }

  private _isDateValid(eligibility: EligibilityData): boolean {
    if (!eligibility.validity) {
      return true
    }
    const validity = eligibility.validity

    const now = new Date()
    if (validity.start) {
      const start = this._parseDate(validity.start)
      if (start && now < start) {
        return false
      }
    }
    if (validity.end) {
      const end = this._parseDate(validity.end)

      if (end && now > end) {
        return false
      }
    }
    return true
  }

  private _parseDate(dateStr: string): Date | undefined {
    const [d, m, y] = dateStr.split('/')
    if (!d || !m || !y) {
      return undefined
    }
    return new Date(Number(y), Number(m) - 1, Number(d))
  }

  private _matchCompanyConditions(eligibility: EligibilityData, data: QuestionnaireData): boolean {
    const companyConditions = eligibility.company
    if (!companyConditions) {
      return true
    }

    // employees
    if (data.structure_size) {
      const companyWorkforce = SizeToWorkforce[data.structure_size]
      // CF preprocessInputForPublicodes
      if (data.structure_size !== StructureSize.EI) {
        if (companyConditions.minEmployees) {
          if (companyWorkforce < companyConditions.minEmployees) {
            return false
          }
        }
        if (companyConditions.maxEmployees) {
          if (companyWorkforce > companyConditions.maxEmployees) {
            return false
          }
        }
      } else {
        // CF preprocessInputForPublicodes
        // I believe we aren't using legalcategory to account for the manual data
        if (companyConditions.excludeMicroentrepreneur && data.legalCategory === LegalCategory.EI) {
          return false
        }
      }
    }

    // NAF
    if (companyConditions.allowedNafSections?.length && data.codeNAF1) {
      if (!companyConditions.allowedNafSections.includes(data.codeNAF1)) {
        return false
      }
    }

    // region
    if (companyConditions.allowedRegion?.length && data.region) {
      if (!companyConditions.allowedRegion.includes(data.region)) {
        return false
      }
    }

    return true
  }

  private _matchObjectives(eligibility: EligibilityData, data: QuestionnaireData): boolean {
    const allowedObjectives = eligibility.priorityObjectives
    if (!allowedObjectives || allowedObjectives.length === 0) {
      return true // no restriction on objectives
    }

    const objectivesFromQuestionnaire: ThemeId[] = []

    if (QuestionnaireChecker.isEnvironmentalImpact(data.recently_audited)) {
      objectivesFromQuestionnaire.push(ThemeId.Environmental)
    }

    if (QuestionnaireChecker.isEcoDesign(data.wastes_materials_objective)) {
      objectivesFromQuestionnaire.push(ThemeId.EcoDesign)
    }

    if (QuestionnaireChecker.isWasteManagement(data.wastes_management_objective)) {
      objectivesFromQuestionnaire.push(ThemeId.Waste)
    }

    if (QuestionnaireChecker.isWaterConsumption(data.water_reduction_objective)) {
      objectivesFromQuestionnaire.push(ThemeId.Water)
    }

    if (QuestionnaireChecker.isSustainableMobility(data.sustainable_mobility_objective)) {
      objectivesFromQuestionnaire.push(ThemeId.Mobility)
    }

    if (QuestionnaireChecker.isEnergyPerformance(data.energy_reduction_objective)) {
      objectivesFromQuestionnaire.push(ThemeId.Energy)
    }

    if (QuestionnaireChecker.isBuildingProperty(data.building_property)) {
      objectivesFromQuestionnaire.push(ThemeId.Building)
    }

    objectivesFromQuestionnaire.push(ThemeId.Biodiversity)
    objectivesFromQuestionnaire.push(ThemeId.RH)

    return objectivesFromQuestionnaire.some((obj) => allowedObjectives.includes(obj))
  }
}
