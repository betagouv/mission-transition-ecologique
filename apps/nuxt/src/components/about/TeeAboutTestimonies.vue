<template>
  <section class="fr-my-3w fr-py-3w fr-px-2w fr-px-md-6w">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12">
        <h2>Des retours du terrain</h2>
        <p>
          Le service Transition écologique des entreprises progresse grâce aux retours de ses utilisateurs. Ces témoignages, issus
          d’entretiens qualitatifs, illustrent les bénéfices concrets qu’ils en retirent.
        </p>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--center fr-mt-3w">
      <div class="fr-col-md-10">
        <Testimony
          v-for="testimony in testimonies"
          :key="testimony.slug"
          class="fr-mb-md-2w"
          :testimony="testimony"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Testimony as TestimonyType } from '@/types'

const testimonies: TestimonyType[] = [
  {
    slug: 'green-family-love-and-green',
    verbatim:
      'Le service Transition écologique des entreprises nous donne accès à de nombreux outils pour accélérer l’éco-conception de nos produits d’hygiène pour toute la famille. En tant que PME, Il nous aide à **budgéter**, à **identifier les aides disponibles** et à **prioriser nos actions** de décarbonation : un vrai gain de temps !',
    companyName: 'Green Family - Love & Green',
    authorName: 'Marguerite GUILLOU',
    authorFunction: 'responsable RSE & Qualité de Green Family - Love & Green',
    authorImage: '/images/about/Tee_about_guillou_marguerite.webp',
    authorImageAttributes: 'Photo de Marguerite GUILLOU, responsable RSE & Qualité de Green Family - Love & Green'
  },
  {
    slug: 'region-hdf',
    verbatim:
      'La plateforme Transition écologique des entreprises est très facile d’utilisation et permet d’accéder à une bonne connaissance des aides existantes à destination des entreprises, en lien avec le développement durable. Je l’utilise régulièrement dans le cadre de mes missions et n’hésite pas à en faire la diffusion auprès de mon réseau de partenaires. Bravo pour cette initiative concrète, pertinente et dotée de beaucoup de sens !',
    companyName: 'Région Hauts-de-France',
    authorName: 'Aurélie HOUDUSSE',
    authorFunction: 'Chargée de Mission Entrepreneuriat',
    authorImage: '/images/about/Tee_about_houdusse_aurelie.webp',
    authorImageAttributes: 'Photo de Aurélie HOUDUSSE, chargée de mission Entrepreneuriat à la Région Hauts-de-France'
  }
]
</script>

<style scoped>
p:last-child {
  margin-bottom: 0;
}

figure.fr-quote:last-child {
  padding-bottom: 0 !important;
}
</style>
