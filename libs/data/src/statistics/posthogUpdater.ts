import BrevoManager from '../common/brevo/brevoManager'
import PosthogManager from '../common/posthog/posthogManager'

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
      this.lastUpdateTime = new Date()
      return await this._performUpdate()
    } else {
      const minutesRemaining = Math.ceil(60 - timeDifference)
      return `The data has been refreshed recently. Please wait ${minutesRemaining} minute(s) before updating again.`
    }
  }

  private async _performUpdate(): Promise<string> {
    // load all posthog events
    const posthogEvents = await new PosthogManager().getEvents()
    // load all brevo deals.
    const dealList = await new BrevoManager().getDeals()

    // // for each posthog event
    const enrichPosthogEventsData = this._enrichPosthogEvents(posthogEvents, dealList)
    // // transmit the all the updated events to posthog
    // await new PosthogManager().updateEvents(enrichPosthogEventsData)
    console.log(enrichPosthogEventsData)
    return 'sucessfullUpdate'
  }

  private _enrichPosthogEvents(posthogEvents: any, dealList: any) {
    for
    console.log(posthogEvents, dealList)
    return 'TBD'
  }
}

export default PosthogUpdater
