<template>
  <div
    class="fr-card fr-mx-md-0 fr-mx-2v themeCard"
    :class="`fr-bg-xs--${option.color}--light`"
  >
    <div class="fr-card__body fr-py-1v">
      <div class="fr-card__content fr-p-2v">
        <div class="fr-card__title themeCardTitle">
          <div
            class="fr-p-0 fr-hidden-xs fr-my-2v themeDivider"
            :class="`fr-bg--${option.color}`"
          />
          <div class="fr-h5 fr-mb-1v">
            {{ option.title }}
          </div>
        </div>
        <div class="fr-card__desc">
          <ul class="fr-tags-group">
            <ThemeProjectTag
              v-for="project in option.highlightProjects"
              :key="project.id"
              :color="option.color"
              :project="project"
            />
            <span
              v-if="option.moreThanThree"
              class="fr-m-auto fr-ml-0"
              >...</span
            >
          </ul>
        </div>
      </div>
    </div>
    <div
      class="fr-hidden-xs fr-card__header"
      :class="`fr-card__header--${option.color}`"
    >
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
import { ThemeOption } from './ThemeSelect.vue'

interface Props {
  option: ThemeOption
}
defineProps<Props>()
</script>
<style scoped>
.themeDivider {
  height: 4px;
  width: 15%;
}
.themeCard {
  height: 100%;
}
.themeCard:hover {
  box-shadow: 1px 2px 8px 2px rgba(0, 0, 0, 0.1);
}
.themeCardTitle {
  height: 40%;
}
</style>
