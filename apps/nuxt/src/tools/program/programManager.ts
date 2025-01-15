import { useUsedTrackStore } from '@/stores/usedTrack'
import ProgramApi from '@/tools/api/programApi'
import { ResultApi } from '@/tools/api/resultApi'
import { CompanyData } from '@/tools/companyData'
import Navigation from '@/tools/navigation'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'
import { ProgramData, QuestionnaireData } from '@/types'

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
    if (this._useProgram.currentProgram && this._useProgram.currentProgram.id === id) {
      return
    }

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
      this._useProgram.currentProgram = resultApi.data
      this._useProgram.hasError = false
    } else {
      this._useProgram.hasError = true
    }
    this._useNavigation.hasSpinner = false
  }

  async getDependentCompanyData(onlyEligible: boolean | undefined = undefined) {
    CompanyData.isDataFull().value ? await this.getFiltered(onlyEligible) : await this.get()
  }

  async update() {
    const navigation = new Navigation()
    if (
      (navigation.isQuestionnaireResult() && UsedTrack.isNoSpecificGoal()) ||
      navigation.isQuestionnaireProjectDetail() ||
      navigation.isCatalogProjectDetail() ||
      navigation.isCatalogPrograms()
    ) {
      await this.getDependentCompanyData(navigation.isCatalogPrograms() ? false : undefined)
    } else if (navigation.isProgramDetail() && this._useProgram.currentProgram) {
      const currentId = this._useProgram.currentProgram.id
      this._useProgram.reset()
      await this.getOneById(currentId)
    } else {
      this._useProgram.reset()
    }
  }

  private async _getFromApi(questionnaireData: QuestionnaireData = {}): Promise<ResultApi<ProgramData[]>> {
    return await new ProgramApi(questionnaireData).get()
  }

  private async _getOneFromApi(id: string): Promise<ResultApi<ProgramData>> {
    return await new ProgramApi(useUsedTrackStore().getQuestionnaireData()).getOne(id)
  }
}
