<template>
  <router-link
    :id="project.slug"
    :to="getRouteToProjectDetail()"
    class="no-outline"
  >
    <DsfrButton
      :label="project.nameTag || project.title"
      secondary
      :class="`fr-m-4v fr-radius-a--2v fr-btn--secondary--${color}`"
    />
  </router-link>
</template>
<script setup lang="ts">
import { type RouteLocationRaw } from 'vue-router'
import { RouteName } from '@/types/routeType'
import { useNavigationStore } from '@/stores/navigation'
import { Color, Project } from '@/types'

interface Props {
  color?: Color
  project: Project
}
const props = defineProps<Props>()

const navigationStore = useNavigationStore()

const getRouteToProjectDetail = (): RouteLocationRaw => {
  return {
    name: RouteName.ProjectResultDetail,
    params: { projectSlug: props.project.slug },
    query: navigationStore.query
  }
}
</script>
