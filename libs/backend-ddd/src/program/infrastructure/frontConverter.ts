import { PublicodesKeys, FormattedFiltersKeys, PublicodeObjective, Objective } from '@tee/common'
import { ProgramType, PublicodesCondition } from '@tee/data'
import type { ObjectivePublicodeData } from './types'
import { PublicodeToObjectiveMapping } from './types'

const getFormattedPublicodeKey = (publicodeKey: string): FormattedFiltersKeys | undefined => {
  if (publicodeKey === PublicodesKeys.hasObjective) {
    return FormattedFiltersKeys.hasObjective
  }
  return undefined
}

const isObjectivePublicodeData = (data: unknown): data is ObjectivePublicodeData => {
  return typeof data === 'object' && data !== null && PublicodesCondition.oneOfThese in data
}
const geFormattedObjective = (publicodeData: ObjectivePublicodeData): Objective[] => {
  const objectives: PublicodeObjective[] = publicodeData[PublicodesCondition.oneOfThese]
  return objectives.map((obj: PublicodeObjective) => PublicodeToObjectiveMapping[obj])
}

const getFormattedPublicodeData = (publicodeKey: FormattedFiltersKeys, publicodeData: unknown) => {
  if (publicodeKey === FormattedFiltersKeys.hasObjective && isObjectivePublicodeData(publicodeData)) {
    return geFormattedObjective(publicodeData)
  }
  return null
}

export const domainToFront = (program: ProgramType) => {
  const { publicodes, ...frontProgram } = program
  if (publicodes) {
    const convertedProgramPublicodes = Object.keys(publicodes).reduce<{ [key in FormattedFiltersKeys]?: string[] }>((acc, publicodeKey) => {
      const convertedKey: FormattedFiltersKeys | undefined = getFormattedPublicodeKey(publicodeKey)
      if (convertedKey) {
        const convertedData = getFormattedPublicodeData(convertedKey, publicodes[publicodeKey])
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
