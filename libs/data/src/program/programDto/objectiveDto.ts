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
  step = step.replaceAll('https://agirpourlatransition.ademe.fr/user/register', 'https://agirpourlatransition.ademe.fr/inscription')
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

  const liens: NonNullable<YamlObjective['liens']> = []
  for (const line of lines.slice(1)) {
    if (line.toLocaleLowerCase().includes('#formulaire#')) {
      liens.push({ formulaire: true })
      continue
    }
    const match = line.match(/\[(.*?)\]\((.*?)\)/)
    if (match) {
      const isUrl = z.string().url().safeParse(match[2]).success
      const isEmail = match[2].startsWith('mailto:')
      if (isUrl && !isEmail) {
        // awaited so that the log is written before the report
        await validateObjectiveLink(match[2], stepId, generator)
      }
      liens.push({ lien: match[2], texte: match[1] })
    }
  }

  return { description, liens: liens.length > 0 ? liens : undefined }
}
