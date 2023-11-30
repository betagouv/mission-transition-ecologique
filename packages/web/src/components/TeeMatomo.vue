<template>
  <!-- DEBUGGING -->
  <div v-if="debug" class="vue-debug fr-mt-5v">
    <h5>DEBUG - TeeMatomo</h5>
    <div v-if="true" class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-2">
        <h6>
          analytics.matomoServer :<br />
          <code>{{ analytics.matomoServer }}</code>
        </h6>
      </div>
      <div class="fr-col-2">
        <h6>
          analytics.matomoSiteId :<br />
          <code>{{ analytics.matomoSiteId }}</code>
        </h6>
      </div>
      <div class="fr-col-2">
        <h6>
          analytics.domain :<br />
          <code>{{ analytics.domain }}</code>
        </h6>
      </div>
      <div class="fr-col-2">
        <h6>
          analytics.hasTrackAllOutlinks:<br />
          <code>{{ analytics.hasTrackAllOutlinks }}</code>
        </h6>
      </div>
      <div class="fr-col-2">
        <h6>
          analytics.allowAnalytics:<br />
          <code>{{ analytics.allowAnalytics }}</code>
        </h6>
      </div>
      <div class="fr-col-2">
        <h6>
          analytics.matomoIsSet:<br />
          <code>{{ analytics.matomoIsSet }}</code>
        </h6>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue'

import { analyticsStore } from '../stores/analytics'

import { matomoScript } from '../utils/matomo'
import type { ImportMetaEnv } from '@/env'

interface Props {
  debug?: boolean
}
defineProps<Props>()

const analytics = analyticsStore()

// const scriptUniqueId = 'gov-aid-tree-matomo-script'

const metaEnv: ImportMetaEnv = import.meta.env
// const matomoDeactivate = ref(metaEnv.VITE_MATOMO_DEACTIVATE === 'true')
const matomoDeactivate: boolean = metaEnv.VITE_MATOMO_DEACTIVATE
// const matomoServer = ref(metaEnv.VITE_MATOMO_URL)
// const matomoSiteId = ref(metaEnv.VITE_MATOMO_APP_ID)
// const hasTrackAllOutlinks = false

let matomoScriptElem = document.getElementById(analytics.scriptUniqueId)

onBeforeMount(() => {
  // console.log()
  // console.log('TeeMatomo > onBeforeMount >  matomoDeactivate :', matomoDeactivate)
  // console.log('TeeMatomo > onBeforeMount >  matomoDeactivate :', typeof(matomoDeactivate))
  analytics.setAppDomain(location.hostname)
  analytics.setAnalyticsServer(metaEnv.VITE_MATOMO_URL, metaEnv.VITE_MATOMO_APP_ID, matomoDeactivate)
  // console.log('TeeMatomo > onBeforeMount >  analytics.matomoServer :', analytics.matomoServer)
  // console.log('TeeMatomo > onBeforeMount >  analytics.matomoSiteId :', analytics.matomoSiteId)
  // console.log('TeeMatomo > onBeforeMount >  analytics.domain :', analytics.domain)
})

onMounted(() => {
  // console.log()
  // console.log('TeeMatomo > onMounted >  analytics.matomoServer :', analytics.matomoServer)
  // console.log('TeeMatomo > onMounted >  analytics.matomoSiteId :', analytics.matomoSiteId)
  // console.log('TeeMatomo > onMounted >  analytics.domain :', analytics.domain)
  // console.log('TeeMatomo > onMounted >  analytics.allowAnalytics :', analytics.allowAnalytics)
  if (!matomoScriptElem && analytics.allowAnalytics) {
    // console.log('TeeMatomo > onMounted >  hasTrackAllOutlinks :', hasTrackAllOutlinks)
    matomoScriptElem = document.createElement('script')
    matomoScriptElem.setAttribute('id', analytics.scriptUniqueId)
    matomoScriptElem.setAttribute('type', 'text/javascript')

    // console.log('TeeMatomo > onMounted >  scriptText :', scriptText)
    matomoScriptElem.innerHTML = matomoScript(analytics.matomoServer, analytics.matomoSiteId, analytics.domain, analytics.hasTrackAllOutlinks)
    document.head.appendChild(matomoScriptElem)
    analytics.setMatomoIsSet(true)
  }
})
</script>
