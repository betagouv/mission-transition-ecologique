import * as fs from 'fs'
import { LogEvent, LogLevel } from './types'

export class Logger {
  private logs: LogEvent[] = []

  log(criticity: LogLevel, message: string, data: any) {
    this.logs.push({ criticity, message, data })
  }

  write(fileName: string) {
    const sortedLogs = this.logs.sort((a, b) => a.criticity - b.criticity)

    let markdownContent = '| Criticity | Message | Data |\n'
    markdownContent += '| --- | --- | --- |\n'

    sortedLogs.forEach((log) => {
      const criticityDisplay = log.criticity === LogLevel.high ? '**<span style="color:red;">high</span>**' : log.criticity
      markdownContent += `| ${criticityDisplay} | ${log.message} | ${JSON.stringify(log.data)} |\n`
    })

    fs.writeFileSync(fileName, markdownContent, 'utf8')
  }
}
