import { ProjectType } from './types/shared'
import { ProjectSorterInterface } from '../../../backend-ddd/src/project/domain/spi'

export class ProjectSorter implements ProjectSorterInterface {
  public sortByPriority(projects: ProjectType[]) {
    console.log('Sort by priority')
    return projects.sort((a, b) => {
      return a.priority - b.priority
    })
  }

  public sortBySector(projects: ProjectType[]) {
    console.log('Sort by sector')
    return projects.sort((a, b) => {
      return a.sectors.length <= 5 && a.sectors.length < b.sectors.length ? -1 : 1
    })
  }
}
