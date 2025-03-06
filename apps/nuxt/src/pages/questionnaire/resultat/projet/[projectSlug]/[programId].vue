<template>
  <ProgramDetail />
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { RouteName } from '@/types/routeType'

definePageMeta({
  name: RouteName.ProgramFromProjectResultDetail,
  middleware: [MiddlewareName.hasProject, MiddlewareName.setUsedTracks, MiddlewareName.hasUsedTracks, MiddlewareName.hasProgram]
})
</script>
