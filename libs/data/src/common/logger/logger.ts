import * as fs from 'fs'
import { LogEvent, LoggerInterface, LoggerType, LogLevel, LogLevelDisplay } from './types'

export class Logger implements LoggerInterface {
  private logs: LogEvent[] = []

  // Configuration centralisée des URLs Baserow
  private static readonly _baserowBaseUri = 'https://baserow.io/database/114839/table/'
  private static readonly _baserowConfig = {
    [LoggerType.Program]: { tableId: '314437', viewId: '539069' },
    [LoggerType.Project]: { tableId: '305253', viewId: '519286' },
    [LoggerType.Faq]: { tableId: '669314', viewId: '1271291' }
  }

  constructor(
    private _type: LoggerType,
    private _consoleLog = false
  ) {}

  // ... existing code ...

  private _buildBaserowLink(log: LogEvent): string | undefined {
    const config = Logger._baserowConfig[this._type]
    if (!config) {
      return undefined
    }

    return `${Logger._baserowBaseUri}${config.tableId}/${config.viewId}/row/${log.baserowId}`
  }

  log(criticality: LogLevel, message: string, name: string, baserowId: number, data?: unknown) {
    this.logs.push({ name, baserowId, criticality, message, data })
    if (this._consoleLog) {
      console.log({ name, baserowId, criticality, message, data })
    }
  }

  write(fileName: string) {
    const sortedLogs = this._sortLogs()

    let markdownContent = `| Niveau de l'erreur | ${this._type} concerné | Lien Baserow | Message | Données |\n`
    markdownContent += '| --- | --- | --- | --- | --- |\n'

    sortedLogs.forEach((log) => {
      const baserowLink = this._buildBaserowLink(log)
      markdownContent += `| ${LogLevelDisplay[log.criticality]} | ${log.name} | (${baserowLink ? `[lien](${baserowLink}` : ``}) |  ${log.message} | ${JSON.stringify(log.data)} |\n`
    })

    fs.writeFileSync(fileName, markdownContent, 'utf8')
  }

  private _sortLogs(): LogEvent[] {
    return this.logs.sort((a, b) => {
      if (a.criticality === LogLevel.Info && b.criticality !== LogLevel.Info) {
        return 1
      }
      if (b.criticality === LogLevel.Info && a.criticality !== LogLevel.Info) {
        return -1
      }

      const nameComparison = a.name.localeCompare(b.name)
      if (nameComparison !== 0) {
        return nameComparison
      }

      return a.criticality - b.criticality
    })
  }
}
