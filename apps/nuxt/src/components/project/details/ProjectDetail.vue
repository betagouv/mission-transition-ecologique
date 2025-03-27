<template>
  <ProjectHeader
    v-if="project"
    :project="project"
    :theme-color="themeColor as Color"
  />
  <div
    v-if="project"
    id="externalLinksTracking"
    class="fr-col-12"
  >
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-3 fr-col-hidden fr-col-unhidden-md fr-mt-4v">
          <TeeCopyLinkButton class="fr-mx-4v" />
          <ProjectSideNav :project="project" />
        </div>
        <div class="fr-col-12 fr-col-md-9">
          <ProjectDescription :project="project" />
          <ProjectPrograms
            v-if="project"
            :project="project"
          />
          <LinkedProjects
            v-if="project.linkedProjects.length > 0"
            :project="project"
            :color="themeColor as Color"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Color, ThemeId } from '@/types'
import { MetaSeo } from '@/tools/metaSeo'
import { Theme } from '@/tools/theme'
import { useProjectStore } from '@/stores/project'
import { useExternalLinkTracker } from '@/tools/analytic/useExternalLinkTracker'
import Analytics from '@/tools/analytic/analytics'

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

Analytics.sendDetailPageView('project', project.value?.title)
useExternalLinkTracker('project')
</script>
