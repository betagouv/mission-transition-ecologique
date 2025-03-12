<template>
  <div class="fr-container--fluid fr-mt-2v fr-mt-md-3v">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-pl-2v fr-pl-md-0 fr-col-3 fr-col-lg-12 fr-col-content--middle fr-text--blue-france tee-font-style--italic">
        <TeeCounterResult :to-count="filteredPrograms" />
      </div>
      <div class="fr-col-9 fr-col-hidden-lg fr-text-right">
        <ProgramModalFilter />
      </div>
      <div class="fr-col-12 fr-mt-2v">
        <div class="fr-grid-row fr-grid-row--center fr-grid-row-lg--left">
          <div
            v-for="program in filteredPrograms"
            :key="program.id"
            class="fr-col-12 no-outline fr-mb-2w"
          >
            <ProgramCard
              :program="program"
              class="fr-enlarge-link fr-card--horizontal-tier"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgramCard from '@/components/program/list/ProgramCard.vue'
import { ProgramTypeForFront } from '@/types'

interface Props {
  filteredPrograms?: ProgramTypeForFront[]
}
defineProps<Props>()
</script>
<style lang="scss">
@use '@/assets/scss/setting';

.program-card:active {
  @media (width >= 0) and (width <= 767px) {
    background-color: var(--background-default-grey-active);
    border: thin solid setting.$purple;
    border-radius: 8px;
  }
}
</style>
