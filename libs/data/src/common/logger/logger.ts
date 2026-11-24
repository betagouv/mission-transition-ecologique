import * as fs from 'fs'
import { LinkStatus } from '../validators/linkStatus'
import { LogEvent, LoggedLink, LoggerInterface, LoggerType, LogLevel, LogLevelDisplay } from './types'

export class Logger implements LoggerInterface {
  private _logs: LogEvent[] = []

  // Configuration centralisée des URLs Baserow
  private static readonly _baserowBaseUri = 'https://baserow.io/database/114839/table/'
  private static readonly _baserowConfig = {
    [LoggerType.Program]: { tableId: '314437', viewId: '539069' },
    [LoggerType.Project]: { tableId: '305253', viewId: '519286' },
    [LoggerType.Faq]: { tableId: '669314', viewId: '1271291' },
    [LoggerType.Operator]: { tableId: '314410', viewId: '539018' }
  }

  private static readonly _linkProblemLabels: Record<LinkStatus, string> = {
    [LinkStatus.Valid]: 'Lien valide',
    [LinkStatus.Broken]: 'Lien cassé',
    [LinkStatus.Malformed]: 'Lien mal formé (chemin local ou protocole non web)',
    [LinkStatus.Unverifiable]: 'Non vérifiable automatiquement (protection anti-robot)',
    [LinkStatus.Forbidden]: 'Accès refusé (403), même dans un navigateur',
    [LinkStatus.Unreachable]: 'Injoignable, même dans un navigateur'
  }

  constructor(
    private _type: LoggerType,
    private _consoleLog = false
  ) {}

  private _buildBaserowLink(log: LogEvent): string | undefined {
    const config = Logger._baserowConfig[log.type ?? this._type]
    if (!config) {
      return undefined
    }

    return `${Logger._baserowBaseUri}${config.tableId}/${config.viewId}/row/${log.baserowId}`
  }

  log(criticality: LogLevel, message: string, name: string, baserowId: number, data?: unknown, type?: LoggerType): void {
    this._logs.push({ name, baserowId, criticality, message, data, type })
    if (this._consoleLog) {
      console.log({ name, baserowId, criticality, message, data, type })
    }
  }

  logLink(criticality: LogLevel, link: LoggedLink, name: string, baserowId: number, type?: LoggerType): void {
    const message = `${Logger._linkProblemLabels[link.status]} dans le champ ${link.field}`
    this._logs.push({ name, baserowId, criticality, message, data: link.url, type, link })
    if (this._consoleLog) {
      console.log({ name, baserowId, criticality, message, link, type })
    }
  }

  write(fileName: string) {
    const sortedLogs = this._sortLogs()
    const generalLogs = sortedLogs.filter((log) => !log.link)
    const linkLogs = sortedLogs.filter((log) => log.link?.status === LinkStatus.Broken || log.link?.status === LinkStatus.Malformed)
    const toCheckLogs = sortedLogs.filter((log) => log.link?.status === LinkStatus.Forbidden || log.link?.status === LinkStatus.Unreachable)
    const unverifiableLogs = sortedLogs.filter((log) => log.link?.status === LinkStatus.Unverifiable)

    // Most important sections first: the PR body may be truncated at the end
    const markdownContent =
      this._renderGeneralLogs(generalLogs) +
        this._renderLinkLogs(linkLogs) +
        this._renderToCheckLogs(toCheckLogs) +
        this._renderUnverifiableLogs(unverifiableLogs) || 'Aucun point problématique détecté.\n'

    fs.writeFileSync(fileName, markdownContent, 'utf8')
  }

  private _renderGeneralLogs(logs: LogEvent[]): string {
    if (logs.length === 0) {
      return ''
    }
    let markdownContent = `| Niveau de l'erreur | ${this._type} concerné | Lien Baserow | Message | Données |\n`
    markdownContent += '| --- | --- | --- | --- | --- |\n'

    logs.forEach((log) => {
      const baserowLink = this._buildBaserowLink(log)
      markdownContent += `| ${LogLevelDisplay[log.criticality]} | ${log.name} | ${baserowLink ? `[lien](${baserowLink})` : ``} |  ${log.message} | ${JSON.stringify(log.data)} |\n`
    })

    return markdownContent
  }

  /**
   * One row per broken or malformed link, with every place where it is used.
   */
  private _renderLinkLogs(logs: LogEvent[]): string {
    const logsByUrl = this._groupBy(logs, (log) => (log.link as LoggedLink).url)
    if (logsByUrl.size === 0) {
      return ''
    }

    const rows = [...logsByUrl.entries()]
      .map(([url, urlLogs]) => ({ url, logs: urlLogs, criticality: Math.min(...urlLogs.map((log) => log.criticality)) as LogLevel }))
      .sort((a, b) => a.criticality - b.criticality || a.url.localeCompare(b.url))

    let markdownContent = `\n#### Liens cassés ou mal formés (${rows.length})\n\n`
    markdownContent += '| Niveau | Lien | Problème | Utilisé dans |\n'
    markdownContent += '| --- | --- | --- | --- |\n'
    rows.forEach(({ url, logs: urlLogs, criticality }) => {
      const status = (urlLogs[0].link as LoggedLink).status
      const linkCell =
        status === LinkStatus.Malformed ? `\`${this._encodeUrl(url)}\`` : this._markdownLink(this._shortLabel(url, true), url)
      markdownContent += `| ${LogLevelDisplay[criticality]} | ${linkCell} | ${this._problem(urlLogs[0].link as LoggedLink)} | ${this._renderUsages(urlLogs)} |\n`
    })

    return markdownContent
  }

