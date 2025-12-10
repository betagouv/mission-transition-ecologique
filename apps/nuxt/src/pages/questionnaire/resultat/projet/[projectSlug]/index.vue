<template>
  <ProjectDetail />
</template>

<script setup lang="ts">
import ProjectDetail from '@/components/project/details/ProjectDetail.vue'
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { MetaRobots } from '@/tools/metaRobots'
import { RouteName } from '@/types/routeType'

definePageMeta({
  name: RouteName.ProjectResultDetail,
  middleware: [MiddlewareName.hasProject, MiddlewareName.hasUsedTracks]
})

useHead(MetaRobots.noIndexNoFollow())
</script>
