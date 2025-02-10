import RequestApi from '@/tools/api/requestApi'

export default class StatsApi extends RequestApi {
  protected readonly url = '/api/statistics/generate_stats_iframe_url'

  async getIframeUrl() {
    return this.getJson<{ iframeUrl: string }>()
  }
}
