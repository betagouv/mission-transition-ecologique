import { PublicodeObjective, ThemeId } from '@tee/common'

export class ThemeConverter {
  private static _publicodeToThemeMapping = {
    [PublicodeObjective.EnvironmentalImpact]: ThemeId.Environmental,
    [PublicodeObjective.EnergyPerformance]: ThemeId.Energy,
    [PublicodeObjective.WaterConsumption]: ThemeId.Water,
    [PublicodeObjective.BuildingRenovation]: ThemeId.Building,
    [PublicodeObjective.SustainableMobility]: ThemeId.Mobility,
    [PublicodeObjective.WasteManagement]: ThemeId.Waste,
    [PublicodeObjective.EcoDesign]: ThemeId.EcoDesign,
    [PublicodeObjective.TrainOrRecruit]: ThemeId.RH,
    [PublicodeObjective.MakeSavings]: ThemeId.Environmental,
    [PublicodeObjective.DurablyInvest]: ThemeId.Environmental,
    [PublicodeObjective.Biodiversity]: ThemeId.Biodiversity,
    [PublicodeObjective.UnknownYet]: ThemeId.Environmental
  }

  static toObjectives(themeIds: ThemeId[]) {
    return themeIds.map((themeId: ThemeId) => {
      const entry = Object.entries(this._publicodeToThemeMapping).find(([_, value]) => value === themeId)
      if (entry) {
        return entry[0] as PublicodeObjective
      }
      throw new Error(`No PublicodeObjective found for ThemeId: ${themeId}`)
    })
  }

  static fromObjectives(publicodeObjectives: PublicodeObjective[]) {
    return publicodeObjectives.map((obj: PublicodeObjective) => this._publicodeToThemeMapping[obj])
  }
}
