import { ProgramType, ProjectType } from '@tee/data'
// import { ProjectEligibility, ProjectSorter, ProjectType } from '@tee/data'
import ProjectFeatures from '../domain/projectFeatures'
import { QuestionnaireData } from '@tee/common'
import { Result } from 'true-myth'

export class ProjectService {
  private _project: ProjectFeatures

  public constructor() {
    const projectEligibility = new ProjectEligibility()
    const projectSorter = new ProjectSorter()
    this._project = new ProjectFeatures(projectEligibility, projectSorter)
  }

  public getFiltered(questionnaireData: QuestionnaireData): Result<ProjectType[], Error> {
    try {
      return Result.ok(this._project.getFiltered(questionnaireData))
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Result.err(error)
      } else {
        return Result.err(new Error(String(error)))
      }
    }
  }

  public addEligibleProgramsCount(projects: ProjectType[], programs: ProgramType[]): Result<ProjectType[], Error> {
    try {
      const eligibleProgramsSet = new Set(programs.map((program) => program.id))
      const projectList = projects.map((project: ProjectType) => {
        const countEligiblePrograms = project.programs.reduce(
          (count, programId: string) => count + (eligibleProgramsSet.has(programId) ? 1 : 0),
          0
        )
        return {
          ...project,
          countEligiblePrograms
        }
      })
      return Result.ok(projectList)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Result.err(error)
      } else {
        return Result.err(new Error(String(error)))
      }
    }
  }

  public getById(id: number): ProjectType | undefined {
    return this._project.getById(id)
  }

  public getBySlug(id: string): ProjectType | undefined {
    return this._project.getBySlug(id)
  }
}
