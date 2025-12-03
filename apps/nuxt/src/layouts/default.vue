<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import TeeFooter from '@/components/TeeFooter.vue'
import { Identity } from '@/tools/identity'
import { MetaSeo } from '@/tools/metaSeo'
import Navigation from '@/tools/navigation'
import Translation from '@/tools/translation'
import Cookie from '@/tools/cookies'
import { defineOrganization, defineWebPage, defineWebSite, useSchemaOrg } from '@unhead/schema-org/vue'

const navigationStore = useNavigationStore()

onBeforeMount(() => {
  Translation.setLocale('fr')
  Cookie.setCookies()
})

useSeoMeta(MetaSeo.default())

const navigation = Navigation.getInstance()
const { currentRoute } = useRouter()

useHead({
  templateParams: {
    schemaOrg: {
      host: navigation.baseUrl,
      path: computed(() => currentRoute.value.path)
    }
  }
})

useSchemaOrg([
  defineWebPage({ name: MetaSeo.title(), description: MetaSeo.defaultDescription }),
  defineWebSite({
    name: MetaSeo.title(),
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
