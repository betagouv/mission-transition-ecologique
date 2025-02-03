import { ProjectType } from './types/shared'
import { ProjectEligibilityInterface } from '../../../backend-ddd/src/project/domain/spi'

export class ProjectEligibility implements ProjectEligibilityInterface {
  public isEligible(project: ProjectType, codeNAF1: string) {
    return project.sectors.includes(codeNAF1)
  }
}
