import { ProjectType } from './types/shared'

export class ProjectEligibility {
  public isEligible(project: ProjectType, codeNAF1: string) {
    return project.sectors.includes(codeNAF1)
  }
}
