import { PublicodeObjective, PublicodesKeys, ThemeId } from '@tee/common'
import { FiltersKeys, ProgramTypeForFront, ProgramTypeWithEligibility, PublicodesCondition } from '@tee/data'
import { ThemeConverter } from '../../common/domain/converter/ThemeConverter'
import { ProgramService } from '../../program/application/programService'
import type { ObjectivePublicodeData } from './types'

export default class FrontConverter {
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
    return ThemeConverter.fromObjectives(objectives)
  }

  private _getFilterData(publicodeData: unknown) {
    if (this._isObjectivePublicodeData(publicodeData)) {
      return this._getTheme(publicodeData)
    }
    return null
  }

  public convertDomainToFront(program: ProgramTypeWithEligibility): ProgramTypeForFront {
    return ProgramService.isPublicodesEvaluator() ? this._convertWithPublicodes(program) : this._convertFromJson(program)
  }

  private _convertWithPublicodes(program: ProgramTypeWithEligibility) {
    const { publicodes, eligibilityData: _eligibilityData, ...frontProgram } = program
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

  private _convertFromJson(program: ProgramTypeWithEligibility) {
    const { publicodes: _publicodes, eligibilityData, ...frontProgram } = program

    return {
      ...frontProgram,
      filters: {
        [FiltersKeys.Theme]: eligibilityData?.priorityObjectives || undefined
      }
    } as ProgramTypeForFront
  }
}
