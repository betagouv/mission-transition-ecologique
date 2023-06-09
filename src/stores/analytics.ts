import { ref } from 'vue'
import { defineStore } from 'pinia'

import { trackEvent } from '@/utils/matomo'

export const analyticsStore = defineStore('analytics', () => {
  
  // language selection
  const scriptUniqueId = ref('gov-aid-tree-matomo-script')
  const allowAnalytics = ref(false)
  const matomoServer = ref()
  const matomoSiteId = ref()
  const domain = ref()
  const hasTrackAllOutlinks = ref(false)
  const matomoIsSet = ref(false)

  // actions
  function setAnalyticsServer(server: string, appId: string, trackAllOutlinks: boolean = false) {
    matomoServer.value = server
    matomoSiteId.value = appId
    hasTrackAllOutlinks.value = trackAllOutlinks
    allowAnalytics.value = !!(matomoServer.value && matomoSiteId.value)
  }

  function setAppDomain(appDomain: string) {
    domain.value = appDomain
  }
  function setMatomoIsSet(scriptIsSet: boolean = true) {
    matomoIsSet.value = allowAnalytics.value && scriptIsSet
  }

  function sendEvent (action: any, name: any = null, value: any = null) {
    console.log()
    console.log('analytics > sendEvent > action :', action)
    console.log('analytics > sendEvent > name :', name)
    console.log('analytics > sendEvent > value :', value)
    // if (matomoIsSet.value) {
    //   trackEvent(
    //     domain.value,
    //     action,
    //     name,
    //     value
    //   )
    // }
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
