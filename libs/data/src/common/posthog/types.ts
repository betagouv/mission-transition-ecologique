export type PosthogEvent = {
  eventId?: string //only unique Id
  eventName?: string
  eventDate?: string
  personId?: string
  distinctId?: string
  sessionId?: string
  linkedEventId?: string
  opportunityId?: string
}

export type EventCreation = {
  linkedEventId: string
  personId: string
  eventName: string
}
