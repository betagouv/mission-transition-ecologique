<template>
  <!-- MAIN APP COMPONENT  -->
  <Layout
    :breadcrumb="false"
    fluid
  >
    <template #top>
      <div class="fr-bg--blue--lightness">
        <TeeCta />
      </div>
    </template>
    <div class="fr-container--fluid fr-container-md">
      <h2 class="fr-text--blue-france fr-text-center fr-text-left-md fr-pt-6v">Quel est votre projet ?</h2>
      <TeeHomeProjectList :limit="9" />
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-bg--blue--lightness fr-hidden fr-unhidden-sm fr-col-12 fr-py-0-5v fr-my-8v"></div>
      </div>
      <TeePromises />
    </div>
  </Layout>
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
