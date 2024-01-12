<template>
  <div class="fr-container--fluid fr-px-2v fr-pb-20v fr-mt-0 fr-mb-20v" style="min-height: 800px">
    <router-view />
  </div>
  <ContactHelp />
</template>

<script setup lang="ts">
import ContactHelp from '@/components/contact/ContactHelp.vue'
</script>
