<template>
  <div v-if="haveProjects && countProjects >= 1">
    {{ countProjects }}
    {{ countProjects > 1 ? Translation.t('results.results') : Translation.t('results.result') }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Project } from '@tee/data'
import Translation from '@/utils/translation'

interface ProjectListProps {
  sortedProjects?: Project[]
}

const props = defineProps<ProjectListProps>()

const countProjects = computed(() => {
  return props.sortedProjects?.length || 0
})

const haveProjects = computed(() => {
  return countProjects.value > 0
})
</script>
