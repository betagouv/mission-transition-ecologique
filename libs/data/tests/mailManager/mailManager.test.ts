import { describe, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/common/brevo/brevoMail', async () => {
  const BrevoMailMock = (await import('./mailSenderMock')).default
  return { default: BrevoMailMock }
})
vi.mock('../../src/common/baserow/programBaserow', () => {
  return {
    ProgramBaserow: vi.fn().mockImplementation(() => ({
      getPrograms: vi.fn(),
      patchProgram: vi.fn()
    }))
  }
})
import { MailManager } from '../../src/program/services/mailManager'
import { mailManagerTestCases } from './mailManager.fixture'
import { makeMockProgram } from '../mockData/mockProgram.factory'
import { ProgramBaserow } from '../../src/common/baserow/programBaserow'
import BrevoMail from '../../src/common/brevo/brevoMail'

describe('MailManager', () => {
  let mailManager: MailManager
  let mailSender: BrevoMail
  beforeEach(() => {
    mailSender = new BrevoMail()
    mailManager = new MailManager(mailSender)
    vi.spyOn(mailManager as any, '_wait').mockResolvedValue(undefined)
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-06-01'))
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  mailManagerTestCases.forEach(({ name, testData, expected }) => {
    test(name, async () => {
      let program = makeMockProgram(testData)

      const patchProgramSpy = vi.fn().mockResolvedValue(undefined)

      ;(ProgramBaserow as any).mockImplementation(() => {
        return {
          getPrograms: vi.fn().mockResolvedValue([program]),
          patchProgram: patchProgramSpy
        }
      })

      await mailManager.sendProgramsMails()

      if (expected.sendInitialMail) {
        expect(mailSender.sendInitialMail).toHaveBeenCalled()
      } else {
        expect(mailSender.sendInitialMail).not.toHaveBeenCalled()
      }

      if (expected.sendPeriodicMail) {
        expect(mailSender.sendPeriodicMail).toHaveBeenCalled()
      } else {
        expect(mailSender.sendPeriodicMail).not.toHaveBeenCalled()
      }

      if (expected.sendEolMail) {
        expect(mailSender.sendEolMail).toHaveBeenCalled()
      } else {
        expect(mailSender.sendEolMail).not.toHaveBeenCalled()
      }

      if (patchProgramSpy.mock.calls.length > 0) {
        const newtechdata = patchProgramSpy.mock.calls[0][1]
        program = {
          ...program,
          tech: newtechdata.tech
        }
        vi.clearAllMocks()
        expect(mailSender.sendInitialMail).not.toHaveBeenCalled()
        expect(mailSender.sendPeriodicMail).not.toHaveBeenCalled()
        expect(mailSender.sendEolMail).not.toHaveBeenCalled()

        await mailManager.sendProgramsMails()
        expect(mailSender.sendInitialMail).not.toHaveBeenCalled()
        expect(mailSender.sendPeriodicMail).not.toHaveBeenCalled()
        expect(mailSender.sendEolMail).not.toHaveBeenCalled()
      }
    })
  })
})
