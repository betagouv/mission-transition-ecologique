import ProgramApi from '@/tools/api/programApi'
import { ResultApi } from '@/tools/api/resultApi'
import { CompanyData } from '@/tools/companyData'
import Navigation from '@/tools/navigation'
import AbstractProgram from '@/tools/program/abstractProgram'
import { QuestionnaireData } from '@/tools/questionnaire/questionnaireData'
import { AbstractProgramTypeForFront, ProgramTypeForFront, QuestionnaireData as QuestionnaireDataType } from '@/types'

export class ProgramManager {
  _useProgram = useProgramStore()
  _useNavigation = useNavigationStore()

  async get(questionnaireData: QuestionnaireDataType = {}) {
    this._useNavigation.hasSpinner = true
    const resultApi = await this._getFromApi(questionnaireData)
    if (resultApi.isOk() && resultApi.data) {
      const teePrograms: ProgramTypeForFront[] = []
      const externalPrograms: AbstractProgramTypeForFront[] = []

      resultApi.data.forEach((program) => {
        if (AbstractProgram.isTeeProgram(program)) {
          teePrograms.push(program)
        } else if (AbstractProgram.isExternalProgram(program)) {
          externalPrograms.push(program)
        }
      })

      this._useProgram.programs = teePrograms
      this._useProgram.extPrograms = externalPrograms

      this._useProgram.hasPrograms = true
      this._useProgram.hasError = false
    } else {
      this._useProgram.hasError = true
      this._useProgram.hasPrograms = false
    }
    this._useNavigation.hasSpinner = false
  }

  async getFiltered(onlyEligible: boolean | undefined = undefined) {
    const questionnaireData = QuestionnaireData.get()
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
        this._useProgram.currentExtProgram = undefined
        return
      }
    }

    if (this._useProgram.extPrograms && this._useProgram.extPrograms.length > 0) {
      const extProgram = this._useProgram.extPrograms.find((program) => program.id === id)
      if (extProgram) {
        this._useProgram.currentExtProgram = extProgram
        this._useProgram.currentProgram = undefined
        return
      }
    }

    this._useNavigation.hasSpinner = true
    const resultApi = await this._getOneFromApi(id)
    if (resultApi.isOk()) {
      if (AbstractProgram.isTeeProgram(resultApi.data)) {
        this._useProgram.currentProgram = resultApi.data as ProgramTypeForFront
        this._useProgram.currentExtProgram = undefined
      } else if (AbstractProgram.isExternalProgram(resultApi.data)) {
        this._useProgram.currentExtProgram = resultApi.data
        this._useProgram.currentProgram = undefined
      }
      this._useProgram.hasError = false
    } else {
      this._useProgram.hasError = true
    }
    this._useNavigation.hasSpinner = false
  }

  async getDependentCompanyData(onlyEligible: boolean | undefined = undefined) {
    CompanyData.isDataFull() && useFiltersStore().companyDataSelected ? await this.getFiltered(onlyEligible) : await this.get()
  }

  async update() {
    const navigation = new Navigation()
    if (navigation.isQuestionnaireResult() || navigation.isQuestionnaireProjectDetail()) {
      await this.getDependentCompanyData(undefined)
    } else if (navigation.isCatalogProjectDetail() || navigation.isCatalogPrograms()) {
      await this.getDependentCompanyData(true)
    } else if (navigation.isProgramDetail() && this._useProgram.currentProgram) {
      const currentId = this._useProgram.currentProgram.id
      this._useProgram.reset()
      await this.getOneById(currentId)
    } else if (navigation.isProgramDetail() && this._useProgram.currentExtProgram) {
      const currentId = this._useProgram.currentExtProgram.id
      this._useProgram.reset()
      await this.getOneById(currentId)
    } else {
      this._useProgram.reset()
    }
  }

  private async _getFromApi(questionnaireData: QuestionnaireDataType = {}): Promise<ResultApi<AbstractProgramTypeForFront[]>> {
    return (await new ProgramApi(questionnaireData).get()) as unknown as ResultApi<AbstractProgramTypeForFront[]>
  }

  private async _getOneFromApi(id: string): Promise<ResultApi<AbstractProgramTypeForFront>> {
    return (await new ProgramApi(QuestionnaireData.get()).getOne(id)) as unknown as ResultApi<AbstractProgramTypeForFront>
  }
}
