import { Result } from 'true-myth'
import axios, { AxiosError, AxiosInstance, RawAxiosRequestHeaders } from 'axios'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { ensureError } from '../../../../common/domain/error/errors'
import Config from '../../../../config'
import { SolicitationResponseData, Subject, subjectToIdMapping, CreateSolicitationApiBody } from './types'
import OpportunityHubAbstract from '../opportunityHubAbstract'
import { Operators } from '@tee/data'
import { Opportunity, ThemeId } from '@tee/common'
import { OpportunityAssociatedData } from '../../../../opportunity/domain/opportunityAssociatedData'

export class PlaceDesEntreprises extends OpportunityHubAbstract {
  protected readonly _baseUrl = Config.PDE_API_BASEURL
  protected _axios: AxiosInstance
  protected readonly _operatorNames = [] // warning, invalid but never used since we override all possible external uses of this value right below
  private readonly _pdeLanding = 114

  constructor() {
    super()
    const token = Config.PDE_API_TOKEN
    this._axios = axios.create({
      baseURL: this._baseUrl,
      headers: this._makeHeaders(token)
    })
  }

  override get operatorNames(): Operators[] | Error {
    return new Error('Operator List non valid for Place des entreprises')
  }

  override support = (_opportunityData: OpportunityAssociatedData) => {
    return true
  }

  public needReturnReceipt() {
    return false
  }

  public hasTransmissionLimit(): boolean {
    return true
  }

  public transmitOpportunity = async (
    opportunity: Opportunity,
    opportunityData: OpportunityAssociatedData
  ): Promise<Result<number, Error>> => {
    let maybePayload
    const themeId = opportunityData.getThemeId()
    if (opportunityData.isProgram()) {
      maybePayload = this._createProgramRequestBody(opportunity, themeId)
    } else if (opportunityData.isProject()) {
      maybePayload = this._createProjectRequestBody(opportunity, opportunityData.data.title, themeId)
    } else if (opportunityData.isCustomProject()) {
      maybePayload = this._createProjectRequestBody(opportunity, opportunityData.data.title)
    } else {
      return Result.err(Error('Can not transmit to PDE an opportunity of type' + opportunity.type))
    }
    if (maybePayload.isErr) {
      return Result.err(maybePayload.error)
    }
    return await this._sendOpportunity(maybePayload.value)
  }

  private _sendOpportunity = async (payload: CreateSolicitationApiBody): Promise<Result<number, Error>> => {
    try {
      const response = await this._axios.request<SolicitationResponseData>({
        method: 'POST',
        url: `/solicitations`,
        data: payload,
        // The transmission runs after the API response, a longer timeout does not delay the user
        timeout: 10000
      })
      const status = response.status
      if (status != 200) {
        return Result.err(new Error('PDE API error ' + status + ': ' + this._stringifyResponseData(response.data)))
      }
      const solicitationId = response.data?.data?.solicitation_id
      if (typeof solicitationId === 'number') {
        return Result.ok(solicitationId)
      }

      return Result.err(new Error('PDE API invalid response, missing solicitation_id: ' + this._stringifyResponseData(response.data)))
    } catch (exception: unknown) {
      return Result.err(this._describeException(exception))
    }
  }

  // Errors are reported by the caller, which adds the opportunity: keep the API status and response here
  private _describeException(exception: unknown): Error {
    const error = ensureError(exception)
    if (!(error instanceof AxiosError)) {
      return error
    }
    if (!error.response) {
      return new Error('PDE API unreachable (' + (error.code ?? 'unknown') + '): ' + error.message)
    }

    return new Error('PDE API error ' + error.response.status + ': ' + this._stringifyResponseData(error.response.data))
  }

  private _stringifyResponseData(data: unknown): string {
    try {
      return (JSON.stringify(data) ?? '').slice(0, 500)
    } catch {
      return '[unserializable response]'
    }
  }

  private _makeHeaders(token: string): RawAxiosRequestHeaders {
    return {
      ...AxiosHeaders.makeJsonHeader(),
      ...AxiosHeaders.makeBearerHeader(token)
    }
  }

  private _createProgramRequestBody(opportunity: Opportunity, themeId: ThemeId | undefined): Result<CreateSolicitationApiBody, Error> {
    return Result.ok({
      solicitation: {
        landing_id: this._pdeLanding,
        landing_subject_id: this._getLandingSubjectIdByTheme(themeId),
        description: opportunity.message,
        full_name: opportunity.firstName + ' ' + opportunity.lastName,
        email: opportunity.email,
        phone_number: opportunity.phoneNumber,
        siret: opportunity.companySiret,
        origin_url: opportunity.linkToCatalog
      }
    })
  }

  private _createProjectRequestBody(opportunity: Opportunity, title: string, themeId?: ThemeId): Result<CreateSolicitationApiBody, Error> {
    return Result.ok({
      solicitation: {
        landing_id: this._pdeLanding,
        landing_subject_id: this._getLandingSubjectIdByTheme(themeId),
        description: 'Demande via le projet ' + title + '\n\n' + opportunity.message,
        full_name: opportunity.firstName + ' ' + opportunity.lastName,
        email: opportunity.email,
        phone_number: opportunity.phoneNumber,
        siret: opportunity.companySiret,
        origin_url: opportunity.linkToCatalog
      }
    })
  }

  private _getLandingSubjectIdByTheme(themeId?: ThemeId): number {
    return themeId ? subjectToIdMapping[this._themeToPdeSubjectMapping[themeId]] : subjectToIdMapping[Subject.DemarcheEcologie]
  }

  private _themeToPdeSubjectMapping: { [key in ThemeId]: Subject } = {
    [ThemeId.Energy]: Subject.Energie,
    [ThemeId.Water]: Subject.Eau,
    [ThemeId.Waste]: Subject.Dechets,
    [ThemeId.Mobility]: Subject.TransportMobilite,
    [ThemeId.RH]: Subject.BilanRSE,
    [ThemeId.Environmental]: Subject.DemarcheEcologie,
    [ThemeId.Building]: Subject.DemarcheEcologie,
    [ThemeId.Biodiversity]: Subject.DemarcheEcologie,
    [ThemeId.EcoDesign]: Subject.DemarcheEcologie
  }
}
