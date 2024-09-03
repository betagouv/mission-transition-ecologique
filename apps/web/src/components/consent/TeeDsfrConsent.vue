<template>
  <div
    ref="tee-consent-popup"
    class="fr-consent-banner"
  >
    <DsfrConsent
      :url="RouteName.PersonalData"
      @accept-all="onAcceptAll()"
      @refuse-all="onRefuseAll()"
      @customize="openCustomize()"
    />
  </div>
</template>
<script setup lang="ts">
import { RouteName } from '@/types/routeType'
import Cookie from '@/utils/cookies'

const popup = ref<HTMLElement | null>(null)

const onAcceptAll = () => {
  Cookie.acceptAllCookies()
}
const onRefuseAll = () => {
  Cookie.refuseAllCookies()
}
const openCustomize = () => {
  const modal = document.getElementById('fr-consent-modal')
  if (modal) {
    modal.classList.add('fr-modal--opened')
  }
}

onMounted(() => {
  if (document.cookie && popup.value) {
    popup.value.classList.add('fr-hidden')
  }
})
</script>
