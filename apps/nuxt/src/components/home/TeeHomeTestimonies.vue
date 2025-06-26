<template>
  <div class="fr-container--fluid fr-bg--blue--lightness">
    <div class="fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-py-4w">
        <div class="fr-col-md-3 fr-col-xl-2 fr-pr-2v">
          <h2 class="fr-mt-3w">Elles l'ont fait !</h2>
          <p class="green-tick fr-pt-3w">Ces entreprises sont passées à l'action et en récoltent déjà les bénéfices.</p>
        </div>
        <div class="fr-col-md-9 fr-col-xl-10">
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
