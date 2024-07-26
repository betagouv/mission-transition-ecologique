import { useUsedTrackStore } from '@/stores/usedTrack'
import {
  PublicodesKeys,
  QuestionnaireDataEnum,
  QuestionnaireRoute,
  TrackId,
  OpportunityBody,
  ReqResp,
  WithoutNullableKeys,
  OpportunityFormType,
  OpportunityType
} from '@/types'
import RequestApi from '@/service/api/requestApi'
import TrackStructure from '@/utils/track/trackStructure'
import Config from '@/config'
import { Path } from '@/router/routes'

export default class OpportunityApi extends RequestApi {
  protected readonly url = '/api/opportunities'
  private readonly _headers = {
    accept: 'application/json',
    'content-type': 'application/json'
  }
  private _usedTrackStore = useUsedTrackStore()
  private _opportunityForm: WithoutNullableKeys<OpportunityFormType>

  constructor(
    opportunityForm: OpportunityFormType,
    private _id: string,
    private _slug: string,
    private _opportunityType: OpportunityType
  ) {
    super()
    this._opportunityForm = opportunityForm as WithoutNullableKeys<OpportunityFormType>
  }

  async fetch() {
    let resp: ReqResp = {}
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify(this.payload())
      })

      resp = (await response.json()) as ReqResp
      resp.ok = response.ok
      resp.status = response.status
      resp.statusText = response.statusText
      resp.url = response.url
    } catch (error: unknown) {
      resp.ok = false
      resp.status = 500
      resp.statusText = 'Internal server error'
      resp.message = `${error}`
    }

    return resp
  }

  payload(): OpportunityBody {
    return {
      opportunity: {
        type: this._opportunityType,
        id: this._id,
        firstName: this._opportunityForm.name.value,
        lastName: this._opportunityForm.surname.value,
        email: this._opportunityForm.email.value,
        phoneNumber: this._opportunityForm.tel.value,
        companySiret: this._opportunityForm.siret.value,
        companyName: this.getFromUsedTrack(TrackId.Siret, 'denomination'),
        companySector: TrackStructure.getSector(),
        companySize: (this.getFromUsedTrack(TrackId.StructureWorkforce, PublicodesKeys.Workforce) as unknown as number) ?? undefined, // get from usedTrack
        message: this._opportunityForm.needs.value,
        questionnaireRoute: this.getFromUsedTrack(
          TrackId.QuestionnaireRoute,
          QuestionnaireDataEnum.questionnaire_route as string
        ) as QuestionnaireRoute, // get from usedTrack
        otherData: this.getAllValuesFromUsedTrack(),
        linkToPage: this._opportunityForm.linkToPage.value,
        linkToCatalog: this._generateCatalogLink()
      },
      optIn: this._opportunityForm.cgu.value
    }
  }

  private _generateCatalogLink(): string {
    if (this._opportunityType == OpportunityType.Program) {
      return Config.deployUrl + Path.ProgramCatalog + '/' + this._id
    }
    if (this._opportunityType == OpportunityType.Project) {
      return Config.deployUrl + Path.ProjectCatalog + '/' + this._slug
    }
    console.error('catalog Link Generation Not Handled For The Current Opportunity Type') // TODO change it for the error handling method of the front end
    return 'catalogLinkGenerationNotHandledForTheCurrentOpportunityType'
  }

  private getFromUsedTrack(trackId: TrackId, key: string) {
    return this._usedTrackStore.findInQuestionnaireDataByTrackIdAndKey(trackId, key)
  }

  private getAllValuesFromUsedTrack() {
    return JSON.stringify(this._usedTrackStore.completedQuestionnaireData)
  }
}
