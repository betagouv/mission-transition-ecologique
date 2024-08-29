<template>
  <div class="fr-container">
    <DsfrBreadcrumb
      :links="allBreadcrumbs"
      class="fr-mb-1-5v"
    />
  </div>
</template>
<script setup lang="ts">
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { RouteName } from '@/types/routeType'
import { type RouteLocationRaw } from 'vue-router'
interface Props {
  links?: DsfrBreadcrumbProps['links']
}
const props = defineProps<Props>()
const navigationStore = useNavigationStore()
const usedTrackStore = useUsedTrackStore()

const isProgramCatalogDetail = navigationStore.isCatalogProgramDetail()
const isProjectCatalogDetail = navigationStore.isCatalogProjectDetail()
const isCatalogDetail = navigationStore.isCatalogDetail()

const isProgramCatalog = navigationStore.isCatalogPrograms()
const isProjectCatalog = navigationStore.isCatalogProjects()

const isInfoPage = navigationStore.isByRouteName([
  RouteName.Legal,
  RouteName.PersonalData,
  RouteName.Legal,
  RouteName.Accessibility,
  RouteName.Statistiques
])
const isQuestionnaire = navigationStore.isByRouteName([
  RouteName.QuestionnaireResult,
  RouteName.QuestionnaireResultDetail,
  RouteName.ProgramFromProjectDetail,
  RouteName.ProjectResultDetail
])
const getListText = () => {
  if (isProgramCatalogDetail || isProgramCatalog) {
    return 'Liste des dispositifs'
  } else if (isProjectCatalogDetail || isProjectCatalog) {
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

const routeToBaseList: RouteLocationRaw = {
  name: getBaseRouteName(),
  query: isCatalogDetail ? undefined : navigationStore.query
}

const allBreadcrumbs = computed(() => {
  let baseLinks: { text: string; to: RouteLocationRaw | string }[] = [{ text: 'Accueil', to: '/' }]
  if (!isInfoPage) {
    baseLinks.push({ text: getListText(), to: routeToBaseList })
  }
  if (isQuestionnaire) {
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
