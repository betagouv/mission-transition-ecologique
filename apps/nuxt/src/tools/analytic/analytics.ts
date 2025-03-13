import Posthog from '@/tools/analytic/posthog'
import { CompanyData } from '@/tools/companyData'
import Matomo from './matomo'

export default class Analytics {
  static sendEvent(name: string | null = null, value?: object) {
    if (import.meta.client) {
      Posthog.captureEvent(name ? name : 'unnamed event', value)
      Matomo.sendEvent(name ? name : 'unnamed event', name, JSON.stringify(value))
    }
  }

  static sendDetailPageView(type: 'program' | 'project', title?: string) {
    if (import.meta.client) {
      this.sendEvent('detail_page_view', {
        type: type,
        title: title,
        url: window.location.href,
        company: CompanyData.toString()
      })
    }
  }
}
