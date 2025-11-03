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
    slug: 'la-fenetriere',
    verbatim:
      '**Cette plateforme, je la vois comme la référence en terme d’aides autour de la RSE** : une solution **pratique, efficace**, adaptée aux besoins des dirigeants des petites entreprises.',
    companyName: 'La Fenêtrière',
    authorName: 'Catherine GUERNIOU',
    authorFunction: 'directrice de La Fenêtrière',
    authorImage: '/images/testimony/temoignage-benjamin-souviraa-blue-ocean-png.webp',
    authorImageAttributes: 'Photo de Catherine GUERNIOU, directrice de La Fenêtrière, engagé dans la transition écologique'
  },
  {
    slug: 'green-family-love-and-green',
    verbatim:
      'Le service Transition écologique des entreprises nous donne accès à de nombreux outils pour accélérer l’éco-conception de nos produits d’hygiène pour toute la famille. En tant que PME, Il nous aide à **budgéter**, à **identifier les aides disponibles** et à **prioriser nos actions** de décarbonation : un vrai gain de temps !',
    companyName: 'Green Family - Love & Green',
    authorName: 'Marguerite GUILLOU',
    authorFunction: 'responsable RSE & Qualité de Green Family - Love & Green',
    authorImage: '/images/testimony/borismarcel-jpg.webp',
    authorImageAttributes:
      'Photo de Marguerite GUILLOU, responsable RSE & Qualité de Green Family - Love & Green, engagé dans la transition écologique'
  },
  {
    slug: 'biomere',
    verbatim:
      'Cet outil peut me permettre d’être **plus autonome dans mes recherches** de subventions. C’est aussi une belle **source d’inspiration** pour mettre en place des actions auxquelles je n’aurais pas pensé !',
    companyName: 'Biomère',
    authorName: 'Pauline VENOT',
    authorFunction: 'chargée de mission RSE chez Biomère',
    authorImage: '/images/testimony/noemie-feldbauer-jpg.webp',
    authorImageAttributes: 'Photo de Pauline VENOT, chargée de mission RSE chez Biomère, engagé dans la transition écologique'
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
