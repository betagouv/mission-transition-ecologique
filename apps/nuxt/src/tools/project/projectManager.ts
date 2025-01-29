import { useUsedTrackStore } from '@/stores/usedTrack'
import ProjectApi from '@/tools/api/projectApi'
import { ResultApi } from '@/tools/api/resultApi'
import Navigation from '@/tools/navigation'
import { type ProjectType, QuestionnaireData } from '@/types'

export class ProjectManager {
  _useProject = useProjectStore()
  _useNavigation = useNavigationStore()

  async getProjects(questionnaireData: QuestionnaireData = {}) {
    this._useNavigation.hasSpinner = true
    console.log('getProjects', questionnaireData)
    const resultApi = await this._getProjectsFromApi(questionnaireData)
    console.log(resultApi, resultApi.isOk())
    if (resultApi.isOk()) {
      this._useProject.projects = resultApi.data
      console.log('get projects', this._useProject.projects[0])
      this._useProject.hasProjects = true
      this._useProject.hasError = false
    } else {
      this._useProject.hasError = true
      this._useProject.hasProjects = false
    }
    this._useNavigation.hasSpinner = false
  }

  async getFilteredProjects() {
    const questionnaireData = useUsedTrackStore().getQuestionnaireData()

    await this.getProjects(questionnaireData)
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
      this._useProject.hasError = false
    } else {
      this._useProject.hasError = true
    }
    this._useNavigation.hasSpinner = false
  }

  async update() {
    const navigation = new Navigation()
    // if (navigation.isProjectDetail() && this._useProject.currentProject) {
    //   this.getProjectBySlug(this._useProject.currentProject.slug)
    // }
    if (
      navigation.isQuestionnaireResult() ||
      navigation.isProgramDetail() ||
      navigation.isQuestionnaireThemeCards() ||
      navigation.isHomepage()
    ) {
      await this.getFilteredProjects()
    } else if (navigation.isCatalogProjects()) {
      const questionnaireData = useUsedTrackStore().getQuestionnaireData()
      await this.getProjects(questionnaireData)
    } else {
      this._useProject.reset()
    }
  }

  private async _getProjectsFromApi(questionnaireData: QuestionnaireData = {}): Promise<ResultApi<ProjectType[]>> {
    console.log('getProjectsFromApi')
    return await new ProjectApi(questionnaireData).get()
  }

  private async _getProjectFromApi(slug: string): Promise<ResultApi<ProjectType>> {
    return await new ProjectApi().getOne(slug)
  }
}
