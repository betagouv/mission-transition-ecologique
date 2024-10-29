<template>
  <div
    class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-0 fr-mb-12v"
    style="min-height: 800px"
  >
    <CatalogProjects />
  </div>
  <ContactHelp v-if="isCatalog" />
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { RouteName } from '@/types'

definePageMeta({
  name: RouteName.CatalogProjects
})

const navigationStore = useNavigationStore()
const isCatalog = computed(() => {
  return navigationStore.isCatalogList()
})
</script>
