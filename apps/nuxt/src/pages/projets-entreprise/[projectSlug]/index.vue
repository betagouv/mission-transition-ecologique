<template>
  <ProjectDetail />
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { MetaRobots } from '@/tools/metaRobots'
import { RouteName } from '@/types'

definePageMeta({
  name: RouteName.CatalogProjectDetail,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.hasProject]
})

useHead(MetaRobots.indexFollow())
</script>
