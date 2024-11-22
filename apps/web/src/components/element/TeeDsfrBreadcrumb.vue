<template>
  <div class="fr-container">
    <DsfrBreadcrumb
      :links="breadcrumbs"
      class="fr-mb-1-5v"
    />
  </div>
</template>
<script setup lang="ts">
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { TrackId } from '@/types'
import { RouteName } from '@/types/routeType'
import { type RouteLocationRaw } from 'vue-router'
interface Props {
  links?: DsfrBreadcrumbProps['links']
}
const props = defineProps<Props>()
const navigationStore = useNavigationStore()
const usedTrackStore = useUsedTrackStore()

const getListName = () => {
  if (navigationStore.isProgramFromProject() || navigationStore.isCatalogAboutProjects()) {
    return 'projets'
  }
  return 'dispositifs'
}

const getListText = () => {
  if (navigationStore.isCatalog()) {
    return 'Liste des ' + getListName()
  } else {
    return 'Vos résultats'
  }
}
const getBaseRouteName = () => {
  switch (true) {
    case navigationStore.isCatalogAboutProjects():
      return RouteName.CatalogProjects
    case navigationStore.isCatalogAboutPrograms():
      return RouteName.CatalogPrograms
    case navigationStore.isProgramFromProject():
    default:
      return RouteName.QuestionnaireResult
  }
}

const routeToBaseList: RouteLocationRaw = {
  name: getBaseRouteName(),
  query: navigationStore.isCatalogDetail() ? undefined : navigationStore.query
}

const breadcrumbs = computed(() => {
  const baseLinks: { text: string; to: RouteLocationRaw }[] = [{ text: 'Accueil', to: { name: RouteName.Homepage } }]
  if (!navigationStore.isStaticPage()) {
    baseLinks.push({ text: getListText(), to: routeToBaseList })
  }
  if (navigationStore.isQuestionnaire()) {
    const trackId = usedTrackStore.getPreviousCompletedUsedTrackId()
    baseLinks.splice(1, 0, {
      text: 'Questionnaire',
      to: navigationStore.routeByTrackId(trackId || TrackId.QuestionnaireRoute)
    })
  }
  if (props.links) {
    return [...baseLinks, ...props.links]
  }
  return baseLinks
})
</script>
