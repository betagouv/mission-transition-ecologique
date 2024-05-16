<template>
  <div
    :id="RouteName.QuestionnaireResult"
    ref="trackElement"
    class="fr-container--fluid fr-container--fluid--no-overflow"
  >
    <div
      ref="tee-app-tracks"
      class="fr-grid-row fr-justify-center"
    >
      <div
        id="tee-app-tracks"
        class="fr-grid-row--center fr-col fr-col-sm-12 fr-col-md-8 fr-col-lg-9 fr-col-xl-8"
      >
        <Suspense>
          <ProgramList />
          <template #fallback>
            <span>Chargement...</span>
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgramList from '@/components/program/list/ProgramList.vue'
import { RouteName } from '@/types/routeType'
</script>
