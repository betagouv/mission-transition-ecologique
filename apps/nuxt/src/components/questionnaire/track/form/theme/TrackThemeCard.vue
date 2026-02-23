<template>
  <div
    tabindex="0"
    class="fr-card fr-mx-md-0 fr-mx-2v theme-card"
    :class="`fr-bg-xs--${option.color}--light`"
  >
    <div class="fr-card__body fr-py-1v">
      <div class="fr-card__content fr-p-2v">
        <div class="fr-card__title">
          <div
            class="fr-p-0 fr-hidden fr-unhidden-sm fr-my-2v theme-divider"
            :class="`fr-bg--${option.color}`"
          />
          <div
            class="fr-mb-1v"
            :class="Breakpoint.isMobile() ? 'fr-h2' : 'fr-h5'"
          >
            {{ option.title }}
          </div>
        </div>
        <div class="fr-card__desc fr-m-1v">
          <TeeProjectButton
            v-for="project in option.highlightProjects"
            :key="project.id"
            class="highlighted-project fr-mx-1v fr-my-1v inline-flex"
            :color="option.color"
            size="sm"
            :project="project"
          />
          <span
            v-if="option.moreThanThree"
            class="fr-m-auto fr-ml-0"
            >...</span
          >
        </div>
      </div>
    </div>
    <div
      class="fr-hidden fr-unhidden-sm fr-card__header"
      :class="`fr-bg--${option.color}--light`"
    >
      <div class="fr-card__img fr-card__img--contain fr-m-auto">
        <img
          class="fr-responsive-img"
          :src="option.imgSrc"
          :alt="option.altImg"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Breakpoint from '@/tools/breakpoints'
import { Color, ProjectType } from '@/types'

export interface TrackThemeOptionProps {
  value: string | undefined
  title: string
  imgSrc: string
  altImg: string
  highlightProjects: ProjectType[]
  color: Color
  moreThanThree: boolean
}

interface Props {
  option: TrackThemeOptionProps
}
defineProps<Props>()
</script>
<style scoped>
.theme-divider {
  height: 4px;
  width: 15%;
}

.highlighted-project {
  max-width: 90%;
}
</style>
