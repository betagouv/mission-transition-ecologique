<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-2v">
    <div class="fr-grid-row fr-grid-row--center">
      <ResultListNoResults
        v-if="showNoResultsComponent"
        :has-error="hasError"
        :has-spinner="hasSpinner"
        :count-items="countPrograms"
      />
    </div>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
        <div class="fr-grid-row fr-grid-row--center">
          <div
            v-if="!hasSpinner"
            class="fr-col-2 fr-col-hidden fr-col-unhidden-md"
          >
            <div class="fr-sidemenu fr-pr-0 fr-mx-3v">
              <div class="fr-text--bold fr-text-left fr-mb-3v fr-mt-6w">Filtres</div>
              <ProgramFiltersAccordion />
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-10 fr-pr-md-2v">
            <ProgramList :filtered-programs="filteredPrograms" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ProgramData } from '@/types'
import { computed } from 'vue'
import ProgramFiltersAccordion from '@/components/program/list/filters/ProgramFiltersAccordion.vue'

interface ProgramListProps {
  filteredPrograms?: ProgramData[]
}

const props = defineProps<ProgramListProps>()

const hasError = ref<boolean>(false)

const countPrograms = computed(() => {
  return props.filteredPrograms?.length || 0
})

const hasSpinner = computed(() => {
  return props.filteredPrograms === undefined && !hasError.value
})

const showNoResultsComponent = computed(() => {
  return hasSpinner.value || hasError.value || !countPrograms.value
})
</script>
