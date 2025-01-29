<template>
  <div
    class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-0 fr-mb-12v"
    style="min-height: 800px"
  >
    <ProjectDetail />
  </div>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { RouteName } from '@/types'

definePageMeta({
  name: RouteName.CatalogProjectDetail,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.resetFilters, MiddlewareName.hasProject]
})
</script>
