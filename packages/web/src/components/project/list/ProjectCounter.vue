<template>
  <div v-if="haveProjects && countProjects > 1">
    {{ countProjects }}
    {{ countProjects > 1 ? Translation.t('results.results') : Translation.t('results.result') }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type ProgramData } from '@/types'
import { Project } from '@tee/common/src/project/types'
import Translation from '@/utils/translation'
import projectData from '@tee/data/static/project.json'

interface ProjectListProps {
  filteredPrograms?: ProgramData[]
}

const props = defineProps<ProjectListProps>()

const sortedProjects = computed(() => {
  return props.filteredPrograms
    ? (projectData as unknown as Project[])
        .filter((project: Project) => {
          return project.programs.some((program) => props.filteredPrograms!.some((res) => res.id === program))
        })
        .sort((a, b) => b.priority - a.priority)
    : undefined
})

const countProjects = computed(() => {
  return sortedProjects.value?.length || 0
})

const haveProjects = computed(() => {
  return countProjects.value > 0
})
</script>
