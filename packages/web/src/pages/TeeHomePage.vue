<template>
  <!-- MAIN APP COMPONENT  -->
  <div class="fr-container--fluid" style="background-color: #e8edff">
    <div class="fr-container fr-py-2v">
      <TeeCta />
    </div>
  </div>

  <!-- INTRO / CTA -->
  <div class="fr-container fr-my-5v">
    <TeeHomeSteps />
  </div>

  <!-- INTRO / INFOS -->
  <div class="fr-container--fluid" style="background-color: #e8edff">
    <div class="fr-container fr-py-20v fr-px-20v">
      <TeeHomeInfos />
    </div>
  </div>
</template>

<script setup lang="ts">
import TeeCta from '@/components/home/TeeCta.vue'
import TeeHomeSteps from '@/components/home/TeeHomeSteps.vue'
import TeeHomeInfos from '@/components/home/TeeHomeInfos.vue'
</script>
