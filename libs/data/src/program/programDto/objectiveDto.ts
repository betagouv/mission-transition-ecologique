import { YamlObjective } from '../types/domain'
import { ProgramDto } from './programDto'
import { validateObjectiveLink } from './linksValidator'
import { LinkValidator } from '../../common/validators/linkValidator'
import { LogLevel } from '../../common/logger/types'
import z from 'zod'

export async function setObjectives(generator: ProgramDto) {
  const objectifs: YamlObjective[] = []

  for (let i = 1; i <= 6; i++) {
    const step = generator.rawProgram[`étape${i}` as keyof typeof generator.rawProgram] as string
    if (step) {
      objectifs.push(await parseStep(step, i, generator))
    }
  }
  generator.programData['objectifs'] = objectifs
  return
}

async function parseStep(step: string, stepId: number, generator: ProgramDto): Promise<YamlObjective> {
  const lines = step.split('\n')
  const description = lines[0].substring(2)
  await LinkValidator.logInvalidLinks(
    description,
    generator.logger,
    LogLevel.Minor,
    `"Objectif ${stepId}"`,
    generator.rawProgram['Id fiche dispositif'],
    generator.rawProgram.id
  )

  const liens = lines
    .slice(1)
    .map((line) => {
      if (line.toLocaleLowerCase().includes('#formulaire#')) {
        return { formulaire: true }
      }
      const match = line.match(/\[(.*?)\]\((.*?)\)/)
      if (match) {
        const isUrl = z.string().url().safeParse(match[2]).success
        const isEmail = match[2].startsWith('mailto:')
        if (isUrl && !isEmail) {
          validateObjectiveLink(match[2], stepId, generator)
        }
        return { lien: match[2], texte: match[1] }
      }
      return null
    })
    .filter((link) => link !== null)

  return { description, liens: liens.length > 0 ? liens : undefined }
}
