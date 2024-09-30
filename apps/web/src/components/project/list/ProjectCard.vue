<template>
  <DsfrCard
    :title="project.title"
    :description="project.shortDescription"
    :img-src="project.image"
    :alt-img="`image / ${project.title}`"
    :no-arrow="true"
    :link="getRouteToProjectDetail(project)"
    class="teste2e-project-target"
  >
    <template
      v-if="isPriorityProject"
      #start-details
    >
      <div
        v-if="!isUniquePriority"
        class="fr-card__header--priority fr-hidden fr-unhidden-lg"
      >
        {{ priorityOrder }}
      </div>
      <div class="fr-mb-1v">
        <DsfrBadge
          :label="priorityTag"
          :no-icon="true"
          class="fr-badge--success"
        />
      </div>
    </template>
  </DsfrCard>
</template>

<script setup lang="ts">
import { DsfrCard } from '@gouvminint/vue-dsfr'
import { Project, RouteName } from '@/types'
import type { RouteLocationRaw } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'

interface Props {
  project: Project
  isPriorityProject?: boolean
  isUniquePriority?: boolean
  priorityOrder?: number
}

withDefaults(defineProps<Props>(), {
  isPriorityProject: false,
  priorityOrder: undefined
})

const priorityTag: string = 'A FAIRE EN PRIORITÉ'

const navigationStore = useNavigationStore()

const isCatalog = navigationStore.isCatalogProjects()

const getRouteToProjectDetail = (project: Project): RouteLocationRaw => {
  return {
    name: isCatalog ? RouteName.CatalogProjectDetail : RouteName.ProjectResultDetail,
    params: { projectSlug: project.slug },
    query: isCatalog ? undefined : navigationStore.query
  }
}
</script>
<style lang="scss" scoped>
:deep(.fr-card__title a) {
  color: black;
}
</style>
