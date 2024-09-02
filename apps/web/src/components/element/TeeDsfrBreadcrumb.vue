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
import { RouteName } from '@/types/routeType'
import { type RouteLocationRaw } from 'vue-router'
interface Props {
  links?: DsfrBreadcrumbProps['links']
}
const props = defineProps<Props>()
const navigationStore = useNavigationStore()
const usedTrackStore = useUsedTrackStore()

const getListText = () => {
  if (navigationStore.isCatalog()) {
    return 'Liste des ' + (navigationStore.isCatalogAboutPrograms() ? 'dispositifs' : 'projets')
  } else {
    return 'Vos résultats'
  }
}
const getBaseRouteName = () => {
  if (navigationStore.isCatalogProgramDetail()) {
    return RouteName.CatalogPrograms
  } else if (navigationStore.isCatalogProjectDetail()) {
    return RouteName.CatalogProjects
  } else {
    return RouteName.QuestionnaireResult
  }
}

const routeToBaseList: RouteLocationRaw = {
  name: getBaseRouteName(),
  query: navigationStore.isCatalogDetail() ? undefined : navigationStore.query
}

const breadcrumbs = computed(() => {
  let baseLinks: { text: string; to: RouteLocationRaw | string }[] = [{ text: 'Accueil', to: '/' }]
  if (!navigationStore.isStaticPage()) {
    baseLinks.push({ text: getListText(), to: routeToBaseList })
  }
  if (navigationStore.isQuestionnaire()) {
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
