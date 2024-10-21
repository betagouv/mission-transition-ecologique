import { Project } from '@tee/data'
import ProjectFeatures from '../domain/projectFeatures'
import { ProjectFilterQuery } from '@tee/common'
import { Result } from 'true-myth'

export class ProjectService {
  private _project: ProjectFeatures

  public constructor() {
    this._project = new ProjectFeatures()
  }

  public getFiltered(projectQuery: ProjectFilterQuery): Result<Project[], Error> {
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

  public getById(id: number): Project | undefined {
    return this._project.getById(id)
  }

  public getBySlug(id: string): Project | undefined {
    return this._project.getBySlug(id)
  }
}
