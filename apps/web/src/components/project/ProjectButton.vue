<template>
  <TeeButtonLink
    :id="project.slug"
    :to="getRouteToProjectDetail()"
    class="fr-my-1-5v fr-mx-1v fr-radius-a--2v"
    :class="`fr-btn--secondary--${color}`"
    :size="size"
  >
    <div class="project-button-text">{{ project.nameTag || project.title }}</div>
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
  size?: 'sm' | 'md' | 'lg'
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
<style lang="scss">
.project-button-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
