<template>
  <div class="fr-grid-row fr-grid-row--gutters tee-home-steps fr-pt-md-5v">
    <div
      v-for="c in content"
      :key="`${c.img}-title`"
      class="fr-col fr-col-xs-12 fr-col-md-4 fr-text-center fr-py-4v"
    >
      <div class="fr-grid-row fr-px-2v fr-pb-sm-6v">
        <div class="fr-col fr-col-xs-2 fr-col-sm-3 fr-col-md-12 tee-home-steps-image">
          <img
            class="fr-mb-md-5v"
            :src="c.img"
            :alt="c.title"
          />
        </div>
        <div class="fr-col fr-col-xs-10 fr-col-sm-9 fr-col-md-12 tee-home-steps-title">
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
        class="fr-grid-row fr-sm-hide fr-justify-center fr-mb-2v tee-home-step-operators-container"
      >
        <img
          :src="c.logos.img"
          :alt="c.logos.label"
          class="fr-mx-2v fr-my-2v tee-home-step-operator-img"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const content = [
  {
    title: 'Je renseigne mon profil avec mon SIRET',
    img: '/images/home/1.svg',
    text: 'pour obtenir en quelques clics des résultats correspondant à mon secteur d’activité et secteur géographique'
  },
  {
    title: 'Je réponds à quelques questions par thématique',
    img: '/images/home/2.svg',
    text: 'En fonction de mes objectifs et des enjeux de mon entreprise : bâtiment, mobilité, déchets, eau, énergie...'
  },
  {
    title: 'J’accède aux projets de transition écologique pour mon entreprise',
    img: '/images/home/3.svg',
    text: 'Et je découvre les études et aides financières proposées par l’ensemble des partenaires : ADEME, Bpifrance, CCI, CMA, etc.',
    logos: {
      label: 'Partenaires',
      img: '/images/logos/logos-operators.png'
    }
  }
]
</script>
