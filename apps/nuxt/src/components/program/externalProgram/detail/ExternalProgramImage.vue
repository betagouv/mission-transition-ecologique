<template>
  <img
    class="fr-responsive-img"
    :src="img(`/${currentProgram?.illustration || 'images/TEE_ampoule.webp'}`, { quality: 70, loading: 'lazy' })"
    :alt="`image / ${currentProgram?.titre}`"
  />

  <!-- PROGRAM TYPE -->
  <ul class="fr-badges-group fr-tee-program-detail-img-badge">
    <li class="fr-badge fr-badge--info fr-badge--no-icon">
      {{ currentProgram?.["nature de l'aide"] }}
    </li>
  </ul>
</template>
<script setup lang="ts">
import { Image } from '@/tools/image'

const { currentProgram } = storeToRefs(useProgramStore())

const img = Image.getUrl
</script>
