<template>
  <div
    class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-0 fr-mb-12v"
    style="min-height: 800px"
  >
    <ProgramDetail />
  </div>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { RouteName } from '@/types'

definePageMeta({
  name: RouteName.CatalogProgramDetail,
  layout: 'default',
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.hasProgram]
})
</script>
