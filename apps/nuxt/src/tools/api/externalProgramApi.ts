import RequestApi from '@/tools/api/requestApi'
import { ResultApi } from '@/tools/api/resultApi'
import { ProgramType } from '@/types'

export default class ExternalProgramApi extends RequestApi {
  protected readonly url = '/api/externalPrograms'

  constructor() {
    super()
  }

  async get(): Promise<ResultApi<ExternalProgramType[]>> {
    return await super.getJson<ExternalProgramType[]>()
  }

  async getOne(id: string): Promise<ResultApi<ExternalProgramType>> {
    return await super.getJson<ExternalProgramType>(this.url + '/' + id)
  }
}
