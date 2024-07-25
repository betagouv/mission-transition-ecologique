<template>
  <DsfrBreadcrumb
    class="fr-pl-10v"
    :links="allBreadcrumbs"
  />
</template>
<script setup lang="ts">
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { RouteName } from '@/types/routeType'
import type { RouteLocationRaw } from 'vue-router'

interface Props {
  links?: DsfrBreadcrumbProps['links']
  resultHash?: string
}
const props = defineProps<Props>()
const navigationStore = useNavigationStore()
const usedTrackStore = useUsedTrackStore()
const isCatalogDetail = navigationStore.isByRouteName(RouteName.CatalogDetail)

const questionnaireRoute = computed<RouteLocationRaw>(() => {
  const trackId = usedTrackStore.getPreviousCompletedUsedTrackId()
  if (trackId) {
    return navigationStore.routeByTrackId(trackId)
  }
  return '/questionnaire'
})

const routeToResults = {
  name: isCatalogDetail ? RouteName.Catalog : RouteName.QuestionnaireResult,
  hash: '#' + props.resultHash,
  query: isCatalogDetail ? undefined : navigationStore.query
}
const allBreadcrumbs = computed<DsfrBreadcrumbProps['links']>(() => {
  let baseLinks = [
    { text: 'Accueil', to: '/' },
    { text: 'Vos résultats', to: routeToResults }
  ]
  if (!isCatalogDetail) {
    baseLinks = baseLinks.toSpliced(1, 0, { text: 'Questionnaire', to: questionnaireRoute.value })
  }
  if (props.links) {
    return [...baseLinks, ...props.links]
  }
  return baseLinks
})
</script>
