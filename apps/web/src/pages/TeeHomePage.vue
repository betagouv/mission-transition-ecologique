<template>
  <!-- MAIN APP COMPONENT  -->
  <div class="fr-container--fluid fr-bg--blue-france--lightness">
    <div class="fr-container fr-py-2v">
      <TeeCta />
    </div>
  </div>
  <CatalogProjects
    :show-breadcrumbs="false"
    :show-title="false"
  />
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeHomePage > FUNCTION_NAME > MSG_OR_VALUE :`)

import TeeCta from '@/components/home/TeeCta.vue'
import CatalogProjects from '@/components/catalog/CatalogProjects.vue'
</script>
