<template>
  <!-- MAIN APP COMPONENT  -->
  <div
    class="fr-container--fluid fr-px-20v fr-pb-20v fr-mt-10v fr-mb-20v"
    style="min-height: 800px">
    <!-- <p>TeeQuestionnairePage</p> -->
    <!-- <WidgetApp
      :key="route.name"
      :seed="'track_help'"
      :disable-widget="true"
      :program-id="route.params.programId"
      :locale="'fr'"
    /> -->
    <router-view/>
  </div>
</template>

<script setup lang="ts">

// import { onMounted } from 'vue'
// import { useRouter, useRoute } from 'vue-router'

// @ts-ignore
// import WidgetApp from '../../WidgetApp.ce.vue'

// const router = useRouter()
// const route = useRoute()

// onMounted(async() => {
// //   // cf: https://stackoverflow.com/questions/69495211/vue3-route-query-empty
// //   console.log('TeeCatalogPage > onMounted > set router...')
//   await router.isReady()
//   console.log('TeeQuestionnairePage > onMounted > router is ready...')
// })

</script>