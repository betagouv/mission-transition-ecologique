import { ProjectType } from '@tee/data'
import { NafRepository } from '../../establishment/infrastructure/json/nafRepository'
import { ProjectSorterInterface } from './spi'

export class ProjectSorter implements ProjectSorterInterface {
  public byPriority(projects: ProjectType[], codeNAF: string | undefined): ProjectType[] {
    // Pre-compute priorities once per project to avoid recomputation (and NafRepository instantiation)
    // on every sort comparison, and return a new array so we don't mutate the shared singleton input.
    const nafRepository = new NafRepository()
    return projects
      .map((project) => ({ project, priority: this._getPriority(project.priority, codeNAF, nafRepository) }))
      .sort((a, b) => a.priority - b.priority)
      .map(({ project }) => project)
  }

  private _getPriority(priorities: Record<string, number>, companySector: string | undefined, nafRepository: NafRepository): number {
    if (!companySector) {
      return priorities['default']
    }
    if (priorities[companySector]) {
      return priorities[companySector]
    }

    for (const getter of ['getNiv4', 'getNiv3', 'getNiv2', 'getSectionCode'] as const) {
      const code = nafRepository[getter](companySector)
      if (code.isJust && priorities[code.value]) {
        return priorities[code.value]
      }
    }

    return priorities['default']
  }
}
