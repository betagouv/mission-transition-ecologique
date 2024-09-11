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
  private _getPublicodeKey(publicodeKey: string): FiltersKeys | undefined {
    if (publicodeKey === PublicodesKeys.hasObjective) {
      return FiltersKeys.hasObjective
    }
    return undefined
  }

  private _isObjectivePublicodeData(data: unknown): data is ObjectivePublicodeData {
    return data instanceof Object && PublicodesCondition.oneOfThese in data
  }

  private _getObjective(publicodeData: ObjectivePublicodeData): Objective[] {
    const objectives: PublicodeObjective[] = publicodeData[PublicodesCondition.oneOfThese]
    return objectives.map((obj: PublicodeObjective) => PublicodeToObjectiveMapping[obj])
  }

  private _getPublicodeData(publicodeKey: FiltersKeys, publicodeData: unknown) {
    if (publicodeKey === FiltersKeys.hasObjective && this._isObjectivePublicodeData(publicodeData)) {
      return this._getObjective(publicodeData)
    }
    return null
  }

  public convertDomainToFront(program: ProgramType) {
    const { publicodes, ...frontProgram } = program
    if (publicodes) {
      const convertedProgramPublicodes = Object.keys(publicodes).reduce<{ [key in FiltersKeys]?: string[] }>((acc, publicodeKey) => {
        const convertedKey = this._getPublicodeKey(publicodeKey)
        if (convertedKey) {
          const convertedData = this._getPublicodeData(convertedKey, publicodes[publicodeKey])
          if (convertedData) {
            acc[convertedKey] = convertedData
          }
        }
        return acc
      }, {})
      return { ...frontProgram, filters: convertedProgramPublicodes }
    }
    return program
  }
}

export default FrontConverter
