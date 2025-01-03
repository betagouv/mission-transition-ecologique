<template>
  <!-- MAIN APP COMPONENT  -->
  <div class="fr-container--fluid fr-bg--blue-france--lightness">
    <div class="fr-container fr-py-2v">
      <TeeCta />
    </div>
  </div>
  <h1 class="fr-container fr-text--blue-france fr-py-8v">Quel est votre projet ?</h1>
  <CatalogProjects
    :show-breadcrumbs="false"
    :show-title="false"
    :show-limit="9"
    :show-counter="false"
  />
  <div class="fr-container fr-grid-row fr-grid-row--center fr-pt-8v">
    <div class="fr-col-12 fr-col-justify--center">
      <TeeButtonLink
        :to="{ name: RouteName.CatalogProjects }"
        size="sm"
        icon="fr-icon-arrow-right-line"
        icon-right
        class="no-outline fr-text--decoration-underline fr-mb-8v"
      >
        Voir tout les projets
      </TeeButtonLink>
    </div>
    <div class="fr-bg--blue-france--lightness fr-col-12 fr-py-0-5v fr-my-8v"></div>
    <div class="fr-col-6 fr-px-4v fr-pl-8w fr-text-center">
      <h4 class="fr-text--blue-france fr-pb-2v">
        Un point d'entrée unique pour toutes les aides à la transition écologique des entreprises
      </h4>
      <p>
        Transition écologique des entreprises rassemble plus de <b>150 aides</b> nationales, régionales et territoriales
        <b>mises à jour quotidiennement</b> issues de l'ensemble des <b>partenaires publiques</b>: ADEME, Bpifrance, CCI, CMA, etc.
      </p>
      <div class="fr-col-justify--center fr-col-content--middle">
        <img
          v-for="operator in operators"
          :key="operator.label"
          :src="operator.img"
          :alt="operator.label"
          width="70px"
          class="fr-m-2v"
        />
      </div>
    </div>
    <div class="fr-col-6 fr-px-4v fr-pr-8w fr-text-center">
      <h4 class="fr-text--blue-france fr-pb-2v">Des conseillers pour vous aider sur l'ensemble du territoire</h4>
      <p>
        Conseillers-entreprises vous met en relation avec <b>le conseiller compétent pour votre demande sur votre territoire</b>. Des
        spécialistes pour vous accompagner dans vos réflexions, et vos recherches pour mener à bien votre projet de transition écologique.
      </p>
      <div class="fr-col-justify--center fr-col-content--middle">
        <img
          v-for="operator in otherOperators"
          :key="operator.label"
          :src="operator.img"
          :alt="operator.label"
          :width="operator.width"
          class="fr-m-2v"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeHomePage > FUNCTION_NAME > MSG_OR_VALUE :`)
import { RouteName } from '@/types'
import TeeCta from '@/components/home/TeeCta.vue'
import CatalogProjects from '@/components/catalog/CatalogProjects.vue'

const operators = [
  {
    label: 'ADEME',
    img: '/images/logos/ademe.svg'
  },
  {
    label: 'Bpifrance',
    img: '/images/logos/bpi-france.svg'
  },
  {
    label: 'CCI France',
    img: '/images/logos/cci-france.svg'
  },
  {
    label: 'CMA France',
    img: '/images/logos/cma-france.png'
  }
]

const otherOperators = [
  {
    label: 'République française',
    img: '/images/logos/republique_francaise_rvb-1536x1392.webp',
    width: '80px'
  },
  {
    label: 'Conseiller entreprise',
    img: '/images/logos/logo-conseillers-entreprises.png',
    width: '260px'
  }
]
</script>
