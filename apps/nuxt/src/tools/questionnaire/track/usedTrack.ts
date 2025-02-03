import { useUsedTrackStore } from '@/stores/usedTrack'
import { MobilityStatus, ThemeId, QuestionnaireDataEnum, TrackId, WasteManagementStatus, YesNo, RouteName } from '@/types'
import { QuestionnaireChecker, BuildingProperty } from '@tee/common'
import { CompanyData } from '@/tools/companyData'
import Navigation from '@/tools/navigation'

type QuestionnaireDataReturnType = {
  [QuestionnaireDataEnum.priority_objective]: ThemeId
  [QuestionnaireDataEnum.sustainable_mobility_objective]: MobilityStatus | undefined
  [QuestionnaireDataEnum.energy_reduction_objective]: YesNo | undefined
  [QuestionnaireDataEnum.wastes_management_objective]: WasteManagementStatus | undefined
  [QuestionnaireDataEnum.water_reduction_objective]: YesNo | undefined
  [QuestionnaireDataEnum.wastes_materials_objective]: YesNo | undefined
  [QuestionnaireDataEnum.recently_audited]: YesNo | undefined
  [QuestionnaireDataEnum.building_property]: BuildingProperty
}

export default class UsedTrack {
  static findInQuestionnaireData<K extends keyof QuestionnaireDataReturnType>(trackId: TrackId, key: K): QuestionnaireDataReturnType[K] {
    return useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(trackId, key) as QuestionnaireDataReturnType[K]
  }

  static async updateQuestionnaireStep() {
    if (!new Navigation().isQuestionnaireStep()) {
      return
    }

    if (!CompanyData.isDataFull().value) {
      return
    }

    const next = CompanyData.getNextTrackStorage()

    if (!next) {
      return
    }

    await useRouter().push({
      name: RouteName.Questionnaire,
      hash: Navigation.hashByRouteName(RouteName.Questionnaire),
      params: { trackId: next },
      query: useNavigationStore().query
    })
  }

  static checkBuildingPropertyStatus(propertyStatus: BuildingProperty): boolean {
    return this.findInQuestionnaireData(TrackId.BuildingProperty, QuestionnaireDataEnum.building_property) === propertyStatus
  }

  static getPriorityTheme(): ThemeId {
    return this.findInQuestionnaireData(TrackId.Goals, QuestionnaireDataEnum.priority_objective)
  }

  static hasBuildingProperty(): boolean {
    return QuestionnaireChecker.isBuildingProperty(
      this.findInQuestionnaireData(TrackId.BuildingProperty, QuestionnaireDataEnum.building_property)
    )
  }

  static hasPriorityTheme(): boolean {
    return this.findInQuestionnaireData(TrackId.Goals, QuestionnaireDataEnum.priority_objective) !== undefined
  }

  static hasMobilityTheme(): boolean {
    return QuestionnaireChecker.isSustainableMobility(
      this.findInQuestionnaireData(TrackId.MobilityWishes, QuestionnaireDataEnum.sustainable_mobility_objective)
    )
  }

  static hasEnergyTheme(): boolean {
    return QuestionnaireChecker.isEnergyPerformance(
      this.findInQuestionnaireData(TrackId.EnergyReductionPriority, QuestionnaireDataEnum.energy_reduction_objective)
    )
  }

  static hasWasteTheme(): boolean {
    return QuestionnaireChecker.isWasteManagement(
      this.findInQuestionnaireData(TrackId.WastesStake, QuestionnaireDataEnum.wastes_management_objective)
    )
  }

  static hasWaterTheme(): boolean {
    return QuestionnaireChecker.isWaterConsumption(
      this.findInQuestionnaireData(TrackId.WaterStake, QuestionnaireDataEnum.water_reduction_objective)
    )
  }

  static hasEcoDesignTheme(): boolean {
    return QuestionnaireChecker.isEcoDesign(
      this.findInQuestionnaireData(TrackId.WastesMaterials, QuestionnaireDataEnum.wastes_materials_objective)
    )
  }

  static hasEnvironmentalImpactTheme(): boolean {
    return QuestionnaireChecker.isEnvironmentalImpact(this.findInQuestionnaireData(TrackId.Goals, QuestionnaireDataEnum.recently_audited))
  }
}
