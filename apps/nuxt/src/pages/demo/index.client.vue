<template>
  <div>
    <Script
      id="transition-ecologique-entreprise"
      :src="Iframe.getScript()"
    ></Script>
    <Script
      id="transition-ecologique-entreprise"
      :src="Iframe.getScript()"
      data-type="projet"
      data-id="diag-360"
    ></Script>
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
