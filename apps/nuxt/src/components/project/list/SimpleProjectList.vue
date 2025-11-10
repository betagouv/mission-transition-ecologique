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
        :title-tag="titleProjectTag"
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
import { FilterItemKeys, ProjectType } from '@/types'
import ProjectPriority from '@/tools/project/projectPriority'

const { filters } = storeToRefs(useFiltersStore())

interface Props {
  projectList?: ProjectType[]
  withCounter?: boolean
  withModalFilter?: boolean
  titleProjectTag?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
const props = defineProps<Props>()

const priorityProjects = computed(() => ProjectPriority.get(props.projectList))

const isPriorityProject = (project: ProjectType) => ProjectPriority.is(project, priorityProjects.value)

const getPriorityOrder = (project: ProjectType) => ProjectPriority.getIndex(project, priorityProjects.value)

const isUniquePriority = computed(() => ProjectPriority.isUnique(priorityProjects.value))
</script>
