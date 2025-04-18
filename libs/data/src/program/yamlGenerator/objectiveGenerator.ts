import { YamlObjective } from '../types/domain'
import { CoreGenerator } from './coreGenerator'
import { validateObjectiveLink } from './linksValidator'

export function setObjectives(generator: CoreGenerator) {
  const objectifs: YamlObjective[] = []

  for (let i = 1; i <= 6; i++) {
    const step = generator.program[`étape${i}` as keyof typeof generator.program] as string
    if (step) {
      objectifs.push(parseStep(step, i, generator))
    }
  }
  generator.yamlContent['objectifs'] = objectifs
  return
}

function parseStep(step: string, stepId: number, generator: CoreGenerator): YamlObjective {
  const lines = step.split('\n')
  const description = lines[0].substring(2)

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
