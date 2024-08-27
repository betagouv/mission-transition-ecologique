<template>
  <!-- DEBUGGING -->
  <div
    v-if="debugStore.is"
    class="vue-debug fr-mt-5v"
  >
    <h5>DEBUG - TeeMatomo</h5>
    <div
      v-if="true"
      class="fr-grid-row fr-grid-row--gutters"
    >
      <div class="fr-col-2">
        <h6>
          matomo.server :<br />
          <code>{{ Matomo.server }}</code>
        </h6>
      </div>
      <div class="fr-col-2">
        <h6>
          matomo.siteId :<br />
          <code>{{ Matomo.siteId }}</code>
        </h6>
      </div>
      <div class="fr-col-2">
        <h6>
          matomo.domain :<br />
          <code>{{ Matomo.domain }}</code>
        </h6>
      </div>
      <div class="fr-col-2">
        <h6>
          matomo.hasTrackAllOutLinks:<br />
          <code>{{ Matomo.hasTrackAllOutLinks }}</code>
        </h6>
      </div>
      <div class="fr-col-2">
        <h6>
          matomo.allowAnalytics:<br />
          <code>{{ Matomo.allowAnalytics }}</code>
        </h6>
      </div>
      <div class="fr-col-2">
        <h6>
          matomo.isSet:<br />
          <code>{{ Matomo._isSet }}</code>
        </h6>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeMatomo > FUNCTION_NAME > MSG_OR_VALUE :`)

import { onMounted } from 'vue'
import Matomo from '@/utils/matomo'
import { useDebugStore } from '@/stores/debug'

const debugStore = useDebugStore()

let matomoScriptElem = document.getElementById(Matomo.scriptUniqueId)

onMounted(() => {
  if (!matomoScriptElem && Matomo.allowAnalytics) {
    matomoScriptElem = document.createElement('script')
    matomoScriptElem.setAttribute('id', Matomo.scriptUniqueId)
    matomoScriptElem.setAttribute('type', 'text/javascript')
    matomoScriptElem.innerHTML = Matomo.script()
    document.head.appendChild(matomoScriptElem)
    Matomo.isSet(true)
  }
})
</script>
