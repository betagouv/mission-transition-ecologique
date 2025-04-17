import { ProgramType, ProjectType } from '@tee/data'
import ProjectFeatures from '../domain/projectFeatures'
import { QuestionnaireData } from '@tee/common'
import { Result } from 'true-myth'
import { RedirectService } from '../../common/application/redirectService'
import { ProjectEligibility } from '../infrastructure/projectEligibility'
import ProjectsJson from '../infrastructure/projectsJson'
import { ProjectSorter } from '../infrastructure/projectSorter'

export class ProjectService {
  private _project: ProjectFeatures

  public constructor() {
    this._project = new ProjectFeatures(ProjectsJson.getInstance(), new ProjectEligibility(), new ProjectSorter())
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

  public getRedirect(slug: string): string | undefined {
    return new RedirectService().getByProjectSlug(slug)
  }
}
