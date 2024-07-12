import { Maybe, Result } from 'true-myth'
import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { handleException } from '../../../../common/domain/error/errors'
import Config from '../../../../config'
import { GetLandingResponseData, Subject, subjectToIdMapping, CreateSolicitationApiBody } from './types'
import { OpportunityWithContactId } from '../../../../opportunity/domain/types'
import OpportunityHubAbstract from '../opportunityHubAbstract'
import { ProgramService } from '../../../../program/application/programService'
import OpportunityService from '../../../../opportunity/application/opportunityService'
import { Objective } from '../../../../common/types'
import { Operators, ProgramType } from '@tee/data'
import { Opportunity } from '@tee/common'
import Monitor from '../../../../common/domain/monitoring/monitor'

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

  override support = (program: ProgramType) => {
    const validOperator = (program['opérateur de contact'] as Operators) !== 'Bpifrance'
    const notAutonomous = !program['activable en autonomie']
    return validOperator && notAutonomous
  }

  override shouldTransmit = async (opportunity: OpportunityWithContactId, program: ProgramType) => {
    if (!this.support(program)) {
      return false
    }
    const reachTransmissionLimit = await this._reachedDailyContactTransmissionLimit(opportunity)
    return !reachTransmissionLimit
  }

  public transmitOpportunity = async (opportunity: Opportunity, program: ProgramType): Promise<Maybe<Error>> => {
    const maybePayload = this._createRequestBody(opportunity, program)
    if (maybePayload.isErr) {
      return Maybe.of(maybePayload.error)
    }
    try {
      const response = await this._axios.request<GetLandingResponseData>({
        method: 'POST',
        url: `/solicitations`,
        data: maybePayload.value,
        timeout: 3000
      })
      const status = response.status
      if (status != 200) {
        new Monitor().error('Error creating an opportunity at CE during CE API Call ' + response)

        return Maybe.of(Error('PDE Api Error ' + status))
      } else {
        return Maybe.nothing()
      }
    } catch (exception: unknown) {
      new Monitor().error('Error creating an opportunity at CE ' + exception)

      return Maybe.of(handleException(exception))
    }
  }

  private async _reachedDailyContactTransmissionLimit(opportunity: OpportunityWithContactId): Promise<boolean> {
    const contact = opportunity.contactId
    const previousDailyOpportunities = await new OpportunityService().getDailyOpportunitiesByContactId(contact)
    if (previousDailyOpportunities.isErr) {
      return false
    }

    let tranmismissiblePrograms = 0
    for (const prevOpportunity of previousDailyOpportunities.value) {
      const prevProgram = new ProgramService().getById(prevOpportunity.programId)
      if (prevProgram && this.support(prevProgram)) {
        tranmismissiblePrograms += 1
      }
    }
    // The current opportunity being already created in brevo when we check the hub transmission, we count the current program.
    // The question is do we have MORE than one tranmissible program which indicates older tranmissions.
    return tranmismissiblePrograms > 1
  }

  private _makeHeaders(token: string): RawAxiosRequestHeaders {
    return {
      ...AxiosHeaders.makeJsonHeader(),
      ...AxiosHeaders.makeBearerHeader(token)
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
      const objective = programObjectives[0]
      const subjectKey = this._objectiveToSubjectIdMapping[objective]
      return subjectToIdMapping[subjectKey]
    } else {
      return subjectToIdMapping[defaultSubject]
    }
  }

  private _createRequestBody(opportunity: Opportunity, program: ProgramType): Result<CreateSolicitationApiBody, Error> {
    return Result.ok({
      solicitation: {
        landing_id: this._pdeLanding,
        landing_subject_id: this.subjectMapping(new ProgramService().getObjectives(program.id)),
        description: opportunity.message,
        full_name: opportunity.firstName + ' ' + opportunity.lastName,
        email: opportunity.email,
        phone_number: opportunity.phoneNumber,
        siret: opportunity.companySiret,
        location: '',
        api_calling_url: opportunity.linkToProgramPage,
        questions_additionnelles: []
      }
    })
  }
}
