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
// @ts-ignore
// import WidgetApp from '../../WidgetApp.ce.vue'
// @ts-ignore
import TeeCta from '@/components/home/TeeCta.vue'
// @ts-ignore
import TeeHomeSteps from '@/components/home/TeeHomeSteps.vue'
// @ts-ignore
import TeeHomeInfos from '@/components/home/TeeHomeInfos.vue'
</script>
