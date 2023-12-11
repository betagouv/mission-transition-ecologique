<template>
  <div class="fr-grid-row fr-my-20v">
    <div v-if="image" class="fr-col fr-col-6 fr-col-offset-3">
      <img class="fr-responsive-img" :src="`${choices.publicPath}${image}`" :alt="`image / no-results`" />
    </div>
    <div v-if="message" class="fr-col fr-col-12">
      <p class="fr-text-center tee-text-no-result fr-mt-6v">
        {{ message[choices.lang] }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { choicesStore } from '../../stores/choices'
import type { Translations } from '@/types/index'

const choices = choicesStore()

interface Props {
  image?: string
  message?: Translations
}
defineProps<Props>()
</script>
