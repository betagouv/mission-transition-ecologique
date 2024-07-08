<template>
  <TeeEligibilityCriteriaBar
    :bg-color="Color.blueLightnessed"
    :bg-bar-color="Color.blueLighted"
    :previous-route="routeToProjects"
    message=""
    message-icon=""
  />
  <div class="fr-container--fluid fr-mb-4v backgroundProjectTitle">
    <img
      :src="project.image"
      :alt="`image / ${project.title}`"
    />
    <div :class="`fr-grid-row fr-grid-row--bottom fr-px-md-16v fr-gradient--${themeColor} projectTitleGradient`">
      <div class="fr-col-9 fr-col-sm-9 fr-col-xs-12 fr-col-offset-sm-3 fr-h1 fr-text-left fr-pb-8v projectTitle">
        {{ project.title }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Color, Project } from '@/types'
import { RouteName } from '@/types/routeType'
import { useNavigationStore } from '@/stores/navigation'

interface Props {
  project: Project
  themeColor: string
}
const props = defineProps<Props>()
const navigationStore = useNavigationStore()

const routeToProjects = {
  name: RouteName.QuestionnaireResult,
  hash: '#' + props.project.id,
  query: navigationStore.query
}
</script>

<style scoped>
.backgroundProjectTitle {
  position: relative;
  height: 400px;
}
.backgroundProjectTitle img {
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
}
.projectTitleGradient {
  height: 100%;
  position: relative;
}
.projectTitle {
  z-index: 100;
  padding: 0.75rem 1rem;
}
</style>
