<template>
  <div
    class="fr-container--fluid fr-container--fluid--no-overflow fr-px-0v fr-mt-0 fr-mb-10v"
    style="min-height: 800px"
  >
    <ProgramDetail />
  </div>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { RouteName } from '@/types/routeType'

definePageMeta({
  name: RouteName.ProgramResultDetail,
  layout: 'default',
  middleware: [MiddlewareName.setUsedTracks, MiddlewareName.hasUsedTracks, MiddlewareName.hasProgram]
})
</script>
