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
  <div class="fr-container fr-grid-row fr-grid-row--center fr-py-8v">
    <TeeButtonLink
      :to="{ name: RouteName.CatalogProjects }"
      size="sm"
      icon="fr-icon-arrow-right-line"
      icon-right
      class="no-outline fr-text--decoration-underline"
    >
      Voir tout les projets
    </TeeButtonLink>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeHomePage > FUNCTION_NAME > MSG_OR_VALUE :`)
import { RouteName } from '@/types'
import TeeCta from '@/components/home/TeeCta.vue'
import CatalogProjects from '@/components/catalog/CatalogProjects.vue'
</script>
