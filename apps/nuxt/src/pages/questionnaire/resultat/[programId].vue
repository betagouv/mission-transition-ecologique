<template>
  <ProgramDetail />
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { MetaRobots } from '@/tools/metaRobots'
import { RouteName } from '@/types/routeType'

definePageMeta({
  name: RouteName.ProgramResultDetail,
  middleware: [MiddlewareName.setUsedTracks, MiddlewareName.hasUsedTracks, MiddlewareName.hasProgram]
})

useHead(MetaRobots.noIndexNoFollow())
</script>
