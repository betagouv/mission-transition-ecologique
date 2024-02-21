<template>
  <!-- MAIN APP COMPONENT  -->
  <div data-tf-live="01HNJQ5V7EYXZTQAY755QPMA4R"></div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeAddProgram > FUNCTION_NAME > MSG_OR_VALUE :`)
import { onMounted, onBeforeUnmount } from 'vue'

const typeformScript = document.createElement('script')
typeformScript.async = true
typeformScript.setAttribute('type', 'text/javascript')
typeformScript.setAttribute('src', 'https://embed.typeform.com/next/embed.js')

onMounted(() => {
  document.head.appendChild(typeformScript)
})

onBeforeUnmount(() => {
  document.head.removeChild(typeformScript)
  const typeformLink = document.head.querySelector('link[href*="https://embed.typeform.com"]')
  if (typeformLink) {
    document.head.removeChild(typeformLink)
  }
})
</script>
