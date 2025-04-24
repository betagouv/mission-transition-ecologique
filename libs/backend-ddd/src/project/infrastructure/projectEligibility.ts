import { ProjectEligibilityInterface } from '../domain/spi'
import { ProjectEligibility as DataProjectEligibility, ProjectType } from '@tee/data'

export class ProjectEligibility implements ProjectEligibilityInterface {
  public isEligible(project: ProjectType, codeNAF1: string): boolean {
    return new DataProjectEligibility().isEligible(project, codeNAF1)
  }
}
