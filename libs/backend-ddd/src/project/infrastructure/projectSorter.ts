import { ProjectSorterInterface } from '../domain/spi'
import { ProjectSorter as DataProjectSorter, ProjectType } from '@tee/data'

export class ProjectSorter implements ProjectSorterInterface {
  public byPriority(projects: ProjectType[], codeNAF: string) {
    return new DataProjectSorter().byPriority(projects, codeNAF)
  }

  public bySector(projects: ProjectType[]) {
    return new DataProjectSorter().bySector(projects)
  }
}
