<template>
  <!-- TEE PROGRAM COMPONENT  -->
  <div
    class="fr-container--fluid fr-px-20v fr-pb-20v fr-mt-10v fr-mb-20v"
    style="min-height: 800px">
    <!-- {{ route.params.programId }} -->
    <WidgetApp
      :seed="TrackId.Results"
      :showHeaderBool="false"
      :showFooterBool="false"
      :disableWidget="true"
      :program-id="route.params.programId"
      :locale="'fr'"
      />
      <TeeProgramDetail
        :program-id="String(route.params.programId)"
        :track-id="TrackId.Results"
        :disable-widget="true"
      />
  </div>
</template>

<script setup lang="ts">

// CONSOLE LOG TEMPLATE
// console.log(`TeeProgramPage > FUNCTION_NAME > MSG_OR_VALUE :`)

import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// @ts-ignore
import WidgetApp from '@/WidgetApp.ce.vue'
// @ts-ignore
import TeeProgramDetail from '@/components/program/TeeProgramDetail.vue'
import { TrackId } from '@/types'

const router = useRouter()
const route = useRoute()

onMounted(async() => {
//   // cf: https://stackoverflow.com/questions/69495211/vue3-route-query-empty
  await router.isReady()
  console.log('TeeCatalogPage > onMounted > router is ready...')
})

</script>
