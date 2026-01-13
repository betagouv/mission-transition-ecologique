<template>
  <div class="fr-grid-row fr-grid-row--center fr-my-md-10v">
    <div class="fr-col-5 fr-col-sm-12">
      <img
        class="fr-responsive-img no-result-img"
        loading="lazy"
        src="/images/tracks/no-results.png"
        alt="pas de résultat"
      />
    </div>
    <div
      v-if="message"
      class="fr-px-4v"
      :class="ctaLabel ? 'fr-col-12 fr-col-md-10' : 'fr-col-12 fr-col-md-5'"
    >
      <p class="fr-text-center fr-h5 fr-text--blue-900 fr-mt-6v">
        {{ message }}
      </p>
    </div>
    <TeeDsfrButton
      v-if="ctaLabel"
      :label="ctaLabel"
      @click="emit('cta-click')"
    />
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeNoResults > FUNCTION_NAME > MSG_OR_VALUE :`)

interface Props {
  message?: string
  ctaLabel?: string
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'cta-click'): void
}>()
</script>
<style lang="scss" scoped>
.no-result-img {
  max-height: 200px;
  object-fit: contain;
}
</style>
