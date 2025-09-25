import { vi } from 'vitest'
import { DataProgram } from '../../src/program/types/domain'

export default class MailSenderMock {
  sendInitialMail = vi.fn<(program: DataProgram) => Promise<void>>()
  sendPeriodicMail = vi.fn<(program: DataProgram) => Promise<void>>()
  sendEolMail = vi.fn<(program: DataProgram) => Promise<void>>()
}
