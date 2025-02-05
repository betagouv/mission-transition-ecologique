<template>
  <!-- MAIN APP COMPONENT  -->
  <div>
    <div class="fr-container--fluid fr-bg--blue-france--lightness">
      <div class="fr-container fr-py-2v">
        <TeeCta />
      </div>
    </div>
    <div class="fr-container fr-py-2v fr-px-8v fr-px-sm-8v fr-px-md-20v">
      <h2 class="fr-text--blue-france fr-container fr-pt-6v">Quel est votre projet ?</h2>
      <TeeHomeProjectList :limit="8" />
      <div class="fr-container fr-grid-row fr-grid-row--center fr-pt-8v">
        <div class="fr-col-12 fr-col-justify--center">
          <TeeButtonLink
            :to="{ name: RouteName.CatalogProjects }"
            icon="fr-icon-arrow-right-line"
            icon-right
            class="no-outline fr-border-b--blue-france fr-py-0 fr-pc-4v fr-mb-8v"
          >
            Voir tous les projets
          </TeeButtonLink>
        </div>
        <div class="fr-bg--blue-france--lightness fr-hidden fr-unhidden-sm fr-col-12 fr-py-0-5v fr-mt-8v fr-mb-16v"></div>
      </div>

      <TeePromises />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineRouteRules } from '#imports'
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { RouteName } from '@/types'

definePageMeta({
  path: '/',
  name: RouteName.Homepage,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetFilters]
})

defineRouteRules({
  sitemap: {
    priority: 1.0,
    changefreq: 'weekly'
  }
})
</script>
