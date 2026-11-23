import * as fs from 'fs'
import { Logger } from '../../../src/common/logger/logger'
import { LoggerType, LogLevel } from '../../../src/common/logger/types'
import { LinkStatus } from '../../../src/common/validators/linkStatus'

vi.mock('fs', () => ({
  writeFileSync: vi.fn()
}))

const writtenContent = (logger: Logger): string => {
  logger.write('test.log')
  return vi.mocked(fs.writeFileSync).mock.calls.at(-1)?.[1] as string
}

describe('Logger.write', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('keeps the general table for non link logs', () => {
    const logger = new Logger(LoggerType.Program)
    logger.log(LogLevel.Major, 'Problème de format', 'dispositif-a', 1, 'donnée')

    const content = writtenContent(logger)

    expect(content).toContain("| Niveau de l'erreur | Dispositif concerné |")
    expect(content).toContain('| :fire: :fire: | dispositif-a |')
    expect(content).not.toContain('Liens cassés')
    expect(content).not.toContain('<details>')
  })

  it('groups a broken link used in several programs and fields on a single row', () => {
    const logger = new Logger(LoggerType.Program)
    const url = 'https://www.example.fr/contact'
    logger.logLink(LogLevel.Major, { url, status: LinkStatus.Broken, field: '"Contact Question"' }, 'dispositif-a', 1)
    logger.logLink(LogLevel.Major, { url, status: LinkStatus.Broken, field: 'étape 2' }, 'dispositif-a', 1)
    logger.logLink(LogLevel.Minor, { url, status: LinkStatus.Broken, field: 'URL externe' }, 'dispositif-b', 2)

    const content = writtenContent(logger)
    const rows = content.split('\n').filter((line) => line.includes(url))

    expect(content).toContain('#### Liens cassés ou mal formés (1)')
    expect(rows).toHaveLength(1)
    expect(rows[0]).toContain('| :fire: :fire: |')
    expect(rows[0]).toContain('[dispositif-a](https://baserow.io/database/114839/table/314437/539069/row/1) : "Contact Question", étape 2')
    expect(rows[0]).toContain('<br>[dispositif-b](https://baserow.io/database/114839/table/314437/539069/row/2) : URL externe')
  })

  it('shows malformed links as code, before broken ones', () => {
    const logger = new Logger(LoggerType.Program)
    logger.logLink(LogLevel.Major, { url: 'https://www.example.fr/404', status: LinkStatus.Broken, field: 'étape 1' }, 'dispositif-a', 1)
    logger.logLink(
      LogLevel.Critic,
      { url: 'https://file:///Users/a.pdf', status: LinkStatus.Malformed, field: 'étape 1' },
      'dispositif-b',
      2
    )

    const content = writtenContent(logger)

    expect(content.indexOf('`https://file:///Users/a.pdf`')).toBeGreaterThan(-1)
    expect(content.indexOf('file:///Users')).toBeLessThan(content.indexOf('https://www.example.fr/404'))
  })

  it('collapses unverifiable links grouped by domain after the other sections', () => {
    const logger = new Logger(LoggerType.Program)
    logger.logLink(LogLevel.Info, { url: 'https://protege.fr/a', status: LinkStatus.Unverifiable, field: 'étape 1' }, 'dispositif-a', 1)
    logger.logLink(LogLevel.Info, { url: 'https://protege.fr/b', status: LinkStatus.Unverifiable, field: 'étape 1' }, 'dispositif-a', 1)
    logger.logLink(LogLevel.Info, { url: 'https://autre.fr/c', status: LinkStatus.Unverifiable, field: 'étape 3' }, 'dispositif-b', 2)
    logger.logLink(LogLevel.Major, { url: 'https://www.example.fr/404', status: LinkStatus.Broken, field: 'étape 1' }, 'dispositif-a', 1)

    const content = writtenContent(logger)

    expect(content).toContain('<summary>:warning: 3 liens non vérifiables automatiquement')
    expect(content).toContain('Domaines : `autre.fr` (1), `protege.fr` (2)')
    expect(content.indexOf('Liens cassés')).toBeLessThan(content.indexOf('<details>'))
    expect(content).not.toMatch(/\| :warning: \|/)
  })

  it('omits the general table when there are only link logs', () => {
    const logger = new Logger(LoggerType.Program)
    logger.logLink(LogLevel.Major, { url: 'https://www.example.fr/404', status: LinkStatus.Broken, field: 'étape 1' }, 'dispositif-a', 1)

    expect(writtenContent(logger)).not.toContain("Niveau de l'erreur")
  })

  it('shows a short decoded label while keeping the full url as target', () => {
    const logger = new Logger(LoggerType.Program)
    const url = `https://www.example.fr/sites/default/files/${'tr%C3%A8s%20long%20'.repeat(10)}cahier%20des%20charges%20%5B2026%5D.pdf`
    logger.logLink(LogLevel.Major, { url, status: LinkStatus.Broken, field: 'étape 1' }, 'dispositif-a', 1)

    const row = writtenContent(logger)
      .split('\n')
      .find((line) => line.includes(url)) as string
    const label = (row.match(/\| \[(.*?[^\\])\]\(/) as RegExpMatchArray)[1]

    expect(row).toContain(`](${url})`)
    expect(label.startsWith('www.example.fr/sites/default/f')).toBe(true)
    expect(label).toContain('…')
    expect(label.endsWith('charges \\[2026\\].pdf')).toBe(true)
  })

  it('escapes pipes in table cells', () => {
    const logger = new Logger(LoggerType.Faq)
    logger.logLink(
      LogLevel.Major,
      { url: 'https://www.example.fr/404', status: LinkStatus.Broken, field: 'Réponse' },
      'Question a | b ?',
      3
    )

    expect(writtenContent(logger)).toContain('Question a \\| b ?')
  })
})
