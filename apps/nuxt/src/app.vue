<script setup lang="ts">
import { useNavigationStore } from './stores/navigation'

import TeeFooter from './components/TeeFooter.vue'
import Translation from '@/tools/translation'
import Cookie from '@/tools/cookies'

const navigationStore = useNavigationStore()
const router = useRouter()
const route = useRoute()

const isReady = computed<boolean>(() => {
  return navigationStore.isReady
})

onBeforeMount(() => {
  Translation.setLocale('fr')
  Cookie.setCookies()
})

onMounted(async () => {
  // cf: https://stackoverflow.com/questions/69495211/vue3-route-query-empty
  await router.isReady()
  navigationStore.setRouter(router)
  navigationStore.setRoute(route)
})
</script>

<template>
  <div>
    <TeeDsfrConsent />
    <TeeDsfrPersonalizeConsent />
    <TeeHeader />
<!--      <TeeMatomo />-->
      <NuxtPage/>

    <div class="fr-mt-0v">
      <TeeFooter />
    </div>
  </div>
</template>


