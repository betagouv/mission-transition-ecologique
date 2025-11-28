<template>
  <DsfrButton
    class="fr-btn-fullwidth fr-btn-align-center"
    :label="option.label?.[Translation.lang]"
    size="large"
    style="font-weight: 700; min-height: 3.5rem; font-size: 1.5rem"
  />
</template>

<script setup lang="ts">
import { type TrackOptionsUnion } from '@/types'
import Translation from '@/tools/translation'
import type { DsfrButton } from '@gouvminint/vue-dsfr'

interface Props {
  option: TrackOptionsUnion
}
defineProps<Props>()
</script>
