<template>
  <div class="fr-container--fluid">
    <!-- MAIN APP COMPONENT  -->
    <div class="fr-bg--blue-france--lightness">
      <div class="fr-container fr-py-2v">
        <TeeCta />
      </div>
    </div>

    <!-- INTRO / CTA -->
    <div class="fr-container fr-my-5v">
      <TeeHomeSteps />
    </div>

    <!-- INTRO / INFOS -->
    <div class="fr-bg--blue-france--lightness">
      <div class="fr-container fr-pt-10v fr-pb-20v fr-px-0 fr-px-md-20v">
        <TeeHomeInfos />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineRouteRules } from '#imports'
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { RouteName, ChangeFreq, Priority } from '@/types'

definePageMeta({
  path: '/',
  name: RouteName.Homepage,
  middleware: [MiddlewareName.resetUsedTrackStore]
})

defineRouteRules({
  sitemap: {
    priority: Priority.Highest,
    changefreq: ChangeFreq.Weekly
  }
})
</script>
