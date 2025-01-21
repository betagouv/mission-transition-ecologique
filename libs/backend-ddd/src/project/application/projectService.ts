import { ProgramType, ProjectType } from '@tee/data'
import ProjectFeatures from '../domain/projectFeatures'
import { ProjectFilterQuery } from '@tee/common'
import { Result } from 'true-myth'

export class ProjectService {
  private _project: ProjectFeatures

  public constructor() {
    this._project = new ProjectFeatures()
  }

  public getFiltered(projectQuery: ProjectFilterQuery, availablePrograms: ProgramType[]): Result<ProjectType[], Error> {
    try {
      return Result.ok(this._project.getFiltered(projectQuery))
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
