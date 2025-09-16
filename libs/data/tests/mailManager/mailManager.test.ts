import { describe, expect, beforeEach, vi } from 'vitest'
import { MailManager } from '../../src/program/mailManager'
import { mailManagerTestCases } from './mailManager.testData'
import { makeMockProgram } from '../mockData/mockProgram.testData'
import BrevoMailMock from '../../src/common/brevo/brevoMail'
import { ProgramBaserow } from '../../src/common/baserow/programBaserow'

vi.mock('../common/baserow/programBaserow')
vi.mock('../common/brevo/brevoMail')

describe('MailManager', () => {
  let mailManager: MailManager
  let brevoMock: BrevoMailMock

  beforeEach(() => {
    mailManager = new MailManager()
    brevoMock = new BrevoMailMock()

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-08-01'))
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  mailManagerTestCases.forEach(({ name, testData, expected }) => {
    test(name, async () => {
      const program = makeMockProgram(testData)

      ;(ProgramBaserow as any).mockImplementation(() => {
        return {
          getPrograms: vi.fn().mockResolvedValue([program]),
          patchProgram: vi.fn().mockResolvedValue(undefined)
        }
      })

      await mailManager.sendProgramsMails()

      if (expected.sendInitialMail) {
        expect(brevoMock.sendInitialMail).toHaveBeenCalledWith(program)
      } else {
        expect(brevoMock.sendInitialMail).not.toHaveBeenCalled()
      }

      if (expected.sendPeriodicMail) {
        expect(brevoMock.sendPeriodicMail).toHaveBeenCalledWith(program)
      } else {
        expect(brevoMock.sendPeriodicMail).not.toHaveBeenCalled()
      }

      if (expected.sendEolMail) {
        expect(brevoMock.sendEolMail).toHaveBeenCalledWith(program)
      } else {
        expect(brevoMock.sendEolMail).not.toHaveBeenCalled()
      }
    })
  })
})
