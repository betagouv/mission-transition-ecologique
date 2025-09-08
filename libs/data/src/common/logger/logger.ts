import * as fs from 'fs'
import { LogEvent, LoggerType, LogLevel, LogLevelDisplay } from './types'

export class Logger {
  private logs: LogEvent[] = []
  private _baserowProgramLink = 'https://baserow.io/database/114839/table/314437/539069/row/'
  private _baserowProjectLink = 'https://baserow.io/database/114839/table/305253/519286/row/'

  constructor(
    private _type: LoggerType,
    private _consoleLog = false
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(criticity: LogLevel, message: string, name: string, baserowId: number, data?: any) {
    this.logs.push({ name, baserowId, criticity, message, data })
    if (this._consoleLog) {
      console.log({ name, baserowId, criticity, message, data })
    }
  }

  write(fileName: string) {
    const sortedLogs = this._sortLogs()

    let markdownContent = `| Niveau de l'erreur | ${this._type} concerné | Lien Baserow | Message | Données |\n`
    markdownContent += '| --- | --- | --- | --- | --- |\n'

    sortedLogs.forEach((log) => {
      const baserowLink =
        this._type == LoggerType.Project ? this._baserowProjectLink + log.baserowId : this._baserowProgramLink + log.baserowId
      markdownContent += `| ${LogLevelDisplay[log.criticity]} | ${log.name} | [lien](${baserowLink}) |  ${log.message} | ${JSON.stringify(log.data)} |\n`
    })

    fs.writeFileSync(fileName, markdownContent, 'utf8')
  }

  private _sortLogs(): LogEvent[] {
    return this.logs.sort((a, b) => {
      if (a.criticity === LogLevel.Info && b.criticity !== LogLevel.Info) {
        return 1
      }
      if (b.criticity === LogLevel.Info && a.criticity !== LogLevel.Info) {
        return -1
      }

      const nameComparison = a.name.localeCompare(b.name)
      if (nameComparison !== 0) {
        return nameComparison
      }

      return a.criticity - b.criticity
    })
  }
}
