import { Project } from '@tee/data'
import { projects } from '@tee/data/static'

export default class ProjectFeatures {
  public getById(id: number): Project | undefined {
    return projects.find((project) => project.id === +id)
  }
}
