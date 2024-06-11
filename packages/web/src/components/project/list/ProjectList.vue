<template>
  <!--  List of project cards-->

  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-px-0 fr-mb-0 fr-mt-6v fr-px-md-4w">
    <div class="fr-grid-row fr-grid-row--center fr-justify-center">
      <div class="fr-col-9 fr-col-offset-md-3 fr-col-offset-lg-2 fr-col-xs-12">
        <ProgramListHeaderResult v-if="!navigationStore.isCatalog() && !hasSpinner" />
      </div>
      <div class="fr-col-9 fr-col-offset-md-3 fr-col-offset-lg-2 fr-mb-3v fr-col-xs-10">
        <ProgramFilterByTheme class="fr-pl-md-3v" />
      </div>
      <div
        v-if="hasObjectiveCard && !hasSpinner"
        class="fr-col-9 fr-col-offset-md-3 fr-col-offset-lg-2 fr-col-xs-12"
      >
        <TeeObjectiveCard
          :objective="objective as PublicodeObjective"
          radius-corner="tr"
          radius-size="2-5v"
        />
      </div>
      <div class="fr-mt-md-4w fr-mt-4v fr-pt-2v fr-pl-2w fr-pl-md-0 fr-col-9 fr-col-offset-md-3 fr-col-offset-lg-2 fr-col-xs-12">
        <h4>Quel est votre Projet ?</h4>
      </div>
      <div class="fr-mb-4v fr-pl-2w fr-pl-md-0 fr-col-9 fr-col-offset-md-3 fr-col-offset-lg-2 fr-col-xs-12 fr-text--blue-france">
        <div v-if="haveProjects && countProjects > 1">
          {{ countProjects }}
          {{ countProjects > 1 ? Translation.t('results.results') : Translation.t('results.result') }}
        </div>
      </div>
      <div
        v-if="hasSpinner || hasError || !countFilteredPrograms"
        class="fr-col-9 fr-text-center"
      >
        <TeeSpinner
          v-if="hasSpinner"
          scale="6"
        />
        <ProgramListNoResults
          v-else-if="!countFilteredPrograms && !hasError"
          image="images/tracks/no-results.svg"
          :message="{ fr: 'Aucune aide n\'a pu être identifiée avec les critères choisis...' }"
        />
        <TeeError
          v-else-if="hasError"
          :mailto="Contact.email"
          :email="Contact.email"
        />
      </div>
      <div
        v-if="filteredPrograms"
        class="fr-col-9 fr-col-xs-12 fr-col-offset-md-3 fr-col-offset-lg-2"
      >
        <div class="fr-container--fluid fr-container--fluid--no-overflow">
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--left">
            <div
              v-for="project in projectsData"
              :key="project.id"
              class="fr-col-12 fr-col-md-6 fr-col-lg-4"
            >
              <!--              <router-link-->
              <!--                v-for="project in projectsData"-->
              <!--                :id="project.id"-->
              <!--                :key="project.id"-->
              <!--                :to="getRouteToProjectDetail(project.id)"-->
              <!--                class="fr-col-12 fr-col-md-6 fr-col-lg-4"-->
              <!--              >-->
              <ProjectCard
                :project="project"
                class="fr-radius-a--1v"
              />
              <!--              </router-link>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { projects } from '@tee/common/src/project/mockData'
import { computed, onBeforeMount } from 'vue'
import { useUsedTrackStore } from '@/stores/usedTrack'
import Matomo from '@/utils/matomo'
import { type ProgramData, PublicodeObjective, TrackId } from '@/types'
import { useProgramStore } from '@/stores/program'
import { useNavigationStore } from '@/stores/navigation'
import ProgramListHeaderResult from '@/components/program/list/ProgramListHeaderResult.vue'
import ProgramFilterByTheme from '@/components/program/list/filters/ProgramFilterByTheme.vue'
import UsedTrack from '@/utils/track/usedTrack'
import Theme from '@/utils/theme'
import { Project } from '@tee/common/src/project/types'
import Translation from '@/utils/translation'
import Contact from '@/utils/contact'
import ProgramListNoResults from '@/components/program/list/ProgramListNoResults.vue'

const programStore = useProgramStore()
const navigationStore = useNavigationStore()

const hasError = ref<boolean>(false)
const programs = ref<ProgramData[]>()

const hasSpinner = computed(() => {
  return projectsData.value === undefined && !hasError.value
})

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})

const countFilteredPrograms = computed(() => {
  return filteredPrograms.value?.length || 0
})

const projectsData = computed(() => {
  return filteredPrograms.value
    ? projects.filter((project: Project) => {
        return project.programs.some((program) => filteredPrograms.value!.some((res) => res.id === program))
      })
    : undefined
})

const countProjects = computed(() => {
  return projectsData.value?.length || 0
})

const haveProjects = computed(() => {
  return countProjects.value > 0
})

const hasObjectiveCard = computed(() => {
  return programStore.hasObjectiveTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective())
})

const objective = computed(() => {
  if (programStore.hasObjectiveTypeSelected()) {
    return programStore.programFilters.objectiveTypeSelected
  }

  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective()) {
    return Theme.getPublicodeObjectiveByObjective(UsedTrack.getPriorityObjective())
  }

  return ''
})

onBeforeMount(async () => {
  const result = useUsedTrackStore().hasUsedTracks() ? await programStore.programsByUsedTracks : await programStore.programs
  if (result.isOk) {
    programs.value = result.value
  } else {
    hasError.value = true
  }

  // analytics / send event
  Matomo.sendEvent(TrackId.Results, navigationStore.isCatalog() ? 'show_results_catalog' : 'show_results')
})
</script>
