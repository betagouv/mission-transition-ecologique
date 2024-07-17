<template>
  <div
    :id="RouteName.QuestionnaireResult"
    class="fr-container--fluid fr-container--fluid--no-overflow"
  >
    <TeeDsfrBreadcrumb :links="links" />
    <ResultList />
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/types/routeType'
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'

const links = ref<DsfrBreadcrumbProps['links']>([{ text: 'Vos résultats' }])
</script>
