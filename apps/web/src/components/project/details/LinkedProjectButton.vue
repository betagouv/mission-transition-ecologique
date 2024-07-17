<template>
  <TeeButtonLink
    :id="project.slug"
    :to="getRouteToProjectDetail()"
    class="fr-my-1-5v fr-mx-2v fr-radius-a--2v"
    :class="`fr-btn--secondary--${color}`"
  >
    {{ project.nameTag || project.title }}
  </TeeButtonLink>
</template>
<script setup lang="ts">
import { type RouteLocationRaw } from 'vue-router'
import { RouteName } from '@/types/routeType'
import { useNavigationStore } from '@/stores/navigation'
import { Color, Project } from '@/types'

interface Props {
  project: Project
  color?: Color
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
