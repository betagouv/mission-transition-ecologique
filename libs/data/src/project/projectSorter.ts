import { ProjectType } from './types/shared'
import { ProjectSorterInterface } from '../../../backend-ddd/src/project/domain/spi'

export class ProjectSorter implements ProjectSorterInterface {
  public sortBySector(projects: ProjectType[]) {
    return projects.sort((a, b) => {
      return a.sectors.length <= 5 && a.sectors.length < b.sectors.length ? -1 : 1
    })
  }
}
