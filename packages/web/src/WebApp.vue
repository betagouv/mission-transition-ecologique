<template>
  <div
    ref="trackElement"
    id="app">
    <!-- HEADER -->
    <TeeHeader/>

    <!-- MATOMO -->
    <!-- <TeeMatomo
      :debug="debugBool"
      /> -->

    <router-view/>

    <!-- FOOTER -->
    <div
      class="fr-mt-0v">
      <TeeAppFooter
        :stick-to-bottom="false"/>
    </div>
  </div>
</template>

<script setup lang="ts">
// cf : https://github.com/betagouv/transition-ecologique-entreprises-widget/commit/845f2cd7c31b16aa7bbeecf8533a9d72bb557c38#diff-11f3012b2f722ad4a8671a5c6dbb44f832deb7b4064388325f824ac0e958837c

import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { navigationStore } from './stores/navigation'
const nav = navigationStore()

// @ts-ignore
import TeeHeader from './components/TeeHeader.vue'
// @ts-ignore
// import TeeMatomo from './components/TeeMatomo.vue'
// @ts-ignore
import TeeAppFooter from './components/TeeAppFooter.vue'

const router = useRouter()
const route = useRoute()

onMounted(async() => {
  // cf: https://stackoverflow.com/questions/69495211/vue3-route-query-empty
  console.log('WebApp > onMounted > set router...')
  await router.isReady()
  console.log('WebApp > onMounted > router is ready...')
  nav.setRouter(router)
  nav.setRoute(route)
})

</script>

<style lang="scss">
  @import '~@gouvfr/dsfr/dist/dsfr.min.css'; // ok
  @import '@public/css/custom.css';
  @import '~@gouvfr/dsfr/dist/utility/icons/icons.min.css'; // ok
</style>