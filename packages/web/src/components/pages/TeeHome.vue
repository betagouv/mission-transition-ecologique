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
      <TeeHomeElectric/>
      <TeeHomeBuilding/>
      <TeeHomeMobility/>
      <TeeHomeWater/>
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
import TeeHomeElectric from '../home/TeeHomeElectric.vue'
// @ts-ignore
import TeeHomeBuilding from '../home/TeeHomeBuilding.vue'
// @ts-ignore
import TeeHomeMobility from '../home/TeeHomeMobility.vue'
// @ts-ignore
import TeeHomeWater from '../home/TeeHomeWater.vue'

</script>