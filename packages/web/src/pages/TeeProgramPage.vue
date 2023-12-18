<template>
  <!-- TEE PROGRAM COMPONENT  -->
  <div class="fr-container--fluid fr-px-20v fr-pb-20v fr-mt-10v fr-mb-20v" style="min-height: 800px">
    <TeeProgramDetail :program-id="String(route.params.programId)" :track-id="TrackId.Results" :disable-widget="true" />
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeProgramPage > FUNCTION_NAME > MSG_OR_VALUE :`)

import { useRoute } from 'vue-router'
import TeeProgramDetail from '@/components/program/TeeProgramDetail.vue'
import { TrackId } from '@/types'
const route = useRoute()
</script>
