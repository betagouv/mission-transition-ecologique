import RequestApi from '@/tools/api/requestApi'
import type { Project } from '@/types'
import { projects, projectsTest } from '@tee/data/static'
import { Result } from 'true-myth'

export default class ProjectApi extends RequestApi {
  protected override readonly url = '/api/projects'

  constructor() {
    super()
  }

  async get(): Promise<Result<Project[], Error>> {
    let projectsData: Project[] = projects
    if (import.meta.env.VITE_DATA_TEST === 'true') {
      projectsData = projectsTest
    }
    //TODO replace with api call once the endpoint is available
    return new Promise((resolve, reject) => {
      if (!projectsData) reject(new Error('No project data'))
      else resolve(Result.ok(projectsData))
    })
  }

  async getOne(slug: string): Promise<Result<Project, Error>> {
    // TO DO : api to get projects when backend is ready
    // const url: string = this.url + '/' + slug
    const { data: project } = await useAsyncData(`project-id-${slug}`, async () => {
      return projects.find((project) => project.slug === slug)
    })

    if (project.value) {
      return Result.ok(project.value)
    }

    return Result.err(new Error('Project not found'))
  }
}