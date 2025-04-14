<template>
  <ProgramDetail />
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { MetaRobots } from '@/tools/metaRobots'
import { RouteName } from '@/types'

definePageMeta({
  name: RouteName.CatalogProgramDetail,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.hasProgram]
})

useHead(MetaRobots.indexFollow())
</script>
