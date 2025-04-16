<template>
  <ProgramDetail />
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { MetaRobots } from '@/tools/metaRobots'
import { RouteName } from '@/types/routeType'

definePageMeta({
  name: RouteName.CatalogProgramFromCatalogProjectDetail,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.hasProject, MiddlewareName.hasProgram]
})

useHead(MetaRobots.indexFollow())
</script>
