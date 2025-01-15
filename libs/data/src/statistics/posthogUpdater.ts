import BrevoManager from '../common/brevo/brevoManager'
import { DealStage } from '../common/brevo/types'
import PosthogManager from '../common/posthog/posthogManager'
import { PosthogEvent } from '../common/posthog/types'

export class PosthogUpdater {
  private static instance: PosthogUpdater
  private lastUpdateTime: Date

  private constructor() {
    this.lastUpdateTime = new Date(Date.now() - 24 * 60 * 60 * 1000)
  }

  public static getInstance(): PosthogUpdater {
    if (!PosthogUpdater.instance) {
      PosthogUpdater.instance = new PosthogUpdater()
    }
    return PosthogUpdater.instance
  }

  public async updatePosthogData(): Promise<string> {
    const timeDifference = (new Date().getTime() - this.lastUpdateTime.getTime()) / (1000 * 60)
    if (timeDifference >= 2) {
      // TODO 2minutes should be 60minute when in prod.
      this.lastUpdateTime = new Date()
      return await this._performUpdate()
    } else {
      const minutesRemaining = Math.ceil(60 - timeDifference)
      return `The data has been refreshed recently. Please wait ${minutesRemaining} minute(s) before updating again.`
    }
  }

  private async _performUpdate(): Promise<string> {
    const posthogFormEvents = await new PosthogManager().getFormEvents()
    const deals = await new BrevoManager().getDeals()
    const posthogStatusEvents = await new PosthogManager().getStatusEvent()

    for (const formEvent of posthogFormEvents) {
      const { eventDate, eventId } = formEvent

      if (!eventDate || !eventId) {
        console.log(`Skipping event due to missing eventDate or eventId: ${JSON.stringify(formEvent)}`)
        continue
      }
      const eventDateTime = new Date(eventDate).getTime()
      const matchingDeals = deals.filter((deal) => {
        const creationDate = new Date(deal.creationDate).getTime()
        const timeDifference = Math.abs(eventDateTime - creationDate)
        return timeDifference <= 60000 // 1 minute in milliseconds
      })

      if (matchingDeals.length !== 1) {
        console.log(`Skipping event ${eventId}: Expected 1 matching deal, found ${matchingDeals.length}`)
        continue
      }
      const currentDealStatus = matchingDeals[0].status
      const linkedStatusEvents = posthogStatusEvents.filter((statusEvent) => statusEvent.linkedEventId === eventId)

      await this._handleStatusUpdate(currentDealStatus, linkedStatusEvents, eventId)
    }
    return 'sucessfullUpdate'
  }

  private async _handleStatusUpdate(initialStatus: DealStage, linkedStatusEvents: PosthogEvent[], eventId: string): Promise<void> {
    const statusMap: Record<DealStage, DealStage | null> = {
      [DealStage.Gagnee]: DealStage.AideProposee,
      [DealStage.AideProposee]: DealStage.Transmise,
      [DealStage.Perdue]: DealStage.Transmise,
      [DealStage.Transmise]: DealStage.Nouvelle,
      [DealStage.Nouvelle]: null
    }

    let currentStatus: DealStage | null = initialStatus
    while (currentStatus) {
      const eventName = `brevo_status_set_to_${currentStatus}`
      const existingEvent = linkedStatusEvents.find((e) => e.eventName === eventName)

      if (!existingEvent) {
        console.log(`Creating event: ${eventName} for eventId: ${eventId}`)
        // await new PosthogManager().createLinkedEvent(eventName, eventId)
      }

      currentStatus = statusMap[currentStatus]
    }
  }
}
