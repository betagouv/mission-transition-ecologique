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
  function setAnalyticsServer(server: string, appId: string, deactivate: boolean = false, trackAllOutlinks: boolean = false) {
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

  function sendEvent(action: string, name: string | null = null, value: string | number | null = null) {
    // console.log()
    // console.log('analytics > sendEvent > action :', action)
    // console.log('analytics > sendEvent > name :', name)
    // console.log('analytics > sendEvent > value :', value)
    if (matomoIsSet.value) {
      // Track by domain
      trackEvent('from_domain', domain.value)
      // Track by action
      trackEvent(action, name, value)
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
