<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container--fluid fr-container--fluid--no-overflow">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
        <div class="fr-grid-row fr-grid-row--center">
          <div
            v-if="!useNavigationStore().hasSpinner"
            class="fr-col-2 fr-col-hidden fr-col-unhidden-md"
          >
            <div class="fr-sidemenu fr-pr-0 fr-mx-3v">
              <div class="fr-text--bold fr-text-left fr-mb-3v fr-mt-6w">Filtres</div>
              <ProgramFiltersAccordion />
            </div>
          </div>
          <div
            class="fr-col-12 fr-col-md-10 fr-pl-md-2v fr-pr-md-6v"
            :class="{
              'fr-col-offset-md-2': useNavigationStore().hasSpinner
            }"
          >
            <TeeSpinner
              v-if="useNavigationStore().hasSpinner"
              class="fr-mt-16w"
            />
            <TeeListNoResults
              v-if="showNoResultsComponent"
              :has-error="hasError"
              message="Aucune aide n'a pu être identifiée sur cette thématique..."
              :count-items="countPrograms"
            />
            <TeeNoResult
              v-if="!hasRegisteredData && !useNavigationStore().hasSpinner"
              :message="Translation.t('results.alertNoDataNoResults')"
              :cta-label="Translation.t('results.noResultCTA')"
              @cta-click="openModal"
            />
            <ProgramList
              v-else
              :filtered-programs="filteredPrograms"
            />
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
import Translation from '@/utils/translation'
import Navigation from '@/utils/navigation'
import CompanyDataStorage from '@/utils/storage/companyDataStorage'
import { useNavigationStore } from '@/stores/navigation'

interface ProgramListProps {
  filteredPrograms?: ProgramData[]
  hasError: boolean
}

const hasRegisteredData = CompanyDataStorage.hasData()

const props = defineProps<ProgramListProps>()

const openModal = () => {
  Navigation.toggleRegisterModal()
}

const countPrograms = computed(() => {
  return props.filteredPrograms?.length || 0
})

const showNoResultsComponent = computed(() => {
  return props.hasError || !countPrograms.value
})
</script>
