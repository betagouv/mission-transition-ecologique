import { useUsedTrackStore } from '@/stores/usedTrack'
import ProjectApi from '@/tools/api/projectApi'
import { ResultApi } from '@/tools/api/resultApi'
import Navigation from '@/tools/navigation'
import { type ProjectFilterQuery, ProjectType, Sector } from '@/types'

export class ProjectManager {
  _useProject = useProjectStore()
  _useNavigation = useNavigationStore()

  async getProjects(filteredData: ProjectFilterQuery = {}) {
    this._useNavigation.hasSpinner = true
    const resultApi = await this._getProjectsFromApi(filteredData)
    if (resultApi.isOk()) {
      this._useProject.projects = resultApi.data
      this._useProject.hasProjects = true
    } else {
      this._useProject.hasError = true
      this._useProject.hasProjects = false
    }
    this._useNavigation.hasSpinner = false
  }

  async getFilteredProjects() {
    const { codeNAF1, sector, secteur } = useUsedTrackStore().getQuestionnaireData()
    const filteredData: ProjectFilterQuery = {
      ...(codeNAF1 && { codeNAF1 }),
      sector: !codeNAF1 ? sector || (secteur as Sector) : undefined
    }

    await this.getProjects(filteredData)
  }

  async getProjectBySlug(slug: string) {
    if (this._useProject.currentProject && this._useProject.currentProject.slug === slug) {
      return
    }

    if (this._useProject.hasProjects) {
      const project = this._useProject.projects.find((project) => project.slug === slug)
      if (project) {
        this._useProject.currentProject = project
        return
      }
    }

    this._useNavigation.hasSpinner = true
    const resultApi = await this._getProjectFromApi(slug)
    if (resultApi.isOk()) {
      this._useProject.currentProject = resultApi.data
    } else {
      this._useProject.hasError = true
      this._useProject.hasProjects = false
    }
    this._useNavigation.hasSpinner = false
  }

  async update() {
    const navigation = new Navigation()
    // if (navigation.isProjectDetail() && this._useProject.currentProject) {
    //   this.getProjectBySlug(this._useProject.currentProject.slug)
    // }
    if (navigation.isQuestionnaireResult()) {
      await this.getFilteredProjects()
    } else if (navigation.isCatalogProjects()) {
      await this.getProjects()
    } else if (navigation.isProgramDetail()) {
      await this.getFilteredProjects()
    } else {
      this._useProject.reset()
    }
  }

  private async _getProjectsFromApi(projectFilterQuery: ProjectFilterQuery = {}): Promise<ResultApi<ProjectType[]>> {
    return await new ProjectApi(projectFilterQuery).get()
  }

  private async _getProjectFromApi(slug: string): Promise<ResultApi<ProjectType>> {
    return await new ProjectApi().getOne(slug)
  }
}
