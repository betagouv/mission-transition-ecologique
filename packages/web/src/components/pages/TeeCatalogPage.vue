<template>
  <!-- MAIN APP COMPONENT  -->
    <div
      class="fr-container--fluid fr-px-20v fr-pb-20v fr-mt-10v fr-mb-20v"
      style="min-height: 800px">
      <WidgetApp
        :seed="'track_results'"
        :showHeaderBool="false"
        :showFooterBool="false"
        :disableWidget="true"
        :locale="'fr'"
      />
    </div>
</template>

<script setup lang="ts">

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

// @ts-ignore
import WidgetApp from '../../WidgetApp.ce.vue'
// @ts-ignore
// import TeeProgramDetail from '../TeeProgramDetail.vue'

const router = useRouter()

onMounted(async() => {
//   // cf: https://stackoverflow.com/questions/69495211/vue3-route-query-empty
//   console.log('TeeProgramPAge > onMounted > set router...')
  await router.isReady()
  console.log('TeeProgramPAge > onMounted > router is ready...')
})

</script>