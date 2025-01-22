<template>
  <div>
    <Script
      id="transition-ecologique-entreprise"
      :src="`${domain}/scripts/iframe.js`"
      data-type="projet"
      data-id="diag-360"
    ></Script>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'iframe'
})

const domain = window.location.origin
</script>
