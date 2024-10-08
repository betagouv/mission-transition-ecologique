import { MobilityStatus, WasteManagementStatus, YesNo, BuildingProperty } from './types/types'

export class QuestionnaireChecker {
  static isEnvironmentalImpact(audited: YesNo | undefined) {
    return audited !== YesNo.Yes
  }

  static isEcoDesign(wastesMaterials: YesNo | undefined) {
    return wastesMaterials !== YesNo.No
  }

  static isWasteManagement(wastesManagement: WasteManagementStatus | undefined) {
    return (
      wastesManagement === WasteManagementStatus.Yes || wastesManagement === WasteManagementStatus.Unknown || wastesManagement === undefined
    )
  }

  static isBuildingProperty(buildingStatus: BuildingProperty | undefined) {
    return buildingStatus === BuildingProperty.Owns || buildingStatus === BuildingProperty.OwnsAndRents
  }

  static isWaterConsumption(waterReduction: YesNo | undefined) {
    return waterReduction !== YesNo.No
  }

  static isSustainableMobility(mobilityObjective: MobilityStatus | undefined) {
    return mobilityObjective === MobilityStatus.Yes || mobilityObjective === MobilityStatus.Unknown || mobilityObjective === undefined
  }

  static isEnergyPerformance(energyReduction: YesNo | undefined) {
    return energyReduction !== YesNo.No
  }
}
