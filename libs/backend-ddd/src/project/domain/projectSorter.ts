import { ProjectType } from '@tee/data'
import { NafRepository } from '../../establishment/infrastructure/json/nafRepository'
import { ProjectSorterInterface } from './spi'

export class ProjectSorter implements ProjectSorterInterface {
  public byPriority(projects: ProjectType[], codeNAF: string | undefined) {
    return projects.sort((a, b) => {
      return this._getPriority(a.priority, codeNAF) - this._getPriority(b.priority, codeNAF)
    })
  }

  private _getPriority(priorities: Record<string, number>, companySector: string | undefined): number {
    if (!companySector) {
      return priorities['default']
    }
    if (priorities[companySector]) {
      return priorities[companySector]
    }

    const nafRepository = new NafRepository()
    for (const getter of ['getNiv4', 'getNiv3', 'getNiv2', 'getSectionCode'] as const) {
      const code = nafRepository[getter](companySector)
      if (code.isJust && priorities[code.value]) {
        return priorities[code.value]
      }
    }

    return priorities['default']
  }
}
