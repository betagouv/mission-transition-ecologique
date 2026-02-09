<template>
  <div>
    <Script
      id="transition-ecologique-entreprise"
      :src="Iframe.getScript()"
    />
    <div class="fr-mb-2v"></div>
    <Script
      id="transition-ecologique-entreprise"
      :src="Iframe.getScript()"
      data-type="projet"
      data-id="diag-360"
    />
    <div class="fr-mb-2v"></div>
    <Script
      id="transition-ecologique-entreprise"
      :src="Iframe.getScript()"
      data-type="siret"
      data-source="tee"
    />
    <div class="fr-mb-2v"></div>
  </div>
</template>

<script setup lang="ts">
import { Iframe } from '@/tools/iframe/iframe'
import { MetaRobots } from '@/tools/metaRobots'

definePageMeta({
  layout: 'iframe'
})

useHead(MetaRobots.noIndexFollow())
</script>
