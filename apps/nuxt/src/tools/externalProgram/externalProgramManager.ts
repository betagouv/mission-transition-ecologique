import ExternalProgramApi from '@/tools/api/externalProgramApi'
import { ResultApi } from '@/tools/api/resultApi'
import { ExternalProgramType } from '@/types'

export class ExternalProgramManager {
  _useExternalProgram = useExternalProgramStore()
  _useNavigation = useNavigationStore()
  private static _isLoading = false

  async get() {
    // Prevent multiple simultaneous calls
    if (ExternalProgramManager._isLoading) {
      return
    }

    // If we already have the data, don't fetch again
    if (this._useExternalProgram.hasExternalPrograms) {
      return
    }

    ExternalProgramManager._isLoading = true
    this._useNavigation.hasSpinner = true

    try {
      const resultApi = await this._getFromApi()
      console.log(resultApi)
      if (resultApi.isOk()) {
        this._useExternalProgram.externalPrograms = resultApi.data
        this._useExternalProgram.hasExternalPrograms = true
        this._useExternalProgram.hasError = false
      } else {
        this._useExternalProgram.hasError = true
        this._useExternalProgram.hasExternalPrograms = false
      }
    } finally {
      this._useNavigation.hasSpinner = false
      ExternalProgramManager._isLoading = false
    }
  }

  async getOneById(id: string) {
    // If we have all external programs in memory, use them
    if (this._useExternalProgram.hasExternalPrograms) {
      const program = this._useExternalProgram.externalPrograms.find((program) => program.id === id)
      if (program) {
        this._useExternalProgram.currentExternalProgram = program
        return
      }
    }

    // Otherwise, fetch the single program from the API
    this._useNavigation.hasSpinner = true
    const resultApi = await this._getOneFromApi(id)
    if (resultApi.isOk()) {
      this._useExternalProgram.currentExternalProgram = resultApi.data
      this._useExternalProgram.hasError = false
    } else {
      this._useExternalProgram.hasError = true
    }
    this._useNavigation.hasSpinner = false
  }

  private async _getFromApi(): Promise<ResultApi<ExternalProgramType[]>> {
    return await new ExternalProgramApi().get()
  }

  private async _getOneFromApi(id: string): Promise<ResultApi<ExternalProgramType>> {
    return await new ExternalProgramApi().getOne(id)
  }
}
