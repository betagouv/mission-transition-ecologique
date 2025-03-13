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
    <ProjectDescription
      id="externalLinksTracking"
      :project="project"
    />
    <ProjectPrograms
      v-if="project"
      :project="project"
    />
    <LinkedProjects
      v-if="project?.linkedProjects.length"
      :project="project"
      :color="themeColor as Color"
    />
  </Layout>
</template>
<script setup lang="ts">
import { Color, ThemeId } from '@/types'
import { MetaSeo } from '@/tools/metaSeo'
import { Theme } from '@/tools/theme'
import { useProjectStore } from '@/stores/project'
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import { useExternalLinkTracker } from '@/tools/analytic/useExternalLinkTracker'
import Analytics from '@/tools/analytic/analytics'
import { CompanyData } from '@/tools/companyData'

const { currentProject: project } = storeToRefs(useProjectStore())
const themeColor = ref<Color | ''>()

useExternalLinkTracker('project_external_link_clicked')
useSeoMeta(MetaSeo.get(project.value?.title, project.value?.shortDescription, project.value?.image))

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

if (project.value) {
  const selectedThemeId = Theme.getThemeFromSelectedOrPriorityTheme()
  const themeId = project.value?.themes.find((theme) => theme === selectedThemeId.value) || project.value?.mainTheme
  themeColor.value = Theme.getColorById(themeId as ThemeId)
}

const links = computed<DsfrBreadcrumbProps['links']>(() => [{ text: project.value?.title || '' }])

if (import.meta.client) {
  Analytics.sendEvent('detail_page_view', 'detail_page_view', {
    type: 'project',
    title: project.value?.title,
    url: window.location.href,
    company: CompanyData.toString()
  })
}
</script>
