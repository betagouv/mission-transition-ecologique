<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeMatomo > FUNCTION_NAME > MSG_OR_VALUE :`)

import { onMounted } from 'vue'
import Matomo from '@/utils/matomo'

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
