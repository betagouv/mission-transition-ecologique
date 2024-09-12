<template>
  <div
    class="fr-card fr-mx-md-0 fr-mx-2v theme-card"
    :class="`fr-bg-xs--${option.color}--light`"
  >
    <div class="fr-card__body fr-py-1v">
      <div class="fr-card__content fr-p-2v">
        <div class="fr-card__title theme-card-title">
          <div
            class="fr-p-0 fr-hidden-xs fr-my-2v theme-divider"
            :class="`fr-bg--${option.color}`"
          />
          <div class="fr-h5 fr-mb-1v fr-hidden-xs">
            {{ option.title }}
          </div>
          <div class="fr-h2 fr-mb-1v fr-hidden-sm">
            {{ option.title }}
          </div>
        </div>
        <div class="fr-card__desc">
          <ul class="fr-tags-group">
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
          </ul>
        </div>
      </div>
    </div>
    <div
      class="fr-hidden-xs fr-card__header"
      :class="`fr-bg--${option.color}--light`"
    >
      <div class="fr-card__img fr-card__img--contain">
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
.theme-divider {
  height: 4px;
  width: 15%;
}

.theme-card {
  height: 100%;
}

.theme-card:hover {
  box-shadow: 1px 2px 8px 2px rgb(0 0 0 / 10%);
}

.theme-card-title {
  height: 80px;

  @media (width >= 0) and (width <= 575px) {
    height: auto;
  }
}

.highlighted-project {
  max-width: 90%;
}
</style>
