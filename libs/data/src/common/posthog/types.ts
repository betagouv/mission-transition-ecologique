export type PosthogEvent = {
  eventId?: string //only unique Id
  eventName?: string
  eventDate?: string
  personId?: string
  sessionId?: string
  linkedEventId?: string
  opportunityId?: string
}
