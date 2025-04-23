<template>
  <LayoutList>
    <template
      v-if="withCounter"
      #counter
    >
      <TeeCounterResult :to-count="projectList" />
    </template>
    <template
      v-if="withModalFilter"
      #modalFilter
    >
      <ProjectModalFilter />
    </template>
    <li
      v-for="project in projectList"
      :key="project.id"
      class="fr-col-12 fr-col-sm-6 fr-col-lg-4"
    >
      <ProjectCard
        :project="project"
        :is-priority-project="isPriorityProject(project)"
        :is-unique-priority="isUniquePriority"
        :priority-order="getPriorityOrder(project)"
        class="fr-radius-a--1v fr-card--shadow fr-enlarge-link"
      />
    </li>
    <li
      v-if="filters[FilterItemKeys.themeType] === ''"
      class="fr-col-12 fr-col-sm-6 fr-col-lg-4"
    >
      <TeeHomeQuestionnaireCta />
    </li>
  </LayoutList>
</template>
<script setup lang="ts">
import { ProjectType } from '@tee/data'
import { FilterItemKeys } from '@/types'
import Navigation from '@/tools/navigation'

const { filters } = storeToRefs(useFiltersStore())

interface Props {
  projectList?: ProjectType[]
  withCounter?: boolean
  withModalFilter?: boolean
}
const props = defineProps<Props>()

const filtersStore = useFiltersStore()

const priorityProjects = computed(() => {
  const isHomePage = new Navigation().isHomepage()
  const hasThemeSelected = filtersStore.hasThemeTypeSelected()
  const isCompanyDataSelected = useFiltersStore().getCompanyDataSelected().value
  if (!isCompanyDataSelected || (isHomePage && !hasThemeSelected)) {
    return undefined
  }
  const projectQty = hasThemeSelected ? 1 : 3
  return props.projectList ? props.projectList.slice(0, projectQty) : undefined
})

const isUniquePriority = computed(() => {
  return priorityProjects.value ? priorityProjects.value.length === 1 : false
})

const isPriorityProject = (project: ProjectType) => {
  return priorityProjects.value ? priorityProjects.value.includes(project) : false
}

const getPriorityOrder = (project: ProjectType) => {
  return priorityProjects.value ? priorityProjects.value.indexOf(project) + 1 : undefined
}
</script>
