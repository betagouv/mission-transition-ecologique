<template>
  <div
    :class="`fr-card fr-card-objective fr-mx-md-0 fr-mx-2v themeCard fr-bg-xs--${option.color}--light ${isSelected ? 'selectedCard' : ''} `"
  >
    <div class="fr-card__body fr-py-1v">
      <div class="fr-card__content fr-p-2v">
        <div class="fr-card__title">
          <div :class="`fr-p-0 fr-hidden-xs fr-my-2v fr-bg--${option.color} themeDivider`" />
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
            <span class="fr-m-auto fr-ml-0">...</span>
          </ul>
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
import { ThemeOption } from './ThemeSelect.vue'

interface Props {
  option: ThemeOption
  isSelected: boolean
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
.selectedCard {
  background-size: 100% 4px, 4px 100%, 4px 100%, 100% 4px !important;
}
</style>
