import { ProgramType } from '../types/shared'
import { CompanySizeCondition, ConditionalValues, DataProgram, RegionCondition, ConditionalYaml } from '../types/domain'
import { Logger } from '../../common/logger/logger'
import { LogLevel } from '../../common/logger/types'

export class ConditionalDataGenerator {
  constructor(
    private _program: DataProgram,
    private _logger: Logger
  ) {}

  generate(yamlContent: { [key: string]: unknown }): void {
    if (!this._program.conditionalData || !this._program.conditionalData.length) {
      return
    }

    const champsConditionnels: ProgramType['champs conditionnels'] = []

    this._program.conditionalData.forEach((conditional) => {
      const conditionalYaml = this._generateOneConditional(conditional)
      if (conditionalYaml) {
        champsConditionnels.push(conditionalYaml)
      }
    })

    yamlContent['champs conditionnels'] = champsConditionnels
  }

  private _generateOneConditional(oneConditional: ConditionalValues): ConditionalYaml | undefined {
    switch (oneConditional['Type de condition']) {
      case 'géographique':
        return this._generateGeographicCondition(oneConditional)
      case 'nombre de salariés':
        return this._generateCompanySizeCondition(oneConditional)
      default:
        console.log('Warning, type de donnée conditionnelle non gérée et donc non prise en compte')
        return
    }
  }

  private _generateGeographicCondition(oneConditional: RegionCondition): ConditionalYaml {
    const geographicCondition = oneConditional['valeur de la condition géographique']

    const uneDeCesConditions = geographicCondition.map((region) => `région = ${region.Name}`)

    const conditionalEntry = {
      'une de ces conditions': uneDeCesConditions
    }

    this._valueReplacement(oneConditional, conditionalEntry)
    return conditionalEntry
  }

  private _generateCompanySizeCondition(oneConditional: CompanySizeCondition): ConditionalYaml {
    let min = oneConditional['Condition: nb min salaries']
    let max = oneConditional['Condition: nb max salaries']
    if (!min) {
      min = '0'
      this._logger.log(
        LogLevel.Minor,
        `Dispositif conditionnel sur la taille: nb min salaries manquant, valeur par défaut 0 utilisée.`,
        this.program['Id fiche dispositif'],
        this.program.id
      )
    }
    if (!max) {
      max = '999'
      this.logger.log(
        LogLevel.Minor,
        `Dispositif conditionnel sur la taille: nb max salaries manquant, valeur par défaut 999 utilisée.`,
        this.program['Id fiche dispositif'],
        this.program.id
      )
    }

    const conditionalEntry = {
      'toutes ces conditions': [`effectif >= ${min}`, `effectif <= ${max}`]
    }

    this._valueReplacement(oneConditional, conditionalEntry)
    return conditionalEntry
  }

  private _valueReplacement(oneConditional: ConditionalValues, conditionalEntry: ConditionalYaml): void {
    const addField = (key: string, value: unknown) => {
      if (conditionalEntry && value && (!Array.isArray(value) || value.length > 0)) {
        conditionalEntry[key] = value
      }
    }

    if (oneConditional['Opérateur de contact'].length) {
      addField('opérateur de contact', oneConditional['Opérateur de contact'][0].Nom)
    }
    addField(
      'autres opérateurs',
      oneConditional['Autres opérateurs'].map((operator) => operator.Nom)
    )
    addField('url', oneConditional['URL externe'])
    addField('Montant du dispositif', oneConditional["Montant de l'aide ou coût"])
    addField('Durée du dispositif', oneConditional["Durée de l'aide"])
    addField('Eligibilité taille', oneConditional['Eligibilité taille'])
    if (oneConditional['Eligibilité Spécifique']) {
      conditionalEntry["autres critères d'éligibilité"] = oneConditional['Eligibilité Spécifique']
        .split('\n')
        .map((criteria) => criteria.substring(2))
    }
  }
}
