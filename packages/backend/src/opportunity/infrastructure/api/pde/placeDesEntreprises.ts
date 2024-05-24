import { Result } from 'true-myth'
import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { handleException } from '../../../../common/domain/error/errors'
import Config from '../../../../config'
import { GetLandingResponseData, Landing, Subject, subjectToIdMapping } from './types'
import { Objective } from '@tee/common/src/questionnaire/types'

export class PDE {
  private readonly _baseUrl = 'https://reso-staging.osc-fr1.scalingo.io/api/v1'
  private _axios: AxiosInstance

  constructor() {
    const token = Config.PDE_API_TOKEN
    this._axios = axios.create({
      baseURL: this._baseUrl,
      headers: this._makeHeaders(token)
    })
  }

  getLandingId = async (): Promise<Result<number, Error>> => {
    try {
      const rawResponse = await this._axios.request<GetLandingResponseData>({
        method: 'GET',
        url: `/landings`,
        timeout: 3000
      })
      const response = rawResponse.data
      if (Array.isArray(response.data) && response.data.length > 0) {
        const landingPage = response.data[0] as Landing
        return Result.ok(landingPage.id)
      } else {
        return Result.err(Error('PDE landing ID not found'))
      }
    } catch (exception: unknown) {
      return Result.err(handleException(exception))
    }
  }

  private _makeHeaders(token: string): RawAxiosRequestHeaders {
    return {
      ...AxiosHeaders.makeJsonHeader(),
      Authorization: `Bearer ${token}`
    }
  }

  private _objectiveToSubjectIdMapping: { [key in Objective]: Subject } = {
    [Objective.EnvironmentalImpact]: Subject.DemarcheEcologie,
    [Objective.EnergyPerformance]: Subject.Energie,
    [Objective.WaterConsumption]: Subject.Eau,
    [Objective.BuildingRenovation]: Subject.Energie,
    [Objective.SustainableMobility]: Subject.TransportMobilite,
    [Objective.WasteManagement]: Subject.Dechets,
    [Objective.EcoDesign]: Subject.DemarcheEcologie,
    [Objective.TrainOrRecruit]: Subject.BilanRSE,
    [Objective.MakeSavings]: Subject.DemarcheEcologie,
    [Objective.DurablyInvest]: Subject.DemarcheEcologie,
    [Objective.UnknownYet]: Subject.DemarcheEcologie
  }

  subjectMapping(programObjectives: Objective[]): number {
    const defaultSubject = Subject.DemarcheEcologie
    if (programObjectives.length === 1) {
      const objective = programObjectives[0] as Objective
      const subjectKey = this._objectiveToSubjectIdMapping[objective]
      return subjectToIdMapping[subjectKey]
    } else {
      return subjectToIdMapping[defaultSubject]
    }
  }

  async createOpportunity(opportunity: Opportunity, program: Program): Promise<Result<number, Error>> {
    
  }
}
