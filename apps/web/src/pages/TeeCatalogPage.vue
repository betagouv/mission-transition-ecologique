<template>
  <div
    class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-0 fr-mb-12v"
    style="min-height: 800px"
  >
    <router-view />
  </div>
  <ContactHelp v-if="isCatalog" />
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'

const navigationStore = useNavigationStore()
const isCatalog = computed(() => {
  return navigationStore.isCatalog()
})
</script>
