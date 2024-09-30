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
      :class="`fr-card__header--${option.color}`"
    >
      <div class="fr-card__img fr-card__img--contain fr-m-auto">
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
import { ThemeOption } from './ThemeSelect.vue'
import Breakpoint from '@/utils/breakpoints'

interface Props {
  option: ThemeOption
}
defineProps<Props>()
</script>
<style scoped>
.theme-divider {
  height: 4px;
  width: 15%;
}

.theme-card:hover,
.theme-card:active,
.highlighted-project:active {
  box-shadow: 1px 2px 8px 2px rgb(0 0 0 / 10%);
}

.highlighted-project {
  max-width: 90%;
}
</style>
