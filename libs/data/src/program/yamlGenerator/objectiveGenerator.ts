import { YamlObjective } from '../types/domain'
import { CoreGenerator } from './coreGenerator'
import { validateObjectiveLink } from './linksValidator'
import { LinkValidator } from '../../common/validators/linkValidator'
import { LogLevel } from '../../common/logger/types'

export async function setObjectives(generator: CoreGenerator) {
  const objectifs: YamlObjective[] = []

  for (let i = 1; i <= 6; i++) {
    const step = generator.program[`étape${i}` as keyof typeof generator.program] as string
    if (step) {
      objectifs.push(await parseStep(step, i, generator))
    }
  }
  generator.yamlContent['objectifs'] = objectifs
  return
}

async function parseStep(step: string, stepId: number, generator: CoreGenerator): Promise<YamlObjective> {
  const lines = step.split('\n')
  const description = lines[0].substring(2)
  await LinkValidator.logInvalidLinks(
    description,
    generator.logger,
    LogLevel.Minor,
    `"Objectif ${stepId}"`,
    generator.program['Id fiche dispositif'],
    generator.program.id
  )

  const liens = lines
    .slice(1)
    .map((line) => {
      if (line.toLocaleLowerCase().includes('#formulaire#')) {
        return { formulaire: true }
      }
      const match = line.match(/\[(.*?)\]\((.*?)\)/)
      if (match) {
        validateObjectiveLink(match[2], stepId, generator)
        return { lien: match[2], texte: match[1] }
      }
      return null
    })
    .filter((link) => link !== null)

  return { description, liens: liens.length > 0 ? liens : undefined }
}
