import { Result } from 'true-myth'
import { LegalCategory, QuestionnaireChecker, QuestionnaireData, SizeToWorkforce, StructureSize, ThemeId } from '@tee/common'
import { EligibilityData, ProgramType } from '@tee/data'
import { EligibilityEvaluator } from './spi'

export class ProgramEligibilityEvaluator implements EligibilityEvaluator {
  evaluate(program: ProgramType, questionnaireData: QuestionnaireData): Result<boolean | undefined, Error> {
    try {
      const eligibility: EligibilityData = program.eligibilityData
      if (!this.isDateValid(eligibility)) {
        // console.log('date false')
        return Result.ok(false)
      }

      if (!this.matchCompanyConditions(eligibility, questionnaireData)) {
        // console.log('company false')

        return Result.ok(false)
      }

      if (!this.matchObjectives(eligibility, questionnaireData)) {
        // console.log('objective false')

        return Result.ok(false)
      }

      return Result.ok(true)
    } catch (err) {
      return Result.err(
        new Error('Error during the eligibility evaluation', {
          cause: err
        })
      )
    }
  }

  private isDateValid(eligibility: EligibilityData): boolean {
    if (!eligibility.validity) {
      return true
    }
    const validity = eligibility.validity

    const now = new Date()
    if (validity.start) {
      const start = this.parseDate(validity.start)
      if (start && now < start) {
        return false
      }
    }
    if (validity.end) {
      const end = this.parseDate(validity.end)

      if (end && now > end) {
        return false
      }
    }
    return true
  }
  private parseDate(dateStr: string): Date | undefined {
    const [d, m, y] = dateStr.split('/')
    if (!d || !m || !y) {
      return undefined
    }
    return new Date(Number(y), Number(m) - 1, Number(d))
  }

  private matchCompanyConditions(eligibility: EligibilityData, data: QuestionnaireData): boolean {
    const companyConditions = eligibility.company
    if (!companyConditions) {
      return true
    }

    // employees
    if (data.structure_size) {
      const companyWorkforce = SizeToWorkforce[data.structure_size]
      // CF preprocessInputForPublicodes
      if (data.structure_size != StructureSize.EI) {
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
        // i believe we arn't using legalcategory to account for the manual data
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

  private matchObjectives(eligibility: EligibilityData, data: QuestionnaireData): boolean {
    const allowedObjectives = eligibility.questionnaire?.priorityObjectives
    if (!allowedObjectives || allowedObjectives.length === 0) {
      return true // no restriction on objectives
    }

    // Build temporary objectives array based on questionnaire data
    const objectivesFromQuestionnaire: string[] = []

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

    // Check if any of the objectives from questionnaire match allowed objectives
    return objectivesFromQuestionnaire.some((obj) => allowedObjectives.includes(obj))
  }
}
