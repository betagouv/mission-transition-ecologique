<template>
  <LayoutList>
    <template
      v-if="withCounterAndModalFilter"
      #counter
    >
      <TeeCounterResult :to-count="projectList" />
    </template>
    <template
      v-if="withCounterAndModalFilter"
      #modalFilter
    >
      <ProgramModalFilter />
    </template>
    <li
      v-for="project in projectList"
      :key="project.id"
      class="fr-col-12 fr-col-sm-6 fr-col-lg-4"
    >
      <ProjectCard
        :project="project"
        class="fr-radius-a--1v fr-card--shadow fr-enlarge-link"
      />
    </li>
  </LayoutList>
</template>
<script setup lang="ts">
import { ProjectType } from '@tee/data'

interface Props {
  projectList?: ProjectType[]
  withCounterAndModalFilter?: boolean
}

defineProps<Props>()
</script>
