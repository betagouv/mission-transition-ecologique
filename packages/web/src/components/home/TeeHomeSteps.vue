<template>
  <div
    class="fr-grid-row fr-grid-row-gutters">
    <div
      v-for="c in content"
      :key="`${c.img}-title`"
      class="fr-col fr-col-xs-12 fr-col-md-4 fr-pt-8v fr-text-center fr-pb-0">
      <div class="fr-grid-row">
        <div class="fr-col fr-col-xs-2 fr-col-sm-12">
          <img 
            class="fr-mb-5v" 
            :src="c.img" 
            :alt="c.title"
            />
        </div>
        <div class="fr-col fr-col-xs-10 fr-col-sm-12">
          <h3>
            {{ c.title }}
          </h3>
        </div>
      </div>
    </div>
  </div>
  <div
    class="fr-grid-row fr-grid-row-gutters fr-sm-hide">
    <div
      v-for="c in content"
      :key="`${c.img}-text`"
      class="fr-col fr-col-4 fr-pb-8v fr-pt-0 fr-text-center">
      <p>
        {{ c.text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

const content = [
  {
    title: 'Je renseigne mon profil avec mon SIRET',
    img: '/images/home/1.svg',
    text: "pour obtenir en quelques clics des résultats personnalisés \
          éligible dans votre secteur d’activité et géographique."
  },
  {
    title: 'Je réponds à quelques questions par thématique',
    img: '/images/home/2.svg',
    text: " En fonction de vos objectifs et des enjeux de votre entreprise : \
          bâtiment, mobilité, déchets, eau, énergie..."
  },
  {
    title: "J’accède aux dispositifs de soutien pour mon entreprise",
    img: '/images/home/3.svg',
    text: " Des propositions d’accompagnements et aides financières pour \
          financer vos projets issues \
          de l’ensemble des partenaires :\
          ADEME, BPI, CCI et CMA !"
  }
]

</script>