<template>
  <div
    class="fr-container--fluid fr-container--fluid--no-overflow fr-px-0v fr-mt-0 fr-mb-10v"
    style="min-height: 800px"
  >
    <TeeQuestionnaireResult />
  </div>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { MetaRobots } from '@/tools/metaRobots'
import { RouteName } from '@/types/routeType'

definePageMeta({
  name: RouteName.QuestionnaireResult,
  middleware: [MiddlewareName.setUsedTracks, MiddlewareName.hasUsedTracks]
})

defineRouteRules({
  sitemap: false
})

useHead(MetaRobots.noIndexNoFollow())
</script>
