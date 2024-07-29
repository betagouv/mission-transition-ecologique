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
import { type RouteLocationAsRelativeGeneric } from 'vue-router'
interface Props {
  links?: DsfrBreadcrumbProps['links']
  resultHash?: string
}
const props = defineProps<Props>()
const navigationStore = useNavigationStore()
const usedTrackStore = useUsedTrackStore()
const isCatalogDetail = navigationStore.isByRouteName(RouteName.CatalogDetail)

const routeToResults: RouteLocationAsRelativeGeneric = {
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
