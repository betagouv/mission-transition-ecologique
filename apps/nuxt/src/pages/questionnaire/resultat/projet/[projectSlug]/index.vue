<template>
  <div
    class="fr-container--fluid fr-container--fluid--no-overflow fr-px-0v fr-mt-0 fr-mb-10v"
    style="min-height: 800px"
  >
    <ProjectDetail />
  </div>
</template>

<script setup lang="ts">
import ProjectDetail from '@/components/project/details/ProjectDetail.vue'
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { RouteName } from '@/types/routeType'

definePageMeta({
  name: RouteName.ProjectResultDetail,
  layout: 'default',
  middleware: [MiddlewareName.hasProject, MiddlewareName.setUsedTracks, MiddlewareName.hasUsedTracks]
})
</script>
