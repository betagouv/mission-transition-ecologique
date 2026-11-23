import { ProgramDto } from './programDto'
import { LogLevel } from '../../common/logger/types'

export function setAdemeThemes(generator: ProgramDto) {
  const { rawProgram: program, logger } = generator
  const codes: string[] = []

  for (const theme of program['Thème ADEME'] ?? []) {
    if (!theme.code) {
      logger.log(
        LogLevel.Minor,
        "Une des thématiques ADEME n'a pas de code, elle est ignorée. A compléter dans la table des thèmes ADEME de baserow",
        program['Id fiche dispositif'],
        program.id,
        theme.label
      )
      continue
    }
    if (!codes.includes(theme.code)) {
      codes.push(theme.code)
    }
  }

  if (codes.length) {
    generator.programData['ademeThemes'] = codes
  }
}
