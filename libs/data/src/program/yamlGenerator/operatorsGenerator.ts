import { CoreGenerator } from './coreGenerator'
import { LogLevel } from '../../common/logger/types'
import { Operator } from '../../operators/types/domain'

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
    return
  }

  if (!program['Opérateur de contact'][0].name) {
    logger.log(
      LogLevel.Critic,
      "L'opérateur de contact n'a pas de nom. A modifier dans la table opérateur de baserow. Programme non généré dans l'attente de la modification",
      program['Id fiche dispositif'],
      program.id,
      program['Opérateur de contact'][0]
    )
    generator.valid = false
    return
  }
  generator.yamlContent['opérateur de contact'] = program['Opérateur de contact'][0].name

  const filteredOperators = filterValidOperators(generator)
  if (filteredOperators.length) {
    generator.yamlContent['autres opérateurs'] = filteredOperators.map((operator) => operator.name)
  }
}

function filterValidOperators(generator: CoreGenerator): Operator[] {
  return generator.program['Autres opérateurs'].filter((operator) => {
    const hasName = operator.name
    if (!hasName) {
      generator.logger.log(
        LogLevel.Minor,
        "Un des 'autres opérateurs' n'a pas de nom, sa valeur est ignorée. Sa prise en compte nécessite l'ajout de son nom dans la colonne baserow correspondante",
        generator.program['Id fiche dispositif'],
        generator.program.id,
        operator.name
      )
    }
    return hasName
  })
}
