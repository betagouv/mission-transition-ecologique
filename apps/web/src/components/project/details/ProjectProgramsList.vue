<template>
  <ul class="fr-ml-3v">
    <li class="fr-mb-2v fr-text--purple fr-text--bold">{{ title }}</li>
  </ul>

  <router-link
    v-for="program in programs"
    :id="program.id"
    :key="program.id"
    :to="getRouteToProgramDetail(program.id)"
    class="fr-col-12 fr-card fr-enlarge-link fr-card--horizontal-tier fr-mb-10v"
  >
    <ProgramCard :program="program" />
  </router-link>
</template>

<script setup lang="ts">
import { type ProgramData, Project } from '@/types'
import { type RouteLocationRaw } from 'vue-router'
import { RouteName } from '@/types/routeType'
import { useNavigationStore } from '@/stores/navigation'

interface Props {
  programs: ProgramData[]
  project: Project
  title: string
}
const props = defineProps<Props>()

const navigationStore = useNavigationStore()

const getRouteToProgramDetail = (programId: string): RouteLocationRaw => {
  return {
    name: RouteName.ProgramFromProjectDetail,
    params: { programId: programId, projectSlug: props.project.slug },
    query: navigationStore.query
  }
}
</script>
