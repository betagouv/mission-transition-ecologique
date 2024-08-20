<template>
  <TeeButtonLink
    :id="project.slug"
    :to="getRouteToProjectDetail()"
    :size="size"
    class="fr-radius-a--2v"
    :class="`fr-btn--secondary--${color}`"
  >
    <span class="project-button-text">{{ project.nameTag || project.title }}</span>
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
const props = withDefaults(defineProps<Props>(), {
  color: Color.green,
  size: 'md'
})

const navigationStore = useNavigationStore()

const getRouteName = () => {
  if (navigationStore.isCatalogProgramDetail()) {
    return RouteName.CatalogProjectFromProgramDetail
  }
  if (navigationStore.isCatalogProjectDetail() || navigationStore.isByRouteName(RouteName.CatalogProjectFromProgramDetail)) {
    return RouteName.CatalogProjectDetail
  }
  if (navigationStore.isByRouteName(RouteName.QuestionnaireResultDetail)) {
    return RouteName.ProjectFromProgramDetail
  }
  return RouteName.ProjectResultDetail
}
const getRouteToProjectDetail = (): RouteLocationRaw => {
  return {
    name: getRouteName(),
    params: { projectSlug: props.project.slug },
    query: navigationStore.isCatalogProgramDetail() || navigationStore.isCatalogProjectDetail() ? undefined : navigationStore.query
  }
}
</script>
<style lang="scss" scoped>
.project-button-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
