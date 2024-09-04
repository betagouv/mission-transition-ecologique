import { Project } from '@tee/data'
import ProjectFeatures from '../domain/projectFeatures'

export class ProjectService {
  private _project: ProjectFeatures

  public constructor() {
    this._project = new ProjectFeatures()
  }

  public getById(id: number): Project | undefined {
    return this._project.getById(id)
  }
  public getBySlug(id: string): Project | undefined {
    return this._project.getBySlug(id)
  }
}
