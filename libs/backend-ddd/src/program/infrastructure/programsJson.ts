import { ProgramRepository } from '../domain/spi'
import { jsonPrograms } from '@tee/data/generated'
import { ProgramType } from '@tee/data'
import { QuestionnaireData, StructureSize, StructureSizeMap } from '@tee/common'
import { ConditionalYaml } from './types'
import { Monitor } from '../../common'

export default class ProgramsJson implements ProgramRepository {
  private static instance: ProgramsJson
  private _programs: ProgramType[] = []

  private constructor() {
    this._programs = jsonPrograms as unknown as ProgramType[]
  }

  public static getInstance(): ProgramsJson {
    if (!ProgramsJson.instance) {
      ProgramsJson.instance = new ProgramsJson()
    }

    return ProgramsJson.instance
  }

  public getAll(): ProgramType[] {
    return this._programs
  }
  public getById = (id: string): ProgramType | undefined => {
    return this.getAll().find((programData: ProgramType) => programData.id === id)
  }

  public getAllPersonalizedPrograms(questionnaireData: QuestionnaireData): ProgramType[] {
    const allPrograms = jsonPrograms as unknown as ProgramType[]
    // new json reading to get new objects and avoid modifying this._programs.
    allPrograms.forEach((program) => {
      if (program['champs conditionnels']) {
        for (const conditionalChange of program['champs conditionnels']) {
          if (this._isConditionalValid(conditionalChange as ConditionalYaml, questionnaireData)) {
            this._rewriteProgramProperties(program, conditionalChange as ConditionalYaml)
          }
        }
      }
    })
    return allPrograms
  }

  private _isConditionalValid(conditionnalChange: ConditionalYaml, questionnaireData: QuestionnaireData): boolean {
    if (!conditionnalChange['une de ces conditions'] && !conditionnalChange['toutes ces conditions']) {
      Monitor.error('Format error in program conditionnal data')
      return false
    }
    let conditionValid = true
    if (
      conditionnalChange['une de ces conditions'] &&
      !conditionnalChange['une de ces conditions'].some((condition) => this._checkcondition(condition, questionnaireData))
    ) {
      conditionValid = false
    }
    if (
      conditionnalChange['toutes ces conditions'] &&
      !conditionnalChange['toutes ces conditions'].every((condition) => this._checkcondition(condition, questionnaireData))
    ) {
      conditionValid = false
    }
    return conditionValid
  }

  private _checkcondition(condition: string, questionnaireData: QuestionnaireData): boolean {
    if (condition.startsWith('région = ')) {
      const regionCondition = condition.replace('région = ', '').trim()
      return questionnaireData.region === regionCondition
    }

    if (condition.startsWith('effectif')) {
      this._checkStructureSizeCondition(condition, questionnaireData.structure_size)
    }

    Monitor.error('Unknown condition type in conditional programs', { condition })
    return false
  }

  private _checkStructureSizeCondition(condition: string, structure_size: StructureSize | undefined) {
    if (!structure_size) {
      Monitor.error('In conditionalPrograms, impossible to assess the sizeCOndition, no structure_size available')
      return false
    }

    const comparisonValue = this._getConditionSizeValue(condition)
    const conditionIncludeMathSign = condition.includes('<=') || condition.includes('>=')
    if (comparisonValue === null || !conditionIncludeMathSign) {
      Monitor.error('Formatting error in a conditional program condition of type structure size', { condition })
      return false
    }

    if (condition.includes('<=')) {
      return StructureSizeMap[structure_size] <= comparisonValue
    } else if (condition.includes('>=')) {
      return StructureSizeMap[structure_size] >= comparisonValue
    }

    return false
  }

  private _getConditionSizeValue(condition: string): number | null {
    const stringPart = condition.split('=')[1]?.trim()
    const value = parseInt(stringPart, 10)
    return isNaN(value) ? null : value
  }

  private _rewriteProgramProperties = (program: ProgramType, conditionalChange: ConditionalYaml) => {
    const simpleRewriteKeys = ['opérateur de contact', 'autres opérateurs', 'url']
    simpleRewriteKeys.forEach((key) => {
      if (conditionalChange[key as keyof ConditionalYaml]) {
        program[key] = conditionalChange[key as keyof ConditionalYaml]
      }
    })

    if (conditionalChange['Montant du dispositif']) {
      this._rewriteFinancialData(program, conditionalChange['Montant du dispositif'])
    }

    if (conditionalChange['Durée du dispositif']) {
      this._rewriteDurationData(program, conditionalChange['Durée du dispositif'])
    }

    if (conditionalChange['Eligibilité taille']) {
      program["conditions d'éligibilité"]["taille de l'entreprise"][0] = conditionalChange['Eligibilité taille']
    }

    if (conditionalChange["autres critères d'éligibilité"] && conditionalChange["autres critères d'éligibilité"].length) {
      program["conditions d'éligibilité"]["autres critères d'éligibilité"] = conditionalChange["autres critères d'éligibilité"] as [
        string,
        ...string[]
      ]
    }
  }

  private _rewriteDurationData(program: ProgramType, value: string) {
    this._updateIfExists(program, "durée de l'accompagnement", value)
    this._updateIfExists(program, 'durée du prêt', value)
  }

  private _rewriteFinancialData(program: ProgramType, value: string) {
    this._updateIfExists(program, "coût de l'accompagnement", value)
    this._updateIfExists(program, 'montant du financement', value)
    this._updateIfExists(program, "montant de l'avantage fiscal", value)
    this._updateIfExists(program, 'montant du prêt', value)
  }

  private _updateIfExists(program: ProgramType, key: string, value: string) {
    if (program[key]) {
      program[key] = value
    }
  }
}
