<template>
  <div class="fr-grid-row fr-my-10v">
    <div class="fr-col fr-col-6 fr-col-offset-3">
      <img
        class="fr-responsive-img"
        src="/images/tracks/no-results.svg"
        :alt="`image / pas de résultat`"
      />
    </div>
    <div
      v-if="message"
      class="fr-col fr-col-12"
    >
      <p class="fr-text-center tee-text-no-result fr-mt-6v">
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
