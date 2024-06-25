import { useUsedTrackStore } from '@/stores/usedTrack'
import { PublicodesKeys, QuestionnaireDataEnum, QuestionnaireRoute, TrackId } from '@/types'
import type { ReqResp, WithoutNullableKeys, ProjectFormType } from '@/types'
import RequestApi from '@/service/api/requestApi'
import TrackStructure from '@/utils/track/trackStructure'
import { ProjectBody } from '@tee/common/src/project/types'

export default class ProjectApi extends RequestApi {
  private readonly url = '/api/projects'
  private readonly headers = {
    accept: 'application/json',
    'content-type': 'application/json'
  }

  private usedTrackStore = useUsedTrackStore()

  private _projectForm: WithoutNullableKeys<ProjectFormType>

  constructor(
    projectForm: ProjectFormType,
    private _projectId: number
  ) {
    super()
    this._projectForm = projectForm as WithoutNullableKeys<ProjectFormType>
  }

  async fetch() {
    let resp: ReqResp = {}
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: this.headers,
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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      resp.message = `${error}`
    }

    return resp
  }

  payload(): ProjectBody {
    return {
      project: {
        firstName: this._projectForm.name.value,
        lastName: this._projectForm.surname.value,
        email: this._projectForm.email.value,
        phoneNumber: this._projectForm.tel.value,
        companySiret: this._projectForm.siret.value,
        companyName: this.getFromUsedTrack(TrackId.Siret, 'denomination'),
        companySector: TrackStructure.getSector(),
        companySize: (this.getFromUsedTrack(TrackId.StructureWorkforce, PublicodesKeys.Workforce) as unknown as number) ?? undefined, // get from usedTrack
        projectId: this._projectId,
        message: this._projectForm.needs.value,
        questionnaireRoute: this.getFromUsedTrack(
          TrackId.QuestionnaireRoute,
          QuestionnaireDataEnum.questionnaire_route as string
        ) as QuestionnaireRoute, // get from usedTrack
        otherData: this.getAllValuesFromUsedTrack(),
        linkToProjectPage: this._projectForm.linkToProjectPage.value
      },
      optIn: this._projectForm.cgu.value
    }
  }

  private getFromUsedTrack(trackId: TrackId, key: string) {
    return this.usedTrackStore.findInQuestionnaireDataByTrackIdAndKey(trackId, key)
  }

  private getAllValuesFromUsedTrack() {
    return JSON.stringify(this.usedTrackStore.completedQuestionnaireData)
  }
}
