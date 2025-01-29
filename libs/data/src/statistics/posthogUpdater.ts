import BrevoManager from '../common/brevo/brevoManager'
import { BrevoDeal, DealStage } from '../common/brevo/types'
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
    if (timeDifference >= 60) {
      this.lastUpdateTime = new Date()
      return await this._performUpdate()
    } else {
      const minutesRemaining = Math.ceil(60 - timeDifference)
      return `The data has been refreshed recently. Please wait ${minutesRemaining} minute(s) before updating again.`
    }
  }

  private async _performUpdate(): Promise<string> {
    const posthogManager = new PosthogManager()
    const posthogFormEvents = await posthogManager.getFormEvents()
    const deals = await new BrevoManager().getDeals()
    const posthogStatusEvents = await posthogManager.getStatusEvent()

    for (const formEvent of posthogFormEvents) {
      const eventId = formEvent.eventId
      if (!eventId) {
        continue
      }
      const matchingDeal = this._findDealMatch(formEvent, deals)

      if (!matchingDeal) {
        continue
      }
      const currentDealStatus = matchingDeal.status

      const linkedStatusEvents = posthogStatusEvents.filter((statusEvent) => statusEvent.linkedEventId === eventId)
      this._createStatusUpdateEvents(posthogManager, currentDealStatus, linkedStatusEvents, eventId, formEvent.distinctId || 'null')
    }
    await posthogManager.createEvents()
    return 'sucessfull Update'
  }

  private _findDealMatch(formEvent: PosthogEvent, deals: BrevoDeal[]): BrevoDeal | undefined {
    if (!formEvent.eventId) {
      return undefined
    }

    if (formEvent.opportunityId) {
      const matchingDeals = deals.filter((deal) => deal.dealId === formEvent.opportunityId)
      if (matchingDeals.length == 1) {
        return matchingDeals[0]
      }
    }

    if (!formEvent.eventDate) {
      return undefined
    }
    const eventDateTime = new Date(formEvent.eventDate).getTime()
    const matchingDeals = deals.filter((deal) => {
      const creationDate = new Date(deal.creationDate).getTime()
      const timeDifference = Math.abs(eventDateTime - creationDate)
      return timeDifference <= 60000 // 1 minute in milliseconds
    })

    if (matchingDeals.length == 1) {
      return matchingDeals[0]
    }
    return undefined
  }

  private _createStatusUpdateEvents(
    posthogManager: PosthogManager,
    initialStatus: DealStage,
    linkedStatusEvents: PosthogEvent[],
    eventId: string,
    personId: string
  ): void {
    const dealDependencyMap: Record<DealStage, DealStage | null> = {
      [DealStage.Gagnee]: DealStage.AideProposee,
      [DealStage.AideProposee]: DealStage.Transmise,
      [DealStage.Perdue]: DealStage.Transmise,
      [DealStage.Transmise]: DealStage.Nouvelle,
      [DealStage.Nouvelle]: null
    }

    let currentStatus: keyof typeof DealStage | null = initialStatus

    while (currentStatus) {
      const eventName = `brevo_status_set_to_${currentStatus}`
      const existingEvent = linkedStatusEvents.find((e) => e.eventName === eventName)

      if (!existingEvent) {
        posthogManager.addToEventsToCreate(eventName, eventId, personId)
      }
      currentStatus = dealDependencyMap[currentStatus]
    }
  }
}
