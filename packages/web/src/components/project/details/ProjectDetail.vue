<template>
  <ProjectHeader
    class="fr-col-12"
    :project-title="projectTitle"
    :project-img="projectImg"
    :color="theme?.color"
  />
  <div class="fr-col-12 fr-container--fluid">
    <div class="fr-grid-row fr-pt-4v">
      <div class="fr-col-3 fr-col-sm-3 fr-hidden-xs">
        <DsfrButton
          label="Copier le lien"
          size="sm"
          class="fr-m-4v fr-radius-a--2v"
          icon="fr-icon-link"
          @click="copyUrl"
        />
        <ProjectSideNav />
      </div>
      <div class="fr-col-8 fr-col-xs-12 fr-col-sm-9">
        <ProjectDescription
          :project-description="projectDescription"
          :project-more-description="projectMoreDescription"
        />
        <ProjectPrograms :objective="themeObjective" />
        <div
          id="project-contact"
          ref="TeeProjectFormContainer"
          class="fr-tee-form-block fr-tee-form-container"
        >
          <ProjectForm
            v-if="project"
            :project="project"
            :form-container-ref="TeeProjectFormContainer"
          />
        </div>
        <hr class="divider fr-my-2v" />
        <LinkedProjects
          v-if="relatedProjects.length > 0"
          id="project-linked-projects"
          :related-projects="relatedProjects"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Project, ProjectId } from '@tee/common/src/project/types'
import { projects } from '@tee/common/src/project/mockData'
import { Theme as ThemeType } from '@/types'
import Theme from '@tee/common/src/theme/theme'
import { DsfrButton } from '@gouvminint/vue-dsfr'
interface Props {
  projectId: string
}
const props = defineProps<Props>()
const getProjectById = (id: string | ProjectId) => {
  return projects.find((project: Project) => project.id === Number(id))
}
const copyUrl = async () => {
  const pageUrl = window.location.href
  await navigator.clipboard.writeText(pageUrl)
}
const project = ref<Project>()
const theme = ref<ThemeType>()
const relatedProjects = ref()
const projectTitle = computed(() => project.value?.title)
const projectImg = computed(() => project.value?.image)
const projectDescription = computed(() => project.value?.longDescription)
const projectMoreDescription = computed(() => project.value?.moreDescription)
const TeeProjectFormContainer = ref<HTMLElement | null | undefined>(null)
const themeObjective = computed(() => theme.value?.value)

onBeforeMount(() => {
  const selectedProject = getProjectById(props.projectId)
  if (selectedProject) {
    project.value = selectedProject
  }
  const themeProject = Theme.getById(project.value?.mainTheme)
  if (themeProject) {
    theme.value = Theme.getById(project.value?.mainTheme)
  }
  relatedProjects.value = project.value?.linkedProjects.map((projectId: ProjectId) => getProjectById(projectId))
  console.log('project', project, theme)
})
</script>
<style scoped>
.divider {
  border-top: 1px solid #ccc;
}
</style>
