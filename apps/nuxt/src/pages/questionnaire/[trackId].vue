<template>
  <div
    class="fr-container--fluid fr-container--fluid--no-overflow fr-px-0v fr-mt-0 fr-mb-10v"
    style="min-height: 800px"
  >
    <TeeQuestionnaire :track-id="$route.params.trackId" />
  </div>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { RouteName } from '@/types/routeType'

definePageMeta({
  name: RouteName.Questionnaire,
  middleware: [MiddlewareName.setUsedTracks, MiddlewareName.hasUsedTracks, MiddlewareName.hasTrack]
})
</script>
