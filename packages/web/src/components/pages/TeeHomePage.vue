<template>
  <!-- MAIN APP COMPONENT  --> 
  <div 
    class="fr-container--fluid"
    style="background-color: #E8EDFF;">
    <div
      class="fr-container fr-py-20v">
      <TeeCta/>
    </div>
  </div>


  <!-- INTRO / CTA -->
  <div class="fr-container fr-my-5v">
    <TeeHomeSteps/>
  </div>

  <!-- INTRO / INFOS -->
  <div 
    class="fr-container--fluid"
    style="background-color: #E8EDFF;">
    <div
      class="fr-container fr-py-20v fr-px-20v">
      <TeeHomeInfos/>
    </div>
  </div>
</template>

<script setup lang="ts">

// @ts-ignore
// import WidgetApp from '../../WidgetApp.ce.vue'
// @ts-ignore
import TeeCta from '../home/TeeCta.vue'
// @ts-ignore
import TeeHomeSteps from '../home/TeeHomeSteps.vue'
// @ts-ignore
import TeeHomeInfos from '../home/TeeHomeInfos.vue'

</script>