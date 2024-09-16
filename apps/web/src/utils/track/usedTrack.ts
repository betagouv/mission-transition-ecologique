import { useUsedTrackStore } from '@/stores/usedTrack'
import { MobilityStatus, ThemeId, QuestionnaireDataEnum, QuestionnaireRoute, TrackId, WasteManagementStatus, YesNo } from '@/types'
import { ObjectiveChecker } from '@tee/common'

type QuestionnaireDataReturnType = {
  [QuestionnaireDataEnum.questionnaire_route]: QuestionnaireRoute
  [QuestionnaireDataEnum.priority_objective]: ThemeId
  [QuestionnaireDataEnum.sustainable_mobility_objective]: MobilityStatus | undefined
  [QuestionnaireDataEnum.energy_reduction_objective]: YesNo | undefined
  [QuestionnaireDataEnum.wastes_management_objective]: WasteManagementStatus | undefined
  [QuestionnaireDataEnum.water_reduction_objective]: YesNo | undefined
  [QuestionnaireDataEnum.wastes_materials_objective]: YesNo | undefined
  [QuestionnaireDataEnum.recently_audited]: YesNo | undefined
}

export default class UsedTrack {
  static findInQuestionnaireData<K extends keyof QuestionnaireDataReturnType>(trackId: TrackId, key: K): QuestionnaireDataReturnType[K] {
    return useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(trackId, key) as QuestionnaireDataReturnType[K]
  }

  static isNoSpecificGoal(): boolean {
    return (
      this.findInQuestionnaireData(TrackId.QuestionnaireRoute, QuestionnaireDataEnum.questionnaire_route) ===
      QuestionnaireRoute.NoSpecificGoal
    )
  }

  static isSpecificGoal(): boolean {
    return (
      this.findInQuestionnaireData(TrackId.QuestionnaireRoute, QuestionnaireDataEnum.questionnaire_route) ===
      QuestionnaireRoute.SpecificGoal
    )
  }

  static getPriorityTheme(): ThemeId {
    return this.findInQuestionnaireData(TrackId.Goals, QuestionnaireDataEnum.priority_objective)
  }

  static hasPriorityTheme(): boolean {
    return this.findInQuestionnaireData(TrackId.Goals, QuestionnaireDataEnum.priority_objective) !== undefined
  }

  static isMobilityTheme(): boolean {
    return ObjectiveChecker.isSustainableMobility(
      this.findInQuestionnaireData(TrackId.MobilityWishes, QuestionnaireDataEnum.sustainable_mobility_objective)
    )
  }

  static isEnergyTheme(): boolean {
    return ObjectiveChecker.isEnergyPerformance(
      this.findInQuestionnaireData(TrackId.EnergyReductionPriority, QuestionnaireDataEnum.energy_reduction_objective)
    )
  }

  static isWasteTheme(): boolean {
    return ObjectiveChecker.isWasteManagement(
      this.findInQuestionnaireData(TrackId.WastesStake, QuestionnaireDataEnum.wastes_management_objective)
    )
  }

  static isWaterTheme(): boolean {
    return ObjectiveChecker.isWaterConsumption(
      this.findInQuestionnaireData(TrackId.WaterStake, QuestionnaireDataEnum.water_reduction_objective)
    )
  }

  static isEcoDesignTheme(): boolean {
    return ObjectiveChecker.isEcoDesign(
      this.findInQuestionnaireData(TrackId.WastesMaterials, QuestionnaireDataEnum.wastes_materials_objective)
    )
  }

  static isEnvironmentalImpactTheme(): boolean {
    return ObjectiveChecker.isEnvironmentalImpact(this.findInQuestionnaireData(TrackId.Goals, QuestionnaireDataEnum.recently_audited))
  }
}
