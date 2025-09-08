export enum LogLevel {
  Info = 30,
  Minor = 20,
  Major = 10,
  Critic = 1
}

export enum LoggerType {
  Program = 'Dispositif',
  Project = 'Projet',
  Faq = 'FAQ'
}

export const LogLevelDisplay: Record<LogLevel, string> = {
  [LogLevel.Info]: ':warning:',
  [LogLevel.Minor]: ':fire:',
  [LogLevel.Major]: ':fire: :fire:',
  [LogLevel.Critic]: ':fire: :fire: :fire: :fire:'
}

export interface LogEvent {
  name: string
  baserowId: number
  criticity: LogLevel
  message: string
  data: unknown
}
