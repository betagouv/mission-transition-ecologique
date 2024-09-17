<template>
  <div class="fr-container--fluid fr-mt-2v fr-mt-md-3v">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-pl-2v fr-pl-md-0 fr-col-3 fr-col-md-12 fr-col-content--middle fr-text--blue-france tee-font-style--italic">
        <TeeCounterResult :to-count="filteredPrograms" />
      </div>
      <div class="fr-col-9 fr-col-hidden-md fr-text-right">
        <ProgramModalFilter />
      </div>
      <div class="fr-col-12 fr-mt-2v">
        <div class="fr-grid-row fr-grid-row--center fr-grid-row-lg--left">
          <router-link
            v-for="program in filteredPrograms"
            :id="program.id"
            :key="program.id"
            :to="getRouteToProgramDetail(program.id)"
            class="fr-col-12 program-card fr-card fr-enlarge-link fr-card--horizontal-tier fr-mb-6v"
          >
            <ProgramCard :program="program" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgramCard from '@/components/program/list/ProgramCard.vue'
import { useNavigationStore } from '@/stores/navigation'
import { ProgramType } from '@/types'
import { RouteName } from '@/types/routeType'
import { type RouteLocationRaw } from 'vue-router'

interface Props {
  filteredPrograms?: ProgramType[]
}
defineProps<Props>()

const navigationStore = useNavigationStore()

const isCatalog = navigationStore.isCatalogPrograms()

const getRouteToProgramDetail = (programId: string): RouteLocationRaw => {
  return {
    name: isCatalog ? RouteName.CatalogProgramDetail : RouteName.QuestionnaireResultDetail,
    params: { programId },
    query: isCatalog ? undefined : navigationStore.query
  }
}
</script>
<style lang="scss">
@import '../../../assets/scss/setting/color';

.program-card:active {
  @media (width >= 0) and (width <= 767px) {
    background-color: var(--background-default-grey-active);
    border: thin solid $base-blue;
    border-radius: 8px;
  }
}
</style>
