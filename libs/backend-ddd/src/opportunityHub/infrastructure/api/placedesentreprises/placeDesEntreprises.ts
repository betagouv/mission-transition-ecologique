import { Result } from 'true-myth'
import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { ensureError, handleException } from '../../../../common/domain/error/errors'
import Config from '../../../../config'
import { SolicitationResponseData, Subject, subjectToIdMapping, CreateSolicitationApiBody } from './types'
import OpportunityHubAbstract from '../opportunityHubAbstract'
import { Operators } from '@tee/data'
import { Opportunity, ThemeId } from '@tee/common'
import Monitor from '../../../../common/domain/monitoring/monitor'
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
        timeout: 3000
      })
      const status = response.status
      if (status != 200) {
        Monitor.error('Error creating an opportunity at CE during CE API Call', { CeReponse: response, payload: payload })

        return Result.err(new Error('PDE Api Error ' + status))
      }
      const solicitationId = response.data?.data?.solicitation_id
      if (typeof solicitationId === 'number') {
        return Result.ok(solicitationId)
      } else {
        Monitor.warning('Unable to retrieve the Id from CE while transmitting the opportunity using the API', {
          CeReponse: response,
          payload: payload
        })

        return Result.err(new Error('Invalid response format: missing solicitation_id'))
      }
    } catch (exception: unknown) {
      Monitor.exception(ensureError(exception))

      return Result.err(handleException(exception))
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
