<template>
  <!-- MAIN APP COMPONENT  -->
  <div class="fr-container--fluid fr-bg--blue-france--lightness">
    <div class="fr-container fr-py-2v">
      <TeeCta />
    </div>
  </div>

  <!-- INTRO / CTA -->
  <div class="fr-container fr-my-5v">
    <TeeHomeSteps />
  </div>

  <!-- INTRO / INFOS -->
  <div class="fr-container--fluid fr-bg--blue-france--lightness">
    <div class="fr-container fr-pt-10v fr-pb-20v fr-px-0 fr-px-md-20v">
      <TeeHomeInfos />
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeHomePage > FUNCTION_NAME > MSG_OR_VALUE :`)

import TeeCta from '@/components/home/TeeCta.vue'
import TeeHomeSteps from '@/components/home/TeeHomeSteps.vue'
import TeeHomeInfos from '@/components/home/TeeHomeInfos.vue'
</script>
