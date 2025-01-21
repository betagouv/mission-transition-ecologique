<template>
  <div>
    <Script
      id="transition-ecologique-entreprise"
      :src="scriptUrl"
      data-type="projet"
      data-id="diag-360"
    ></Script>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'iframe'
})

import { Iframe } from '@/tools/iframe/iframe'

const scriptUrl = Iframe.getScript()
console.log('script', scriptUrl)
</script>
