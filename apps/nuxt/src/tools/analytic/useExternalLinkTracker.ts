import { onMounted, onUnmounted } from 'vue'
// import Analytics from './analytics'

export function useExternalLinkTracker(eventName: string) {
  const trackExternalLinks = (event: Event) => {
    const trackedContainer = document.getElementById('externalLinksTracking')
    if (!trackedContainer) return

    const target = event.target as HTMLElement
    const link = target.closest('a') as HTMLAnchorElement | null

    if (link && trackedContainer.contains(link) && link.href.startsWith('http') && !link.href.includes(window.location.hostname)) {
      console.log(eventName)
      // Analytics.sendEvent(eventName, eventName, {
      //   url: link.href,
      //   referrer: window.location.href
      // })
    }
  }

  onMounted(() => {
    document.addEventListener('click', trackExternalLinks)
  })

  onUnmounted(() => {
    document.removeEventListener('click', trackExternalLinks)
  })
}
