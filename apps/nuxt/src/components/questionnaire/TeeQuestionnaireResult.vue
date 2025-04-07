<template>
  <div
    :id="RouteName.QuestionnaireResult"
    class="fr-container--fluid fr-container--fluid--no-overflow"
  >
    <TeeDsfrBreadcrumb />
    <div
      v-if="hasSpinner"
      class="fr-grid-row fr-grid-row--center"
    >
      <TeeSpinner />
    </div>
    <div v-else>
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-text-center-md">
            <div class="fr-grid-row fr-text-center fr-text-left-md">
              <div class="fr-col-12">
                <h1 class="fr-mb-md-4v fr-mb-2v fr-text--blue-france">Vos résultats</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ResultListInTabs />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/types/routeType'
import { useNavigationStore } from '@/stores/navigation'

const hasSpinner = useNavigationStore().hasSpinner
</script>
