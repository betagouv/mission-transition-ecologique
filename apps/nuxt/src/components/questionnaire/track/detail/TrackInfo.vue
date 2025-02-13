<template>
  <div
    v-if="track?.info"
    class="fr-px-4v fr-px-md-0v fr-col-12"
  >
    <p class="fr-mb-2v">
      <span
        class="fr-icon-info-fill"
        aria-hidden="true"
      />
      {{ track.info[Translation.lang] }}
    </p>
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
