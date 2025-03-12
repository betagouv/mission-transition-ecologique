import { onMounted, onUnmounted } from 'vue'
import Analytics from './analytics'
import { CompanyData } from '../companyData'

export function useExternalLinkTracker(eventName: string) {
  const trackExternalLinks = (event: Event) => {
    if (import.meta.client) {
      const trackedContainer = document.getElementById('externalLinksTracking')
      if (!trackedContainer) return

      const target = event.target as HTMLElement
      const link = target.closest('a') as HTMLAnchorElement | null

      if (link && trackedContainer.contains(link) && link.href.startsWith('http') && !link.href.includes(window.location.hostname)) {
        Analytics.sendEvent(eventName, eventName, {
          link: link.href,
          url: window.location.href,
          company: CompanyData.toString()
        })
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
