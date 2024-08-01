<template>
  <div
    class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-0 fr-mb-12v"
    style="min-height: 800px"
  >
    <router-view />
  </div>
  <ContactHelp v-if="isCatalogRoot" />
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { RouteName } from '@/types/routeType'

const navigationStore = useNavigationStore()
const isCatalogRoot = computed(() => {
  return navigationStore.isByRouteName(RouteName.CatalogPrograms)
})
</script>
