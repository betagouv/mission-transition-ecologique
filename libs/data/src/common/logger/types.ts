export enum LogLevel {
  info = 30,
  minor = 20,
  major = 10,
  critic = 1
}
export interface LogEvent {
  criticity: LogLevel
  message: string
  data: unknown
}
