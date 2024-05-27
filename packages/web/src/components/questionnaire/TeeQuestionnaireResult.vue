<template>
  <div
    :id="RouteName.QuestionnaireResult"
    ref="trackElement"
  >
    <div
      id="tee-app-tracks"
      ref="tee-app-tracks"
    >
      <ProgramList />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgramList from '@/components/program/list/ProgramList.vue'
import { RouteName } from '@/types/routeType'
</script>
