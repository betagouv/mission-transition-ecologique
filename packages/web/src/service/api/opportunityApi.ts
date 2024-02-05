import type { OpportunityBody } from '@tee/backend/build/src/opportunity/controller/opportunityController'
import { useTracksStore } from '@/stores/tracks'
import { Entreprise, type ReqResp, TrackId, type WithoutNullableKeys } from '@/types'
import type { QuestionnaireRoute } from '@tee/backend/build/src/opportunity/infrastructure/api/brevo/types'
import type { opportunityFormType } from '@/types/opportunityFormType'

export default class OpportunityApi {
  private readonly url = '/api/opportunities'
  private readonly headers = {
    accept: 'application/json',
    'content-type': 'application/json'
  }
  private useTracks = useTracksStore()

  private _opportunityForm: WithoutNullableKeys<opportunityFormType>

  constructor(
    opportunityForm: opportunityFormType,
    private _programId: string
  ) {
    this._opportunityForm = opportunityForm as WithoutNullableKeys<opportunityFormType>
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

  payload(): OpportunityBody {
    return {
      opportunity: {
        firstName: this._opportunityForm.name.value,
        lastName: this._opportunityForm.surname.value,
        email: this._opportunityForm.email.value,
        phoneNumber: this._opportunityForm.tel.value,
        companySiret: this._opportunityForm.siret.value,
        companyName: this.getFromUsedTrack(TrackId.Siret, 'denomination'),
        companySector: this.getFromUsedTrack(TrackId.Siret, 'secteur') ?? this.getFromUsedTrack(TrackId.Sectors, 'secteur'), // get from usedTrack
        companySize: (this.getFromUsedTrack(TrackId.StructureWorkforce, Entreprise.Workforce) as unknown as number) ?? undefined, // get from usedTrack
        programId: this._programId,
        message: this._opportunityForm.needs.value,
        questionnaireRoute: this.getFromUsedTrack(TrackId.Help, 'user_help') as QuestionnaireRoute, // get from usedTrack
        otherData: this.getAllValuesFromUsedTrack()
      },
      optIn: this._opportunityForm.cgu.value
    }
  }

  private getFromUsedTrack(trackId: TrackId, key: string) {
    return this.useTracks.findSelectedValueByTrackIdAndKey(trackId, key)
  }

  private getAllValuesFromUsedTrack() {
    return JSON.stringify(this.useTracks.getAllUsedTracksValues)
  }
}
