<template>
  <div class="fr-consent-banner">
    <DsfrConsent
      :url="RouteName.PersonalData"
      @accept-all="onAcceptAll()"
      @refuse-all="onRefuseAll()"
    />
  </div>
</template>
<script setup lang="ts">
import { RouteName } from '@/types/routeType'
import { useNavigationStore } from '@/stores/navigation'
import type { CookieManager } from '@/types/navigation'

const onAcceptAll = () => {
  useNavigationStore().cookies = useNavigationStore().cookies.map((cookie: CookieManager) => ({ ...cookie, accepted: true }))
}
const onRefuseAll = () => {
  useNavigationStore().cookies = useNavigationStore().cookies.map((cookie: CookieManager) => ({ ...cookie, accepted: false }))
}
</script>
