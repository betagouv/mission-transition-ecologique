<template>
  <div
    id="app"
    ref="trackElement"
    class="fr-container--fluid">
    <!-- HEADER -->
    <TeeHeader/>

    <!-- MATOMO -->
    <!-- <TeeMatomo
      :debug="debugBool"
      /> -->
    
    <!-- MAIN APP COMPONENT  -->
    <div
      style="min-height: auto">
      <TeeApp
      :seed="'track_needs'"
      :showHeaderBool="false"
      :showFooterBool="false"
      :noLocalMatomo="true"
      :locale="'fr'"
      />
    </div>

    <!-- INTRO / CTA -->
    <div
      class="fr-grid-row fr-grid-row-gutters fr-my-10v">
      <div class="fr-col fr-col-4 fr-p-8v fr-text-center">
        <h1>1</h1>
        <h3>
          Je renseigne mon profil avec mon SIRET
        </h3>
        <p>
          pour obtenir en quelques clics des résultats personnalisés 
          éligible dans votre secteur d’activité et géographique.
        </p>
      </div>
      <div class="fr-col fr-col-4 fr-p-8v fr-text-center">
        <h1>2</h1>
        <h3>
          Je réponds à quelques questions par thématique
        </h3>
        <p>
          En fonction de vos objectifs et des enjeux de votre entreprise : 
          bâtiment, mobilité, déchets, eau, énergie...
        </p>
      </div>
      <div class="fr-col fr-col-4 fr-p-8v fr-text-center">
        <h1>
          3
        </h1>
        <h3>
          J’accède aux dispositifs de soutien pour mon entreprise
        </h3>
        <p>
          Des propositions d’accompagnements et aides financières pour 
          financer vos projets issues 
          de l’ensemble des partenaires :
          ADEME, BPI, CCI et CMA !
        </p>
      </div>
    </div>
    <!-- FOOTER -->
    <div
      class="fr-mt-10v">
      <TeeAppFooter
        :stick-to-bottom="true"/>
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
import TeeAppFooter from './components/TeeAppFooter.vue'
</script>

<style lang="scss">
  @import '~@gouvfr/dsfr/dist/dsfr.min.css'; // ok
  @import '@public/css/custom.css';
  @import '~@gouvfr/dsfr/dist/utility/icons/icons.min.css'; // ok
</style>