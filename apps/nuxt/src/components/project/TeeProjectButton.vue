<template>
  <TeeButtonLink
    :id="project.slug"
    :to="getRouteToProjectDetail()"
    :size="size"
    :target="target"
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
  target?: string
  size?: 'sm' | 'md' | 'lg'
}
const props = withDefaults(defineProps<Props>(), {
  color: Color.green,
  size: 'md',
  target: ''
})

const navigationStore = useNavigationStore()

const getRouteToProjectDetail = (): RouteLocationRaw => {
  const slug = props.project.slug
  return {
    name: navigationStore.isCatalogDetail() ? RouteName.CatalogProjectDetail : RouteName.ProjectResultDetail,
    params: { projectSlug: slug },
    query: navigationStore.isCatalogDetail() ? undefined : navigationStore.query
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
