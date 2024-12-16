import BrevoManager from '../common/brevo/brevoManager'

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

    // load all brevo deals.
    const dealList = await new BrevoManager().getDeals()
    console.log(dealList.length)

    // for each posthog event
    // transmit the all the

    return 'sucessfullUpdate'
  }
}

export default PosthogUpdater
