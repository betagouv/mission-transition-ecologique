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
  Opportunity,
  RouteName,
  ProgramData,
  Project
} from '@/types'
import RequestApi from '@/service/api/requestApi'
import TrackStructure from '@/utils/track/trackStructure'
import { ThemeId } from '@tee/data'
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
    private _id: ProgramData['id'] | Project['id'] | undefined,
    private _slug: ProgramData['id'] | Project['slug'] | undefined,
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
    const opportunity: Opportunity = {
      type: this._opportunityType,
      id: this._getId(),
      titleMessage: this.getTitleMessage(),
      firstName: this._opportunityForm.name.value,
      lastName: this._opportunityForm.surname.value,
      email: this._opportunityForm.email.value,
      phoneNumber: this._opportunityForm.tel.value,
      theme: this._opportunityForm.theme.value as ThemeId,
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
    }
    return {
      opportunity,
      optIn: this._opportunityForm.cgu.value
    }
  }

  private _getId(): string {
    if (this._opportunityType === OpportunityType.CustomProject) {
      return this._opportunityForm.projectTitle.value as string
    }
    return this._id?.toString() as string
  }

  private _generateLinkToPage(): string {
    const { fullPath } = router.currentRoute.value
    return new URL(fullPath, window.location.origin).href
  }

  private _generateCatalogLink(): string | undefined {
    if (this._opportunityType == OpportunityType.Program) {
      return (
        useNavigationStore().getAbsoluteUrlByRouteName(RouteName.CatalogProgramDetail, {
          programId: this._slug as ProgramData['id']
        }) ?? ''
      )
    }
    if (this._opportunityType == OpportunityType.Project) {
      return (
        useNavigationStore().getAbsoluteUrlByRouteName(RouteName.CatalogProjectDetail, {
          projectSlug: this._slug as Project['slug']
        }) ?? ''
      )
    }
    if (this._opportunityType == OpportunityType.CustomProject) {
      return 'https://mission-transition-ecologique.beta.gouv.fr/custom'
    }
    return undefined
  }

  private getTitleMessage(): string {
    if (this._opportunityType === OpportunityType.Project || this._opportunityType === OpportunityType.CustomProject) {
      return this._opportunityForm.projectTitle.value as string
    }
    return this._slug as string
  }

  private getFromUsedTrack(trackId: TrackId, key: string) {
    return this._usedTrackStore.findInQuestionnaireDataByTrackIdAndKey(trackId, key)
  }

  private getAllValuesFromUsedTrack() {
    return JSON.stringify(this._usedTrackStore.completedQuestionnaireData)
  }
}
