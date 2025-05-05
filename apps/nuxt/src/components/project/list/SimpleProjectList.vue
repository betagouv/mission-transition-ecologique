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
import ProjectPriority from '@/tools/project/projectPriority'

const { filters } = storeToRefs(useFiltersStore())

interface Props {
  projectList?: ProjectType[]
  withCounter?: boolean
  withModalFilter?: boolean
}
const props = defineProps<Props>()

const priorityProjects = computed(() => ProjectPriority.getPriorityProjects(props.projectList))

const isPriorityProject = (project: ProjectType) => ProjectPriority.isPriorityProject(project, priorityProjects.value)

const getPriorityOrder = (project: ProjectType) => ProjectPriority.getPriorityOrder(project, priorityProjects.value)

const isUniquePriority = computed(() => ProjectPriority.isUniquePriority(priorityProjects.value))
</script>
