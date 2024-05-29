import { Maybe, Result } from 'true-myth'
import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { handleException } from '../../../../common/domain/error/errors'
import Config from '../../../../config'
import { GetLandingResponseData, Landing, Subject, subjectToIdMapping, CreateSolicitationApiBody } from './types'
import { Opportunity } from '../../../../opportunity/domain/types'
import { Operators, Program } from '../../../../program/domain/types/types'
import OpportunityHubAbstract from '../opportunityHubAbstract'
import { Objective } from '../../../../common/types'
import ProgramService from '../../../../program/application/programService'
import OpportunityService from '../../../../opportunity/application/opportunityService'

export class PlaceDesEntreprises extends OpportunityHubAbstract {
  protected readonly _baseUrl = 'https://reso-staging.osc-fr1.scalingo.io/api/v1'
  protected _axios: AxiosInstance
  constructor() {
    super()
    const token = Config.PDE_API_TOKEN
    this._axios = axios.create({
      baseURL: this._baseUrl,
      headers: this._makeHeaders(token)
    })
  }
  protected readonly _operatorNames = [] // warning, invalid but never used since we override all possible external uses of this value right below
  override get operatorNames(): Operators[] | Error {
    return new Error('Operator List non valid for Place des entreprises')
  }
  override support = (program: Program) => {
    const validOperator = (program['opérateur de contact'] as Operators) !== 'Bpifrance'
    const notAutonomous = !program['activable en autonomie']
    return validOperator && notAutonomous
  }
  override shouldReceive = async (opportunity: Opportunity, program: Program) => {
    // il faut check support et l'historique de création du contactId sous 24h.
    return this.support(program) && (await !this._reachedDailyContactTransmissionLimit(opportunity))
  }

  public transmitOpportunity = async (opportunity: Opportunity, program: Program): Promise<Maybe<Error>> => {
    const maybePayload = await this._createRequestBody(opportunity, program)
    if (maybePayload.isErr) {
      return Maybe.of(maybePayload.error)
    }
    try {
      const rawResponse = await this._axios.request<GetLandingResponseData>({
        method: 'POST',
        url: `/solicitations`,
        data: maybePayload.value,
        timeout: 3000
      })
      const status = rawResponse.status
      if (status != 200) {
        return Maybe.of(Error('PDE Api Error ' + status))
      } else {
        return Maybe.nothing()
      }
    } catch (exception: unknown) {
      return Maybe.of(handleException(exception))
    }
  }

  private async _reachedDailyContactTransmissionLimit(opportunity: Opportunity): Promise<boolean> {
    const contact = opportunity.contactId as number
    const previousDailyOpportunities : Program[] = new OpportunityService.getdailyOpportunitiesByContactId(contact)
    let toTransmit = true
    for (const prevOpportunity of previousDailyOpportunities) {
      const prevProgram = getProgramFromOpportunity(prevOpportunity)
      if (this.support(prevProgram)) {
        toTransmit = false
        break
      }
    }
    return Promise.resolve(toTransmit)
  }

  private _getLandingId = async (): Promise<Result<number, Error>> => {
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

  private async _createRequestBody(opportunity: Opportunity, program: Program): Promise<Result<CreateSolicitationApiBody, Error>> {
    const landing_id = await this._getLandingId()
    if (landing_id.isErr) {
      return Result.err(landing_id.error)
    }
    return Result.ok({
      solicitation: {
        landing_id: landing_id.value,
        landing_subject_id: this.subjectMapping(new ProgramService().getObjectives(program.id)),
        description: opportunity.message,
        full_name: opportunity.firstName + ' ' + opportunity.lastName,
        email: opportunity.email,
        phone_number: opportunity.phoneNumber,
        siret: opportunity.companySiret,
        location: '',
        origin_url: opportunity.linkToProgramPage,
        questions_additionnelles: []
      }
    })
  }
}
