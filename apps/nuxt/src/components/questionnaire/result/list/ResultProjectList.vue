<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container--fluid fr-container--fluid--no-overflow">
    <div
      v-if="isSpecificGoal && !showNoResults && hasRegisteredData"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-container fr-mb-2v">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2">
          <h2 class="fr-text--bold fr-mt-3v fr-mb-0">Quel est votre projet ?</h2>
        </div>
      </div>
    </div>

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
      :sorted-projects="sortedProjects"
    />

    <div
      v-if="showOtherProjectForm"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-container">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2">
          <Transition
            name="fade"
            mode="out-in"
          >
            <OtherProjectCta
              v-if="!otherProjectForm && !showNoResults"
              @click="openOtherProjectForm"
            />
            <OtherProjectForm v-else />
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectSorter from '@/tools/project/projectSorter'
import { ProjectType } from '@/types'
import { computed } from 'vue'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'
import { useProgramStore } from '@/stores/program'
import OtherProjectCta from '@/components/project/list/OtherProjectCta.vue'
import OtherProjectForm from '@/components/project/list/OtherProjectForm.vue'
import Translation from '@/tools/translation'
import Navigation from '@/tools/navigation'
import { CompanyData } from '@/tools/companyData'
import { useNavigationStore } from '@/stores/navigation'

interface ProjectListProps {
  filteredProjects?: ProjectType[]
  hasError: boolean
}
const props = defineProps<ProjectListProps>()
const otherProjectForm = ref<boolean>(false)

const hasRegisteredData = CompanyData.isDataFull()

const openModal = () => {
  Navigation.toggleRegisterModal()
}

watch(
  () => props.filteredProjects,
  () => {
    otherProjectForm.value = false
  }
)
const programStore = useProgramStore()

const hasProjects = computed(() => {
  return countProjects.value > 0
})

const countProjects = computed(() => {
  return props.filteredProjects?.length || 0
})

const hasThemeCard = computed(() => {
  return programStore.hasThemeTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme())
})

const openOtherProjectForm = () => {
  otherProjectForm.value = true
}

const sortedProjects = ProjectSorter.sort(computed(() => props.filteredProjects))

const showNoResults = computed(() => {
  return (props.hasError || (!countProjects.value && props.filteredProjects !== undefined)) && !useNavigationStore().hasSpinner
})

const showOtherProjectForm = computed(() => {
  return !showNoResults.value && hasRegisteredData.value && !useNavigationStore().hasSpinner
})

const isSpecificGoal = computed(() => {
  return hasThemeCard.value && UsedTrack.isSpecificGoal() && hasProjects.value
})
</script>
