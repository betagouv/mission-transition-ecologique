import { Result } from 'true-myth'
import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { ensureError, handleException } from '../../../../common/domain/error/errors'
import Config from '../../../../config'
import { SolicitationResponseData, Subject, subjectToIdMapping, CreateSolicitationApiBody } from './types'
import { OpportunityWithContactId } from '../../../../opportunity/domain/types'
import OpportunityHubAbstract from '../opportunityHubAbstract'
import { ProgramService } from '../../../../program/application/programService'
import OpportunityService from '../../../../opportunity/application/opportunityService'
import { Operators, ProgramType, ThemeId } from '@tee/data'
import { Objective, Opportunity, OpportunityType } from '@tee/common'
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

  override shouldTransmit = async (opportunity: OpportunityWithContactId, opportunityData: OpportunityAssociatedData) => {
    if (!this.support(opportunityData)) {
      return false
    }
    const reachTransmissionLimit = await this.reachedDailyContactTransmissionLimit(opportunity.contactId)
    return !reachTransmissionLimit
  }

  public transmitOpportunity = async (
    opportunity: Opportunity,
    opportunityData: OpportunityAssociatedData
  ): Promise<Result<number, Error>> => {
    let maybePayload
    if (opportunityData.isProgram()) {
      maybePayload = this._createProgramRequestBody(opportunity, opportunityData.data)
    } else if (opportunityData.isProject()) {
      maybePayload = this._createProjectRequestBody(opportunity, opportunityData.data.title, opportunityData.data.mainTheme)
    } else if (opportunityData.isCustomProject()) {
      maybePayload = this._createProjectRequestBody(opportunity, opportunityData.data.title)
    } else {
      return Result.err(Error("Canno't transmit to PDE an opportunity of type" + opportunity.type))
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

  async reachedDailyContactTransmissionLimit(contact: number): Promise<boolean> {
    const previousDailyOpportunities = await new OpportunityService().getDailyOpportunitiesByContactId(contact)
    if (previousDailyOpportunities.isErr) {
      return false
    }

    let transmissiblePrograms = 0
    for (const prevOpportunity of previousDailyOpportunities.value) {
      const prevProgram = new ProgramService().getById(prevOpportunity.id)
      if (prevProgram && this.support(new OpportunityAssociatedData(OpportunityType.Program, prevProgram))) {
        transmissiblePrograms += 1
      } else {
        // this loop account for both projects and CustomProjects
        transmissiblePrograms += 1
      }
    }

    // The current opportunity being already created in brevo when we check the hub transmission, we count the current program.
    // The question is do we have MORE than one transmissible opportunity which indicates older tranmissions.
    return transmissiblePrograms > 1
  }

  private _makeHeaders(token: string): RawAxiosRequestHeaders {
    return {
      ...AxiosHeaders.makeJsonHeader(),
      ...AxiosHeaders.makeBearerHeader(token)
    }
  }

  private _objectiveToPdeSubjectMapping: { [key in Objective]: Subject } = {
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
    [Objective.Biodiversity]: Subject.DemarcheEcologie,
    [Objective.UnknownYet]: Subject.DemarcheEcologie
  }

  subjectMapping(programObjectives: Objective[]): number {
    const defaultSubject = Subject.DemarcheEcologie
    if (programObjectives.length === 1) {
      const objective = programObjectives[0]
      const subjectKey = this._objectiveToPdeSubjectMapping[objective]
      return subjectToIdMapping[subjectKey]
    } else {
      return subjectToIdMapping[defaultSubject]
    }
  }

  private _createProgramRequestBody(opportunity: Opportunity, program: ProgramType): Result<CreateSolicitationApiBody, Error> {
    return Result.ok({
      solicitation: {
        landing_id: this._pdeLanding,
        landing_subject_id: this.subjectMapping(new ProgramService().getObjectives(program.id)),
        description: opportunity.message,
        full_name: opportunity.firstName + ' ' + opportunity.lastName,
        email: opportunity.email,
        phone_number: opportunity.phoneNumber,
        siret: opportunity.companySiret,
        origin_url: opportunity.linkToCatalog
      }
    })
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

  private _createProjectRequestBody(
    opportunity: Opportunity,
    title: string,
    mainTheme?: ThemeId
  ): Result<CreateSolicitationApiBody, Error> {
    const landingId = mainTheme
      ? subjectToIdMapping[this._themeToPdeSubjectMapping[mainTheme]]
      : subjectToIdMapping[Subject.DemarcheEcologie]
    return Result.ok({
      solicitation: {
        landing_id: this._pdeLanding,
        landing_subject_id: landingId,
        description: 'Demande via le projet ' + title + '\n\n' + opportunity.message,
        full_name: opportunity.firstName + ' ' + opportunity.lastName,
        email: opportunity.email,
        phone_number: opportunity.phoneNumber,
        siret: opportunity.companySiret,
        origin_url: opportunity.linkToCatalog
      }
    })
  }
}
