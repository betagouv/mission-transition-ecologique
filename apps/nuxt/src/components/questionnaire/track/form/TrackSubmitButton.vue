<template>
  <div class="fr-col-6 fr-col-md-5 fr-col-lg-4 fr-col-xl-3">
    <DsfrButton
      class="fr-btn-fullwidth fr-btn-sm-fullwidth"
      :label="Translation.t('previous')"
      icon="fr-icon-arrow-left-line"
      secondary
      @click="previous"
    />
  </div>
  <!-- BTN NEXT -->
  <div class="fr-col-6 fr-col-md-5 fr-col-lg-4 fr-col-xl-3">
    <DsfrButton
      v-if="showNextButton"
      class="fr-btn-fullwidth fr-btn-sm-fullwidth fr-col-justify--right"
      :label="Translation.t('next')"
      :disabled="selectedOptions.length === 0"
      icon="fr-icon-arrow-right-line"
      icon-right
      @click="next"
    />
  </div>
</template>

<script setup lang="ts">
import type { TrackOptionsUnion } from '@/types'
import Translation from '@/tools/translation'
import type { DsfrButton } from '@gouvminint/vue-dsfr'

interface Props {
  selectedOptions: TrackOptionsUnion[]
  showNextButton: boolean
}
defineProps<Props>()

const emit = defineEmits<{
  previous: []
  next: []
}>()

function previous() {
  emit('previous')
}

function next() {
  emit('next')
}
</script>
