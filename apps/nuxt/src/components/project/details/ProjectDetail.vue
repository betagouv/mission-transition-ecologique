<template>
  <Layout
    :links="links"
    sticky-menu
  >
    <template #top>
      <ProjectHeader
        v-if="project"
        :project="project"
        :theme-color="themeColor as Color"
      />
    </template>
    <template #sidemenu>
      <TeeCopyLinkButton class="fr-mt-6v" />
      <ProjectSideNav :project="project" />
    </template>
    <div id="externalLinksTracking">
      <ProjectDescription :project="project" />
    </div>
    <ProjectPrograms
      v-if="project"
      :project="project"
    />
    <ProjectTestimonies :project="project" />
    <LinkedProjects
      v-if="project?.linkedProjects.length"
      :project="project"
      :color="themeColor as Color"
    />
  </Layout>
</template>
<script setup lang="ts">
import Navigation from '@/tools/navigation'
import { Color, RouteName, ThemeId } from '@/types'
import { MetaSeo } from '@/tools/metaSeo'
import { Theme } from '@/tools/theme'
import { useProjectStore } from '@/stores/project'
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import { useExternalLinkTracker } from '@/tools/analytic/useExternalLinkTracker'
import Analytics from '@/tools/analytic/analytics'

const { currentProject: project } = storeToRefs(useProjectStore())
const navigation = new Navigation()

const themeColor = ref<Color | ''>()

useSeoMeta(MetaSeo.get(project.value?.title, project.value?.shortDescription))
useSchemaOrg(defineWebPage({ description: project.value?.shortDescription }))

if (project.value) {
  useHead({
    link: [
      {
        rel: 'canonical',
        href: navigation.getHrefByRouteName(RouteName.CatalogProjectDetail, {
          projectSlug: project.value.slug
        })
      }
    ]
  })
}

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

if (project.value) {
  const selectedThemeId = Theme.getThemeFromSelectedOrPriorityTheme()
  const themeId = project.value?.themes.find((theme) => theme === selectedThemeId.value) || project.value?.mainTheme
  themeColor.value = Theme.getColorById(themeId as ThemeId)
}

const links = computed<DsfrBreadcrumbProps['links']>(() => [{ text: project.value?.title || '' }])

Analytics.sendDetailPageView('project', project.value?.title)
useExternalLinkTracker('project')
</script>
