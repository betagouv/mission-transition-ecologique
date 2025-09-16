import { DataProgram } from '../../../program/types/domain'
import { vi } from 'vitest'

export default class BrevoMailMock {
  sendInitialMail = vi.fn<(program: DataProgram) => Promise<void>>()
  sendPeriodicMail = vi.fn<(program: DataProgram) => Promise<void>>()
  sendEolMail = vi.fn<(program: DataProgram) => Promise<void>>()
}
