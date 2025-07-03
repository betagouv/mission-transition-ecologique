<template>
  <div class="fr-container--fluid fr-bg--blue--lightness">
    <div class="fr-container--fluid fr-container-md">
      <div class="fr-container fr-px-md-0">
        <h2 class="fr-text--blue-france fr-text-center fr-text-left-md fr-pt-6v fr-mb-2v">Elles l'ont fait !</h2>
        <p class="fr-text--blue-france fr-text-center fr-text-left-md fr-mb-8v">
          Ces entreprises sont passées à l'action et en récoltent déjà les bénéfices.
        </p>
      </div>
      <div class="fr-grid-row fr-grid-row--center fr-py-4w">
        <div class="fr-col-md-10 fr-col-xl-10">
          <Testimony
            v-for="testimony in testimoniesToDisplay"
            :key="testimony.slug"
            class="fr-my-4v"
            :testimony="testimony"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { testimonies } from '@tee/data/static'

const testimoniesToDisplay = testimonies
  .filter((testimonie) => testimonie.homePageHighlight > 0)
  .sort((a, b) => a.homePageHighlight - b.homePageHighlight)
</script>

<style scoped lang="scss">
.green-tick {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
    border-top: 3px solid #1ebe8e;
    border-radius: 2px;
  }
}
</style>
