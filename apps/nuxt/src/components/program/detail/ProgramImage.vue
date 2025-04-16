<template>
  <NuxtImg
    class="fr-responsive-img"
    :src="`/${currentProgram?.illustration}`"
    quality="70"
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
const { currentProgram } = storeToRefs(useProgramStore())
</script>
