import { PublicodesKeys, FiltersKeys, PublicodeObjective, Objective } from '@tee/common'
import { ProgramType, PublicodesCondition } from '@tee/data'
import type { ObjectivePublicodeData } from './types'

const PublicodeToObjectiveMapping = {
  [PublicodeObjective.EnvironmentalImpact]: Objective.EnvironmentalImpact,
  [PublicodeObjective.EnergyPerformance]: Objective.EnergyPerformance,
  [PublicodeObjective.WaterConsumption]: Objective.WaterConsumption,
  [PublicodeObjective.BuildingRenovation]: Objective.BuildingRenovation,
  [PublicodeObjective.SustainableMobility]: Objective.SustainableMobility,
  [PublicodeObjective.WasteManagement]: Objective.WasteManagement,
  [PublicodeObjective.EcoDesign]: Objective.EcoDesign,
  [PublicodeObjective.TrainOrRecruit]: Objective.TrainOrRecruit,
  [PublicodeObjective.MakeSavings]: Objective.MakeSavings,
  [PublicodeObjective.DurablyInvest]: Objective.DurablyInvest,
  [PublicodeObjective.UnknownYet]: Objective.UnknownYet
}

class FrontConverter {
  private _getFilterKey(publicodeKey: string): FiltersKeys | undefined {
    if (publicodeKey === PublicodesKeys.hasObjective) {
      return FiltersKeys.hasTheme
    }
    return undefined
  }

  private _isObjectivePublicodeData(data: unknown): data is ObjectivePublicodeData {
    return data instanceof Object && PublicodesCondition.oneOfThese in data
  }

  private _getTheme(publicodeData: ObjectivePublicodeData): Objective[] {
    const objectives: PublicodeObjective[] = publicodeData[PublicodesCondition.oneOfThese]
    return objectives.map((obj: PublicodeObjective) => PublicodeToObjectiveMapping[obj])
  }

  private _getFilterData(publicodeData: unknown) {
    if (this._isObjectivePublicodeData(publicodeData)) {
      return this._getTheme(publicodeData)
    }
    return null
  }

  public convertDomainToFront(program: ProgramType) {
    const { publicodes, ...frontProgram } = program
    if (publicodes) {
      const programFilters = Object.keys(publicodes).reduce<{ [key in FiltersKeys]?: string[] }>((acc, publicodeKey) => {
        const filterKey = this._getFilterKey(publicodeKey)
        if (filterKey) {
          const convertedData = this._getFilterData(publicodes[publicodeKey])
          if (convertedData) {
            acc[filterKey] = convertedData
          }
        }
        return acc
      }, {})
      return { ...frontProgram, filters: programFilters }
    }
    return program
  }
}

export default FrontConverter
