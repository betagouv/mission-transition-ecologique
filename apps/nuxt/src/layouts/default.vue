<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import TeeFooter from '@/components/TeeFooter.vue'
import { Identity } from '@/tools/identity'
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
useSchemaOrg([
  defineWebPage({ name: MetaSeo.title, description: MetaSeo.defaultDescription }),
  defineWebSite({
    name: MetaSeo.title,
    description: MetaSeo.descriptionWebsite
  }),
  defineOrganization({
    '@type': 'GovernmentOrganization',
    name: Identity.title,
    logo: Identity.logoPath,
    description: Identity.description
  })
])
</script>

<template>
  <div>
    <TeeHeader />
    <div>
      <slot />
    </div>
    <TeeFooter />
    <ClientOnly>
      <TeeDsfrConsent />
      <TeeDsfrPersonalizeConsent />
      <TeeRegisterModal v-if="navigationStore.hasRegisterModal" />
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
#tee > div:first-of-type {
  min-height: 100vh;
  margin: 0;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>
