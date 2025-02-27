<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container--fluid fr-container--fluid--no-overflow">
    <div
      v-if="useNavigationStore().hasSpinner"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
        <div class="fr-col-12 fr-col-offset-md-2 fr-col-md-10 fr-pl-md-2v fr-pr-md-6v fr-col-justify--center">
          <TeeSpinner class="fr-mt-16w" />
        </div>
      </div>
    </div>

    <div
      v-if="showNoResults"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
        <div class="fr-col-12 fr-col-offset-md-2 fr-col-md-10 fr-pl-md-2v fr-pr-md-6v">
          <TeeListNoResults
            :has-error="hasError"
            message="Aucune idée d’action n’a pu être identifiée sur cette thématique..."
            :count-items="countProjects"
          />
        </div>
      </div>
    </div>
    <div
      v-if="!hasRegisteredData && !useNavigationStore().hasSpinner"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
        <div class="fr-col-12 fr-col-offset-md-2 fr-col-md-10 fr-pl-md-2v fr-pr-md-6v">
          <TeeNoResult
            :message="Translation.t('results.alertNoDataNoResults')"
            :cta-label="Translation.t('results.noResultCTA')"
            @cta-click="openModal"
          />
        </div>
      </div>
    </div>
    <ProjectList
      v-else
      :sorted-projects="filteredProjects"
    />

    <div
      v-if="showOtherProjectForm"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
        <div class="fr-col-12 fr-col-offset-md-2 fr-col-md-10 fr-pl-md-2v fr-pr-md-6v">
          <OtherProject />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProjectType } from '@/types'
import { computed } from 'vue'
import Translation from '@/tools/translation'
import Navigation from '@/tools/navigation'
import { CompanyData } from '@/tools/companyData'
import { useNavigationStore } from '@/stores/navigation'

interface ProjectListProps {
  filteredProjects?: ProjectType[]
  hasError: boolean
}
const props = defineProps<ProjectListProps>()

const hasRegisteredData = CompanyData.isDataFull()

const openModal = () => {
  Navigation.toggleRegisterModal()
}

const countProjects = computed(() => {
  return props.filteredProjects?.length || 0
})

const showNoResults = computed(() => {
  return (props.hasError || (!countProjects.value && props.filteredProjects !== undefined)) && !useNavigationStore().hasSpinner
})

const showOtherProjectForm = computed(() => {
  return !showNoResults.value && hasRegisteredData.value && !useNavigationStore().hasSpinner
})
</script>
