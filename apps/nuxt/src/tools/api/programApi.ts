import RequestApi from '@/tools/api/requestApi'
import { ResultApi } from '@/tools/api/resultApi'
import { ProgramTypeForFront, QuestionnaireData, QuestionnaireDataEnum } from '@/types'

export default class ProgramApi extends RequestApi {
  protected readonly url = '/api/programs'

  constructor(private questionnaireData: QuestionnaireData = {}) {
    super()
    this.query = this.buildQuery
  }

  async get(): Promise<ResultApi<ProgramTypeForFront[]>> {
    return await super.getJson<ProgramTypeForFront[]>()
  }

  async getOne(id: string): Promise<ResultApi<ProgramTypeForFront>> {
    return await super.getJson<ProgramTypeForFront>(this.url + '/' + id)
  }

  get buildQuery(): string {
    const queryString: { [key: string]: string } = {}
    Object.entries(this.questionnaireData).forEach(([key, value]: [string, string | string[] | undefined | null]) => {
      if (value !== undefined && value !== null) {
        if (this.isValidQueryParam(key)) {
          queryString[key] = value.toString()
        }
      }
    })
    const params = new URLSearchParams(queryString)
    params.sort()

    return params.toString()
  }

  isValidQueryParam(key: string) {
    return key !== (QuestionnaireDataEnum.priority_objective as string)
  }
}
