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

import { ref, onMounted, onBeforeMount } from 'vue'

import { analyticsStore } from '../stores/analytics'

import { matomoScript } from '../utils/matomo'

interface Props {
  debug?: boolean,
}
const props = defineProps<Props>()

const analytics = analyticsStore()

// const scriptUniqueId = 'gov-aid-tree-matomo-script'

// @ts-ignore
const metaEnv = import.meta.env
// const matomoServer = ref(metaEnv.VITE_MATOMO_URL)
// const matomoSiteId = ref(metaEnv.VITE_MATOMO_APP_ID)
// const domain = ref(location.hostname)
// const notDevEnv = analytics.domain.value !== 'localhost'
// const hasTrackAllOutlinks = false

let matomoScriptElem = document.getElementById(analytics.scriptUniqueId)

onBeforeMount(() => {
  console.log()
  analytics.setAppDomain(location.hostname)
  analytics.setAnalyticsServer(metaEnv.VITE_MATOMO_URL, metaEnv.VITE_MATOMO_APP_ID)
  // console.log('TeeMatomo > onBeforeMount >  analytics.matomoServer :', analytics.matomoServer)
  // console.log('TeeMatomo > onBeforeMount >  analytics.matomoSiteId :', analytics.matomoSiteId)
  // console.log('TeeMatomo > onBeforeMount >  analytics.domain :', analytics.domain)
})

onMounted(() => {
  // console.log()
  console.log('TeeMatomo > onMounted >  analytics.matomoServer :', analytics.matomoServer)
  console.log('TeeMatomo > onMounted >  analytics.matomoSiteId :', analytics.matomoSiteId)
  console.log('TeeMatomo > onMounted >  analytics.domain :', analytics.domain)
  if (!matomoScriptElem && analytics.allowAnalytics) {

    // console.log('TeeMatomo > onMounted >  hasTrackAllOutlinks :', hasTrackAllOutlinks)
    matomoScriptElem = document.createElement('script')
    matomoScriptElem.setAttribute('id', analytics.scriptUniqueId)
    matomoScriptElem.setAttribute('type', 'text/javascript')

    const scriptText = matomoScript(analytics.matomoServer, analytics.matomoSiteId, analytics.domain, analytics.hasTrackAllOutlinks)
    console.log('TeeMatomo > onMounted >  scriptText :', scriptText)
    matomoScriptElem.innerHTML = scriptText
    document.head.appendChild(matomoScriptElem)
    analytics.setMatomoIsSet()
  }
})

</script>