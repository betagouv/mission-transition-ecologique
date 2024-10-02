<template>
  <div class="fr-div-fixed-height">
    <DsfrButton
      class="fr-btn-fullwidth fr-btn-fixed-height fr-btn-sm-align-left fr-btn-grey"
      :class="{ 'fr-bg--grey--lightness': isActive }"
      :label="option.label?.[Translation.lang]"
      :icon="Button.getIcon(isActive, isCheckbox)"
      :secondary="!isActive"
    />
  </div>
</template>

<script setup lang="ts">
import { type TrackOptionsUnion } from '@/types'
import Button from '@/utils/button'
import Translation from '@/utils/translation'
import type { DsfrButton } from '@gouvminint/vue-dsfr'

interface Props {
  option: TrackOptionsUnion
  isActive: boolean
  isCheckbox: boolean
}
defineProps<Props>()
</script>
