<template>
  <div :class="`fr-card fr-mx-md-0 fr-mx-2v themeCard fr-bg-xs--${option.color}--light`">
    <div class="fr-card__body fr-py-1v">
      <div class="fr-card__content fr-p-2v">
        <div class="fr-card__title">
          <div :class="`fr-p-0 fr-hidden-xs fr-my-2v fr-bg--${option.color} themeDivider`" />
          <div class="fr-h5 fr-mb-1v">{{ option.title }}</div>
        </div>
        <div class="themeProjectsTag fr-card__desc">
          <ThemeProjectTag
            v-for="projectId in option.highlightProjects"
            :key="projectId"
            :color="option.color"
            :projects="projects"
            :project-id="projectId"
          />
          <span>...</span>
        </div>
      </div>
    </div>
    <div :class="`fr-card__header fr-card__header--${option.color} fr-hidden-xs`">
      <div class="fr-card__img">
        <img
          class="fr-responsive-img"
          height="200px"
          :src="option.imgSrc"
          :alt="option.altImg"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Project } from '@tee/common/src/project/types'
import { ThemeObjective } from './ThemeSelect.vue'

interface Props {
  option: ThemeObjective
  projects: Project[]
}
defineProps<Props>()
</script>
<style scoped>
.themeDivider {
  height: 6px;
  width: 30%;
}
.themeProjectsTag {
  flex-direction: row-reverse;
}
.themeCard {
  height: 100%;
}
</style>
