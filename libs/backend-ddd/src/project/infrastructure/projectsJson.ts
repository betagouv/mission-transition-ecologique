import { ProjectRepository } from '../domain/spi'
import { projects as jsonProjects } from '@tee/data/static'
import { ProjectType } from '@tee/data'

export class ProjectsJson implements ProjectRepository {
  private static instance: ProjectsJson
  private _projects: ProjectType[] = []

  private constructor() {
    this._projects = jsonProjects as unknown as ProjectType[]
  }

  public static getInstance(): ProjectsJson {
    if (!ProjectsJson.instance) {
      ProjectsJson.instance = new ProjectsJson()
    }

    return ProjectsJson.instance
  }

  public get(): ProjectType[] {
    return this._projects
  }

  public getOneBySlug = (slug: string): ProjectType | undefined => {
    return this.get().find((project: ProjectType) => project.slug === slug)
  }

  public getOneById = (id: number): ProjectType | undefined => {
    return this.get().find((project: ProjectType) => project.id === +id)
  }
}
