<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links="allBreadcrumbs" />
  </div>
</template>
<script setup lang="ts">
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { RouteName } from '@/types/routeType'
import { type RouteLocationAsRelativeGeneric } from 'vue-router'
interface Props {
  links?: DsfrBreadcrumbProps['links']
}
const props = defineProps<Props>()
const navigationStore = useNavigationStore()
const usedTrackStore = useUsedTrackStore()
const isProgramCatalogDetail = navigationStore.isByRouteName(RouteName.CatalogProgramDetail)
const isProjectCatalogDetail = navigationStore.isByRouteName(RouteName.CatalogProjectDetail)
const isProjectFromProgramCatalog = navigationStore.isByRouteName(RouteName.CatalogProjectFromProgramDetail)
const isCatalogDetail = isProgramCatalogDetail || isProjectCatalogDetail

const getListText = () => {
  if (isProgramCatalogDetail || isProjectFromProgramCatalog) {
    return 'Liste des dispositifs'
  } else if (isProjectCatalogDetail) {
    return 'Liste des projets'
  } else {
    return 'Vos résultats'
  }
}
const getBaseRouteName = () => {
  if (isProgramCatalogDetail || isProjectFromProgramCatalog) {
    return RouteName.CatalogPrograms
  } else if (isProjectCatalogDetail) {
    return RouteName.CatalogProjects
  } else {
    return RouteName.QuestionnaireResult
  }
}

const routeToBaseList: RouteLocationAsRelativeGeneric = {
  name: getBaseRouteName(),
  query: isCatalogDetail || isProjectFromProgramCatalog ? undefined : navigationStore.query
}

const allBreadcrumbs = computed<DsfrBreadcrumbProps['links']>(() => {
  let baseLinks = [
    { text: 'Accueil', to: '/' },
    { text: getListText(), to: routeToBaseList }
  ]
  if (!isCatalogDetail && !isProjectFromProgramCatalog) {
    const trackId = usedTrackStore.getPreviousCompletedUsedTrackId()
    if (trackId) {
      baseLinks = baseLinks.toSpliced(1, 0, {
        text: 'Questionnaire',
        to: navigationStore.routeByTrackId(trackId)
      })
    } else {
      baseLinks = baseLinks.toSpliced(1, 0, {
        text: 'Questionnaire',
        to: '/questionnaire'
      })
    }
  }
  if (props.links) {
    return [...baseLinks, ...props.links]
  }
  return baseLinks
})
</script>
