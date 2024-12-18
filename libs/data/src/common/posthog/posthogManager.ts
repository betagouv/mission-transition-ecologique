import * as fs from 'fs'
import axios from 'axios'
import { EventId, PosthogEvent } from './types'
import { DealStage } from '../brevo/types'

export default class PosthogManager {
  private projectId: string
  private apiKey: string

  constructor() {
    this.projectId = process.env['POSTHOG_PROJECT_ID'] || ''
    this.apiKey = process.env['POSTHOG_API_KEY'] || ''

    if (!this.projectId || !this.apiKey) {
      throw new Error('Missing PostHog configuration. Ensure POSTHOG_PROJECT_ID and POSTHOG_API_KEY are set in the environment.')
    }
  }

  public async getFormEvents(): Promise<any> {
    const eventTypes = [
      'send_program_form',
      'send_project_form',
      'send_program_form_catalog',
      'send_project_form_catalog',
      'send_customProject_form'
    ]
    return this.getEvents(eventTypes)
  }

  public async getStatusEvent(): Promise<Record<DealStage, EventId[]>> {
    const dealStageKeys = Object.keys(DealStage) as (keyof typeof DealStage)[]
    const result: Record<DealStage, EventId[]> = {} as Record<DealStage, EventId[]>

    for (const key of dealStageKeys) {
      const dealStageValue = DealStage[key]
      const eventType = `brevo_status_set_to${key}`
      result[dealStageValue] = await this.getTempEvents([eventType])
    }

    return result
  }

  private _convertRawEventsToPosthogEvents(event: string[]): PosthogEvent {
    return {
      eventId: event[0],
      eventName: event[1],
      eventDate: event[3],
      personId: event[4],
      sessionId: event[7]
    }
  }

  public async getEvents(eventTypes: string[]): Promise<PosthogEvent[]> {
    const filePath = 'posthog_data_event.log'
    if (fs.existsSync(filePath)) {
      try {
        console.log('Reading posthog data from local file...')
        const data = fs.readFileSync(filePath, 'utf-8')
        const parsedData = JSON.parse(data)

        return parsedData.result.map((event: string[]) => this._convertRawEventsToPosthogEvents(event))
      } catch (error) {
        console.error('Error reading deals from file:', error)
        throw error // Handle or re-throw error if necessary
      }
    }

    const apiUrl = `https://eu.posthog.com/api/projects/${this.projectId}/query/`

    const hogqlQuery = `
      SELECT *
      FROM events
      WHERE event IN (${eventTypes.map((event) => `'${event}'`).join(', ')})
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
      fs.writeFileSync(filePath, JSON.stringify(data, null, 4))
      return data.result.map((event: string[]) => this._convertRawEventsToPosthogEvents(event))
    } catch (error) {
      console.error('Error fetching events from PostHog:', error)
    }

    return []
  }

  public async createNewEvents(): Promise<void> {
    // TODO
  }

  // dev code
  public async getTempEvents(eventTypes: string[]): Promise<PosthogEvent[]> {
    const filePath = 'posthog_status_event.log'
    if (fs.existsSync(filePath)) {
      try {
        console.log('Reading posthog data from local file...')
        const data = fs.readFileSync(filePath, 'utf-8')
        const parsedData = JSON.parse(data)

        return parsedData.result.map((event: string[]) => this._convertRawEventsToPosthogEvents(event))
      } catch (error) {
        console.error('Error reading deals from file:', error)
        throw error // Handle or re-throw error if necessary
      }
    }

    const apiUrl = `https://eu.posthog.com/api/projects/${this.projectId}/query/`

    const hogqlQuery = `
      SELECT *
      FROM events
      WHERE event IN (${eventTypes.map((event) => `'${event}'`).join(', ')})
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
      fs.writeFileSync(filePath, JSON.stringify(data, null, 4))
      return data.result.map((event: string[]) => this._convertRawEventsToPosthogEvents(event))
    } catch (error) {
      console.error('Error fetching events from PostHog:', error)
    }

    return []
  }
}
