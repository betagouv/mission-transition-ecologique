import * as fs from 'fs'
import axios from 'axios'
import { EnrichedEvent } from './types'

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

  public async getStatusEvent(): Promise<any> {
    // return Record<brevoStatus,EventsId[]>
    const eventTypes = [
      'send_program_form',
      'send_project_form',
      'send_program_form_catalog',
      'send_project_form_catalog',
      'send_customProject_form'
    ]
    return this.getEvents(eventTypes)
  }

  public async getEvents(eventTypes: string[]): Promise<any> {
    const filePath = 'posthog_data_event.log'
    if (fs.existsSync(filePath)) {
      try {
        console.log('Reading posthog data from local file...')
        const data = fs.readFileSync(filePath, 'utf-8')
        const parsedData = JSON.parse(data)
        return parsedData.results
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
      return data
    } catch (error) {
      console.error('Error fetching events from PostHog:', error)
    }
  }

  public async updateEvents(enrichedEvents: EnrichedEvent[]): Promise<void> {
    const url = `https://eu.posthog.com/api/projects/${this.projectId}/batch/`
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`
    }

    const payload = {
      batch: enrichedEvents.map((event) => ({
        event: event.event,
        properties: event.properties
      }))
    }

    try {
      const response = await axios.post(url, payload, { headers })
      console.log(`Successfully updated ${enrichedEvents.length} events.`)
      console.log(response)
    } catch (error) {
      console.error('Error updating events in PostHog:', error)
      throw error
    }
  }
}
