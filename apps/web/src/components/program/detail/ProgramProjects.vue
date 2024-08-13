<template>
  <div
    v-if="projects.length > 0"
    class="fr-mt-2v fr-p-6v fr-bg--blue-light--light fr-radius-a--1v"
  >
    <div class="fr-h4">{{ !singleProject ? Translation.t('program.projectExamples') : Translation.t('program.projectExample') }}:</div>

    <div
      v-if="!singleProject"
      class="fr-grid-row fr-grid-row--middle fr-grid-row--center"
    >
      <DsfrButton
        tertiary
        :disabled="navigationDisabled || startIndex === 0"
        icon="fr-icon-arrow-left-s-line"
        class="fr-col-1"
        no-outline
        icon-only
        @click="navigatePrograms(-1)"
      />
      <div class="fr-col-10">
        <div
          v-if="!useNavigationStore().hasSpinner"
          class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row-md--left"
        >
          <router-link
            :id="visibleProjects[0].slug"
            :to="getRouteToProjectDetail(visibleProjects[0])"
            class="fr-col-12 fr-col-sm-6 fr-col-md-6 fr-col-lg-4 no-outline"
          >
            <ProjectCard
              :project="visibleProjects[0]"
              class="fr-radius-a--1v fr-card--shadow"
            />
          </router-link>
          <router-link
            :id="visibleProjects[1].slug"
            :to="getRouteToProjectDetail(visibleProjects[1])"
            class="fr-col-12 fr-hidden fr-unhidden-sm fr-col-sm-6 fr-col-md-6 fr-col-lg-4 no-outline"
          >
            <ProjectCard
              :project="visibleProjects[1]"
              class="fr-radius-a--1v fr-card--shadow"
            />
          </router-link>
          <router-link
            :id="visibleProjects[2].slug"
            :to="getRouteToProjectDetail(visibleProjects[2])"
            class="fr-col-12 fr-hidden fr-unhidden-lg fr-col-sm-6 fr-col-md-6 fr-col-lg-4 no-outline"
          >
            <ProjectCard
              :project="visibleProjects[2]"
              class="fr-radius-a--1v fr-card--shadow"
            />
          </router-link>
        </div>
      </div>
      <DsfrButton
        tertiary
        icon="fr-icon-arrow-right-s-line"
        class="fr-col-1"
        :disabled="navigationDisabled || endIndex === projects.length - 1"
        no-outline
        icon-only
        @click="navigatePrograms(1)"
      />
    </div>
    <router-link
      v-else
      :id="visibleProjects[0]"
      class="fr-p-4v no-outline"
      :to="getRouteToProjectDetail(visibleProjects[0])"
    >
      <ProjectCard
        :project="visibleProjects[0]"
        :horizontal="true"
        class="fr-radius-a--1v fr-card--shadow fr-card--horizontal-tier"
      />
    </router-link>
  </div>
</template>
<script lang="ts" setup>
import type { ProgramData, Project as ProjectType } from '@/types'
import { RouteName } from '@/types'
import Translation from '@/utils/translation'
import Program from '@/utils/program/program'
import { useProjectStore } from '@/stores/project'
import { useNavigationStore } from '@/stores/navigation'
import { type RouteLocationRaw } from 'vue-router'

interface Props {
  program: ProgramData
}
const props = defineProps<Props>()
const projectStore = useProjectStore()
const projects = ref<ProjectType[]>([])
const startIndex = ref<number>(0)
const endIndex = ref<number>(3)
const navigationStore = useNavigationStore()
const isProgramCatalogDetail = navigationStore.isByRouteName(RouteName.CatalogProgramDetail)

const singleProject = computed<boolean>(() => {
  return projects.value.length === 1
})
const navigationDisabled = computed<boolean>(() => {
  return projects.value && singleProject.value
})

const visibleProjects = computed<ProjectType[]>(() => {
  return projects.value.slice(startIndex.value, endIndex.value)
})

const navigatePrograms = (nav: number) => {
  startIndex.value = startIndex.value + nav
  endIndex.value = endIndex.value + nav
}

onBeforeMount(async () => {
  useNavigationStore().hasSpinner = true

  const projectResult = await projectStore.projects
  if (projectResult.isOk) {
    projects.value = Program.getLinkedProjects(props.program, projectResult.value)
  }
  useNavigationStore().hasSpinner = false
})

const getRouteToProjectDetail = (project: ProjectType): RouteLocationRaw => {
  return {
    name: isProgramCatalogDetail ? RouteName.CatalogProjectFromProgramDetail : RouteName.ProjectFromProgramDetail,
    params: { projectSlug: project.slug },
    query: isProgramCatalogDetail ? undefined : navigationStore.query
  }
}
</script>
