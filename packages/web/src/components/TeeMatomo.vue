<template>
  <!-- DEBUGGING -->
  <div 
    v-if="debug"
    class="vue-debug fr-mt-5v">
    <h5>DEBUG - TeeMatomo</h5>
    <div 
      v-if="true"
      class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-2">
        <h6>analytics.matomoServer :<br>
        <code>{{ analytics.matomoServer }}</code></h6>
      </div>
      <div class="fr-col-2">
        <h6>analytics.matomoSiteId :<br>
        <code>{{ analytics.matomoSiteId }}</code></h6>
      </div>
      <div class="fr-col-2">
        <h6>analytics.domain :<br>
        <code>{{ analytics.domain }}</code></h6>
      </div>
      <div class="fr-col-2">
        <h6>analytics.hasTrackAllOutlinks:<br>
        <code>{{ analytics.hasTrackAllOutlinks }}</code></h6>
      </div>
      <div class="fr-col-2">
        <h6>analytics.allowAnalytics:<br>
        <code>{{ analytics.allowAnalytics }}</code></h6>
      </div>
      <div class="fr-col-2">
        <h6>analytics.matomoIsSet:<br>
        <code>{{ analytics.matomoIsSet }}</code></h6>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

// CONSOLE LOG TEMPLATE
// console.log(`TeeMatomo > FUNCTION_NAME > MSG_OR_VALUE :`)

import { onMounted, onBeforeMount } from 'vue'

import { analyticsStore } from '../stores/analytics'

import { matomoScript } from '../utils/matomo'

interface Props {
  debug?: boolean,
}
const props = defineProps<Props>()

const analytics = analyticsStore()

// @ts-ignore
const metaEnv = import.meta.env
const matomoDeactivate = metaEnv.VITE_MATOMO_DEACTIVATE === 'true'

let matomoScriptElem = document.getElementById(analytics.scriptUniqueId)

onBeforeMount(() => {
  analytics.setAppDomain(location.hostname)
  analytics.setAnalyticsServer(metaEnv.VITE_MATOMO_URL, metaEnv.VITE_MATOMO_APP_ID, matomoDeactivate)
})

onMounted(() => {
  if (!matomoScriptElem && analytics.allowAnalytics) {

    matomoScriptElem = document.createElement('script')
    matomoScriptElem.setAttribute('id', analytics.scriptUniqueId)
    matomoScriptElem.setAttribute('type', 'text/javascript')

    const scriptText = matomoScript(analytics.matomoServer, analytics.matomoSiteId, analytics.domain, analytics.hasTrackAllOutlinks)
    matomoScriptElem.innerHTML = scriptText
    document.head.appendChild(matomoScriptElem)
    analytics.setMatomoIsSet(true)
  }
})

</script>