  /**
   * Links refused with a 403 or unreachable even in a real browser: visible, since some are really deleted files or dead servers,
   * but apart from the broken links since a firewall blocking bots or the CI servers gives the same result.
   */
  private _renderToCheckLogs(logs: LogEvent[]): string {
    const logsByUrl = this._groupBy(logs, (log) => (log.link as LoggedLink).url)
    if (logsByUrl.size === 0) {
      return ''
    }

    let markdownContent = `\n#### ${LogLevelDisplay[LogLevel.Info]} Liens refusés ou injoignables même dans un navigateur, à vérifier manuellement (${logsByUrl.size})\n\n`
    markdownContent +=
      'Fichier supprimé ou serveur en panne, ou pare-feu qui bloque les robots ou les serveurs de la CI : le lien peut fonctionner pour un visiteur.\n\n'
    markdownContent += '| Lien | Problème | Utilisé dans |\n'
    markdownContent += '| --- | --- | --- |\n'
    ;[...logsByUrl.keys()].sort().forEach((url) => {
      const urlLogs = logsByUrl.get(url) as LogEvent[]
      markdownContent += `| ${this._markdownLink(this._shortLabel(url, true), url)} | ${this._problem(urlLogs[0].link as LoggedLink)} | ${this._renderUsages(urlLogs)} |\n`
    })

    return markdownContent
  }

  // "Lien cassé (HTTP 500)"
  private _problem(link: LoggedLink): string {
    const label = Logger._linkProblemLabels[link.status]
    return link.reason ? `${label} (${this._escapeText(link.reason)})` : label
  }

  /**
   * Links behind an anti-bot protection, grouped by domain in a collapsed section.
   */
  private _renderUnverifiableLogs(logs: LogEvent[]): string {
    const logsByUrl = this._groupBy(logs, (log) => (log.link as LoggedLink).url)
    if (logsByUrl.size === 0) {
      return ''
    }

    const urlsByHost = this._groupBy([...logsByUrl.keys()], (url) => this._hostname(url))
    const hosts = [...urlsByHost.keys()].sort()
    const hostSummary = hosts.map((host) => `\`${host}\` (${(urlsByHost.get(host) as string[]).length})`).join(', ')

    let markdownContent = '\n<details>\n'
    markdownContent += `<summary>${LogLevelDisplay[LogLevel.Info]} ${logsByUrl.size} liens non vérifiables automatiquement (protection anti-robot), à contrôler manuellement</summary>\n\n`
    markdownContent += `Domaines : ${hostSummary}\n\n`
    markdownContent += '| Domaine | Lien | Utilisé dans |\n'
    markdownContent += '| --- | --- | --- |\n'
    hosts.forEach((host) => {
      const urls = (urlsByHost.get(host) as string[]).sort()
      urls.forEach((url) => {
        markdownContent += `| ${host} | ${this._markdownLink(this._shortLabel(url, false), url)} | ${this._renderUsages(logsByUrl.get(url) as LogEvent[])} |\n`
      })
    })
    markdownContent += '\n</details>\n'

    return markdownContent
  }

  // "[slug](baserow) : étape 1, Contact Question" for each distinct row using the link
  private _renderUsages(logs: LogEvent[]): string {
    const logsByRow = this._groupBy(logs, (log) => `${log.type ?? this._type}|${log.baserowId}|${log.name}`)
    return [...logsByRow.values()]
      .map((rowLogs) => {
        const baserowLink = this._buildBaserowLink(rowLogs[0])
        const name = rowLogs[0].name
        const fields = [...new Set(rowLogs.map((log) => (log.link as LoggedLink).field))].join(', ')
        return `${baserowLink ? this._markdownLink(name, baserowLink) : this._escapeText(name)} : ${this._escapeText(fields)}`
      })
      .join('<br>')
  }

  private _groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
    const groups = new Map<string, T[]>()
    for (const item of items) {
      const itemKey = key(item)
      groups.set(itemKey, [...(groups.get(itemKey) ?? []), item])
    }
    return groups
  }

  /**
   * Readable and short link text, the full URL stays in the link target:
   * decoded path, with the host or not, truncated in the middle.
   */
  private _shortLabel(url: string, withHost: boolean): string {
    let label = url
    try {
      const parsed = new URL(url)
      label = (withHost ? parsed.hostname : '') + decodeURIComponent(parsed.pathname + parsed.search)
    } catch {
      // keep the raw url
    }
    const maxLength = 70
    if (label.length > maxLength) {
      label = `${label.slice(0, 30)}…${label.slice(-(maxLength - 31))}`
    }
    return label
  }

  private _markdownLink(label: string, url: string): string {
    return `[${this._escapeText(label)}](${this._encodeUrl(url)})`
  }

  /**
   * Url inside a link target or a code span: characters that would end the target (space, parenthesis),
   * split the table cell (pipe), close the code span (backtick) or open an html tag are percent-encoded,
   * which keeps the url valid.
   */
  private _encodeUrl(url: string): string {
    return url.replace(/\r?\n/g, '').replace(/[ ()|`<>]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`)
  }

  private _hostname(url: string): string {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  /**
   * Text inside a table cell or a link text: pipes would split the cell, brackets would break the link,
   * `<` could open an html tag, `*`, `_` and backticks would start an emphasis or a code span.
   * Backslashes are escaped too so they cannot cancel the other escapes.
   */
  private _escapeText(value: string): string {
    return value.replace(/[\\|[\]<>*_`]/g, '\\$&').replace(/\r?\n/g, ' ')
  }

  private _sortLogs(): LogEvent[] {
    return this._logs.sort((a, b) => {
      const criticalityComparison = a.criticality - b.criticality
      if (criticalityComparison !== 0) {
        return criticalityComparison
      }
      return a.name.localeCompare(b.name)
    })
  }
}
