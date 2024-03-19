<template>
  <div
    class="fr-container--fluid fr-mt-0 fr-mb-12v"
    style="min-height: 800px"
  >
    <Suspense>
      <router-view />
      <template #fallback>
        <span>Chargement...</span>
      </template>
    </Suspense>
  </div>
  <ContactHelp />
</template>

<script setup lang="ts">
import ContactHelp from '@/components/contact/ContactHelp.vue'
</script>
