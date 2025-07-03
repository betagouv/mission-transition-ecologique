<script setup lang="ts">
import { Image } from '@/tools/image'
import { partners, otherPartner } from '@/tools/operator'

const img = Image.getUrl
</script>

<template>
  <div class="fr-container fr-px-md-0">
    <h2 class="fr-text--blue-france fr-text-center fr-text-left-md fr-my-6v">Comprendre notre service</h2>
  </div>
  <div class="fr-container fr-hidden fr-unhidden-sm">
    <div class="fr-grid-row fr-grid-row--center fr-py-8v">
      <div class="fr-col-12 fr-col-md-5 fr-text-center fr-position--relative fr-mb-6w fr-mb-md-0">
        <img
          :src="`/images/yellow-circle.svg`"
          class="circle-background"
          alt="cercle jaune en arrière plan"
        />
        <h2 class="fr-text--blue-france fr-pb-2v fr-h4">Le point d'entrée vers les aides à la transition écologique des entreprises</h2>
        <p>
          <i>Transition écologique des entreprises</i> vous permet <b>d'identifier la bonne aide</b> pour votre entreprise parmi les aides
          publiques nationales, régionales et territoriales issues de <b>l’ensemble des partenaires publics.</b>
        </p>
        <div class="fr-grid-row fr-col-justify--center fr-col-content--middle">
          <img
            v-for="operator in partners"
            :key="operator.label"
            class="fr-responsive-img fr-m-2v operator-logo"
            :src="
              img(operator.img, {
                format: operator.format ?? undefined,
                densities: 1,
                quality: 70,
                loading: 'lazy',
                width: operator.width ?? undefined
              })
            "
            :width="operator.width ?? undefined"
            :alt="operator.label"
          />
        </div>
      </div>
      <div class="fr-col-12 fr-col-offset-md-1 fr-col-md-5 fr-text-center fr-position--relative">
        <img
          :src="`/images/green-circle.svg`"
          class="circle-background"
          alt="cercle vert en arrière plan"
        />
        <h2 class="fr-text--blue-france fr-pb-2v fr-h4">Des conseillers pour vous aider sur l'ensemble du territoire</h2>
        <p>
          Pour vous accompagner dans vos réflexions et répondre à vos questions, nous vous mettons en relation avec
          <b>le conseiller compétent pour votre demande sur votre territoire.</b> Ce conseiller est référencé via le service public
          <i>Conseillers-Entreprises</i>.
        </p>
        <div class="fr-col-justify--center fr-grid-row fr-col-content--middle">
          <img
            :key="otherPartner.label"
            class="fr-responsive-img fr-m-2v operator-logo"
            :src="img(otherPartner.img, { format: otherPartner.format ?? undefined, densities: 1, quality: 70, loading: 'lazy' })"
            :alt="otherPartner.label"
          />
        </div>
      </div>
    </div>
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
