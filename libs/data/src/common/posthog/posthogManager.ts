import axios from 'axios'
import { PostHog } from 'posthog-node'
import { EventCreation, PosthogEvent } from './types'
import { DealStage } from '../brevo/types'

export default class PosthogManager {
  private _projectId: string
  private _readApiKey: string
  private _writeApiKey: string
  private _posthogClient?: PostHog
  private _eventsToCreate: EventCreation[]

  constructor() {
    this._projectId = process.env['POSTHOG_PROJECT_ID'] || ''
    this._readApiKey = process.env['POSTHOG_READ_API_KEY'] || ''
    this._writeApiKey = process.env['POSTHOG_WRITE_API_KEY'] || ''
    this._eventsToCreate = []

    if (!this._projectId || !this._writeApiKey || !this._readApiKey) {
      throw new Error(
        'Missing PostHog configuration. Ensure POSTHOG_PROJECT_ID, POSTHOG_READ_API_KEY and POSTHOG_WRITE_API_KEY are set in the environment.'
      )
    }

    try {
      this._posthogClient = new PostHog(this._writeApiKey, {
        host: 'https://eu.i.posthog.com'
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
    return await this.getEvents(eventTypes)
  }

  public async getStatusEvent(): Promise<PosthogEvent[]> {
    const dealStageKeys = Object.keys(DealStage) as (keyof typeof DealStage)[]
    const eventTypes = dealStageKeys.map((key) => `brevo_status_set_to_${key}`)

    return await this.getEvents(eventTypes)
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
      distinctId: event[4],
      sessionId: event[7],
      personId: event[9],
      linkedEventId: linkedEventId,
      opportunityId: opportunityId
    }
  }

  public async getEvents(eventTypes: string[]): Promise<PosthogEvent[]> {
    const apiUrl = `https://eu.posthog.com/api/projects/${this._projectId}/query/`

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
      Authorization: `Bearer ${this._readApiKey}`
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

  public addToEventsToCreate(eventName: string, linkedEventId: string, personId: string): void {
    this._eventsToCreate.push({
      linkedEventId,
      personId,
      eventName
    })
  }

  public async createEvents() {
    if (!this._posthogClient) {
      throw new Error('PostHog client is not initialized')
    }

    try {
      for (const event of this._eventsToCreate) {
        this._posthogClient.capture({
          distinctId: event.personId,
          event: event.eventName,
          properties: {
            linkedEventId: event.linkedEventId
          }
        })
      }
      this._eventsToCreate = []
    } catch (error) {
      console.error('Failed to send events:', error)
    } finally {
      await this._posthogClient.shutdown()
    }
  }
}
