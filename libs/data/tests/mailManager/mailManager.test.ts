import { describe, expect, beforeEach, vi, Mock } from 'vitest'
vi.mock('../../src/common/brevo/brevoMail', () => {
  return import('../../src/common/brevo/__mocks__/brevoMail').then((mod) => ({
    default: mod.default
  }))
})

// vi.mock('../../src/common/brevo/brevoMail', async () => {
//   const BrevoMailMock = (await import('../../src/common/brevo/__mocks__/brevoMail')).default
//   return { default: BrevoMailMock }
// })
vi.mock('../../src/common/baserow/programBaserow', () => {
  return {
    ProgramBaserow: vi.fn().mockImplementation(() => ({
      getPrograms: vi.fn(),
      patchProgram: vi.fn()
    }))
  }
})
import { MailManager } from '../../src/program/mailManager'
import { mailManagerTestCases } from './mailManager.fixture'
import { makeMockProgram } from '../mockData/mockProgram.testData'
import { ProgramBaserow } from '../../src/common/baserow/programBaserow'
import BrevoMail from '../../src/common/brevo/brevoMail'

describe('MailManager', () => {
  let mailManager: MailManager

  beforeEach(() => {
    mailManager = new MailManager()

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
      const program = makeMockProgram(testData)

      ;(ProgramBaserow as any).mockImplementation(() => {
        return {
          getPrograms: vi.fn().mockResolvedValue([program]),
          patchProgram: vi.fn().mockImplementation((_id: number, data: unknown) => {
            console.log('TechData:', data)
            return Promise.resolve()
          })
        }
      })

      await mailManager.sendProgramsMails()
      const brevoMock = (BrevoMail as unknown as Mock).mock
      console.log('brevoMock', brevoMock)
      console.log(
        brevoMock.calls,
        brevoMock.contexts,
        brevoMock.instances,
        brevoMock.invocationCallOrder,
        brevoMock.lastCall,
        brevoMock.results
      )

      if (!expected.sendInitialMail && !expected.sendPeriodicMail && !expected.sendEolMail) {
        expect(brevoMock).not.toBeDefined()
      }

      const brevoInstance = brevoMock.instances[0]
      console.log('brevoinstance: ', brevoInstance)
      expect(brevoInstance.sendInitialMail).toBeDefined()

      if (expected.sendInitialMail) {
        expect(brevoInstance.sendInitialMail).toHaveBeenCalled()
      } else {
        expect(brevoInstance.sendInitialMail).not.toHaveBeenCalled()
      }

      if (expected.sendPeriodicMail) {
        expect(brevoInstance.sendPeriodicMail).toHaveBeenCalled()
      } else {
        expect(brevoInstance.sendPeriodicMail).not.toHaveBeenCalled()
      }

      if (expected.sendEolMail) {
        expect(brevoInstance.sendEolMail).toHaveBeenCalled()
      } else {
        expect(brevoInstance.sendEolMail).not.toHaveBeenCalled()
      }
    })
  })
})
