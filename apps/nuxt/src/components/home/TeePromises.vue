<script setup lang="ts">
import { partners, otherPartner } from '@/tools/operator'
</script>

<template>
  <div class="fr-container fr-hidden fr-unhidden-sm">
    <div class="fr-grid-row fr-grid-row--center fr-py-8v">
      <div class="fr-col-12 fr-col-md-5 fr-text-center fr-position--relative fr-mb-6w fr-mb-md-0">
        <img
          :src="`/images/yellow-circle.svg`"
          class="circle-background"
          alt="cercle jaune en arrière plan"
        />
        <h4 class="fr-text--blue-france fr-pb-2v">Le point d'entrée vers les aides à la transition écologique des entreprises</h4>
        <p>
          <i>Transition écologique des entreprises</i> vous permet <b>d'identifier la bonne aide</b> pour votre entreprise parmi les aides
          publiques nationales, régionales et territoriales issues de <b>l’ensemble des partenaires publics.</b>
        </p>
        <div class="fr-grid-row fr-col-justify--center fr-col-content--middle">
          <NuxtImg
            v-for="operator in partners"
            :key="operator.label"
            class="fr-responsive-img fr-m-2v operator-logo"
            :src="operator.img"
            quality="70"
            densities="1"
            :alt="operator.label"
            :format="operator.format ?? undefined"
            loading="lazy"
            :width="operator.width ?? undefined"
          />
        </div>
      </div>
      <div class="fr-col-12 fr-col-offset-md-1 fr-col-md-5 fr-text-center fr-position--relative">
        <img
          :src="`/images/green-circle.svg`"
          class="circle-background"
          alt="cercle vert en arrière plan"
        />
        <h4 class="fr-text--blue-france fr-pb-2v">Des conseillers pour vous aider sur l'ensemble du territoire</h4>
        <p>
          Pour vous accompagner dans vos réflexions et répondre à vos questions, nous vous mettons en relation avec
          <b>le conseiller compétent pour votre demande sur votre territoire.</b> Ce conseiller est référencé via le service public
          <i>Conseillers-Entreprises</i>.
        </p>
        <div class="fr-col-justify--center fr-grid-row fr-col-content--middle">
          <NuxtImg
            :key="otherPartner.label"
            class="fr-responsive-img fr-m-2v operator-logo"
            :src="otherPartner.img"
            quality="70"
            densities="1"
            :alt="otherPartner.label"
            :format="otherPartner.format ?? undefined"
            loading="lazy"
          />
        </div>
      </div>
    </div>
    <div class="fr-bg--blue--lightness fr-hidden-sm fr-col-12 fr-py-0-5v fr-mt-8v fr-mb-16v"></div>
  </div>
</template>

<style scoped lang="scss">
.circle-background {
  position: absolute;
  z-index: -1;
  left: -10px;
  top: -20px;
}

.operator-logo {
  max-height: 5.5rem;
  max-width: 5.8rem !important;
  width: revert-layer !important;
}
</style>
