import { PublicodeObjective, Objective as ObjectiveEnum, PublicodesKeys, Theme as ThemeType } from '@/types'
import UsedTrack from '@/utils/track/usedTrack'
import ThemeCommon from '@tee/common/src/theme/theme'

export default class Theme extends ThemeCommon {
  static getTitleByValue(objective: PublicodeObjective) {
    return this.getByValue(objective)?.title ?? ''
  }

  static getImageByValue(objective: PublicodeObjective) {
    return this.getByValue(objective)?.image ?? ''
  }

  static getColorByValue(objective: PublicodeObjective) {
    return this.getByValue(objective)?.color ?? ''
  }

  static getTags(): ThemeType[] {
    const tags = []

    if (UsedTrack.isNoSpecificGoal()) {
      UsedTrack.isEnvironmentalImpactObjective()
        ? tags.push(this.getByValue(PublicodeObjective.EnvironmentalImpact) as ThemeType)
        : undefined
      UsedTrack.isEcoDesignObjective() ? tags.push(this.getByValue(PublicodeObjective.EcoDesign) as ThemeType) : undefined
      UsedTrack.isEnergyObjective() ? tags.push(this.getByValue(PublicodeObjective.EnergyPerformance) as ThemeType) : undefined
      UsedTrack.isWasteObjective() ? tags.push(this.getByValue(PublicodeObjective.WasteManagement) as ThemeType) : undefined
      UsedTrack.isWaterObjective() ? tags.push(this.getByValue(PublicodeObjective.WaterConsumption) as ThemeType) : undefined
      UsedTrack.isMobilityObjective() ? tags.push(this.getByValue(PublicodeObjective.SustainableMobility) as ThemeType) : undefined

      return tags
    }

    tags.push(...this.themes)

    return tags
  }

  static isPublicodeObjective(objective: PublicodeObjective | ''): objective is PublicodeObjective {
    return objective !== ''
  }

  static getPublicodeObjectiveByObjective(objective: ObjectiveEnum | undefined): PublicodeObjective | undefined {
    const key = Object.keys(PublicodeObjective).find(
      (key) => PublicodeObjective[key as keyof typeof PublicodeObjective] === ((PublicodesKeys.Goal + objective) as PublicodeObjective)
    ) as keyof typeof PublicodeObjective | undefined

    if (!key) {
      return undefined
    }

    return PublicodeObjective[key]
  }
}
