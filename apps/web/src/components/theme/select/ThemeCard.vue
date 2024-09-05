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
          <TeeDsfrButton
            class="fr-h5 fr-mb-1v fr-hidden-xs fr-btn--tertiary-no-outline"
            size="sm"
            :label="option.title"
            @click="emit('selectTheme', option.value)"
          />
          <TeeDsfrButton
            class="fr-h2 fr-mb-1v fr-hidden-sm fr-btn--tertiary-no-outline"
            size="sm"
            :label="option.title"
            @click="emit('selectTheme', option.value)"
          />
        </div>
        <div class="fr-card__footer">
          <ul class="fr-tags-group">
            <ProjectButton
              v-for="project in option.highlightProjects"
              :key="project.id"
              :color="option.color"
              :project="project"
              size="sm"
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
      @click="emit('selectTheme', option.value)"
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
const emit = defineEmits(['selectTheme'])
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

.theme-card:active {
  box-shadow: 1px 2px 8px 2px rgb(0 0 0 / 10%);
}

.theme-card-title {
  height: 80px;

  @media (width >= 0) and (width <= 575px) {
    height: auto;
  }
}
</style>
