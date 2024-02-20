<template>
  <!-- MAIN APP COMPONENT  -->
  <div data-tf-live="01HNJQ5V7EYXZTQAY755QPMA4R"></div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeAddProgram > FUNCTION_NAME > MSG_OR_VALUE :`)
import { onMounted } from 'vue'

onMounted(() => {
  const typeformScript = document.createElement('script')
  typeformScript.async = true
  typeformScript.setAttribute('type', 'text/javascript')
  typeformScript.setAttribute('src', 'https://embed.typeform.com/next/embed.js')
  document.head.appendChild(typeformScript)
})
</script>
