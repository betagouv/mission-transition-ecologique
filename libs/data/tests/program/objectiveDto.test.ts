import { LinkStatus } from '../../src/common/validators/linkStatus'
import { LinkValidator } from '../../src/common/validators/linkValidator'
import { LogLevel } from '../../src/common/logger/types'
import { setObjectives } from '../../src/program/programDto/objectiveDto'
import { ProgramDto } from '../../src/program/programDto/programDto'

const buildGenerator = (steps: Record<string, string>) => {
  const logger = { log: vi.fn(), logLink: vi.fn(), write: vi.fn() }
  const generator = {
    rawProgram: { 'Id fiche dispositif': 'mon-dispositif', id: 42, ...steps },
    logger,
    programData: {} as Record<string, unknown>
  }
  return { generator, logger }
}

describe('setObjectives', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('waits for the step link checks before returning, so that they are logged before the report is written', async () => {
    // a slow check: without await, setObjectives would return before the link is logged
    vi.spyOn(LinkValidator, 'checkLink').mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(LinkStatus.Broken), 20))
    )
    vi.spyOn(LinkValidator, 'findInvalidLinks').mockResolvedValue([])
    const { generator, logger } = buildGenerator({ étape1: '- Faire le diagnostic\n[Le site](https://www.example.fr/404)' })

    await setObjectives(generator as unknown as ProgramDto)

    expect(logger.logLink).toHaveBeenCalledWith(
      LogLevel.Major,
      { url: 'https://www.example.fr/404', status: LinkStatus.Broken, field: 'étape 1' },
      'mon-dispositif',
      42
    )
    expect(generator.programData['objectifs']).toEqual([
      { description: 'Faire le diagnostic', liens: [{ lien: 'https://www.example.fr/404', texte: 'Le site' }] }
    ])
  })
})
