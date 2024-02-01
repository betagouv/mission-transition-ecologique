<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div
      v-for="c in content"
      :key="`${c.img}-title`"
      class="fr-col fr-col-xs-12 fr-col-md-4 fr-pt-8v fr-text-center fr-pb-0"
    >
      <div class="fr-grid-row fr-px-2v">
        <div class="fr-col fr-col-xs-2 fr-col-sm-12">
          <img
            class="fr-mb-5v"
            :src="c.img"
            :alt="c.title"
          />
        </div>
        <div class="fr-col fr-col-xs-10 fr-col-sm-12">
          <h4>
            {{ c.title }}
          </h4>
        </div>
      </div>
    </div>
  </div>
  <div class="fr-grid-row fr-grid-row-gutters fr-sm-hide">
    <div
      v-for="c in content"
      :key="`${c.img}-text`"
      class="fr-col fr-col-4 fr-pb-8v fr-pt-0 fr-px-2v fr-text-center"
    >
      <p>
        {{ c.text }}
      </p>
      <div
        v-if="c.logos"
        class="fr-grid-row fr-sm-hide fr-justify-center fr-mb-2v tee-home-step-partners-container"
      >
        <!-- <img
          v-for="logo in c.logos"
          :key="logo.img"
          :src="logo.img"
          :alt="logo.label"
          class="fr-mx-2v fr-my-2v tee-home-step-partners-img"
        /> -->
        <img
          :src="c.logos.img"
          :alt="c.logos.label"
          class="fr-mx-2v fr-my-2v tee-home-step-partners-img"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import partners from '@/utils/partners'

const content = [
  {
    title: 'Je renseigne mon profil avec mon SIRET',
    img: '/images/home/1.svg',
    text: 'pour obtenir en quelques clics des résultats correspondant à mon secteur d’activité et secteur géographique'
  },
  {
    title: 'Je réponds à quelques questions par thématique',
    img: '/images/home/2.svg',
    text: 'En fonction de vos objectifs et des enjeux de mon entreprise : bâtiment, mobilité, déchets, eau, énergie...'
  },
  {
    title: 'J’accède aux aides dont mon entreprise peut bénéficier',
    img: '/images/home/3.svg',
    text: 'Des propositions d’accompagnements et de financements issues de l’ensemble des partenaires : ADEME, Bpifrance, CCI, CMA, etc.',
    logos: {
      label: 'Partenaires',
      img: '/images/logos/logos-partners.png'
    }
  }
]
</script>
