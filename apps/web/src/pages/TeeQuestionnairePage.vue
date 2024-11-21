<template>
  <div
    class="fr-container--fluid fr-container--fluid--no-overflow fr-px-0v fr-mt-0 fr-mb-10v"
    style="min-height: 800px"
  >
    <router-view :key="useRoute().path" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
</script>
