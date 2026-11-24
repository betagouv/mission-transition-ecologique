import { LinkStatus } from '../validators/linkStatus'

export interface LoggerInterface {
  log(criticality: LogLevel, message: string, name: string, baserowId: number, data?: unknown, type?: LoggerType): void
  logLink(criticality: LogLevel, link: LoggedLink, name: string, baserowId: number, type?: LoggerType): void
  write(fileName: string): void
}

export enum LogLevel {
  Info = 30,
  Minor = 20,
  Major = 10,
  Critic = 1
}

export enum LoggerType {
  Program = 'Dispositif',
  Project = 'Projet',
  Faq = 'FAQ',
  Operator = 'Opérateur'
}

export const LogLevelDisplay: Record<LogLevel, string> = {
  [LogLevel.Info]: ':warning:',
  [LogLevel.Minor]: ':fire:',
  [LogLevel.Major]: ':fire: :fire:',
  [LogLevel.Critic]: ':fire: :fire: :fire: :fire:'
}

export interface LoggedLink {
  url: string
  status: LinkStatus
  // Baserow field where the link was found (e.g. "étape 1", "Contact Question")
  field: string
}

export interface LogEvent {
  name: string
  baserowId: number
  criticality: LogLevel
  message: string
  data: unknown
  type?: LoggerType
  link?: LoggedLink
}
