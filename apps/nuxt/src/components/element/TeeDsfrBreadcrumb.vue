<template>
  <div class="fr-container">
    <DsfrBreadcrumb
      :links="breadcrumbs"
      class="fr-mb-1-5v"
    />
  </div>
</template>
<script setup lang="ts">
import Navigation from '@/tools/navigation'
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { TrackId } from '@/types'
import { RouteName } from '@/types/routeType'
import { type RouteLocationAsRelativeGeneric, type RouteLocationRaw, RouteParamsGeneric } from 'vue-router'
import { defineBreadcrumb, useSchemaOrg } from '@unhead/schema-org/vue'

export interface TeeDsfrBreadcrumbProps {
  links?: DsfrBreadcrumbProps['links']
}
const props = defineProps<TeeDsfrBreadcrumbProps>()
const navigationStore = useNavigationStore()
const usedTrackStore = useUsedTrackStore()
const navigation = new Navigation()

const getListName = () => {
  if (navigation.isProgramFromProject() || navigation.isCatalogAboutProjects()) {
    return 'projets'
  }
  return 'dispositifs'
}

const getListText = () => {
  if (navigation.isCatalog()) {
    return 'Liste des ' + getListName()
  } else {
    return 'Vos résultats'
  }
}
const getBaseRouteName = () => {
  switch (true) {
    case navigation.isCatalogAboutProjects():
    case navigation.isByRouteName(RouteName.CatalogProgramFromCatalogProjectDetail):
      return RouteName.CatalogProjects
    case navigation.isByRouteName(RouteName.CatalogProgramDetail):
      return RouteName.CatalogPrograms
    case navigation.isQuestionnaireResultDetail():
      return RouteName.QuestionnaireResult
    default:
      return navigation.isCatalog() ? RouteName.CatalogPrograms : RouteName.QuestionnaireStart
  }
}

const routeToBaseList: RouteLocationRaw = {
  name: getBaseRouteName(),
  query: navigation.isCatalogDetail() ? undefined : navigationStore.query
}

const breadcrumbs = computed(() => {
  const baseLinks: { text: string; to: RouteLocationAsRelativeGeneric }[] = [{ text: 'Accueil', to: { name: RouteName.Homepage } }]
  if (!navigation.isStaticPage()) {
    baseLinks.push({ text: getListText(), to: routeToBaseList })
  }
  if (navigation.isQuestionnaire()) {
    const trackId = usedTrackStore.getPreviousCompletedUsedTrackId()
    baseLinks.splice(1, 0, {
      text: 'Questionnaire',
      to: navigationStore.routeByTrackId(trackId || TrackId.Siret)
    })
  }
  if (props.links) {
    return [...baseLinks, ...props.links]
  }
  return baseLinks
})

useSchemaOrg(
  defineBreadcrumb({
    itemListElement: defineBreadcrumbItemList()
  })
)

function defineBreadcrumbItemList() {
  const itemListElement = []
  for (const [breadcrumbIndex, breadcrumb] of breadcrumbs.value.entries()) {
    const to = breadcrumb.to as RouteLocationAsRelativeGeneric | undefined

    if (!to || breadcrumbIndex === breadcrumbs.value.length - 1) {
      itemListElement.push({ name: breadcrumb.text })
    } else {
      const params = to.params as RouteParamsGeneric | undefined

      if (to.name) {
        itemListElement.push({
          name: breadcrumb.text,
          item: navigation.getHrefByRouteName(to.name as RouteName, params)
        })
      }
    }
  }

  return itemListElement
}
</script>
