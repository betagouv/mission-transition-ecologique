<template>
  <div
    ref="trackElement"
    id="app">
    <!-- HEADER -->
    <TeeHeader/>

    <!-- MATOMO -->
    <!-- <TeeMatomo
      :debug="debugBool"
      /> -->
    
    <!-- MAIN APP COMPONENT  -->
    <!-- <div 
      class="fr-container--fluid fr-py"
      style="background-color: #E8EDFF;"> -->
      <div
        class="fr-container--fluid"
        style="min-height: auto">
        <TeeApp
          :seed="'track_needs'"
          :showHeaderBool="false"
          :showFooterBool="false"
          :noLocalMatomo="true"
          :locale="'fr'"
        />
      </div>
    <!-- </div> -->

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

    <!-- MAIN APP COMPONENT  -->
    <!-- <div
      style="min-height: auto">
      <TeeApp
      :seed="'track_results'"
      :showHeaderBool="false"
      :showFooterBool="false"
      :noLocalMatomo="true"
      :locale="'fr'"
      />
    </div> -->

    <!-- FOOTER -->
    <div
      class="fr-mt-0v">
      <TeeAppFooter
        :stick-to-bottom="false"/>
    </div>
  </div>
</template>

<script setup lang="ts">
// cf : https://github.com/betagouv/transition-ecologique-entreprises-widget/commit/845f2cd7c31b16aa7bbeecf8533a9d72bb557c38#diff-11f3012b2f722ad4a8671a5c6dbb44f832deb7b4064388325f824ac0e958837c

// @ts-ignore
import TeeHeader from './components/TeeHeader.vue'
// @ts-ignore
// import TeeMatomo from './components/TeeMatomo.vue'
// @ts-ignore
import TeeApp from './TeeApp.ce.vue'
// @ts-ignore
import TeeHomeSteps from './components/home/TeeHomeSteps.vue'
// @ts-ignore
import TeeHomeElectric from './components/home/TeeHomeElectric.vue'
// @ts-ignore
import TeeHomeBuilding from './components/home/TeeHomeBuilding.vue'
// @ts-ignore
import TeeHomeMobility from './components/home/TeeHomeMobility.vue'
// @ts-ignore
import TeeHomeWater from './components/home/TeeHomeWater.vue'
// @ts-ignore
import TeeAppFooter from './components/TeeAppFooter.vue'
</script>

<style lang="scss">
  @import '~@gouvfr/dsfr/dist/dsfr.min.css'; // ok
  @import '@public/css/custom.css';
  @import '~@gouvfr/dsfr/dist/utility/icons/icons.min.css'; // ok
</style>