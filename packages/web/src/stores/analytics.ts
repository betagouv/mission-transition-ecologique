// CONSOLE LOG TEMPLATE
// console.log(`store.analytics > FUNCTION_NAME > MSG_OR_VALUE :`)

import { ref } from 'vue'
import { defineStore } from 'pinia'

import { trackEvent } from '@/utils/matomo'

export const analyticsStore = defineStore('analytics', () => {
  // language selection
  const scriptUniqueId = ref('gov-aid-tree-matomo-script')
  const allowAnalytics = ref(false)
  const matomoServer = ref<string>()
  const matomoSiteId = ref<number>()
  const domain = ref<string>()
  const hasTrackAllOutlinks = ref(false)
  const matomoIsSet = ref(false)

  // actions
  function setAnalyticsServer(server: string, appId: number, deactivate: boolean = false, trackAllOutlinks: boolean = false) {
    matomoServer.value = server
    matomoSiteId.value = appId
    hasTrackAllOutlinks.value = trackAllOutlinks
    allowAnalytics.value = !!(!deactivate && matomoServer.value && matomoSiteId.value)
  }

  function setAppDomain(appDomain: string) {
    domain.value = appDomain
  }
  function setMatomoIsSet(scriptIsSet: boolean = true) {
    matomoIsSet.value = allowAnalytics.value && scriptIsSet
  }

  function sendEvent(action: string, name: string | null = null, value?: string | number | undefined) {
    if (matomoIsSet.value) {
      if (domain.value) {
        // Track by domain
        trackEvent('from_domain', domain.value)
      }
      if (name) {
        // Track by action
        trackEvent(action, name, value)
      }
    }
  }

  return {
    allowAnalytics,
    scriptUniqueId,
    matomoServer,
    matomoSiteId,
    domain,
    matomoIsSet,
    hasTrackAllOutlinks,
    setAnalyticsServer,
    setAppDomain,
    setMatomoIsSet,
    sendEvent
  }
})
