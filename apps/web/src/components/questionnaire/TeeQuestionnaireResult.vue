<template>
  <div
    :id="RouteName.QuestionnaireResult"
    class="fr-container--fluid fr-container--fluid--no-overflow"
  >
    <TeeDsfrBreadcrumb />
    <ResultList />
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/types/routeType'
</script>
