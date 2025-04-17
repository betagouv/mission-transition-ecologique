import { ProjectSorterInterface } from '../domain/spi'
import { ProjectSorter as DataProjectSorter, ProjectType } from '@tee/data'

export class ProjectSorter implements ProjectSorterInterface {
  public byPriority(projects: ProjectType[]) {
    return new DataProjectSorter().byPriority(projects)
  }

  public bySector(projects: ProjectType[]) {
    return new DataProjectSorter().bySector(projects)
  }
}
