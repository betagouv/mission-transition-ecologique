<template>
  <div
    class="fr-container--fluid fr-container--fluid--no-overflow fr-px-0v fr-mt-0 fr-mb-10v"
    style="min-height: 800px"
  >
    <TeeQuestionnaire :track-id="TrackId.BuildingProperty" />
  </div>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { MetaRobots } from '@/tools/metaRobots'
import { TrackId } from '@/types'
import { RouteName } from '@/types/routeType'

definePageMeta({
  name: RouteName.QuestionnaireStart,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.resetFilters]
})

useHead(MetaRobots.noIndexNoFollow())
</script>
