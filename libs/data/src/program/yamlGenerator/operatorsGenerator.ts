import { CoreGenerator } from './coreGenerator'
import * as schema from '../../../schemas/program-with-publicodes-schema.json'
import { Logger } from '../../common/logger/logger'
import { LogLevel } from '../../common/logger/types'
import { Operator } from '../types/domain'

export function setOperators(generator: CoreGenerator) {
  const { program, logger } = generator
  if (program['Opérateur de contact'].length != 1) {
    logger.log(
      LogLevel.critic,
      program['Id fiche dispositif'] + ": Zéro ou plus d'un opérateur de contact, dispositif non créé ou mis à jour",
      program['Opérateur de contact']
    )
    generator.valid = false
  }

  if (!validateOperator(program['Opérateur de contact'][0].Nom)) {
    logger.log(
      LogLevel.critic,
      program['Id fiche dispositif'] +
        ': Opérateur de contact inconnu, nécessite intervention manuelle sur le code dispositif non créé ou mis à jour',
      program['Opérateur de contact'][0]
    )
    generator.valid = false
  }
  generator.yamlContent['opérateur de contact'] = program['Opérateur de contact'][0].Nom

  const filteredOperators = filterValidOperators(program['Autres opérateurs'], logger, program['Id fiche dispositif'])
  if (filteredOperators.length) {
    generator.yamlContent['autres opérateurs'] = filteredOperators.map((operator) => operator.Nom)
  }
}

function filterValidOperators(operators: Operator[], logger: Logger, programId: string): Operator[] {
  return operators.filter((operator) => {
    const isValid = validateOperator(operator.Nom)
    if (!isValid) {
      logger.log(
        LogLevel.minor,
        programId +
          ': Un des "autres opérateurs" est invalide. Valeur ignorée. sa prise en compte nécessite une intervention mannuelle sur le code',
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
