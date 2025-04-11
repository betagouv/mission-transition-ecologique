import { useUsedTrackStore } from '@/stores/usedTrack'
import ProgramApi from '@/tools/api/programApi'
import { ResultApi } from '@/tools/api/resultApi'
import { CompanyData } from '@/tools/companyData'
import Navigation from '@/tools/navigation'
import { ProgramRedirect, ProgramTypeForFront, QuestionnaireData } from '@/types'

export class ProgramManager {
  _useProgram = useProgramStore()
  _useNavigation = useNavigationStore()

  async get(questionnaireData: QuestionnaireData = {}) {
    this._useNavigation.hasSpinner = true
    const resultApi = await this._getFromApi(questionnaireData)
    if (resultApi.isOk()) {
      this._useProgram.programs = resultApi.data
      this._useProgram.hasPrograms = true
      this._useProgram.hasError = false
    } else {
      this._useProgram.hasError = true
      this._useProgram.hasPrograms = false
    }
    this._useNavigation.hasSpinner = false
  }

  async getFiltered(onlyEligible: boolean | undefined = undefined) {
    const questionnaireData = useUsedTrackStore().getQuestionnaireData()
    if (onlyEligible !== undefined) {
      questionnaireData.onlyEligible = onlyEligible
    }
    await this.get(questionnaireData)
  }

  async getOneById(id: string) {
    if (this._useProgram.hasPrograms) {
      const program = this._useProgram.programs.find((program) => program.id === id)
      if (program) {
        this._useProgram.currentProgram = program
        return
      }
    }

    this._useNavigation.hasSpinner = true
    const resultApi = await this._getOneFromApi(id)
    if (resultApi.isOk()) {
      // console.log('isOK')
      // navigateTo('/aides-entreprise/amelioration-qualite-de-l-air')
      if (resultApi.data.newProgramId) {
        const route = useRoute()
        const newPath = route.fullPath.replace(route.params.programId as string, resultApi.data.newProgramId as string)
        console.log('ici', newPath)
        setTimeout(() => {
          navigateTo(newPath)
        }, 0)
      }
      this._useProgram.currentProgram = resultApi.data as ProgramTypeForFront
      this._useProgram.hasError = false
    } else {
      this._useProgram.hasError = true
    }
    this._useNavigation.hasSpinner = false
  }

  async getDependentCompanyData(onlyEligible: boolean | undefined = undefined) {
    CompanyData.isDataFull() ? await this.getFiltered(onlyEligible) : await this.get()
  }

  async update() {
    const navigation = new Navigation()
    if (navigation.isQuestionnaireResult() || navigation.isQuestionnaireProjectDetail() || navigation.isCatalogPrograms()) {
      await this.getDependentCompanyData(navigation.isCatalogPrograms() ? false : undefined)
    } else if (navigation.isCatalogProjectDetail()) {
      await this.getDependentCompanyData(true)
    } else if (navigation.isProgramDetail() && this._useProgram.currentProgram) {
      const currentId = this._useProgram.currentProgram.id
      this._useProgram.reset()
      await this.getOneById(currentId)
    } else {
      this._useProgram.reset()
    }
  }

  private async _getFromApi(questionnaireData: QuestionnaireData = {}): Promise<ResultApi<ProgramTypeForFront[]>> {
    return await new ProgramApi(questionnaireData).get()
  }

  private async _getOneFromApi(id: string): Promise<ResultApi<ProgramTypeForFront | ProgramRedirect>> {
    return await new ProgramApi(useUsedTrackStore().getQuestionnaireData()).getOne(id)
  }
}
