import { onMounted, onUnmounted } from 'vue'
import Analytics from './analytics'

export function useExternalLinkTracker(eventName: string) {
  const trackExternalLinks = (event: Event) => {
    const target = event.target as HTMLElement
    const link = target.closest('a') as HTMLAnchorElement | null

    if (link && link.href.startsWith('http') && !link.href.includes(window.location.hostname)) {
      Analytics.sendEvent(eventName, eventName, {
        url: link.href,
        referrer: window.location.href
      })
    }
  }

  onMounted(() => {
    document.addEventListener('click', trackExternalLinks)
  })

  onUnmounted(() => {
    document.removeEventListener('click', trackExternalLinks)
  })
}
