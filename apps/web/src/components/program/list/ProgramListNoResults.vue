<template>
  <div class="fr-grid-row fr-grid-row--center fr-my-10v">
    <div
      v-if="image"
      class="fr-col-5"
    >
      <img
        class="fr-responsive-img"
        :src="`${publicPath}${image}`"
        :alt="`image / no-results`"
      />
    </div>
    <div
      v-if="message"
      class="fr-col-8"
    >
      <p class="fr-text-center fr-h5 fr-text--blue-france fr-mt-6v">
        {{ message[Translation.lang] }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeNoResults > FUNCTION_NAME > MSG_OR_VALUE :`)

import Translation from '@/utils/translation'
import type { Translations } from '@/types'
import Config from '@/config'

const publicPath = Config.publicPath

interface Props {
  image?: string
  message?: Translations
}
defineProps<Props>()
</script>
