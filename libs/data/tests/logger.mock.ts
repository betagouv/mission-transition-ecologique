import { LoggerInterface, LogLevel } from '../src/common/logger/types'

export class LoggerMock implements LoggerInterface {
  log(_criticality: LogLevel, _message: string, _name: string, _baserowId: number, _data?: unknown) {
    return void 0
  }

  write(_fileName: string) {
    return void 0
  }
}
