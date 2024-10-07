<template>
  <div class="fr-grid-row fr-grid-row--center fr-my-md-10v">
    <div class="fr-col-5 fr-col-md-12">
      <img
        class="fr-responsive-img no-result-img"
        src="/images/tracks/no-results.png"
        :alt="`image / pas de résultat`"
      />
    </div>
    <div
      v-if="message"
      class="fr-col-12 fr-col-md-5 fr-px-md-4v"
    >
      <p class="fr-text-center fr-h5 fr-text--blue-france fr-mt-6v">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeNoResults > FUNCTION_NAME > MSG_OR_VALUE :`)

interface Props {
  message?: string
}
defineProps<Props>()
</script>
<style lang="scss" scoped>
.no-result-img {
  max-height: 200px;
  object-fit: contain;
}
</style>
