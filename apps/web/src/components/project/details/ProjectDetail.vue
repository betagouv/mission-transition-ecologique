<template>
  <ProjectHeader
    v-if="project"
    :project="project"
    :theme-color="themeColor"
    :theme-title-color="themeTitleColor"
  />
  <div
    v-if="project"
    class="fr-col-12"
  >
    <div class="fr-container">
      <div class="fr-grid-row fr-pt-4v">
        <div class="fr-col-3 fr-col-sm-3 fr-hidden-xs">
          <TeeCopyLinkButton class="fr-m-4v" />
          <ProjectSideNav :project="project" />
        </div>
        <div class="fr-col-8 fr-col-xs-12 fr-col-sm-9">
          <DsfrAccordionsGroup>
            <ProjectDescription :project="project" />
            <ProjectPrograms
              v-if="project"
              :project="project"
            />
            <LinkedProjects
              v-if="project.linkedProjects.length > 0"
              :project="project"
              :color="themeColor"
            />
          </DsfrAccordionsGroup>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ThemeType, Project, Color } from '@/types'
import { Theme } from '@/utils/theme'
import { useProjectStore } from '@/stores/project'
import { computed, onBeforeMount } from 'vue'

const projectStore = useProjectStore()

const project = ref<Project>()
const theme = ref<ThemeType>()

interface Props {
  projectSlug: string
}
const props = defineProps<Props>()

const themeColor = computed<Color | undefined>(() => theme.value?.color)
const themeTitleColor = computed<Color | undefined>(() => theme.value?.titleColor)

onBeforeMount(async () => {
  if (props.projectSlug !== projectStore.currentProject?.slug) {
    await projectStore.getProjectBySlug(props.projectSlug)
  }

  project.value = projectStore.currentProject

  const objective = Theme.getObjectiveFromSelectedOrPriorityObjective()

  if (project.value) {
    const themeId = objective.value
      ? project.value?.themes.find((t) => Theme.getById(t) === Theme.getByValue(objective.value))
      : project.value?.mainTheme

    theme.value = Theme.getById(themeId)
  }
})
</script>
