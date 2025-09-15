<template>
  <div class="fr-container--fluid fr-bg--blue--lightness">
    <div class="fr-container">
      <div class="fr-container fr-px-md-0">
        <h2 class="fr-text--blue-france fr-text-center fr-text-left-md fr-mt-5w fr-mb-2v">Elles l'ont fait !</h2>
        <p class="fr-text--blue-france fr-text-center fr-text-left-md">
          Ces entreprises sont passées à l'action et en récoltent déjà les bénéfices.
        </p>
      </div>
      <div class="fr-grid-row fr-grid-row--center fr-mt-4w">
        <div class="fr-col-md-10 fr-col-xl-10">
          <Testimony
            v-for="(testimony, index) in testimoniesToDisplay"
            :key="testimony.slug"
            :class="[index === testimoniesToDisplay.length - 1 ? 'fr-mb-md-3w fr-bg-sm--none' : 'fr-mb-6w']"
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
@use '@/assets/scss/setting';

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

.fr-quote {
  background-image: linear-gradient(0deg, setting.$blue, setting.$blue);
}
</style>
