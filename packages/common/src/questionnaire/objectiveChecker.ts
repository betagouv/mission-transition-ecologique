import { MobilityStatus, WasteManagementStatus, YesNo } from './types/types'

export default class ObjectiveChecker {
  static isEnvironmentalImpact(audited: YesNo) {
    return audited !== YesNo.Yes
  }

  static isEcoDesign(wastesMaterials: YesNo) {
    return wastesMaterials !== YesNo.No
  }

  static isWasteManagement(wastesManagement: WasteManagementStatus) {
    return wastesManagement === WasteManagementStatus.Yes || wastesManagement === WasteManagementStatus.Unknown
  }

  static isWaterConsumption(waterReduction: YesNo) {
    return waterReduction !== YesNo.No
  }

  static isSustainableMobility(mobilityObjective: MobilityStatus) {
    return mobilityObjective === MobilityStatus.Yes || mobilityObjective === MobilityStatus.Unknown
  }

  static isEnergyPerformance(energyReduction: YesNo) {
    return energyReduction !== YesNo.No
  }
}
