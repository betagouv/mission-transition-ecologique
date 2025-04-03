<template>
  <ProjectDetail />
</template>

<script setup lang="ts">
import ProjectDetail from '@/components/project/details/ProjectDetail.vue'
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { RouteName } from '@/types/routeType'

definePageMeta({
  name: RouteName.ProjectResultDetail,
  middleware: [MiddlewareName.hasProject, MiddlewareName.setUsedTracks, MiddlewareName.hasUsedTracks]
})
</script>
