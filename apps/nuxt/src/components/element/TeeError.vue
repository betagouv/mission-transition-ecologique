<template>
  <div class="fr-text-center">
    <p class="fr-text--deep-red fr-text--md fr-m-0 fr-mb-3v">
      <span
        class="fr-icon-close-circle-fill fr-icon--lg"
        aria-hidden="true"
      />
    </p>
    <h4 class="fr-text--deep-red fr-text--lg fr-m-0">
      {{ Translation.t(`form.sorryError`) }}
    </h4>
    <slot />
    <h6 class="fr-text--blue-900 fr-text--lg fr-mt-15v fr-mb-3v">
      {{ Translation.t('form.nowWhat') }}
    </h6>
    <p class="fr-text--blue-900 fr-mb-15v">
      <span v-html="Translation.t('form.errorMsg', { mailto: mailto, email: email })" />
    </p>
  </div>
</template>

<script setup lang="ts">
import Translation from '@/tools/translation'

interface Props {
  mailto: string
  email: string
}
defineProps<Props>()
</script>
