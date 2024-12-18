export type EventId = {
  eventId?: string
}

export type PosthogEvent = EventId & {
  eventName?: string
  eventDate?: string
  personId?: string // distinctId
  sessionId?: string
}
