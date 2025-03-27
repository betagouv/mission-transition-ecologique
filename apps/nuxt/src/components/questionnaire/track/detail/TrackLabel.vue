<template>
  <div
    v-if="track?.label"
    class="fr-col-12 fr-pb-2v fr-mt-6v"
  >
    <h3 :class="`${track?.info ? 'fr-mb-0' : 'fr-mb-2v'}`">
      {{ track.label[Translation.lang] }}
    </h3>
  </div>
</template>

<script setup lang="ts">
import type { Track } from '@/types'
import Translation from '@/tools/translation'

interface Props {
  track: Track
}
defineProps<Props>()
</script>
