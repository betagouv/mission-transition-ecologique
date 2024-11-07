<template>
  <!-- TYPEFORM WIDGET  -->
  <div
    data-tf-live="01HNJQ5V7EYXZTQAY755QPMA4R"
    class="tee-typeform-widget"
  />
</template>

<script setup lang="ts">
import { RouteName } from '@/types'
import { onMounted, onBeforeUnmount } from 'vue'

definePageMeta({
  path: '/ajouter-une-aide-entreprises',
  name: RouteName.AddProgram
})

if (import.meta.client) {
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
}
</script>
