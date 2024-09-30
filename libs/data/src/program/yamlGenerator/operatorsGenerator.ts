import { CoreGenerator } from './coreGenerator'
import * as schema from '../../../schemas/program-with-publicodes-schema.json'
import { LogLevel } from '../../common/logger/types'
import { Operator } from '../types/domain'

export function setOperators(generator: CoreGenerator) {
  const { program, logger } = generator
  if (program['Opérateur de contact'].length != 1) {
    logger.log(
      LogLevel.Critic,
      "Zéro ou plus d'un opérateur de contact, dispositif non créé ou mis à jour",
      program['Id fiche dispositif'],
      program.id,
      program['Opérateur de contact']
    )
    generator.valid = false
  }

  if (!validateOperator(program['Opérateur de contact'][0].Nom)) {
    logger.log(
      LogLevel.Critic,
      'Opérateur de contact inconnu, nécessite intervention manuelle sur le code dispositif non créé ou mis à jour',
      program['Id fiche dispositif'],
      program.id,
      program['Opérateur de contact'][0]
    )
    generator.valid = false
  }
  generator.yamlContent['opérateur de contact'] = program['Opérateur de contact'][0].Nom

  const filteredOperators = filterValidOperators(generator)
  if (filteredOperators.length) {
    generator.yamlContent['autres opérateurs'] = filteredOperators.map((operator) => operator.Nom)
  }
}

function filterValidOperators(generator: CoreGenerator): Operator[] {
  return generator.program['Autres opérateurs'].filter((operator) => {
    const isValid = validateOperator(operator.Nom)
    if (!isValid) {
      generator.logger.log(
        LogLevel.Minor,
        'Un des "autres opérateurs" est invalide. Valeur ignorée. sa prise en compte nécessite une intervention mannuelle sur le code',
        generator.program['Id fiche dispositif'],
        generator.program.id,
        operator.Nom
      )
    }
    return isValid
  })
}

function validateOperator(operator: string): boolean {
  const operatorEnum = schema.$defs.operators.enum
  return operatorEnum.includes(operator)
}
