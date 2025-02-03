<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import TeeFooter from '@/components/TeeFooter.vue'
import { MetaSeo } from '@/tools/metaSeo'
import Translation from '@/tools/translation'
import Cookie from '@/tools/cookies'

const navigationStore = useNavigationStore()
const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
  Translation.setLocale('fr')
  Cookie.setCookies()
})

// cf: https://stackoverflow.com/questions/69495211/vue3-route-query-empty
navigationStore.setRouter(router)
navigationStore.setRoute(route)

useSeoMeta(MetaSeo.default())
</script>

<template>
  <div>
    <ClientOnly>
      <TeeDsfrConsent />
      <TeeDsfrPersonalizeConsent />
      <TeeRegisterModal v-if="navigationStore.hasRegisterModal" />
    </ClientOnly>
    <TeeHeader />

    <slot />

    <div class="fr-mt-0v">
      <TeeFooter />
    </div>
  </div>
</template>
