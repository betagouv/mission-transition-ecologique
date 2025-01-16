import axios from 'axios'
import { posthog, PostHog } from 'posthog-js'
import { PosthogEvent } from './types'
import { DealStage } from '../brevo/types'

export default class PosthogManager {
  private projectId: string
  private apiKey: string
  private _posthogCaptureHandler?: PostHog

  constructor() {
    this.projectId = process.env['POSTHOG_PROJECT_ID'] || ''
    this.apiKey = process.env['POSTHOG_BACKEND_API_KEY'] || ''

    if (!this.projectId || !this.apiKey) {
      throw new Error('Missing PostHog configuration. Ensure POSTHOG_PROJECT_ID and POSTHOG_BACKEND_API_KEY are set in the environment.')
    }

    try {
      this._posthogCaptureHandler = posthog.init(this.apiKey, {
        api_host: 'https://eu.i.posthog.com'
      })
    } catch (error) {
      console.log(error)
    }
  }

  public async getFormEvents(): Promise<PosthogEvent[]> {
    const eventTypes = [
      'send_program_form',
      'send_project_form',
      'send_program_form_catalog',
      'send_project_form_catalog',
      'send_customProject_form'
    ]
    return this.getEvents(eventTypes)
  }

  public async getStatusEvent(): Promise<PosthogEvent[]> {
    const dealStageKeys = Object.keys(DealStage) as (keyof typeof DealStage)[]
    const eventTypes = dealStageKeys.map((key) => `brevo_status_set_to_${key}`)
    return this.getEvents(eventTypes)
  }

  private _convertRawEventsToPosthogEvents(event: string[]): PosthogEvent {
    let linkedEventId = ''
    let opportunityId = ''

    try {
      const parsedObject = JSON.parse(event[2])
      linkedEventId = parsedObject.linkedEventId || ''
      opportunityId = parsedObject.opportunityId || ''
    } catch (error) {
      /* linter fill */
    }

    return {
      eventId: event[0],
      eventName: event[1],
      eventDate: event[3],
      personId: event[4],
      sessionId: event[7],
      linkedEventId: linkedEventId,
      opportunityId: opportunityId
    }
  }

  public async getEvents(eventTypes: string[]): Promise<PosthogEvent[]> {
    const apiUrl = `https://eu.posthog.com/api/projects/${this.projectId}/query/`

    const hogqlQuery = `
      SELECT *
      FROM events
      WHERE event IN (${eventTypes.map((event) => `'${event}'`).join(', ')})
      LIMIT 10000
    `
    const payload = {
      query: {
        kind: 'HogQLQuery',
        query: hogqlQuery
      }
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`
    }

    try {
      const response = await axios.post(apiUrl, payload, { headers })
      const data = response.data
      return data.results.map((event: string[]) => this._convertRawEventsToPosthogEvents(event))
    } catch (error) {
      console.error('Error fetching events from PostHog:', error)
    }

    return []
  }

  public createLinkedEvent(eventName: string, linkedEventId: string): void {
    if (this._posthogCaptureHandler) {
      this._posthogCaptureHandler.capture(eventName, {
        linked_event_id: linkedEventId
      })
    }
  }
}
