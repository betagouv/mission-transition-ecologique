<template>
  <!-- TYPEFORM WIDGET  -->
  <div>
    <iframe
      src="https://baserow.io/form/oZMzNirPXLXP8RpR2pQ553jFMVURknX_xVUl7B1bdl8"
      title="Formulaire Baserow"
      allowFullScreen
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { defineRouteRules } from '#imports'
import { RouteName } from '@/types'
import { onMounted, onBeforeUnmount } from 'vue'

definePageMeta({
  path: '/ajouter-une-aide-entreprises',
  name: RouteName.AddProgram
})

defineRouteRules({
  sitemap: {
    priority: 0,
    changefreq: 'monthly'
  }
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
