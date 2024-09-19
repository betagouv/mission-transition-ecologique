import { ConditionalValues, DataProgram } from './types/domain'

export class ConditionalDataGenerator {
  constructor(private _program: DataProgram) {}

  generate(yamlContent: { [key: string]: unknown }): void {
    if (!this._program.conditionalData || !this._program.conditionalData.length) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const champsConditionnels: any = []

    this._program.conditionalData.forEach((conditional) => {
      const conditionalYaml = this._generateOneConditional(conditional)
      if (conditionalYaml) {
        champsConditionnels.push(conditionalYaml)
      }
    })

    yamlContent['champs conditionnels'] = champsConditionnels
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _generateOneConditional(oneConditional: ConditionalValues): any {
    switch (oneConditional['Type de condition']) {
      case 'géographique':
        return this._generateGeographicCondition(oneConditional)
      case "taille de l'entreprise":
        return this._generateCompanySizeCondition(oneConditional)
      default:
        console.log('Warning, type de donnée conditionnelle non gérée et donc non prise en compte')
        return
    }
  }

  private _generateGeographicCondition(oneConditional: ConditionalValues): any {
    const conditionGeographique = oneConditional['valeur de la condition géographique']

    const uneDeCesConditions = conditionGeographique.map((region) => `région = ${region.Name}`)

    const conditionalEntry: any = {
      'une de ces conditions': uneDeCesConditions
    }

    this._valueReplacement(oneConditional, conditionalEntry)
    return conditionalEntry
  }

  private _generateCompanySizeCondition(oneConditional: ConditionalValues): any {
    const conditionalEntry: any = {
      'toutes ces conditions': [
        `effectif >= ${oneConditional['Condition: nb min salaries']}`,
        `effectif <= ${oneConditional['Condition: nb max salaries']}`
      ]
    }

    this._valueReplacement(oneConditional, conditionalEntry)
    return conditionalEntry
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _valueReplacement(oneConditional: ConditionalValues, conditionalEntry: any): void {
    const addField = (key: string, value: unknown) => {
      if (value && (!Array.isArray(value) || value.length > 0)) {
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
    addField('Eligibilité Spécifique', oneConditional['Eligibilité Spécifique'])
  }
}
