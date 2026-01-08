import { useUsedTrackStore } from '@/stores/usedTrack'
import {
  TrackId,
  OpportunityBody,
  ReqResp,
  WithoutNullableKeys,
  FormDataType,
  OpportunityType,
  Opportunity as OpportunityFormType,
  RouteName,
  isProjectFormDataType,
  ProjectType,
  ProgramTypeForFront,
  ThemeId
} from '@/types'
import RequestApi from '@/tools/api/requestApi'
import Opportunity from '@/tools/opportunity'
import Navigation from '@/tools/navigation'
import TrackStructure from '@/tools/questionnaire/track/trackStructure'

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
    private _id: ProgramTypeForFront['id'] | ProjectType['id'] | undefined,
    private _slug: ProgramTypeForFront['id'] | ProjectType['slug'] | undefined,
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
    const opportunity: OpportunityFormType = {
      type: this._opportunityType,
      id: this._getId(),
      titleMessage: this._getTitleMessage(),
      firstName: this._opportunityForm.name.value,
      lastName: this._opportunityForm.surname.value,
      email: this._opportunityForm.email.value,
      phoneNumber: this._opportunityForm.tel.value,
      theme: this._opportunityForm.theme.value as ThemeId,
      companySiret: this._opportunityForm.siret.value,
      companyName: this._getFromUsedTrack(TrackId.Siret, 'denomination'),
      companySector: TrackStructure.getSector(),
      companySize: TrackStructure.getSize() ?? undefined,
      message: this._opportunityForm.needs.value,
      otherData: this._getAllValuesFromUsedTrack(),
      linkToPage: this._generateLinkToPage(),
      linkToCatalog: this._generateCatalogLink()
    }
    return {
      opportunity,
      optIn: this._opportunityForm.cgu.value
    }
  }

  private _getId(): string {
    if (Opportunity.isCustomProject(this._opportunityType) && isProjectFormDataType(this._opportunityForm)) {
      return this._opportunityForm.projectTitle.value as string
    }
    return this._id?.toString() as string
  }

  private _generateLinkToPage(): string {
    const router = useRouter()
    if (router) {
      const { fullPath } = router.currentRoute.value
      return new URL(fullPath, window.location.origin).href
    }

    return ''
  }

  private _generateCatalogLink(): string | undefined {
    if (this._opportunityType == OpportunityType.Program) {
      return (
        new Navigation().getAbsoluteUrlByRouteName(RouteName.CatalogProgramDetail, {
          programId: this._slug as ProgramTypeForFront['id']
        }) ?? ''
      )
    }
    if (this._opportunityType == OpportunityType.Project) {
      return (
        new Navigation().getAbsoluteUrlByRouteName(RouteName.CatalogProjectDetail, {
          projectSlug: this._slug as ProjectType['slug']
        }) ?? ''
      )
    }
    if (this._opportunityType == OpportunityType.CustomProject) {
      return 'https://mission-transition-ecologique.beta.gouv.fr/custom'
    }
    return undefined
  }

  private _getTitleMessage(): string {
    if (isProjectFormDataType(this._opportunityForm)) {
      return this._opportunityForm.projectTitle.value as string
    }
    return this._slug as string
  }

  private _getFromUsedTrack(trackId: TrackId, key: string) {
    return this._usedTrackStore.findInQuestionnaireDataByTrackIdAndKey(trackId, key)
  }

  private _getAllValuesFromUsedTrack() {
    return JSON.stringify(this._usedTrackStore.completedQuestionnaireData)
  }
}
