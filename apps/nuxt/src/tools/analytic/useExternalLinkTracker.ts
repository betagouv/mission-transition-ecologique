import { onMounted, onUnmounted } from 'vue'
import Analytics from './analytics'
import { CompanyData } from '../companyData'

export function useExternalLinkTracker(type: 'program' | 'project') {
  const eventName = 'external_link_clicked_v2'

  const trackExternalLinks = (event: Event) => {
    if (import.meta.client) {
      const trackedContainer = document.getElementById('externalLinksTracking')
      if (!trackedContainer) return

      const target = event.target as HTMLElement
      const link = target.closest('a') as HTMLAnchorElement | null

      if (link && trackedContainer.contains(link)) {
        if ((link.href.startsWith('http') && !link.href.includes(window.location.hostname)) || link.href.startsWith('mailto')) {
          Analytics.sendEvent(eventName, {
            type: type,
            link: link.href,
            url: window.location.href,
            company: CompanyData.toString()
          })
        }
      }
    }
  }

  onMounted(() => {
    document.addEventListener('click', trackExternalLinks)
  })

  onUnmounted(() => {
    document.removeEventListener('click', trackExternalLinks)
  })
}
