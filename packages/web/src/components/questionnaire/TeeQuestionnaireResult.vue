<template>
  <div
    ref="trackElement"
    class="fr-container"
  >
    <div
      :id="RouteName.QuestionnaireResult"
      class="fr-container"
    >
      <div
        ref="tee-app-tracks"
        class="fr-grid-row fr-grid-row-gutters fr-justify-center"
      >
        <div class="fr-tee-add-padding fr-mt-10v fr-col-3 fr-col-md-4 fr-col-lg-3 fr-col-xl-2 fr-col-sm-hide">
          <nav
            role="navigation"
            class="fr-sidemenu fr-sidemenu--sticky-full-height"
          >
            <ProgramFilterByType legend="Filtrer par nature de l'aide" />
          </nav>
        </div>
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
  </div>
</template>

<script setup lang="ts">
import ProgramList from '@/components/program/list/ProgramList.vue'
import { RouteName } from '@/types/routeType'
</script>
