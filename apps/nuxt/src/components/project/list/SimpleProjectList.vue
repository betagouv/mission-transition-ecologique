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
        class="fr-radius-a--1v fr-card--shadow fr-enlarge-link"
      />
    </li>
  </LayoutList>
</template>
<script setup lang="ts">
import { ProjectType } from '@tee/data'

interface Props {
  projectList?: ProjectType[]
  withCounter?: boolean
  withModalFilter?: boolean
}
defineProps<Props>()
</script>
