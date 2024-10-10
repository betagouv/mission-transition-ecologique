<template>
  <div class="fr-grid-row fr-grid-row--center fr-my-10v">
    <div class="fr-col-5">
      <img
        class="fr-responsive-img"
        src="/images/tracks/no-results.png"
        :alt="`image / pas de résultat`"
      />
    </div>
    <div
      v-if="message"
      class="fr-col-8"
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
