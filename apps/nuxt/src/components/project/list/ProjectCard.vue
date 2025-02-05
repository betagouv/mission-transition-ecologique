<template>
  <DsfrCard
    :title="project.title"
    :description="project.shortDescription"
    :img-src="project.image"
    :alt-img="`image / ${project.title}`"
    :no-arrow="true"
    :link="getRouteToProjectDetail(project)"
    class="teste2e-project-target project-card"
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
    <template
      v-if="project.countEligiblePrograms"
      #end-details
    >
      <div class="fr-mb-8v">
        <DsfrBadge
          :label="eligibleProgramsTag"
          :no-icon="true"
          class="fr-bg--green--lightness fr-text--black"
        />
      </div>
    </template>
  </DsfrCard>
</template>

<script setup lang="ts">
import Navigation from '@/tools/navigation'
import { DsfrCard } from '@gouvminint/vue-dsfr'
import { ProjectType, RouteName, FilterItemKeys } from '@/types'
import type { RouteLocationRaw } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'
import { useFiltersStore } from '@/stores/filters'

interface Props {
  project: ProjectType
  isPriorityProject?: boolean
  isUniquePriority?: boolean
  priorityOrder?: number
}

const props = withDefaults(defineProps<Props>(), {
  isPriorityProject: false,
  priorityOrder: undefined
})
const priorityTag: string = 'A FAIRE EN PRIORITÉ'
const eligibleProgramsTag = computed(() => {
  return `${useFiltersStore().filters[FilterItemKeys.companyData] ? props.project.countEligiblePrograms : props.project.programs.length} AIDE${props.project.countEligiblePrograms > 1 ? 'S' : ''}`
})
const navigationStore = useNavigationStore()
const navigation = new Navigation()
const getRouteToProjectDetail = (project: ProjectType): RouteLocationRaw => {
  return {
    name: navigation.isCatalogProjects() || navigation.isHomepage() ? RouteName.CatalogProjectDetail : RouteName.ProjectResultDetail,
    params: { projectSlug: project.slug },
    query: navigationStore.query
  }
}
</script>
<style lang="scss" scoped>
:deep(.fr-card__title a) {
  color: black;
}
</style>
