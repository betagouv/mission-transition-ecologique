import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'
import {
  QuestionnaireDataEnum,
  QuestionnaireRoute,
  TrackId,
  OpportunityBody,
  ReqResp,
  WithoutNullableKeys,
  FormDataType,
  OpportunityType,
  RouteName,
  ProgramData,
  Project
} from '@/types'
import RequestApi from '@/service/api/requestApi'
import TrackStructure from '@/utils/track/trackStructure'
import { router } from '../../router'

export default class OpportunityApi extends RequestApi {
  protected readonly url = '/api/opportunities'
  private readonly _headers = {
    accept: 'application/json',
    'content-type': 'application/json'
  }
  private _usedTrackStore = useUsedTrackStore()
  private _opportunityForm: WithoutNullableKeys<FormDataType>

  constructor(
    opportunityForm: FormDataType,
    private _id: ProgramData['id'] | Project['id'],
    private _slug: ProgramData['id'] | Project['slug'],
    private _opportunityType: OpportunityType
  ) {
    super()
    this._opportunityForm = opportunityForm as WithoutNullableKeys<FormDataType>
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
        id: this._id.toString(),
        firstName: this._opportunityForm.name.value,
        lastName: this._opportunityForm.surname.value,
        email: this._opportunityForm.email.value,
        phoneNumber: this._opportunityForm.tel.value,
        companySiret: this._opportunityForm.siret.value,
        companyName: this.getFromUsedTrack(TrackId.Siret, 'denomination'),
        companySector: TrackStructure.getSector(),
        companySize: TrackStructure.getSize() ?? undefined,
        message: this._opportunityForm.needs.value,
        questionnaireRoute: this.getFromUsedTrack(
          TrackId.QuestionnaireRoute,
          QuestionnaireDataEnum.questionnaire_route as string
        ) as QuestionnaireRoute, // get from usedTrack
        otherData: this.getAllValuesFromUsedTrack(),
        linkToPage: this._generateLinkToPage(),
        linkToCatalog: this._generateCatalogLink()
      },
      optIn: this._opportunityForm.cgu.value
    }
  }

  private _generateLinkToPage(): string {
    const { fullPath } = router.currentRoute.value
    return new URL(fullPath, window.location.origin).href
  }

  private _generateCatalogLink(): string {
    if (this._opportunityType == OpportunityType.Program) {
      return (
        useNavigationStore().getAbsoluteUrlByRouteName(RouteName.CatalogProgramDetail, {
          programId: this._slug
        }) ?? ''
      )
    }
    if (this._opportunityType == OpportunityType.Project) {
      return (
        useNavigationStore().getAbsoluteUrlByRouteName(RouteName.CatalogProjectDetail, {
          projectSlug: this._slug
        }) ?? ''
      )
    }
    console.error('catalog Link Generation Not Handled For The Current Opportunity Type')
    return 'catalogLinkGenerationNotHandledForTheCurrentOpportunityType'
  }

  private getFromUsedTrack(trackId: TrackId, key: string) {
    return this._usedTrackStore.findInQuestionnaireDataByTrackIdAndKey(trackId, key)
  }

  private getAllValuesFromUsedTrack() {
    return JSON.stringify(this._usedTrackStore.completedQuestionnaireData)
  }
}
