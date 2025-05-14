import { ProjectType } from '@/types'
import Navigation from '@/tools/navigation'
import { useFiltersStore } from '@/stores/filters'

export default class ProjectPriority {
  static get(projects: ProjectType[] = []): ProjectType[] | undefined {
    const filtersStore = useFiltersStore()

    const hasThemeSelected = filtersStore.hasThemeTypeSelected()
    const isCompanyDataSelected = filtersStore.getCompanyDataSelected().value
    const isHomePage = new Navigation().isHomepage()

    if (!isCompanyDataSelected || (isHomePage && !hasThemeSelected)) {
      return undefined
    }

    const projectQty = hasThemeSelected ? 1 : 3
    return projects.slice(0, projectQty)
  }

  static is(project: ProjectType, priorityProjects: ProjectType[] = []): boolean {
    return priorityProjects.includes(project)
  }

  static getIndex(project: ProjectType, priorityProjects: ProjectType[] = []): number | undefined {
    if (!ProjectPriority.is(project, priorityProjects)) {
      return undefined
    }
    return priorityProjects.indexOf(project) + 1
  }

  static isUnique(priorityProjects: ProjectType[] = []): boolean {
    return priorityProjects.length === 1
  }

  static has(projects: ProjectType[] = []): boolean {
    return projects.length > 0
  }

  static getNonPriorityProjects(projects: ProjectType[] = [], priorityProjects: ProjectType[] = []): ProjectType[] {
    return projects.filter((project) => !priorityProjects.includes(project))
  }
}
