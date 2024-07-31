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
  resultHash?: string
}
const props = defineProps<Props>()
const navigationStore = useNavigationStore()
const usedTrackStore = useUsedTrackStore()
const isProgramCatalogDetail = navigationStore.isByRouteName(RouteName.CatalogProgramDetail)
const isProjectCatalogDetail = navigationStore.isByRouteName(RouteName.CatalogProjectDetail)
const isCatalogDetail = isProgramCatalogDetail || isProjectCatalogDetail

const getListText = () => {
  if (isProgramCatalogDetail) {
    return 'Liste des dispositifs'
  } else if (isProjectCatalogDetail) {
    return 'Liste des projets'
  } else {
    return 'Vos résultats'
  }
}
const getBaseRouteName = () => {
  if (isProgramCatalogDetail) {
    return RouteName.CatalogPrograms
  } else if (isProjectCatalogDetail) {
    return RouteName.CatalogProjects
  } else {
    return RouteName.QuestionnaireResult
  }
}

const routeToBaseList: RouteLocationAsRelativeGeneric = {
  name: getBaseRouteName(),
  hash: props.resultHash,
  query: isCatalogDetail ? undefined : navigationStore.query
}

const allBreadcrumbs = computed<DsfrBreadcrumbProps['links']>(() => {
  let baseLinks = [
    { text: 'Accueil', to: '/' },
    { text: getListText(), to: routeToBaseList }
  ]
  if (!isCatalogDetail) {
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
