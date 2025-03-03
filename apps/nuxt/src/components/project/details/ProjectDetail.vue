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
      <TeeCopyLinkButton class="fr-m-4v" />
      <ProjectSideNav :project="project" />
    </template>
    <ProjectDescription :project="project" />
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

const { currentProject: project } = storeToRefs(useProjectStore())
const themeColor = ref<Color | ''>()

useSeoMeta(MetaSeo.get(project.value?.title, project.value?.shortDescription, project.value?.image))

if (project.value) {
  const selectedThemeId = Theme.getThemeFromSelectedOrPriorityTheme()
  const themeId = project.value?.themes.find((theme) => theme === selectedThemeId.value) || project.value?.mainTheme
  themeColor.value = Theme.getColorById(themeId as ThemeId)
}

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

const links = computed<DsfrBreadcrumbProps['links']>(() => [{ text: project.value?.title || '' }])
</script>
