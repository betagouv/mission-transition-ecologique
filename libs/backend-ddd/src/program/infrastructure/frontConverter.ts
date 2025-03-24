import { PublicodesKeys, PublicodeObjective } from '@tee/common'
import { FiltersKeys, ProgramTypeForFront, ProgramTypeWithEligibility, PublicodesCondition, ThemeId } from '@tee/data'
import type { ObjectivePublicodeData } from './types'

class FrontConverter {
  private _publicodeToThemeMapping = {
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

  private _getFilterKey(publicodeKey: string): FiltersKeys | undefined {
    if (publicodeKey === PublicodesKeys.hasObjective) {
      return FiltersKeys.Theme
    }
    return undefined
  }

  private _isObjectivePublicodeData(data: unknown): data is ObjectivePublicodeData {
    return data instanceof Object && PublicodesCondition.oneOfThese in data
  }

  private _getTheme(publicodeData: ObjectivePublicodeData): ThemeId[] {
    const objectives: PublicodeObjective[] = publicodeData[PublicodesCondition.oneOfThese]
    return objectives.map((obj: PublicodeObjective) => this._publicodeToThemeMapping[obj])
  }

  private _getFilterData(publicodeData: unknown) {
    if (this._isObjectivePublicodeData(publicodeData)) {
      return this._getTheme(publicodeData)
    }
    return null
  }

  public convertDomainToFront(program: ProgramTypeWithEligibility): ProgramTypeForFront {
    const { publicodes, ...frontProgram } = program
    if (publicodes) {
      const filters = Object.keys(publicodes).reduce<{ [key in FiltersKeys]?: string[] }>((acc, publicodeKey) => {
        const filterKey = this._getFilterKey(publicodeKey)
        if (filterKey) {
          const convertedData = this._getFilterData(publicodes[publicodeKey])
          if (convertedData) {
            acc[filterKey] = convertedData
          }
        }
        return acc
      }, {})
      return { ...frontProgram, filters: filters } as ProgramTypeForFront
    }
    return frontProgram as ProgramTypeForFront
  }
}

export default FrontConverter
