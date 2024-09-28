export enum LogLevel {
  info = 30,
  minor = 20,
  major = 10,
  critic = 1
}

export const LogLevelDisplay: Record<LogLevel, string> = {
  [LogLevel.info]: 'info',
  [LogLevel.minor]: 'mineur',
  [LogLevel.major]: 'important',
  [LogLevel.critic]: 'critique'
}

export interface LogEvent {
  criticity: LogLevel
  message: string
  data: unknown
}
